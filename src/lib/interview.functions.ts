import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";
import { loggedFetch } from "./server-logger";

const MODEL = "google/gemini-2.5-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured (missing LOVABLE_API_KEY).");
  const res = await loggedFetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  }, { kind: "ai", op: "interview.callAI", provider: "lovable-ai-gateway", model: MODEL });
  if (res.status === 429) throw new Error("AI rate limit. Please retry shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? "";
}

function parseJSON<T>(s: string): T {
  const cleaned = s.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  const startA = cleaned.indexOf("[");
  const i = start === -1 ? startA : startA === -1 ? start : Math.min(start, startA);
  return JSON.parse(cleaned.slice(i));
}

const SetupSchema = z.object({
  discipline: z.string().min(1).max(40),
  role: z.string().min(1).max(80),
  difficulty: z.enum(["easy", "medium", "hard"]),
  mode: z.enum(["text", "voice", "video", "mcq"]),
  count: z.number().int().min(3).max(15),
});

export const startInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => SetupSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const isMcq = data.mode === "mcq";
    const system = `You are an interview question generator. Output ONLY valid JSON.`;
    const user = isMcq
      ? `Generate ${data.count} multiple-choice interview questions for a "${data.role}" role in ${data.discipline} at ${data.difficulty} difficulty. Return JSON: {"questions":[{"prompt":"...","choices":["A","B","C","D"],"correct":"A","topic":"..."}]}`
      : `Generate ${data.count} open-ended interview questions for a "${data.role}" role in ${data.discipline} at ${data.difficulty} difficulty. Mix technical and behavioral. Return JSON: {"questions":[{"prompt":"...","topic":"..."}]}`;
    const raw = await callAI(system, user);
    const parsed = parseJSON<{ questions: Array<{ prompt: string; choices?: string[]; correct?: string; topic?: string }> }>(raw);
    const questions = parsed.questions.slice(0, data.count);

    const { data: session, error: sErr } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: userId,
        discipline: data.discipline,
        role: data.role,
        difficulty: data.difficulty,
        mode: data.mode,
        total_questions: questions.length,
      })
      .select("id")
      .single();
    if (sErr || !session) throw new Error(sErr?.message ?? "Failed to start session");

    const rows = questions.map((q, idx) => ({
      session_id: session.id,
      idx,
      prompt: q.prompt,
      question_type: isMcq ? "mcq" : "open",
      choices: (q.choices ?? null) as unknown as Json,
      correct_answer: q.correct ?? null,
      expected_topic: q.topic ?? null,
    }));
    const { error: qErr } = await supabase.from("interview_questions").insert(rows);
    if (qErr) throw new Error(qErr.message);
    return { sessionId: session.id };
  });

export const getSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ sessionId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: session } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", data.sessionId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!session) throw new Error("Session not found");
    const { data: questions } = await supabase
      .from("interview_questions")
      .select("*")
      .eq("session_id", data.sessionId)
      .order("idx", { ascending: true });
    const { data: answers } = await supabase
      .from("interview_answers")
      .select("*")
      .eq("session_id", data.sessionId);
    return { session, questions: questions ?? [], answers: answers ?? [] };
  });

const AnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  answer: z.string().min(1).max(8000),
  mediaPath: z.string().max(500).optional(),
});

export const submitAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => AnswerSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: q } = await supabase
      .from("interview_questions")
      .select("id, prompt, question_type, correct_answer, expected_topic, session_id")
      .eq("id", data.questionId)
      .maybeSingle();
    if (!q) throw new Error("Question not found");
    const { data: sess } = await supabase
      .from("interview_sessions")
      .select("id, role, difficulty")
      .eq("id", q.session_id)
      .eq("user_id", userId)
      .maybeSingle();
    if (!sess) throw new Error("Not your session");

    let score = 0;
    let feedback = "";
    let strengths = "";
    let weaknesses = "";

    if (q.question_type === "mcq") {
      score = data.answer.trim() === (q.correct_answer ?? "").trim() ? 10 : 0;
      feedback = score === 10 ? "Correct." : `Incorrect. Correct answer: ${q.correct_answer}.`;
    } else {
      const system = `You are a strict but fair interview evaluator. Output ONLY valid JSON.`;
      const user = `Question: "${q.prompt}"\nCandidate answer: "${data.answer}"\nRole: ${sess.role}, Difficulty: ${sess.difficulty}.\nScore 0-10 (10 = excellent). Return JSON: {"score":0-10,"feedback":"...","strengths":"...","weaknesses":"..."}`;
      const raw = await callAI(system, user);
      const parsed = parseJSON<{ score: number; feedback: string; strengths?: string; weaknesses?: string }>(raw);
      score = Math.max(0, Math.min(10, Math.round(parsed.score)));
      feedback = parsed.feedback ?? "";
      strengths = parsed.strengths ?? "";
      weaknesses = parsed.weaknesses ?? "";
    }

    const { error } = await supabase
      .from("interview_answers")
      .upsert(
        {
          session_id: q.session_id,
          question_id: q.id,
          answer_text: data.answer,
          media_path: data.mediaPath ?? null,
          score,
          feedback,
          strengths,
          weaknesses,
          evaluated_at: new Date().toISOString(),
        },
        { onConflict: "question_id" },
      );
    if (error) throw new Error(error.message);
    return { score, feedback, strengths, weaknesses };
  });

export const finalizeInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ sessionId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: sess } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", data.sessionId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!sess) throw new Error("Session not found");
    const { data: answers } = await supabase
      .from("interview_answers")
      .select("score, feedback")
      .eq("session_id", data.sessionId);
    const list = answers ?? [];
    const total = sess.total_questions || list.length || 1;
    const sum = list.reduce((a, b) => a + (b.score ?? 0), 0);
    const pct = Math.round((sum / (total * 10)) * 100);

    let overall = "";
    try {
      const raw = await callAI(
        "You write concise interview feedback. 3-4 sentences.",
        `Role: ${sess.role}. Score: ${pct}%. Per-question feedback: ${list.map((a) => a.feedback).join(" | ")}`,
      );
      overall = raw.trim();
    } catch {
      overall = `You scored ${pct}%.`;
    }

    await supabase
      .from("interview_sessions")
      .update({
        score: pct,
        overall_feedback: overall,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", data.sessionId);

    let credentialId: string | null = null;
    if (pct >= 80) {
      const { data: cred } = await supabase
        .from("user_credentials")
        .insert({
          user_id: userId,
          credential_name: `${sess.role} Interview — Certified`,
          score: pct,
        })
        .select("id")
        .maybeSingle();
      credentialId = cred?.id ?? null;
    }
    return { score: pct, overall, passed: pct >= 80, credentialId };
  });

export const listMySessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
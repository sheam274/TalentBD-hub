import { c as createServerRpc } from "./createServerRpc-n_mmGc1i.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, e as enumType, s as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const MODEL = "google/gemini-2.5-flash";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
async function callAI(system, user) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured (missing LOVABLE_API_KEY).");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{
        role: "system",
        content: system
      }, {
        role: "user",
        content: user
      }]
    })
  });
  if (res.status === 429) throw new Error("AI rate limit. Please retry shortly.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please contact support.");
  if (!res.ok) throw new Error(`AI error ${res.status}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? "";
}
function parseJSON(s) {
  const cleaned = s.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  const startA = cleaned.indexOf("[");
  const i = start === -1 ? startA : startA === -1 ? start : Math.min(start, startA);
  return JSON.parse(cleaned.slice(i));
}
const SetupSchema = objectType({
  discipline: stringType().min(1).max(40),
  role: stringType().min(1).max(80),
  difficulty: enumType(["easy", "medium", "hard"]),
  mode: enumType(["text", "voice", "video", "mcq"]),
  count: numberType().int().min(3).max(15)
});
const startInterview_createServerFn_handler = createServerRpc({
  id: "6fffea624c23763185d8883bc71dc6641e1b007518aad1b3c890fd60ad8bc926",
  name: "startInterview",
  filename: "src/lib/interview.functions.ts"
}, (opts) => startInterview.__executeServer(opts));
const startInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SetupSchema.parse(i)).handler(startInterview_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const isMcq = data.mode === "mcq";
  const system = `You are an interview question generator. Output ONLY valid JSON.`;
  const user = isMcq ? `Generate ${data.count} multiple-choice interview questions for a "${data.role}" role in ${data.discipline} at ${data.difficulty} difficulty. Return JSON: {"questions":[{"prompt":"...","choices":["A","B","C","D"],"correct":"A","topic":"..."}]}` : `Generate ${data.count} open-ended interview questions for a "${data.role}" role in ${data.discipline} at ${data.difficulty} difficulty. Mix technical and behavioral. Return JSON: {"questions":[{"prompt":"...","topic":"..."}]}`;
  const raw = await callAI(system, user);
  const parsed = parseJSON(raw);
  const questions = parsed.questions.slice(0, data.count);
  const {
    data: session,
    error: sErr
  } = await supabase.from("interview_sessions").insert({
    user_id: userId,
    discipline: data.discipline,
    role: data.role,
    difficulty: data.difficulty,
    mode: data.mode,
    total_questions: questions.length
  }).select("id").single();
  if (sErr || !session) throw new Error(sErr?.message ?? "Failed to start session");
  const rows = questions.map((q, idx) => ({
    session_id: session.id,
    idx,
    prompt: q.prompt,
    question_type: isMcq ? "mcq" : "open",
    choices: q.choices ?? null,
    correct_answer: q.correct ?? null,
    expected_topic: q.topic ?? null
  }));
  const {
    error: qErr
  } = await supabase.from("interview_questions").insert(rows);
  if (qErr) throw new Error(qErr.message);
  return {
    sessionId: session.id
  };
});
const getSession_createServerFn_handler = createServerRpc({
  id: "e9ac1047a2a95d55d95d8e42b5d4a939e8a688586f7c9cc39e31a2324b8e2e59",
  name: "getSession",
  filename: "src/lib/interview.functions.ts"
}, (opts) => getSession.__executeServer(opts));
const getSession = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  sessionId: stringType().uuid()
}).parse(i)).handler(getSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: session
  } = await supabase.from("interview_sessions").select("*").eq("id", data.sessionId).eq("user_id", userId).maybeSingle();
  if (!session) throw new Error("Session not found");
  const {
    data: questions
  } = await supabase.from("interview_questions").select("*").eq("session_id", data.sessionId).order("idx", {
    ascending: true
  });
  const {
    data: answers
  } = await supabase.from("interview_answers").select("*").eq("session_id", data.sessionId);
  return {
    session,
    questions: questions ?? [],
    answers: answers ?? []
  };
});
const AnswerSchema = objectType({
  sessionId: stringType().uuid(),
  questionId: stringType().uuid(),
  answer: stringType().min(1).max(8e3),
  mediaPath: stringType().max(500).optional()
});
const submitAnswer_createServerFn_handler = createServerRpc({
  id: "8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10",
  name: "submitAnswer",
  filename: "src/lib/interview.functions.ts"
}, (opts) => submitAnswer.__executeServer(opts));
const submitAnswer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => AnswerSchema.parse(i)).handler(submitAnswer_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: q
  } = await supabase.from("interview_questions").select("id, prompt, question_type, correct_answer, expected_topic, session_id").eq("id", data.questionId).maybeSingle();
  if (!q) throw new Error("Question not found");
  const {
    data: sess
  } = await supabase.from("interview_sessions").select("id, role, difficulty").eq("id", q.session_id).eq("user_id", userId).maybeSingle();
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
    const user = `Question: "${q.prompt}"
Candidate answer: "${data.answer}"
Role: ${sess.role}, Difficulty: ${sess.difficulty}.
Score 0-10 (10 = excellent). Return JSON: {"score":0-10,"feedback":"...","strengths":"...","weaknesses":"..."}`;
    const raw = await callAI(system, user);
    const parsed = parseJSON(raw);
    score = Math.max(0, Math.min(10, Math.round(parsed.score)));
    feedback = parsed.feedback ?? "";
    strengths = parsed.strengths ?? "";
    weaknesses = parsed.weaknesses ?? "";
  }
  const {
    error
  } = await supabase.from("interview_answers").upsert({
    session_id: q.session_id,
    question_id: q.id,
    answer_text: data.answer,
    media_path: data.mediaPath ?? null,
    score,
    feedback,
    strengths,
    weaknesses,
    evaluated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "question_id"
  });
  if (error) throw new Error(error.message);
  return {
    score,
    feedback,
    strengths,
    weaknesses
  };
});
const finalizeInterview_createServerFn_handler = createServerRpc({
  id: "f4b7424c0041682b1ff51e04486c2975e722e55d2bc2f9683781a44a19c214a2",
  name: "finalizeInterview",
  filename: "src/lib/interview.functions.ts"
}, (opts) => finalizeInterview.__executeServer(opts));
const finalizeInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  sessionId: stringType().uuid()
}).parse(i)).handler(finalizeInterview_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: sess
  } = await supabase.from("interview_sessions").select("*").eq("id", data.sessionId).eq("user_id", userId).maybeSingle();
  if (!sess) throw new Error("Session not found");
  const {
    data: answers
  } = await supabase.from("interview_answers").select("score, feedback").eq("session_id", data.sessionId);
  const list = answers ?? [];
  const total = sess.total_questions || list.length || 1;
  const sum = list.reduce((a, b) => a + (b.score ?? 0), 0);
  const pct = Math.round(sum / (total * 10) * 100);
  let overall = "";
  try {
    const raw = await callAI("You write concise interview feedback. 3-4 sentences.", `Role: ${sess.role}. Score: ${pct}%. Per-question feedback: ${list.map((a) => a.feedback).join(" | ")}`);
    overall = raw.trim();
  } catch {
    overall = `You scored ${pct}%.`;
  }
  await supabase.from("interview_sessions").update({
    score: pct,
    overall_feedback: overall,
    status: "completed",
    completed_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.sessionId);
  let credentialId = null;
  if (pct >= 80) {
    const {
      data: cred
    } = await supabase.from("user_credentials").insert({
      user_id: userId,
      credential_name: `${sess.role} Interview — Certified`,
      score: pct
    }).select("id").maybeSingle();
    credentialId = cred?.id ?? null;
  }
  return {
    score: pct,
    overall,
    passed: pct >= 80,
    credentialId
  };
});
const listMySessions_createServerFn_handler = createServerRpc({
  id: "0cc6dafd3f4941cc09cd282f46e0097a7024d84c10949d71baadc27f314f237a",
  name: "listMySessions",
  filename: "src/lib/interview.functions.ts"
}, (opts) => listMySessions.__executeServer(opts));
const listMySessions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMySessions_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("interview_sessions").select("*").eq("user_id", userId).order("started_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
export {
  finalizeInterview_createServerFn_handler,
  getSession_createServerFn_handler,
  listMySessions_createServerFn_handler,
  startInterview_createServerFn_handler,
  submitAnswer_createServerFn_handler
};

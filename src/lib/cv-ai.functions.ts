import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { loggedFetch, logEvent } from "./server-logger";

const schema = z.object({
  field: z.enum(["skills", "coursework", "summary", "experience_bullets", "project_description", "awards", "certifications", "metrics"]),
  context: z.record(z.string(), z.any()).optional(),
});

const FIELD_PROMPT: Record<string, string> = {
  skills: "Suggest 8 concise CV skill tokens (single words or short phrases) tailored to the candidate's target role. Mix languages, frameworks, cloud, and CS fundamentals.",
  coursework: "Suggest 8 relevant CSE coursework titles a big-tech recruiter values, tailored to the candidate's focus.",
  summary: "Write 3 alternative 2-sentence professional CV summaries for this candidate targeting big-tech SWE roles.",
  experience_bullets: "Write 5 impact-oriented CV bullets (action + tech + measurable result) for the candidate's most recent role. Include realistic metrics.",
  project_description: "Write 4 crisp one-line project descriptions (problem → approach → result with a metric) suitable for a CV project section.",
  awards: "Suggest 6 realistic awards/achievements a strong CSE student might list (ICPC, hackathons, dean's list, scholarships).",
  certifications: "Suggest 6 valuable certifications for a CSE student targeting big-tech (AWS, GCP, Azure, Meta, Google, DeepLearning.AI).",
  metrics: "Rewrite the given experience/project bullets to add concrete, believable metrics (%, users, latency, x-faster). Return the rewritten bullets.",
};

export const suggestCvField = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => schema.parse(i))
  .handler(async ({ data }) => {
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    const useDirect = !!geminiKey;
    const url = useDirect
      ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (useDirect) headers.Authorization = `Bearer ${geminiKey}`;
    else if (lovableKey) headers["Lovable-API-Key"] = lovableKey;
    else return { suggestions: [] as string[], error: "AI not configured." };

    const model = useDirect ? "gemini-2.5-flash" : "google/gemini-3-flash-preview";
    const system = `You are a big-tech resume coach. Reply ONLY with a JSON object: {"suggestions": string[]}. No prose, no markdown fences.`;
    const user = `${FIELD_PROMPT[data.field]}\n\nCandidate context (JSON):\n${JSON.stringify(data.context ?? {}, null, 2)}`;

    const provider = useDirect ? "gemini-direct" : "lovable-ai-gateway";
    const res = await loggedFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    }, { kind: "ai", op: "cv.suggest", provider, model, extra: { field: data.field } });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      logEvent("ai", "error", { op: "cv.suggest", provider, model, field: data.field, status: res.status, body: t.slice(0, 300) });
      return { suggestions: [] as string[], error: res.status === 429 ? "Rate limited. Try again shortly." : "AI unavailable." };
    }
    const json = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
      const list = Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String).filter(Boolean).slice(0, 12) : [];
      return { suggestions: list, error: null };
    } catch {
      return { suggestions: [], error: "Could not parse suggestions." };
    }
  });

const analyzeSchema = z.object({
  cvText: z.string().min(20).max(30000),
  jobTitle: z.string().min(1).max(200),
  jobCompany: z.string().max(200).optional().nullable(),
  jobDescription: z.string().max(30000).optional().nullable(),
});

export const analyzeCvForJob = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => analyzeSchema.parse(i))
  .handler(async ({ data }) => {
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;
    const useDirect = !!geminiKey;
    const url = useDirect
      ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (useDirect) headers.Authorization = `Bearer ${geminiKey}`;
    else if (lovableKey) headers["Lovable-API-Key"] = lovableKey;
    else return { ok: false as const, error: "AI not configured." };

    const model = useDirect ? "gemini-2.5-flash" : "google/gemini-3-flash-preview";
    const system = `You are an ATS resume screener for big-tech and BD IT roles. Reply ONLY with JSON matching this exact shape (no prose, no code fences):
{
  "matchScore": number,           // 0-100 overall fit
  "atsScore": number,             // 0-100 ATS parse quality
  "verdict": string,              // 1 short sentence overall verdict
  "matchedKeywords": string[],    // job keywords found in CV
  "missingKeywords": string[],    // job keywords missing from CV
  "strengths": string[],          // 3-5 bullets
  "gaps": string[],               // 3-5 bullets of what's missing / weak
  "improvements": string[],       // 5 concrete rewrite/add suggestions
  "tailoredSummary": string       // 2-sentence CV summary tailored to this job
}`;
    const user = `TARGET JOB
Title: ${data.jobTitle}
Company: ${data.jobCompany ?? "N/A"}
Description:
${(data.jobDescription ?? "").slice(0, 12000) || "(not provided)"}

CANDIDATE CV
${data.cvText.slice(0, 15000)}`;

    const provider = useDirect ? "gemini-direct" : "lovable-ai-gateway";
    const res = await loggedFetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    }, { kind: "ai", op: "cv.analyze", provider, model, extra: { job: data.jobTitle.slice(0, 60) } });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      logEvent("ai", "error", { op: "cv.analyze", provider, model, status: res.status, body: t.slice(0, 300) });
      return { ok: false as const, error: res.status === 429 ? "Rate limited. Try again shortly." : res.status === 402 ? "AI credits exhausted." : "AI unavailable." };
    }
    const json = await res.json();
    const raw: string = json?.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "").trim());
      return {
        ok: true as const,
        analysis: {
          matchScore: clamp(Number(parsed.matchScore) || 0),
          atsScore: clamp(Number(parsed.atsScore) || 0),
          verdict: String(parsed.verdict ?? ""),
          matchedKeywords: arrStr(parsed.matchedKeywords),
          missingKeywords: arrStr(parsed.missingKeywords),
          strengths: arrStr(parsed.strengths),
          gaps: arrStr(parsed.gaps),
          improvements: arrStr(parsed.improvements),
          tailoredSummary: String(parsed.tailoredSummary ?? ""),
        },
      };
    } catch {
      return { ok: false as const, error: "Could not parse AI response." };
    }
  });

function clamp(n: number) { return Math.max(0, Math.min(100, Math.round(n))); }
function arrStr(v: unknown): string[] { return Array.isArray(v) ? v.map(String).filter(Boolean).slice(0, 20) : []; }

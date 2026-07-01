import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

    const res = await fetch(url, {
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
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("cv-ai error", res.status, t);
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

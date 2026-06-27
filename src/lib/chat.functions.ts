import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM = `You are TalentBD Assistant — a friendly career coach for Bangladeshi engineering students and professionals.
You help users with:
- Choosing learning tracks across CSE, EEE, and Civil engineering
- Picking the right local (Bangladesh) and global remote jobs
- CV tips, ATS keywords, interview prep
- Skill plans and certification guidance
Keep answers concise, structured, and actionable. Use markdown-style lists when helpful.`;

export const talentChat = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => messageSchema.parse(i))
  .handler(async ({ data }) => {
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const lovableKey = process.env.LOVABLE_API_KEY;

    // Prefer the user's own Google Gemini key when present; fall back to Lovable AI Gateway.
    const useDirect = !!geminiKey;
    const url = useDirect
      ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (useDirect) headers.Authorization = `Bearer ${geminiKey}`;
    else if (lovableKey) headers["Lovable-API-Key"] = lovableKey;
    else return { reply: "AI is not configured. Add GOOGLE_GEMINI_API_KEY or LOVABLE_API_KEY.", error: true };

    const model = useDirect ? "gemini-2.5-flash" : "google/gemini-3-flash-preview";

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });

    if (res.status === 429) return { reply: "Too many requests. Please wait a moment and try again.", error: true };
    if (res.status === 402) return { reply: "AI credits exhausted. Please contact support.", error: true };
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, t);
      return { reply: "AI service is temporarily unavailable.", error: true };
    }

    const json = await res.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "I had trouble generating a response.";
    return { reply, error: false };
  });

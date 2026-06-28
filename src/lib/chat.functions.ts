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

const SYSTEM = `You are TalentBD Assistant, powered by Google Gemini. You are a knowledgeable, friendly AI assistant.

Primary focus: helping Bangladeshi engineering students and professionals with:
- Learning tracks across CSE, EEE, and Civil engineering
- Local (Bangladesh) and global remote jobs
- CV tips, ATS keywords, interview prep
- Skill plans and certification guidance

You may also answer general questions (coding, math, explanations, writing help) like a normal Gemini chatbot.
Always format responses in clean Markdown: use headings, bold, bullet lists, numbered steps, and fenced code blocks where useful. Be accurate, concise, and helpful.`;

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

    // Default to gemini-2.5-flash (free-tier eligible). 2.5-pro often returns
    // RESOURCE_EXHAUSTED on free keys; we fall back to flash automatically.
    const primaryModel = useDirect ? "gemini-2.5-flash" : "google/gemini-3-flash-preview";
    const body = (m: string) =>
      JSON.stringify({ model: m, messages: [{ role: "system", content: SYSTEM }, ...data.messages] });

    let res = await fetch(url, { method: "POST", headers, body: body(primaryModel) });
    if (res.status === 429 && useDirect && primaryModel !== "gemini-2.5-flash-lite") {
      res = await fetch(url, { method: "POST", headers, body: body("gemini-2.5-flash-lite") });
    }

    if (res.status === 429) return { reply: "Gemini quota exceeded. Try again shortly.", error: true };
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

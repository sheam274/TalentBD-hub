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
  mode: z.enum(["coach", "gemini"]).optional(),
});

const SYSTEM_COACH = `You are TalentBD Assistant, powered by Google Gemini — behave like a full general-purpose Gemini chatbot.

Answer ANY question the user asks: general knowledge, coding, math, science, writing, explanations, brainstorming, current events, casual chat, etc. Do NOT refuse or redirect to career topics unless the user explicitly asks for career help.

For real-time data you don't have (live weather, stock prices, sports scores, breaking news), say you don't have live access and give the best general guidance or suggest where to check — never refuse the entire conversation.

You have extra expertise in helping Bangladeshi engineering students with learning tracks (CSE/EEE/Civil), jobs, CVs, interviews, and skills — offer this only when relevant.

Format responses in clean Markdown (headings, bold, lists, fenced code). Be accurate, concise, and helpful.`;

const SYSTEM_GEMINI = `You are Google Gemini. Answer the user's question directly, accurately, and helpfully. Use Markdown when useful.`;

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
    const system = data.mode === "gemini" ? SYSTEM_GEMINI : SYSTEM_COACH;
    const body = (m: string) =>
      JSON.stringify({ model: m, messages: [{ role: "system", content: system }, ...data.messages] });

    let res = await fetch(url, { method: "POST", headers, body: body(primaryModel) });
    let modelUsed = primaryModel;
    let fellBack = false;
    if (res.status === 429 && useDirect) {
      res = await fetch(url, { method: "POST", headers, body: body("gemini-2.5-flash-lite") });
      modelUsed = "gemini-2.5-flash-lite";
      fellBack = true;
    }

    if (res.status === 429) return { reply: "Gemini quota exceeded. Try again shortly.", error: true, model: modelUsed, fellBack };
    if (res.status === 402) return { reply: "AI credits exhausted. Please contact support.", error: true };
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error("AI gateway error", res.status, t);
      return { reply: "AI service is temporarily unavailable.", error: true, model: modelUsed, fellBack };
    }

    const json = await res.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "I had trouble generating a response.";
    return { reply, error: false, model: json?.model ?? modelUsed, fellBack };
  });

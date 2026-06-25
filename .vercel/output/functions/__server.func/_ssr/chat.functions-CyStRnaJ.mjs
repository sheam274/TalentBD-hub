import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const messageSchema = objectType({
  messages: arrayType(objectType({
    role: enumType(["user", "assistant", "system"]),
    content: stringType().min(1).max(4e3)
  })).min(1).max(30)
});
const SYSTEM = `You are TalentBD Assistant — a friendly career coach for Bangladeshi engineering students and professionals.
You help users with:
- Choosing learning tracks across CSE, EEE, and Civil engineering
- Picking the right local (Bangladesh) and global remote jobs
- CV tips, ATS keywords, interview prep
- Skill plans and certification guidance
Keep answers concise, structured, and actionable. Use markdown-style lists when helpful.`;
const talentChat_createServerFn_handler = createServerRpc({
  id: "350afbecb56701f5befabf131e494bd0549e911d7fc1292b2a974c03085567f1",
  name: "talentChat",
  filename: "src/lib/chat.functions.ts"
}, (opts) => talentChat.__executeServer(opts));
const talentChat = createServerFn({
  method: "POST"
}).inputValidator((i) => messageSchema.parse(i)).handler(talentChat_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return {
      reply: "AI is not configured yet. Please add the LOVABLE_API_KEY secret.",
      error: true
    };
  }
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{
        role: "system",
        content: SYSTEM
      }, ...data.messages]
    })
  });
  if (res.status === 429) return {
    reply: "Too many requests. Please wait a moment and try again.",
    error: true
  };
  if (res.status === 402) return {
    reply: "AI credits exhausted. Please contact support.",
    error: true
  };
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    console.error("AI gateway error", res.status, t);
    return {
      reply: "AI service is temporarily unavailable.",
      error: true
    };
  }
  const json = await res.json();
  const reply = json?.choices?.[0]?.message?.content ?? "I had trouble generating a response.";
  return {
    reply,
    error: false
  };
});
export {
  talentChat_createServerFn_handler
};

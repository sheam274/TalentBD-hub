import { c as createSsrRpc } from "./router-BajK73Jd.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { o as objectType, s as stringType, n as numberType, e as enumType } from "../_libs/zod.mjs";
const SetupSchema = objectType({
  discipline: stringType().min(1).max(40),
  role: stringType().min(1).max(80),
  difficulty: enumType(["easy", "medium", "hard"]),
  mode: enumType(["text", "voice", "video", "mcq"]),
  count: numberType().int().min(3).max(15)
});
const startInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SetupSchema.parse(i)).handler(createSsrRpc("6fffea624c23763185d8883bc71dc6641e1b007518aad1b3c890fd60ad8bc926"));
const getSession = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  sessionId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("e9ac1047a2a95d55d95d8e42b5d4a939e8a688586f7c9cc39e31a2324b8e2e59"));
const AnswerSchema = objectType({
  sessionId: stringType().uuid(),
  questionId: stringType().uuid(),
  answer: stringType().min(1).max(8e3),
  mediaPath: stringType().max(500).optional()
});
const submitAnswer = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => AnswerSchema.parse(i)).handler(createSsrRpc("8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10"));
const finalizeInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  sessionId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("f4b7424c0041682b1ff51e04486c2975e722e55d2bc2f9683781a44a19c214a2"));
const listMySessions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0cc6dafd3f4941cc09cd282f46e0097a7024d84c10949d71baadc27f314f237a"));
export {
  submitAnswer as a,
  finalizeInterview as f,
  getSession as g,
  listMySessions as l,
  startInterview as s
};

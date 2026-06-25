import { c as createSsrRpc } from "./router-B8OUd1qE.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import { o as objectType, r as recordType, s as stringType } from "../_libs/zod.mjs";
const listMyCredentials = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b910402c449cdc6d93545561777e419d50856c9be92526445f0768cd2e087ff5"));
const submitQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  moduleId: stringType().uuid(),
  answers: recordType(stringType(), stringType())
}).parse(i)).handler(createSsrRpc("2d2bfe4a37a1e5dd9643ecf1c0c0efd5449878c924286877313568ef117cd057"));
export {
  listMyCredentials as l,
  submitQuiz as s
};

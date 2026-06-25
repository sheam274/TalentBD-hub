import { c as createSsrRpc } from "./router-BajK73Jd.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const listModulesPublic = createServerFn({
  method: "GET"
}).handler(createSsrRpc("bf0cdc65f09f76f93c6d1558143b874a02736f00be846832eacf8b634cf1914e"));
const getModulePublic = createServerFn({
  method: "GET"
}).inputValidator((i) => i).handler(createSsrRpc("3ba1c41044cbbd4d5b6cf2c007d09548c610802b6c58d7b7165e82fe755651c1"));
const moduleSchema = objectType({
  id: stringType().uuid().optional(),
  discipline: stringType().min(1),
  section_slug: stringType().min(1).regex(/^[a-z0-9-]+$/),
  title: stringType().min(1),
  description: stringType().optional().nullable(),
  video_url: stringType().optional().nullable(),
  documentation_body: stringType().optional().nullable()
});
const adminUpsertModule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => moduleSchema.parse(i)).handler(createSsrRpc("76acea6ca2fec0db48a9897e52f6934e3bd50a675684f1de4ddedb77e1394da4"));
const adminDeleteModule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("facf9fb0b2a189645b9f5c9ad3aca2d9e4e885c970b0f2bf0b2b814bcd6d923d"));
export {
  adminUpsertModule as a,
  adminDeleteModule as b,
  getModulePublic as g,
  listModulesPublic as l
};

import { c as createServerRpc } from "./createServerRpc-n_mmGc1i.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { s as supabase } from "./client-Bnm4-7qk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const listModulesPublic_createServerFn_handler = createServerRpc({
  id: "bf0cdc65f09f76f93c6d1558143b874a02736f00be846832eacf8b634cf1914e",
  name: "listModulesPublic",
  filename: "src/lib/learning.functions.ts"
}, (opts) => listModulesPublic.__executeServer(opts));
const listModulesPublic = createServerFn({
  method: "GET"
}).handler(listModulesPublic_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabase.from("learning_modules").select("id, discipline, section_slug, title, description").order("discipline").order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getModulePublic_createServerFn_handler = createServerRpc({
  id: "3ba1c41044cbbd4d5b6cf2c007d09548c610802b6c58d7b7165e82fe755651c1",
  name: "getModulePublic",
  filename: "src/lib/learning.functions.ts"
}, (opts) => getModulePublic.__executeServer(opts));
const getModulePublic = createServerFn({
  method: "GET"
}).inputValidator((i) => i).handler(getModulePublic_createServerFn_handler, async ({
  data
}) => {
  const {
    data: mod,
    error
  } = await supabase.from("learning_modules").select("*").eq("discipline", data.discipline).eq("section_slug", data.slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!mod) return null;
  const {
    data: quizzes
  } = await supabase.from("skill_quizzes").select("id, question, choices").eq("module_id", mod.id);
  return {
    module: mod,
    quizzes: quizzes ?? []
  };
});
const moduleSchema = objectType({
  id: stringType().uuid().optional(),
  discipline: stringType().min(1),
  section_slug: stringType().min(1).regex(/^[a-z0-9-]+$/),
  title: stringType().min(1),
  description: stringType().optional().nullable(),
  video_url: stringType().optional().nullable(),
  documentation_body: stringType().optional().nullable()
});
const adminUpsertModule_createServerFn_handler = createServerRpc({
  id: "76acea6ca2fec0db48a9897e52f6934e3bd50a675684f1de4ddedb77e1394da4",
  name: "adminUpsertModule",
  filename: "src/lib/learning.functions.ts"
}, (opts) => adminUpsertModule.__executeServer(opts));
const adminUpsertModule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => moduleSchema.parse(i)).handler(adminUpsertModule_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase: supabase2,
    userId
  } = context;
  const {
    data: roles
  } = await supabase2.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");
  const payload = {
    ...data,
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    created_by: userId
  };
  const {
    error
  } = data.id ? await supabase2.from("learning_modules").update(payload).eq("id", data.id) : await supabase2.from("learning_modules").insert(payload);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteModule_createServerFn_handler = createServerRpc({
  id: "facf9fb0b2a189645b9f5c9ad3aca2d9e4e885c970b0f2bf0b2b814bcd6d923d",
  name: "adminDeleteModule",
  filename: "src/lib/learning.functions.ts"
}, (opts) => adminDeleteModule.__executeServer(opts));
const adminDeleteModule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(adminDeleteModule_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase: supabase2,
    userId
  } = context;
  const {
    data: roles
  } = await supabase2.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");
  const {
    error
  } = await supabase2.from("learning_modules").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminDeleteModule_createServerFn_handler,
  adminUpsertModule_createServerFn_handler,
  getModulePublic_createServerFn_handler,
  listModulesPublic_createServerFn_handler
};

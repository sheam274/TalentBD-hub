import { c as createServerRpc } from "./createServerRpc-n_mmGc1i.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const getMyProfile_createServerFn_handler = createServerRpc({
  id: "5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479",
  name: "getMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => getMyProfile.__executeServer(opts));
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyProfile_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: profile
  } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin = !!roles?.some((r) => r.role === "admin");
  const isEmployer = !!roles?.some((r) => r.role === "employer");
  const {
    data: memberships
  } = await supabase.from("company_members").select("company_id, role, company:companies(id, name, slug, logo_url)").eq("user_id", userId);
  return {
    profile,
    isAdmin,
    isEmployer,
    memberships: memberships ?? []
  };
});
const upsertMyProfile_createServerFn_handler = createServerRpc({
  id: "7925c3de14b795fe0f44175e37721342e39650bcc4169fdaac8d4b16f73f5b1b",
  name: "upsertMyProfile",
  filename: "src/lib/profile.functions.ts"
}, (opts) => upsertMyProfile.__executeServer(opts));
const upsertMyProfile = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(upsertMyProfile_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("profiles").update({
    name: data.name ?? null,
    discipline: data.discipline ?? null,
    skills: data.skills ?? [],
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getMyProfile_createServerFn_handler,
  upsertMyProfile_createServerFn_handler
};

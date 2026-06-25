import { c as createServerRpc } from "./createServerRpc-n_mmGc1i.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, r as recordType, s as stringType, u as unknownType, e as enumType } from "../_libs/zod.mjs";
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
const getMyCv_createServerFn_handler = createServerRpc({
  id: "50a89d37646baf31fb5cfceca91efaf174c133a13989eed656ea3547fc022ecf",
  name: "getMyCv",
  filename: "src/lib/cv.functions.ts"
}, (opts) => getMyCv.__executeServer(opts));
const getMyCv = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyCv_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("cv_records").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
});
const cvSchema = objectType({
  selected_style: enumType(["standard", "premium"]),
  builder_payload: recordType(stringType(), unknownType())
});
const saveMyCv_createServerFn_handler = createServerRpc({
  id: "93625428332452d0174b887b663341128b259874cabc5f35e8635c80cc39234e",
  name: "saveMyCv",
  filename: "src/lib/cv.functions.ts"
}, (opts) => saveMyCv.__executeServer(opts));
const saveMyCv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => cvSchema.parse(i)).handler(saveMyCv_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    error
  } = await supabase.from("cv_records").upsert({
    user_id: userId,
    selected_style: data.selected_style,
    builder_payload: data.builder_payload,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "user_id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  getMyCv_createServerFn_handler,
  saveMyCv_createServerFn_handler
};

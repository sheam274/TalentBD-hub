import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, r as recordType, s as stringType } from "../_libs/zod.mjs";
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
const listMyCredentials_createServerFn_handler = createServerRpc({
  id: "b910402c449cdc6d93545561777e419d50856c9be92526445f0768cd2e087ff5",
  name: "listMyCredentials",
  filename: "src/lib/assessments.functions.ts"
}, (opts) => listMyCredentials.__executeServer(opts));
const listMyCredentials = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyCredentials_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data,
    error
  } = await supabase.from("user_credentials").select("*").eq("user_id", userId).order("verified_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const submitQuiz_createServerFn_handler = createServerRpc({
  id: "2d2bfe4a37a1e5dd9643ecf1c0c0efd5449878c924286877313568ef117cd057",
  name: "submitQuiz",
  filename: "src/lib/assessments.functions.ts"
}, (opts) => submitQuiz.__executeServer(opts));
const submitQuiz = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  moduleId: stringType().uuid(),
  answers: recordType(stringType(), stringType())
}).parse(i)).handler(submitQuiz_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: mod
  } = await supabase.from("learning_modules").select("id, title").eq("id", data.moduleId).maybeSingle();
  if (!mod) throw new Error("Module not found");
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data: quizzes,
    error
  } = await supabaseAdmin.from("skill_quizzes").select("id, correct_answer").eq("module_id", data.moduleId);
  if (error) throw new Error(error.message);
  if (!quizzes || quizzes.length === 0) throw new Error("No quiz available");
  const total = quizzes.length;
  let correct = 0;
  for (const q of quizzes) {
    if (data.answers[q.id] === q.correct_answer) correct++;
  }
  const score = Math.round(correct / total * 100);
  let credentialId = null;
  if (score >= 80) {
    const {
      data: cred,
      error: cErr
    } = await supabase.from("user_credentials").insert({
      user_id: userId,
      credential_name: `${mod.title} — Certified`,
      score,
      module_id: data.moduleId
    }).select("id").maybeSingle();
    if (cErr) throw new Error(cErr.message);
    credentialId = cred?.id ?? null;
  }
  return {
    score,
    correct,
    total,
    passed: score >= 80,
    credentialId
  };
});
export {
  listMyCredentials_createServerFn_handler,
  submitQuiz_createServerFn_handler
};

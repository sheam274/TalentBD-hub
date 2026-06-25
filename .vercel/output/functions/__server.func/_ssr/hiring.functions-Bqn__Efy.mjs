import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
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
const listMessages_createServerFn_handler = createServerRpc({
  id: "31cb9599c0d99e301c45a2ab4e143ce60410025d788dfd2f4e7b3bc72496138d",
  name: "listMessages",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => listMessages.__executeServer(opts));
const listMessages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(listMessages_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("application_messages").select("*").eq("application_id", data.applicationId).order("created_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const sendMessage_createServerFn_handler = createServerRpc({
  id: "49050c353ddd21d31480e10a26c7a7dbc0591858b7599c7b7060f1fc12c4db12",
  name: "sendMessage",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => sendMessage.__executeServer(opts));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  body: stringType().min(1).max(4e3)
}).parse(i)).handler(sendMessage_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("application_messages").insert({
    application_id: data.applicationId,
    sender_id: context.userId,
    body: data.body
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const scheduleInterview_createServerFn_handler = createServerRpc({
  id: "940193314f2e85e01038adcd6f824df3147e66414ecdff0e8d512f952702765a",
  name: "scheduleInterview",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => scheduleInterview.__executeServer(opts));
const scheduleInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  scheduledAt: stringType().min(5),
  meetingUrl: stringType().url(),
  provider: stringType().max(40).optional(),
  notes: stringType().max(2e3).optional()
}).parse(i)).handler(scheduleInterview_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("interview_invitations").insert({
    application_id: data.applicationId,
    scheduled_at: data.scheduledAt,
    meeting_url: data.meetingUrl,
    provider: data.provider ?? null,
    notes: data.notes ?? null,
    created_by: context.userId
  });
  if (error) throw new Error(error.message);
  await context.supabase.from("job_applications").update({
    stage: "interview",
    stage_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: "interview"
  }).eq("id", data.applicationId);
  return {
    ok: true
  };
});
const listInvitations_createServerFn_handler = createServerRpc({
  id: "e10825a874f24275763bd03108f176c830a2d057ccf162a5919debd136213fa1",
  name: "listInvitations",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => listInvitations.__executeServer(opts));
const listInvitations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(listInvitations_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("interview_invitations").select("*").eq("application_id", data.applicationId).order("scheduled_at", {
    ascending: true
  });
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const issueAppointmentLetter_createServerFn_handler = createServerRpc({
  id: "f135e4b4c6cc5753771ae0820b40460f468cf94612a580145434852997f3d26b",
  name: "issueAppointmentLetter",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => issueAppointmentLetter.__executeServer(opts));
const issueAppointmentLetter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  position: stringType().min(1).max(160),
  salary: stringType().max(80).optional(),
  startDate: stringType().optional(),
  body: stringType().min(10).max(8e3)
}).parse(i)).handler(issueAppointmentLetter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: letter,
    error
  } = await context.supabase.from("appointment_letters").insert({
    application_id: data.applicationId,
    position: data.position,
    salary: data.salary ?? null,
    start_date: data.startDate || null,
    body: data.body,
    issued_by: context.userId
  }).select("id").single();
  if (error) throw new Error(error.message);
  await context.supabase.from("job_applications").update({
    stage: "offer",
    stage_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: "offer"
  }).eq("id", data.applicationId);
  return {
    ok: true,
    id: letter.id
  };
});
const getLetter_createServerFn_handler = createServerRpc({
  id: "90ee2599f8529669c1bf2682e1e5a2d0835d90152f3eb423c2743518097079d0",
  name: "getLetter",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => getLetter.__executeServer(opts));
const getLetter = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(getLetter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: letter,
    error
  } = await context.supabase.from("appointment_letters").select("*, application:job_applications(*, job:job_marketplace(job_title, company), applicant:profiles(name))").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return letter;
});
const listLettersForApp_createServerFn_handler = createServerRpc({
  id: "2baeaa91ddc2c977db3a82ded74c3ef8754657a959af7b435924a09a5ecf3a6d",
  name: "listLettersForApp",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => listLettersForApp.__executeServer(opts));
const listLettersForApp = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(listLettersForApp_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: rows,
    error
  } = await context.supabase.from("appointment_letters").select("*").eq("application_id", data.applicationId).order("issued_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const acceptLetter_createServerFn_handler = createServerRpc({
  id: "5abd03faac4f39896017b918d25ba7b3aa506409398ae67e2f2157d1e5ac2517",
  name: "acceptLetter",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => acceptLetter.__executeServer(opts));
const acceptLetter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(acceptLetter_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: letter,
    error: e0
  } = await context.supabase.from("appointment_letters").select("application_id").eq("id", data.id).maybeSingle();
  if (e0 || !letter) throw new Error("Letter not found");
  const {
    error
  } = await context.supabase.from("appointment_letters").update({
    accepted_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await context.supabase.from("job_applications").update({
    stage: "hired",
    stage_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: "hired"
  }).eq("id", letter.application_id);
  return {
    ok: true
  };
});
const getMyApplicationTracking_createServerFn_handler = createServerRpc({
  id: "fb47e927a34a12e7600faef18d3a98bd927a677794d8856995923d41545f2a93",
  name: "getMyApplicationTracking",
  filename: "src/lib/hiring.functions.ts"
}, (opts) => getMyApplicationTracking.__executeServer(opts));
const getMyApplicationTracking = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(getMyApplicationTracking_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: app,
    error
  } = await context.supabase.from("job_applications").select("*, job:job_marketplace(*)").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
  if (error || !app) throw new Error("Application not found");
  const [{
    data: invites
  }, {
    data: letters
  }, {
    data: messages
  }] = await Promise.all([context.supabase.from("interview_invitations").select("*").eq("application_id", data.id).order("scheduled_at"), context.supabase.from("appointment_letters").select("*").eq("application_id", data.id).order("issued_at", {
    ascending: false
  }), context.supabase.from("application_messages").select("*").eq("application_id", data.id).order("created_at")]);
  return {
    app,
    invites: invites ?? [],
    letters: letters ?? [],
    messages: messages ?? []
  };
});
export {
  acceptLetter_createServerFn_handler,
  getLetter_createServerFn_handler,
  getMyApplicationTracking_createServerFn_handler,
  issueAppointmentLetter_createServerFn_handler,
  listInvitations_createServerFn_handler,
  listLettersForApp_createServerFn_handler,
  listMessages_createServerFn_handler,
  scheduleInterview_createServerFn_handler,
  sendMessage_createServerFn_handler
};

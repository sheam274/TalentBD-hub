import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, e as enumType, s as stringType, n as numberType } from "../_libs/zod.mjs";
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
async function assertAdmin(supabase, userId) {
  const {
    data: roles
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");
}
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240",
  name: "adminListUsers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListUsers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("id, name, discipline, created_at").order("created_at", {
    ascending: false
  });
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("user_id, role");
  const {
    data: creds
  } = await supabaseAdmin.from("user_credentials").select("user_id, credential_name, score, verified_at").order("verified_at", {
    ascending: false
  });
  return {
    profiles: profiles ?? [],
    roles: roles ?? [],
    credentials: creds ?? []
  };
});
const adminSetRole_createServerFn_handler = createServerRpc({
  id: "154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3",
  name: "adminSetRole",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminSetRole.__executeServer(opts));
const adminSetRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  userId: stringType().uuid(),
  role: enumType(["admin", "student"]),
  grant: booleanType()
}).parse(i)).handler(adminSetRole_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  if (data.grant) {
    const {
      error
    } = await supabaseAdmin.from("user_roles").insert({
      user_id: data.userId,
      role: data.role
    }).select();
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
  } else {
    const {
      error
    } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId).eq("role", data.role);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminAdjustCredential_createServerFn_handler = createServerRpc({
  id: "7cd5388042421c6471c7c6bb306b56f4852d1622bf6c7703d758526f5bec4caf",
  name: "adminAdjustCredential",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminAdjustCredential.__executeServer(opts));
const adminAdjustCredential = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  userId: stringType().uuid(),
  credentialName: stringType().min(1),
  score: numberType().min(0).max(100)
}).parse(i)).handler(adminAdjustCredential_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("user_credentials").insert({
    user_id: data.userId,
    credential_name: data.credentialName,
    score: data.score
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminStats_createServerFn_handler = createServerRpc({
  id: "fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f",
  name: "adminStats",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminStats.__executeServer(opts));
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const [{
    count: users
  }, {
    count: modules
  }, {
    count: jobs
  }, {
    count: creds
  }] = await Promise.all([supabaseAdmin.from("profiles").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("learning_modules").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("job_marketplace").select("*", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("user_credentials").select("*", {
    count: "exact",
    head: true
  })]);
  return {
    users: users ?? 0,
    modules: modules ?? 0,
    jobs: jobs ?? 0,
    credentials: creds ?? 0
  };
});
const adminListEmployers_createServerFn_handler = createServerRpc({
  id: "eb4be16a46a2b7c4672e1e9b8f2278b719bbc0b0a5469fede4d38f9c933254ca",
  name: "adminListEmployers",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListEmployers.__executeServer(opts));
const adminListEmployers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListEmployers_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "employer");
  const ids = (roles ?? []).map((r) => r.user_id);
  if (!ids.length) return [];
  const {
    data: profiles
  } = await supabaseAdmin.from("profiles").select("*").in("id", ids);
  const {
    data: members
  } = await supabaseAdmin.from("company_members").select("user_id, role, company:companies(id, name, slug)").in("user_id", ids);
  return (profiles ?? []).map((p) => ({
    ...p,
    companies: (members ?? []).filter((m) => m.user_id === p.id)
  }));
});
const adminListApplications_createServerFn_handler = createServerRpc({
  id: "ce92b1170c2782508e220f9436610391c940fe31e688047e3945aafd97eaf528",
  name: "adminListApplications",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListApplications.__executeServer(opts));
const adminListApplications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListApplications_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data
  } = await supabaseAdmin.from("job_applications").select("id, status, stage, created_at, user_id, job:job_marketplace(id, job_title, company), applicant:profiles(name)").order("created_at", {
    ascending: false
  }).limit(200);
  return data ?? [];
});
const adminListInvitations_createServerFn_handler = createServerRpc({
  id: "acc379ac262277a156b01dba433754d310b0739cae2860b5493cc6abdd84f8a6",
  name: "adminListInvitations",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListInvitations.__executeServer(opts));
const adminListInvitations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListInvitations_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data
  } = await supabaseAdmin.from("interview_invitations").select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))").order("scheduled_at", {
    ascending: false
  }).limit(200);
  return data ?? [];
});
const adminListLetters_createServerFn_handler = createServerRpc({
  id: "edab342e568adc7903d83ba759d134e66019ade0742ab3dfcab2c90b9a92280c",
  name: "adminListLetters",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminListLetters.__executeServer(opts));
const adminListLetters = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListLetters_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    data
  } = await supabaseAdmin.from("appointment_letters").select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))").order("issued_at", {
    ascending: false
  }).limit(200);
  return data ?? [];
});
const adminDeleteRow_createServerFn_handler = createServerRpc({
  id: "87fa8faa27fbc4c76dc9dae7d66bb47df38b6b341b6351074a7979f8a5312e46",
  name: "adminDeleteRow",
  filename: "src/lib/admin.functions.ts"
}, (opts) => adminDeleteRow.__executeServer(opts));
const adminDeleteRow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  table: enumType(["interview_invitations", "appointment_letters", "application_messages", "job_applications"]),
  id: stringType().uuid()
}).parse(i)).handler(adminDeleteRow_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-B5y5XiPZ.mjs");
  const {
    error
  } = await supabaseAdmin.from(data.table).delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminAdjustCredential_createServerFn_handler,
  adminDeleteRow_createServerFn_handler,
  adminListApplications_createServerFn_handler,
  adminListEmployers_createServerFn_handler,
  adminListInvitations_createServerFn_handler,
  adminListLetters_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminSetRole_createServerFn_handler,
  adminStats_createServerFn_handler
};

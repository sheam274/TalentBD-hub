import { c as createServerRpc } from "./createServerRpc-n_mmGc1i.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { s as supabase } from "./client-Bnm4-7qk.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, a as arrayType, l as literalType } from "../_libs/zod.mjs";
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
const listJobsPublic_createServerFn_handler = createServerRpc({
  id: "5d02ceaeb7c5fbb24907dafedd46657733fb994ee9f4dc006c0be5cc98b4f2f5",
  name: "listJobsPublic",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => listJobsPublic.__executeServer(opts));
const listJobsPublic = createServerFn({
  method: "GET"
}).handler(listJobsPublic_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabase.from("job_marketplace").select("*").eq("is_live", true).order("is_featured", {
    ascending: false
  }).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getJobPublic_createServerFn_handler = createServerRpc({
  id: "7b5057f369a830a316b3f162d4f3a5880425d0de6259641b14cc0dd69a61d108",
  name: "getJobPublic",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => getJobPublic.__executeServer(opts));
const getJobPublic = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(getJobPublic_createServerFn_handler, async ({
  data
}) => {
  const {
    data: job,
    error
  } = await supabase.from("job_marketplace").select("*").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return job;
});
const getMyApplicationForJob_createServerFn_handler = createServerRpc({
  id: "7ea7eaf411029bc4dd9fd51f9158387b55d31afa0ef2b8da41af88939858acfa",
  name: "getMyApplicationForJob",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => getMyApplicationForJob.__executeServer(opts));
const getMyApplicationForJob = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid()
}).parse(i)).handler(getMyApplicationForJob_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: app,
    error
  } = await context.supabase.from("job_applications").select("id, status, created_at, cover_note").eq("job_id", data.jobId).eq("user_id", context.userId).maybeSingle();
  if (error) throw new Error(error.message);
  return app;
});
const listCompaniesPublic_createServerFn_handler = createServerRpc({
  id: "7408dd7dd4fd762b53a4f2b7d411833f1ebe75c0b8d78d44a80d542be60d3c3c",
  name: "listCompaniesPublic",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => listCompaniesPublic.__executeServer(opts));
const listCompaniesPublic = createServerFn({
  method: "GET"
}).handler(listCompaniesPublic_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabase.from("companies").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getCompanyBySlug_createServerFn_handler = createServerRpc({
  id: "7fa3a7bac652e33498721994b256666c4823262ba34675f430676e07f37b6ed9",
  name: "getCompanyBySlug",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => getCompanyBySlug.__executeServer(opts));
const getCompanyBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  slug: stringType().min(1).max(120)
}).parse(i)).handler(getCompanyBySlug_createServerFn_handler, async ({
  data
}) => {
  const {
    data: company,
    error
  } = await supabase.from("companies").select("*").eq("slug", data.slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!company) return null;
  const {
    data: jobs
  } = await supabase.from("job_marketplace").select("*").eq("is_live", true).or(`company_id.eq.${company.id},company.eq.${company.name}`).order("created_at", {
    ascending: false
  });
  return {
    company,
    jobs: jobs ?? []
  };
});
const jobSchema = objectType({
  id: stringType().uuid().optional(),
  job_title: stringType().min(1),
  company: stringType().min(1),
  description: stringType().optional().nullable(),
  is_remote: booleanType(),
  salary_range: stringType().optional().nullable(),
  requirements: arrayType(stringType()),
  discipline: stringType().optional().nullable(),
  is_live: booleanType(),
  category: stringType().optional().nullable(),
  location: stringType().optional().nullable(),
  experience_level: stringType().optional().nullable(),
  job_type: stringType().optional().nullable(),
  application_deadline: stringType().optional().nullable(),
  is_featured: booleanType().optional(),
  company_id: stringType().uuid().optional().nullable()
});
async function assertAdmin(supabase2, userId) {
  const {
    data: roles
  } = await supabase2.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");
}
const adminListJobs_createServerFn_handler = createServerRpc({
  id: "237197bfe598b3d2a2930c1363b6e8e342c63f281c63e7e6a41a36c74e7ea1e5",
  name: "adminListJobs",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminListJobs.__executeServer(opts));
const adminListJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListJobs_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("job_marketplace").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertJob_createServerFn_handler = createServerRpc({
  id: "c93fe258fa7b1856285f003ca3909e157ae3cee6bf554539e59df5c2b0b9a99a",
  name: "adminUpsertJob",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminUpsertJob.__executeServer(opts));
const adminUpsertJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => jobSchema.parse(i)).handler(adminUpsertJob_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = data.id ? await context.supabase.from("job_marketplace").update(data).eq("id", data.id) : await context.supabase.from("job_marketplace").insert(data);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminToggleJobLive_createServerFn_handler = createServerRpc({
  id: "fb29f374d7deda1aba3ccca7d582c3650dab0cbe96c00b70a321b596f2aa2e8e",
  name: "adminToggleJobLive",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminToggleJobLive.__executeServer(opts));
const adminToggleJobLive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(adminToggleJobLive_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("job_marketplace").update({
    is_live: data.is_live
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteJob_createServerFn_handler = createServerRpc({
  id: "6b9c582fe3057f08f761196abcc83a86955aa38a95f0bddf666456ba07f41b92",
  name: "adminDeleteJob",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminDeleteJob.__executeServer(opts));
const adminDeleteJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(adminDeleteJob_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("job_marketplace").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const applyToJob_createServerFn_handler = createServerRpc({
  id: "85740c9ced03db0602f420a6a1df3f2dc074bb31cf5ab6f2a31b1644a86ad1bf",
  name: "applyToJob",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => applyToJob.__executeServer(opts));
const applyToJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid(),
  coverNote: stringType().max(2e3).optional()
}).parse(i)).handler(applyToJob_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("job_applications").insert({
    job_id: data.jobId,
    user_id: context.userId,
    cover_note: data.coverNote ?? null
  });
  if (error && !error.message.toLowerCase().includes("duplicate")) throw new Error(error.message);
  return {
    ok: true
  };
});
const listMyApplications_createServerFn_handler = createServerRpc({
  id: "5fd5f8abf7af50036312b96324d91e2e2c97b7af588a61b778613c48a7399aea",
  name: "listMyApplications",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => listMyApplications.__executeServer(opts));
const listMyApplications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listMyApplications_createServerFn_handler, async ({
  context
}) => {
  const {
    data,
    error
  } = await context.supabase.from("job_applications").select("id, status, created_at, cover_note, job:job_marketplace(id, job_title, company, location, is_remote, application_deadline)").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const withdrawApplication_createServerFn_handler = createServerRpc({
  id: "4a94def7f696452ae1a9b39db5d2500423bc42c532bfef59757c48500a40c9b7",
  name: "withdrawApplication",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => withdrawApplication.__executeServer(opts));
const withdrawApplication = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(withdrawApplication_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("job_applications").delete().eq("id", data.id).eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const companySchema = objectType({
  id: stringType().uuid().optional(),
  name: stringType().min(1),
  slug: stringType().min(1).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, dashes only"),
  logo_url: stringType().url().optional().nullable().or(literalType("")),
  website: stringType().url().optional().nullable().or(literalType("")),
  industry: stringType().optional().nullable(),
  location: stringType().optional().nullable(),
  description: stringType().optional().nullable()
});
const adminListCompanies_createServerFn_handler = createServerRpc({
  id: "078ac378252deec2f29bae705708c9a68997bfb81778b87b1d9d316886dab58c",
  name: "adminListCompanies",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminListCompanies.__executeServer(opts));
const adminListCompanies = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListCompanies_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("companies").select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const adminUpsertCompany_createServerFn_handler = createServerRpc({
  id: "e0da1c62c6cd8f80334c23124d8fdb29ff8b2fcff7bd8a8bb01c0295e1b88912",
  name: "adminUpsertCompany",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminUpsertCompany.__executeServer(opts));
const adminUpsertCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => companySchema.parse(i)).handler(adminUpsertCompany_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const payload = {
    ...data,
    logo_url: data.logo_url || null,
    website: data.website || null
  };
  const {
    error
  } = data.id ? await context.supabase.from("companies").update(payload).eq("id", data.id) : await context.supabase.from("companies").insert(payload);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteCompany_createServerFn_handler = createServerRpc({
  id: "031c39919a866d9ae9417f33c64b3e850c965480766e89be38ec69cea2859f6c",
  name: "adminDeleteCompany",
  filename: "src/lib/jobs.functions.ts"
}, (opts) => adminDeleteCompany.__executeServer(opts));
const adminDeleteCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(adminDeleteCompany_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("companies").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  adminDeleteCompany_createServerFn_handler,
  adminDeleteJob_createServerFn_handler,
  adminListCompanies_createServerFn_handler,
  adminListJobs_createServerFn_handler,
  adminToggleJobLive_createServerFn_handler,
  adminUpsertCompany_createServerFn_handler,
  adminUpsertJob_createServerFn_handler,
  applyToJob_createServerFn_handler,
  getCompanyBySlug_createServerFn_handler,
  getJobPublic_createServerFn_handler,
  getMyApplicationForJob_createServerFn_handler,
  listCompaniesPublic_createServerFn_handler,
  listJobsPublic_createServerFn_handler,
  listMyApplications_createServerFn_handler,
  withdrawApplication_createServerFn_handler
};

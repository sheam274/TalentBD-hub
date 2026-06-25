import { c as createServerRpc } from "./createServerRpc-DsKw3SU9.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, l as literalType, b as booleanType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
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
async function myCompany(supabase, userId) {
  const {
    data
  } = await supabase.from("company_members").select("company_id, company:companies(*)").eq("user_id", userId).limit(1).maybeSingle();
  if (!data) throw new Error("No company linked to this account");
  return {
    companyId: data.company_id,
    company: data.company
  };
}
const getMyCompany_createServerFn_handler = createServerRpc({
  id: "0a53d7486d303a3715a6e53dde8de07e16ae0422511068197a554cf05b569f11",
  name: "getMyCompany",
  filename: "src/lib/employer.functions.ts"
}, (opts) => getMyCompany.__executeServer(opts));
const getMyCompany = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMyCompany_createServerFn_handler, async ({
  context
}) => {
  const {
    data
  } = await context.supabase.from("company_members").select("company_id, role, company:companies(*)").eq("user_id", context.userId).maybeSingle();
  return data;
});
const updateMyCompany_createServerFn_handler = createServerRpc({
  id: "f2411b68490f12e1d16030d9dbe871e243a63f33abc63d650d06d7cab9ff8482",
  name: "updateMyCompany",
  filename: "src/lib/employer.functions.ts"
}, (opts) => updateMyCompany.__executeServer(opts));
const updateMyCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  name: stringType().min(1).max(120),
  website: stringType().url().or(literalType("")).optional().nullable(),
  logo_url: stringType().url().or(literalType("")).optional().nullable(),
  industry: stringType().max(120).optional().nullable(),
  location: stringType().max(160).optional().nullable(),
  description: stringType().max(4e3).optional().nullable()
}).parse(i)).handler(updateMyCompany_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    companyId
  } = await myCompany(context.supabase, context.userId);
  const {
    error
  } = await context.supabase.from("companies").update({
    name: data.name,
    website: data.website || null,
    logo_url: data.logo_url || null,
    industry: data.industry || null,
    location: data.location || null,
    description: data.description || null
  }).eq("id", companyId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const createCompanyForMe_createServerFn_handler = createServerRpc({
  id: "641668385b338783a93f89916c322667da7a94f3eb2ef5f1ca2fda9e358edda5",
  name: "createCompanyForMe",
  filename: "src/lib/employer.functions.ts"
}, (opts) => createCompanyForMe.__executeServer(opts));
const createCompanyForMe = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  name: stringType().min(1).max(120),
  website: stringType().url().or(literalType("")).optional()
}).parse(i)).handler(createCompanyForMe_createServerFn_handler, async ({
  data,
  context
}) => {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + context.userId.slice(0, 6);
  const {
    data: company,
    error
  } = await context.supabase.from("companies").insert({
    name: data.name,
    slug,
    website: data.website || null
  }).select("id").single();
  if (error) throw new Error(error.message);
  const {
    error: e2
  } = await context.supabase.from("company_members").insert({
    company_id: company.id,
    user_id: context.userId,
    role: "owner"
  });
  if (e2) throw new Error(e2.message);
  return {
    ok: true,
    companyId: company.id
  };
});
const employerListJobs_createServerFn_handler = createServerRpc({
  id: "da347493270df04783a4229e1cf1826c965643a2d32ec373a36d11e26b1c9ea3",
  name: "employerListJobs",
  filename: "src/lib/employer.functions.ts"
}, (opts) => employerListJobs.__executeServer(opts));
const employerListJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(employerListJobs_createServerFn_handler, async ({
  context
}) => {
  const {
    companyId
  } = await myCompany(context.supabase, context.userId);
  const {
    data,
    error
  } = await context.supabase.from("job_marketplace").select("*").eq("company_id", companyId).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const jobInput = objectType({
  id: stringType().uuid().optional(),
  job_title: stringType().min(1).max(160),
  description: stringType().max(8e3).optional().nullable(),
  is_remote: booleanType(),
  salary_range: stringType().max(80).optional().nullable(),
  requirements: arrayType(stringType().max(200)).max(20),
  discipline: stringType().max(80).optional().nullable(),
  is_live: booleanType(),
  category: stringType().max(80).optional().nullable(),
  location: stringType().max(160).optional().nullable(),
  experience_level: stringType().max(80).optional().nullable(),
  job_type: stringType().max(80).optional().nullable(),
  application_deadline: stringType().optional().nullable()
});
const employerUpsertJob_createServerFn_handler = createServerRpc({
  id: "90f0daaea37acd212ba05f402f5bfd144fca4d611002ffe6fba5e8f3199da0c9",
  name: "employerUpsertJob",
  filename: "src/lib/employer.functions.ts"
}, (opts) => employerUpsertJob.__executeServer(opts));
const employerUpsertJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => jobInput.parse(i)).handler(employerUpsertJob_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    companyId,
    company
  } = await myCompany(context.supabase, context.userId);
  const payload = {
    ...data,
    company_id: companyId,
    company: company?.name ?? ""
  };
  const {
    error
  } = data.id ? await context.supabase.from("job_marketplace").update(payload).eq("id", data.id) : await context.supabase.from("job_marketplace").insert(payload);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const employerDeleteJob_createServerFn_handler = createServerRpc({
  id: "aa18f2799919506899e382907609804e8f55a955e00280cb5edb9f416764fa37",
  name: "employerDeleteJob",
  filename: "src/lib/employer.functions.ts"
}, (opts) => employerDeleteJob.__executeServer(opts));
const employerDeleteJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(employerDeleteJob_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("job_marketplace").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const employerListApplicants_createServerFn_handler = createServerRpc({
  id: "6f9328df709b0435c1728567754497e95421d18f75040e774dc2efe8a6ff3d2e",
  name: "employerListApplicants",
  filename: "src/lib/employer.functions.ts"
}, (opts) => employerListApplicants.__executeServer(opts));
const employerListApplicants = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid().optional()
}).parse(i)).handler(employerListApplicants_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    companyId
  } = await myCompany(context.supabase, context.userId);
  let q = context.supabase.from("job_applications").select("id, status, stage, created_at, cover_note, user_id, job:job_marketplace!inner(id, job_title, company_id), applicant:profiles(id, name, discipline)").eq("job.company_id", companyId).order("created_at", {
    ascending: false
  });
  if (data.jobId) q = q.eq("job_id", data.jobId);
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const employerGetApplication_createServerFn_handler = createServerRpc({
  id: "e31ba59b9f8102e4a01d26c5355b03ae7ac798d3c30cbea28c332ecd917f07f5",
  name: "employerGetApplication",
  filename: "src/lib/employer.functions.ts"
}, (opts) => employerGetApplication.__executeServer(opts));
const employerGetApplication = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(employerGetApplication_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    data: app,
    error
  } = await context.supabase.from("job_applications").select("*, job:job_marketplace(*), applicant:profiles(id, name, discipline, skills)").eq("id", data.id).maybeSingle();
  if (error) throw new Error(error.message);
  return app;
});
const updateApplicationStage_createServerFn_handler = createServerRpc({
  id: "bc4aa231c6422106b29e19f77399d4f8ee2a9ba0e5f6a3d051ea87af0dfe400c",
  name: "updateApplicationStage",
  filename: "src/lib/employer.functions.ts"
}, (opts) => updateApplicationStage.__executeServer(opts));
const updateApplicationStage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  stage: enumType(["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"])
}).parse(i)).handler(updateApplicationStage_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    error
  } = await context.supabase.from("job_applications").update({
    stage: data.stage,
    stage_updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    status: data.stage
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
export {
  createCompanyForMe_createServerFn_handler,
  employerDeleteJob_createServerFn_handler,
  employerGetApplication_createServerFn_handler,
  employerListApplicants_createServerFn_handler,
  employerListJobs_createServerFn_handler,
  employerUpsertJob_createServerFn_handler,
  getMyCompany_createServerFn_handler,
  updateApplicationStage_createServerFn_handler,
  updateMyCompany_createServerFn_handler
};

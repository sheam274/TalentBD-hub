import { c as createSsrRpc } from "./router-BajK73Jd.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { o as objectType, s as stringType, b as booleanType, a as arrayType, l as literalType } from "../_libs/zod.mjs";
const listJobsPublic = createServerFn({
  method: "GET"
}).handler(createSsrRpc("5d02ceaeb7c5fbb24907dafedd46657733fb994ee9f4dc006c0be5cc98b4f2f5"));
const getJobPublic = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("7b5057f369a830a316b3f162d4f3a5880425d0de6259641b14cc0dd69a61d108"));
const getMyApplicationForJob = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("7ea7eaf411029bc4dd9fd51f9158387b55d31afa0ef2b8da41af88939858acfa"));
const listCompaniesPublic = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7408dd7dd4fd762b53a4f2b7d411833f1ebe75c0b8d78d44a80d542be60d3c3c"));
const getCompanyBySlug = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  slug: stringType().min(1).max(120)
}).parse(i)).handler(createSsrRpc("7fa3a7bac652e33498721994b256666c4823262ba34675f430676e07f37b6ed9"));
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
const adminListJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("237197bfe598b3d2a2930c1363b6e8e342c63f281c63e7e6a41a36c74e7ea1e5"));
const adminUpsertJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => jobSchema.parse(i)).handler(createSsrRpc("c93fe258fa7b1856285f003ca3909e157ae3cee6bf554539e59df5c2b0b9a99a"));
const adminToggleJobLive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("fb29f374d7deda1aba3ccca7d582c3650dab0cbe96c00b70a321b596f2aa2e8e"));
const adminDeleteJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("6b9c582fe3057f08f761196abcc83a86955aa38a95f0bddf666456ba07f41b92"));
const applyToJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid(),
  coverNote: stringType().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("85740c9ced03db0602f420a6a1df3f2dc074bb31cf5ab6f2a31b1644a86ad1bf"));
const listMyApplications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5fd5f8abf7af50036312b96324d91e2e2c97b7af588a61b778613c48a7399aea"));
const withdrawApplication = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("4a94def7f696452ae1a9b39db5d2500423bc42c532bfef59757c48500a40c9b7"));
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
const adminListCompanies = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("078ac378252deec2f29bae705708c9a68997bfb81778b87b1d9d316886dab58c"));
const adminUpsertCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => companySchema.parse(i)).handler(createSsrRpc("e0da1c62c6cd8f80334c23124d8fdb29ff8b2fcff7bd8a8bb01c0295e1b88912"));
const adminDeleteCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("031c39919a866d9ae9417f33c64b3e850c965480766e89be38ec69cea2859f6c"));
export {
  applyToJob as a,
  listCompaniesPublic as b,
  getMyApplicationForJob as c,
  getCompanyBySlug as d,
  listMyApplications as e,
  adminListJobs as f,
  getJobPublic as g,
  adminUpsertJob as h,
  adminToggleJobLive as i,
  adminDeleteJob as j,
  adminListCompanies as k,
  listJobsPublic as l,
  adminUpsertCompany as m,
  adminDeleteCompany as n,
  withdrawApplication as w
};

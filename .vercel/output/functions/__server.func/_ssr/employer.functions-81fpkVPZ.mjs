import { c as createSsrRpc } from "./router-BajK73Jd.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { o as objectType, s as stringType, l as literalType, b as booleanType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
const getMyCompany = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("0a53d7486d303a3715a6e53dde8de07e16ae0422511068197a554cf05b569f11"));
const updateMyCompany = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  name: stringType().min(1).max(120),
  website: stringType().url().or(literalType("")).optional().nullable(),
  logo_url: stringType().url().or(literalType("")).optional().nullable(),
  industry: stringType().max(120).optional().nullable(),
  location: stringType().max(160).optional().nullable(),
  description: stringType().max(4e3).optional().nullable()
}).parse(i)).handler(createSsrRpc("f2411b68490f12e1d16030d9dbe871e243a63f33abc63d650d06d7cab9ff8482"));
const createCompanyForMe = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  name: stringType().min(1).max(120),
  website: stringType().url().or(literalType("")).optional()
}).parse(i)).handler(createSsrRpc("641668385b338783a93f89916c322667da7a94f3eb2ef5f1ca2fda9e358edda5"));
const employerListJobs = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("da347493270df04783a4229e1cf1826c965643a2d32ec373a36d11e26b1c9ea3"));
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
const employerUpsertJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => jobInput.parse(i)).handler(createSsrRpc("90f0daaea37acd212ba05f402f5bfd144fca4d611002ffe6fba5e8f3199da0c9"));
const employerDeleteJob = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => i).handler(createSsrRpc("aa18f2799919506899e382907609804e8f55a955e00280cb5edb9f416764fa37"));
const employerListApplicants = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  jobId: stringType().uuid().optional()
}).parse(i)).handler(createSsrRpc("6f9328df709b0435c1728567754497e95421d18f75040e774dc2efe8a6ff3d2e"));
const employerGetApplication = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("e31ba59b9f8102e4a01d26c5355b03ae7ac798d3c30cbea28c332ecd917f07f5"));
const updateApplicationStage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid(),
  stage: enumType(["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"])
}).parse(i)).handler(createSsrRpc("bc4aa231c6422106b29e19f77399d4f8ee2a9ba0e5f6a3d051ea87af0dfe400c"));
export {
  employerUpsertJob as a,
  employerDeleteJob as b,
  employerListApplicants as c,
  createCompanyForMe as d,
  employerListJobs as e,
  updateApplicationStage as f,
  getMyCompany as g,
  employerGetApplication as h,
  updateMyCompany as u
};

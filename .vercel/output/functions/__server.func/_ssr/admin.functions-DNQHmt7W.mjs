import { c as createSsrRpc } from "./router-BajK73Jd.mjs";
import { c as createServerFn } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { o as objectType, b as booleanType, e as enumType, s as stringType, n as numberType } from "../_libs/zod.mjs";
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("35cf6cc28f61c798a570ec39672552de8ed250f60706565e25b34a66f0c5b240"));
const adminSetRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  userId: stringType().uuid(),
  role: enumType(["admin", "student"]),
  grant: booleanType()
}).parse(i)).handler(createSsrRpc("154da85bc7e5915df5164155bbb68a97441082079312d44aab513dabc82f59c3"));
const adminAdjustCredential = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  userId: stringType().uuid(),
  credentialName: stringType().min(1),
  score: numberType().min(0).max(100)
}).parse(i)).handler(createSsrRpc("7cd5388042421c6471c7c6bb306b56f4852d1622bf6c7703d758526f5bec4caf"));
const adminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fc54988025651b0d207f9ef4346d9f0fe848ff17785294a4a080cffaee281f4f"));
const adminListEmployers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("eb4be16a46a2b7c4672e1e9b8f2278b719bbc0b0a5469fede4d38f9c933254ca"));
const adminListApplications = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ce92b1170c2782508e220f9436610391c940fe31e688047e3945aafd97eaf528"));
const adminListInvitations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("acc379ac262277a156b01dba433754d310b0739cae2860b5493cc6abdd84f8a6"));
const adminListLetters = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("edab342e568adc7903d83ba759d134e66019ade0742ab3dfcab2c90b9a92280c"));
const adminDeleteRow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  table: enumType(["interview_invitations", "appointment_letters", "application_messages", "job_applications"]),
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("87fa8faa27fbc4c76dc9dae7d66bb47df38b6b341b6351074a7979f8a5312e46"));
export {
  adminListUsers as a,
  adminSetRole as b,
  adminAdjustCredential as c,
  adminListLetters as d,
  adminDeleteRow as e,
  adminListInvitations as f,
  adminListEmployers as g,
  adminStats as h,
  adminListApplications as i
};

import { c as createSsrRpc } from "./router-B8OUd1qE.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const listMessages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("31cb9599c0d99e301c45a2ab4e143ce60410025d788dfd2f4e7b3bc72496138d"));
const sendMessage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  body: stringType().min(1).max(4e3)
}).parse(i)).handler(createSsrRpc("49050c353ddd21d31480e10a26c7a7dbc0591858b7599c7b7060f1fc12c4db12"));
const scheduleInterview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  scheduledAt: stringType().min(5),
  meetingUrl: stringType().url(),
  provider: stringType().max(40).optional(),
  notes: stringType().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("940193314f2e85e01038adcd6f824df3147e66414ecdff0e8d512f952702765a"));
const listInvitations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("e10825a874f24275763bd03108f176c830a2d057ccf162a5919debd136213fa1"));
const issueAppointmentLetter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid(),
  position: stringType().min(1).max(160),
  salary: stringType().max(80).optional(),
  startDate: stringType().optional(),
  body: stringType().min(10).max(8e3)
}).parse(i)).handler(createSsrRpc("f135e4b4c6cc5753771ae0820b40460f468cf94612a580145434852997f3d26b"));
const getLetter = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("90ee2599f8529669c1bf2682e1e5a2d0835d90152f3eb423c2743518097079d0"));
const listLettersForApp = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  applicationId: stringType().uuid()
}).parse(i)).handler(createSsrRpc("2baeaa91ddc2c977db3a82ded74c3ef8754657a959af7b435924a09a5ecf3a6d"));
const acceptLetter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("5abd03faac4f39896017b918d25ba7b3aa506409398ae67e2f2157d1e5ac2517"));
const getMyApplicationTracking = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
  id: stringType().uuid()
}).parse(i)).handler(createSsrRpc("fb47e927a34a12e7600faef18d3a98bd927a677794d8856995923d41545f2a93"));
export {
  getLetter as a,
  acceptLetter as b,
  scheduleInterview as c,
  listInvitations as d,
  listLettersForApp as e,
  getMyApplicationTracking as g,
  issueAppointmentLetter as i,
  listMessages as l,
  sendMessage as s
};

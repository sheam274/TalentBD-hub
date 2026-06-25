import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { d as Route$k, a as useServerFn } from "./router-B8OUd1qE.mjs";
import { g as getMyApplicationTracking, s as sendMessage } from "./hiring.functions-BXo_Q1ek.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-Bnm4-7qk.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-XhNC2-Ux.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
const STEPS = ["applied", "screening", "interview", "offer", "hired"];
function Page() {
  const {
    appId
  } = Route$k.useParams();
  const fn = useServerFn(getMyApplicationTracking);
  const sendFn = useServerFn(sendMessage);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["track", appId],
    queryFn: () => fn({
      data: {
        id: appId
      }
    }),
    refetchInterval: 1e4
  });
  const [msg, setMsg] = reactExports.useState("");
  const send = useMutation({
    mutationFn: () => sendFn({
      data: {
        applicationId: appId,
        body: msg
      }
    }),
    onSuccess: () => {
      setMsg("");
      qc.invalidateQueries({
        queryKey: ["track", appId]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: "Loading…" });
  const d = q.data;
  if (!d) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: "Application not found." });
  const stage = d.app.stage ?? d.app.status ?? "applied";
  const stageIdx = STEPS.indexOf(stage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", className: "text-sm text-muted-foreground hover:underline", children: "← All applications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-2xl font-bold", children: d.app.job?.job_title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      d.app.job?.company,
      " · Applied ",
      new Date(d.app.created_at).toLocaleDateString()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Status timeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 grid grid-cols-5 gap-2", children: STEPS.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `rounded-md border p-2 text-center text-xs ${i <= stageIdx ? "bg-primary text-primary-foreground" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold capitalize", children: s }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] opacity-80", children: [
          "Step ",
          i + 1
        ] })
      ] }, s)) }),
      stage === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-red-600", children: "This application was not selected." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid grid-cols-1 gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Interview invitations" }),
        (d.invites ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "No interviews scheduled yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-2 text-sm", children: (d.invites ?? []).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: new Date(i.scheduled_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: i.provider ?? "Video meeting" }),
          i.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs", children: i.notes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: i.meeting_url, target: "_blank", rel: "noreferrer", className: "mt-2 inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Join meeting" })
        ] }, i.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Appointment letter" }),
        (d.letters ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "No appointment letter yet." }),
        (d.letters ?? []).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded border p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: l.position }),
          l.salary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            "Salary: ",
            l.salary
          ] }),
          l.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
            "Start: ",
            new Date(l.start_date).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/appointment/$letterId", params: {
            letterId: l.id
          }, className: "mt-2 inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "Open letter" }),
          l.accepted_at && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-emerald-600", children: "Accepted" })
        ] }, l.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border bg-white p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Messages with employer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 max-h-80 space-y-2 overflow-y-auto", children: [
        (d.messages ?? []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender_id === d.app.user_id ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`, children: [
          m.body,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] opacity-70", children: new Date(m.created_at).toLocaleString() })
        ] }, m.id)),
        (d.messages ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No messages yet." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: msg, onChange: (e) => setMsg(e.target.value), placeholder: "Reply to employer…", className: "flex-1 rounded-md border px-3 py-2 text-sm", onKeyDown: (e) => e.key === "Enter" && msg && send.mutate() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send.mutate(), disabled: !msg, className: "rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60", children: "Send" })
      ] })
    ] })
  ] });
}
export {
  Page as component
};

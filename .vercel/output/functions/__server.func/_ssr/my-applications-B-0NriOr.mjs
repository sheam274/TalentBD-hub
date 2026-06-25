import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { e as listMyApplications, w as withdrawApplication } from "./jobs.functions-ChLsVKAv.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function statusColor(s) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}
function MyApps() {
  const listFn = useServerFn(listMyApplications);
  const withdrawFn = useServerFn(withdrawApplication);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["my-apps"],
    queryFn: () => listFn()
  });
  const m = useMutation({
    mutationFn: (id) => withdrawFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Application withdrawn");
      qc.invalidateQueries({
        queryKey: ["my-apps"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "My Applications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Jobs you've applied to and where they stand." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
      (q.data ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: a.job?.job_title ?? "Job removed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            a.job?.company,
            " · ",
            a.job?.location ?? (a.job?.is_remote ? "Remote" : "—")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Applied ",
            new Date(a.created_at).toLocaleDateString(),
            a.stage ? ` · Stage: ${a.stage}` : ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${statusColor(a.status)}`, children: a.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/my-applications/${a.id}`, className: "rounded-md border px-3 py-1.5 text-xs hover:bg-white/60", children: "Track" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => m.mutate(a.id), className: "rounded-md border px-3 py-1.5 text-xs hover:bg-white/60", children: "Withdraw" })
        ] })
      ] }, a.id)),
      (q.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "You haven't applied to any jobs yet. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/jobs", className: "underline", children: "Browse jobs" }),
        "."
      ] })
    ] })
  ] });
}
export {
  MyApps as component
};

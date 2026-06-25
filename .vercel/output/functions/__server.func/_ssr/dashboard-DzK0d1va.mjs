import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { e as employerListJobs, c as employerListApplicants, g as getMyCompany } from "./employer.functions-DBgtNhCp.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
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
function Page() {
  const jobsFn = useServerFn(employerListJobs);
  const appsFn = useServerFn(employerListApplicants);
  const meFn = useServerFn(getMyCompany);
  const me = useQuery({
    queryKey: ["my-company"],
    queryFn: () => meFn()
  });
  const jobs = useQuery({
    queryKey: ["emp-jobs"],
    queryFn: () => jobsFn(),
    enabled: !!me.data
  });
  const apps = useQuery({
    queryKey: ["emp-apps"],
    queryFn: () => appsFn({
      data: {}
    }),
    enabled: !!me.data
  });
  if (!me.isLoading && !me.data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "No company linked" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Your account isn't connected to a company yet. Create one to start posting jobs." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employer/company", className: "mt-3 inline-block rounded-md border px-3 py-1.5 text-sm", children: "Create company" })
    ] });
  }
  const list = apps.data ?? [];
  const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"];
  const counts = Object.fromEntries(stages.map((s) => [s, list.filter((a) => (a.stage ?? a.status) === s).length]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold", children: [
        "Welcome, ",
        me.data?.company?.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your jobs, applicants, interviews and offers." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Active jobs", value: (jobs.data ?? []).filter((j) => j.is_live).length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total applicants", value: list.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "In interview", value: counts.interview ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Hired", value: counts.hired ?? 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Applicant pipeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-6", children: stages.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: counts[s] ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground", children: s })
      ] }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employer/applicants", className: "mt-4 inline-block text-sm underline", children: "View all applicants →" })
    ] })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground", children: label })
  ] });
}
export {
  Page as component
};

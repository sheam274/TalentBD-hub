import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn, g as getMyProfile } from "./router-BajK73Jd.mjs";
import { l as listMyCredentials } from "./assessments.functions-CRWC-ESZ.mjs";
import { l as listJobsPublic, e as listMyApplications } from "./jobs.functions-Dys0FdxM.mjs";
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
import "./server-By-0JTie.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
function Dashboard() {
  const profileFn = useServerFn(getMyProfile);
  const credsFn = useServerFn(listMyCredentials);
  const jobsFn = useServerFn(listJobsPublic);
  const appsFn = useServerFn(listMyApplications);
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => profileFn()
  });
  const creds = useQuery({
    queryKey: ["my-creds"],
    queryFn: () => credsFn()
  });
  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsFn()
  });
  const apps = useQuery({
    queryKey: ["my-apps"],
    queryFn: () => appsFn()
  });
  const p = profile.data?.profile;
  const isAdmin = profile.data?.isAdmin;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { style: {
      background: "var(--color-primary)"
    }, className: "text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-12 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/80", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl font-bold text-white", children: p?.name ?? "Engineer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-white/80", children: p?.discipline ? `Discipline: ${p.discipline}` : "Set your discipline in CV Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Credentials", value: creds.data?.length ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Skills", value: p?.skills?.length ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Applications", value: apps.data?.length ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Live jobs", value: jobs.data?.length ?? 0 })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crossover grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { to: "/learn", label: "Start learning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { to: "/assessments", label: "Take assessment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { to: "/cv-builder", label: "Build CV" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickAction, { to: "/cv-parser", label: "Parse resume" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Recent credentials", children: creds.data?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: creds.data.slice(0, 5).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between border-b pb-2 last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.credential_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            c.score,
            "%"
          ] })
        ] }, c.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "No credentials yet. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/assessments", className: "underline", children: "Take an assessment" }),
          "."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "My applications", children: (apps.data?.length ?? 0) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: apps.data.slice(0, 5).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 border-b pb-2 last:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/jobs/$jobId", params: {
              jobId: a.job?.id ?? ""
            }, className: "truncate hover:underline", children: [
              a.job?.job_title ?? "Job removed",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "— ",
                a.job?.company
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${appColor(a.status)}`, children: a.status })
          ] }, a.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", className: "mt-3 inline-block text-sm", style: {
            color: "var(--color-primary)"
          }, children: "Track all →" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "No applications yet. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "underline", children: "Find a job" }),
          "."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "Latest jobs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2 text-sm", children: (jobs.data ?? []).slice(0, 5).map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between border-b pb-2 last:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/jobs/$jobId", params: {
              jobId: j.id
            }, className: "truncate hover:underline", children: [
              j.job_title,
              " — ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: j.company })
            ] }),
            j.is_remote ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-2 py-0.5 text-xs", children: "Remote" }) : null
          ] }, j.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "mt-3 inline-block text-sm", style: {
            color: "var(--color-primary)"
          }, children: "View all →" })
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border bg-white p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Admin tools" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/dashboard", className: "rounded-md border px-3 py-1.5", children: "Admin dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/modules", className: "rounded-md border px-3 py-1.5", children: "Modules" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/jobs", className: "rounded-md border px-3 py-1.5", children: "Jobs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/users", className: "rounded-md border px-3 py-1.5", children: "Users" })
        ] })
      ] })
    ] })
  ] });
}
function Metric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-white/20 bg-white/10 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-white/80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-2xl font-bold text-white", children: value })
  ] });
}
function QuickAction({
  to,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "lift rounded-xl border p-4 text-center font-medium", style: {
    borderColor: "var(--color-border)"
  }, children: label });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children })
  ] });
}
function appColor(s) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}
export {
  Dashboard as component
};

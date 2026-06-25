import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { R as Route$v, u as useAuth, a as useServerFn } from "./router-BajK73Jd.mjs";
import { g as getJobPublic, c as getMyApplicationForJob, a as applyToJob } from "./jobs.functions-Dys0FdxM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { t as ArrowLeft, p as Star, B as Building2, j as CircleCheck, q as MapPin, l as Briefcase, r as GraduationCap, D as DollarSign, u as CalendarDays, s as Clock } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
function statusColor(s) {
  if (s === "accepted") return "bg-emerald-100 text-emerald-700";
  if (s === "rejected") return "bg-red-100 text-red-700";
  if (s === "reviewing") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}
function JobDetails() {
  const {
    jobId
  } = Route$v.useParams();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const getJobFn = useServerFn(getJobPublic);
  const getAppFn = useServerFn(getMyApplicationForJob);
  const applyFn = useServerFn(applyToJob);
  const jobQ = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobFn({
      data: {
        id: jobId
      }
    })
  });
  const appQ = useQuery({
    queryKey: ["my-app", jobId],
    queryFn: () => getAppFn({
      data: {
        jobId
      }
    }),
    enabled: !!user
  });
  const [cover, setCover] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const apply = useMutation({
    mutationFn: () => applyFn({
      data: {
        jobId,
        coverNote: cover
      }
    }),
    onSuccess: () => {
      toast.success("Application submitted");
      setOpen(false);
      setCover("");
      qc.invalidateQueries({
        queryKey: ["my-app", jobId]
      });
      qc.invalidateQueries({
        queryKey: ["my-apps"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (jobQ.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground", children: "Loading job…" });
  const j = jobQ.data;
  if (!j) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Job not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "mt-4 inline-block underline", children: "Back to jobs" })
  ] });
  const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)) : null;
  const alreadyApplied = !!appQ.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/jobs", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Back to jobs"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold md:text-3xl", children: j.job_title }),
            j.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-featured inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3" }),
              "Hot"
            ] }),
            j.is_live && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-live", children: "Live" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 inline-flex items-center gap-1 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4" }),
            " ",
            j.company
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-end gap-2", children: alreadyApplied ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusColor(appQ.data.status)}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
            " Applied · ",
            appQ.data.status
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", className: "text-xs underline text-muted-foreground", children: "Track in dashboard →" })
        ] }) : user ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "rounded-md px-5 py-2 text-sm font-semibold text-white shadow", style: {
          background: "var(--color-primary)"
        }, children: "Apply for this job" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "rounded-md border px-5 py-2 text-sm font-semibold", children: "Sign in to apply" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground", children: [
        j.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }),
          j.location
        ] }),
        j.is_remote && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs", children: "Remote" }),
        j.job_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-4" }),
          j.job_type
        ] }),
        j.experience_level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4" }),
          j.experience_level
        ] }),
        j.salary_range && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 font-medium", style: {
          color: "var(--color-primary)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "size-4" }),
          j.salary_range
        ] }),
        deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 ${daysLeft !== null && daysLeft <= 3 ? "text-destructive font-semibold" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-4" }),
          "Deadline ",
          deadline.toLocaleDateString(),
          " ",
          daysLeft !== null && (daysLeft > 0 ? `(${daysLeft}d left)` : "(closed)")
        ] }),
        j.created_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }),
          "Posted ",
          new Date(j.created_at).toLocaleDateString()
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Job description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90", children: j.description || "The hiring team hasn't added a full description yet. Reach out to learn more about this role." })
        ] }),
        (j.requirements?.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Requirements & skills" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 flex flex-wrap gap-2", children: j.requirements.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-full border bg-white/60 px-3 py-1 text-xs", children: r }, r)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase text-muted-foreground", children: "At a glance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Company", v: j.company }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Location", v: j.location || (j.is_remote ? "Remote" : "—") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Type", v: j.job_type || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Experience", v: j.experience_level || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Category", v: j.category || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Salary", v: j.salary_range || "—" })
          ] })
        ] }),
        !alreadyApplied && user && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow", style: {
          background: "var(--color-primary)"
        }, children: "Apply for this job" }),
        alreadyApplied && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", className: "block w-full rounded-md border px-4 py-3 text-center text-sm font-semibold hover:bg-white/60", children: "Track my application" })
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-6 w-full max-w-md", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold", children: [
        "Apply to ",
        j.job_title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Add a short cover note (optional)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: cover, onChange: (e) => setCover(e.target.value), rows: 5, className: "mt-3 w-full rounded-md border px-3 py-2 text-sm", placeholder: "Why you're a great fit…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => apply.mutate(), disabled: apply.isPending, className: "rounded-md px-3 py-1.5 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: apply.isPending ? "Submitting…" : "Submit application" })
      ] })
    ] }) })
  ] });
}
function Row({
  k,
  v
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-right font-medium", children: v })
  ] });
}
export {
  JobDetails as component
};

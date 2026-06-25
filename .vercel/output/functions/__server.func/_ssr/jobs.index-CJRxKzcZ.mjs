import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn, u as useAuth, c as createSsrRpc } from "./router-B8OUd1qE.mjs";
import { l as listJobsPublic, a as applyToJob } from "./jobs.functions-ChLsVKAv.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { p as Star, G as Globe, R as Radio, E as ExternalLink, q as MapPin, l as Briefcase, r as GraduationCap, s as Clock } from "../_libs/lucide-react.mjs";
import { o as objectType, n as numberType, s as stringType } from "../_libs/zod.mjs";
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
import "./auth-middleware-BkCqN-4J.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const listRemoteJobsExternal = createServerFn({
  method: "GET"
}).inputValidator((i) => objectType({
  search: stringType().max(120).optional(),
  category: stringType().max(80).optional(),
  limit: numberType().int().min(1).max(50).optional()
}).parse(i ?? {})).handler(createSsrRpc("4cb63ed0d692bb9d7aac965617c99fbdf92832cb1010db00e07395aa7083dc49"));
const CATEGORIES = ["IT/Software", "Engineering", "Banking/Finance", "Marketing", "Sales", "Design", "Customer Service", "Healthcare", "Education", "General"];
function Jobs() {
  const fn = useServerFn(listJobsPublic);
  const remoteFn = useServerFn(listRemoteJobsExternal);
  const applyFn = useServerFn(applyToJob);
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const q = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fn(),
    staleTime: 6e4
  });
  const remoteQ = useQuery({
    queryKey: ["remotive-jobs"],
    queryFn: () => remoteFn({
      data: {
        limit: 12
      }
    }),
    staleTime: 5 * 6e4
  });
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [exp, setExp] = reactExports.useState("");
  const [type, setType] = reactExports.useState("");
  const [remote, setRemote] = reactExports.useState("all");
  const [openId, setOpenId] = reactExports.useState(null);
  const [cover, setCover] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const r = p.get("remote");
    if (r === "remote" || r === "onsite" || r === "all") setRemote(r);
    const c = p.get("category");
    if (c) setCategory(c);
    const t = p.get("type");
    if (t) setType(t);
    const s = p.get("search");
    if (s) setSearch(s);
  }, []);
  const apply = useMutation({
    mutationFn: (jobId) => applyFn({
      data: {
        jobId,
        coverNote: cover
      }
    }),
    onSuccess: () => {
      toast.success("Application submitted");
      setOpenId(null);
      setCover("");
      qc.invalidateQueries({
        queryKey: ["my-apps"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const all = q.data ?? [];
  const filtered = reactExports.useMemo(() => all.filter((j) => {
    const t = `${j.job_title} ${j.company} ${(j.requirements ?? []).join(" ")}`.toLowerCase();
    if (search && !t.includes(search.toLowerCase())) return false;
    if (category && j.category !== category) return false;
    if (location && !(j.location ?? "").toLowerCase().includes(location.toLowerCase())) return false;
    if (exp && j.experience_level !== exp) return false;
    if (type && j.job_type !== type) return false;
    if (remote === "remote" && !j.is_remote) return false;
    if (remote === "onsite" && j.is_remote) return false;
    return true;
  }), [all, search, category, location, exp, type, remote]);
  const featured = filtered.filter((j) => j.is_featured);
  const rest = filtered.filter((j) => !j.is_featured);
  const counts = {};
  for (const j of all) counts[j.category ?? "General"] = (counts[j.category ?? "General"] ?? 0) + 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Jobs marketplace" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Local Bangladesh roles + global remote engineering jobs." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 glass rounded-xl p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase text-muted-foreground", children: "Browse by category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCategory(""), className: `rounded-full px-3 py-1.5 text-xs font-medium border ${category === "" ? "bg-primary text-white" : "bg-white/60"}`, style: category === "" ? {
          background: "var(--color-primary)",
          color: "white"
        } : {}, children: [
          "All (",
          all.length,
          ")"
        ] }),
        CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCategory(c === category ? "" : c), className: `rounded-full px-3 py-1.5 text-xs font-medium border ${category === c ? "text-white" : "bg-white/60"}`, style: category === c ? {
          background: "var(--color-primary)",
          color: "white"
        } : {}, children: [
          c,
          " ",
          counts[c] ? `(${counts[c]})` : ""
        ] }, c))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 glass rounded-xl p-4 grid gap-3 md:grid-cols-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search title, company, skill", className: "md:col-span-2 rounded-md border px-3 py-2 text-sm bg-white/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: location, onChange: (e) => setLocation(e.target.value), placeholder: "Location", className: "rounded-md border px-3 py-2 text-sm bg-white/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: exp, onChange: (e) => setExp(e.target.value), className: "rounded-md border px-3 py-2 text-sm bg-white/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Any experience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Entry-level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Mid-level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Senior" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: type, onChange: (e) => setType(e.target.value), className: "rounded-md border px-3 py-2 text-sm bg-white/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Any type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Full-time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Part-time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Contract" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Internship" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: remote, onChange: (e) => setRemote(e.target.value), className: "rounded-md border px-3 py-2 text-sm bg-white/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "remote", children: "Remote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "onsite", children: "On-site" })
      ] })
    ] }),
    featured.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4 text-amber-500" }),
        " Featured / Hot jobs"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-4 md:grid-cols-2", children: featured.map((j, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 4 * 60, children: /* @__PURE__ */ jsxRuntimeExports.jsx(JobCard, { j, onApply: () => setOpenId(j.id), canApply: !!user }) }, j.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: featured.length ? "All jobs" : "Open positions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-4 md:grid-cols-2", children: [
        rest.map((j, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 4 * 60, children: /* @__PURE__ */ jsxRuntimeExports.jsx(JobCard, { j, onApply: () => setOpenId(j.id), canApply: !!user }) }, j.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No jobs match those filters." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-5", style: {
            color: "var(--color-primary)"
          } }),
          "Live remote jobs",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "size-3 animate-pulse" }),
            " Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Powered by Remotive · refreshed every 5 minutes" })
      ] }),
      remoteQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Fetching live remote jobs…" }),
      !remoteQ.isLoading && (remoteQ.data?.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Live feed is taking a break — check back soon." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: (remoteQ.data ?? []).map((j, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 6 * 40, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: j.url ?? "#", target: "_blank", rel: "noreferrer", className: "lift glass rounded-xl p-5 h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          j.company_logo ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: j.company_logo, alt: j.company, className: "size-10 rounded-md object-contain bg-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-md grid place-items-center bg-white/70 font-bold text-sm", style: {
            color: "var(--color-primary)"
          }, children: j.company?.[0] ?? "?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold leading-tight line-clamp-2", children: j.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: j.company })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4 shrink-0 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
          j.category && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: j.category }),
          j.job_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "· ",
            j.job_type
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "· 🌍 ",
            j.location
          ] })
        ] }),
        j.tags?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: j.tags.slice(0, 4).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded border bg-white/60 px-2 py-0.5 text-[11px]", children: t }, t)) }),
        j.salary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-medium", style: {
          color: "var(--color-primary)"
        }, children: j.salary })
      ] }) }, j.id)) })
    ] }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4", onClick: () => setOpenId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-6 w-full max-w-md", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Apply to this job" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Add a short cover note (optional)." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: cover, onChange: (e) => setCover(e.target.value), rows: 5, className: "mt-3 w-full rounded-md border px-3 py-2 text-sm", placeholder: "Why you're a great fit…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpenId(null), className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => apply.mutate(openId), disabled: apply.isPending, className: "rounded-md px-3 py-1.5 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: apply.isPending ? "Submitting…" : "Submit application" })
      ] })
    ] }) })
  ] });
}
function JobCard({
  j,
  onApply,
  canApply
}) {
  const deadline = j.application_deadline ? new Date(j.application_deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "lift glass rounded-xl p-5 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs/$jobId", params: {
          jobId: j.id
        }, className: "font-semibold hover:underline", children: j.job_title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: j.company })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        j.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-featured", children: "Hot" }),
        j.is_live && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-live", children: "Live" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
      j.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
        j.location
      ] }),
      j.is_remote && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-emerald-100 text-emerald-700 px-2 py-0.5", children: "Remote" }),
      j.job_type && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-3" }),
        j.job_type
      ] }),
      j.experience_level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-3" }),
        j.experience_level
      ] }),
      daysLeft !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 ${daysLeft <= 3 ? "text-destructive font-semibold" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
        daysLeft > 0 ? `${daysLeft}d left` : "Closed"
      ] })
    ] }),
    j.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm line-clamp-2", children: j.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: (j.requirements ?? []).slice(0, 6).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded border bg-white/60 px-2 py-0.5 text-xs", children: r }, r)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between gap-2", children: [
      j.salary_range && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", style: {
        color: "var(--color-primary)"
      }, children: j.salary_range }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs/$jobId", params: {
          jobId: j.id
        }, className: "rounded-md border px-3 py-1.5 text-sm font-semibold hover:bg-white/60", children: "View details" }),
        canApply ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onApply, className: "rounded-md px-3 py-1.5 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: "Apply" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/auth", className: "rounded-md px-3 py-1.5 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: "Sign in" })
      ] })
    ] })
  ] });
}
export {
  Jobs as component
};

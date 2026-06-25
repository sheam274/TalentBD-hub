import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as notFound } from "../_libs/tanstack__router-core.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as Route$u, a as useServerFn } from "./router-BajK73Jd.mjs";
import { d as getCompanyBySlug } from "./jobs.functions-Dys0FdxM.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { C as CompanyLogo } from "./CompanyLogo-jc3aSniS.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { t as ArrowLeft, B as Building2, q as MapPin, G as Globe, l as Briefcase } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
function CompanyDetail() {
  const {
    slug
  } = Route$u.useParams();
  const fn = useServerFn(getCompanyBySlug);
  const q = useQuery({
    queryKey: ["company", slug],
    queryFn: () => fn({
      data: {
        slug
      }
    })
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-5xl p-10 text-sm text-muted-foreground", children: "Loading…" });
  if (!q.data) throw notFound();
  const {
    company,
    jobs
  } = q.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/companies", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " All companies"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mt-4 glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyLogo, { name: company.name, url: company.logo_url, website: company.website, size: 96, className: "!rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: company.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
          company.industry && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4" }),
            company.industry
          ] }),
          company.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-4" }),
            company.location
          ] }),
          company.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: company.website, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 hover:underline", style: {
            color: "var(--color-primary)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-4" }),
            company.website.replace(/^https?:\/\//, "")
          ] })
        ] }),
        company.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm leading-relaxed", children: company.description })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-5", style: {
          color: "var(--color-primary)"
        } }),
        " Open roles at ",
        company.name
      ] }),
      jobs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "No live openings right now — check back soon." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 md:grid-cols-2", children: jobs.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/jobs/$jobId", params: {
        jobId: j.id
      }, className: "lift glass rounded-xl p-5 block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold hover:underline", children: j.job_title }),
          j.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-featured", children: "Hot" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          [j.location, j.job_type, j.experience_level].filter(Boolean).join(" · "),
          j.is_remote && " · Remote"
        ] }),
        j.salary_range && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-medium", style: {
          color: "var(--color-primary)"
        }, children: j.salary_range })
      ] }, j.id)) })
    ] })
  ] });
}
export {
  CompanyDetail as component
};

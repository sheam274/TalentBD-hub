import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { b as listCompaniesPublic } from "./jobs.functions-Dys0FdxM.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { C as CompanyLogo } from "./CompanyLogo-jc3aSniS.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { B as Building2, q as MapPin, G as Globe, o as ArrowRight } from "../_libs/lucide-react.mjs";
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
function Companies() {
  const fn = useServerFn(listCompaniesPublic);
  const q = useQuery({
    queryKey: ["companies"],
    queryFn: () => fn()
  });
  const [search, setSearch] = reactExports.useState("");
  const list = (q.data ?? []).filter((c) => `${c.name} ${c.industry ?? ""} ${c.location ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Companies hiring on TalentBD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Explore employers and their open roles." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by name, industry, location", className: "mt-6 w-full rounded-md border bg-white/70 backdrop-blur px-3 py-2 text-sm" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
      list.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 6 * 60, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/companies/$slug", params: {
        slug: c.slug
      }, className: "lift glass rounded-xl p-5 h-full block group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyLogo, { name: c.name, url: c.logo_url, website: c.website, size: 48 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold group-hover:underline truncate", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: [c.industry, c.location].filter(Boolean).join(" · ") || "—" })
          ] })
        ] }),
        c.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm line-clamp-3", children: c.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground", children: [
          c.industry && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-3" }),
            c.industry
          ] }),
          c.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
            c.location
          ] }),
          c.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-3" }),
            c.website.replace(/^https?:\/\//, "").split("/")[0]
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-3 inline-flex items-center gap-1 text-sm font-medium", style: {
          color: "var(--color-primary)"
        }, children: [
          "View company & jobs ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 transition-transform group-hover:translate-x-0.5" })
        ] })
      ] }) }, c.id)),
      list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No companies match." })
    ] })
  ] });
}
export {
  Companies as component
};

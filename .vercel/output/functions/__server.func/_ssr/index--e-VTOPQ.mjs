import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { l as listModulesPublic } from "./learning.functions-DVWMKT2n.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { H as CirclePlay, k as BookOpen, A as Award } from "../_libs/lucide-react.mjs";
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
import "../_libs/zod.mjs";
const disciplineMeta = {
  cse: {
    label: "Computer Science",
    thumb: "thumb-cse",
    icon: "💻",
    blurb: "Web, networking, data, mobile and more."
  },
  eee: {
    label: "Electrical & Electronic",
    thumb: "thumb-eee",
    icon: "⚡",
    blurb: "Power, VLSI, automation."
  },
  civil: {
    label: "Civil Engineering",
    thumb: "thumb-civil",
    icon: "🏗️",
    blurb: "Structural, CAD, BIM."
  }
};
function LearnIndex() {
  const fn = useServerFn(listModulesPublic);
  const q = useQuery({
    queryKey: ["modules"],
    queryFn: () => fn(),
    staleTime: 6e4
  });
  const grouped = (q.data ?? []).reduce((acc, m) => {
    (acc[m.discipline] ||= []).push(m);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold", children: [
          "Learning ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "tracks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Pick a discipline, watch the lessons, and earn a verified credential." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-4" }),
          " Video"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
          " Docs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4" }),
          " Cert"
        ] })
      ] })
    ] }),
    q.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 text-center text-muted-foreground", children: "Loading tracks…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 space-y-14", children: Object.entries(grouped).map(([disc, list]) => {
      const meta = disciplineMeta[disc] ?? {
        label: disc.toUpperCase(),
        thumb: "thumb-cse",
        icon: "📚",
        blurb: ""
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${meta.thumb} thumb-grid flex size-14 items-center justify-center rounded-xl text-2xl shadow-lg`, children: meta.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: meta.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              meta.blurb,
              " · ",
              list.length,
              " module",
              list.length === 1 ? "" : "s"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: list.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 3 * 80, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/learn/$discipline/$topic", params: {
          discipline: m.discipline,
          topic: m.section_slug
        }, className: "lift glass group rounded-xl overflow-hidden flex flex-col h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${meta.thumb} thumb-grid relative h-32`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-12 text-white/90 transition group-hover:scale-110" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute top-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur", children: [
              meta.icon,
              " ",
              disc
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold leading-tight", children: m.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground line-clamp-2", children: m.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-3 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Free · Certifiable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
                color: "var(--color-primary)"
              }, children: "Start →" })
            ] })
          ] })
        ] }) }, m.id)) })
      ] }, disc);
    }) })
  ] });
}
export {
  LearnIndex as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listMySessions } from "./interview.functions-BJ7_yH4c.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { c as Sparkles, h as MessageSquare, I as Mic, V as Video, J as ListChecks, K as Trophy } from "../_libs/lucide-react.mjs";
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
const MODES = [{
  id: "text",
  label: "Text Q&A",
  icon: MessageSquare,
  desc: "Typed answers, instant AI feedback."
}, {
  id: "voice",
  label: "Voice",
  icon: Mic,
  desc: "Speak your answers, transcribed live."
}, {
  id: "video",
  label: "Live Video",
  icon: Video,
  desc: "Recorded video answers with playback."
}, {
  id: "mcq",
  label: "MCQ / Coding",
  icon: ListChecks,
  desc: "AI-generated, auto-graded."
}];
function InterviewLanding() {
  const fn = useServerFn(listMySessions);
  const {
    data
  } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: () => fn()
  });
  const recent = (data ?? []).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { style: {
      background: "var(--color-primary)"
    }, className: "text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-14 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5" }),
        " AI Interviewer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl font-bold", children: "Give an AI-graded interview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-white/85", children: "Pick a role, choose a difficulty, and answer in text, voice, video, or MCQ. Our AI scores each answer, gives you per-question feedback, and issues a verifiable credential at 80%+." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/setup", className: "rounded-md px-5 py-2.5 font-semibold", style: {
          background: "var(--color-accent)",
          color: "var(--color-accent-foreground)"
        }, children: "Start a new interview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/history", className: "rounded-md border border-white/30 px-5 py-2.5 font-semibold hover:bg-white/10", children: "View history" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-12 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Interview modes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: MODES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/interview/setup", search: {
        mode: m.id
      }, className: "group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(m.icon, { className: "size-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: m.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: m.desc })
      ] }, m.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 pb-16 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Recent attempts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/history", className: "text-sm text-primary hover:underline", children: "View all" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border bg-white shadow-sm", children: recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No interviews yet. Start your first one above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: recent.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-4 px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate font-medium", children: [
            s.role,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "· ",
              s.discipline,
              " · ",
              s.difficulty,
              " · ",
              s.mode
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(s.started_at).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          s.status === "completed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-3" }),
            " ",
            s.score,
            "%"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700", children: "In progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/result/$sessionId", params: {
            sessionId: s.id
          }, className: "text-sm text-primary hover:underline", children: "Open" })
        ] })
      ] }, s.id)) }) })
    ] })
  ] });
}
export {
  InterviewLanding as component
};

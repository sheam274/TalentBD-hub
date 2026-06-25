import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as Route$1, a as useServerFn } from "./router-BajK73Jd.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getSession } from "./interview.functions-tzugvOsH.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { d as LoaderCircle, O as BadgeCheck, K as Trophy } from "../_libs/lucide-react.mjs";
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
function ResultPage() {
  const {
    sessionId
  } = Route$1.useParams();
  const fn = useServerFn(getSession);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["interview-result", sessionId],
    queryFn: () => fn({
      data: {
        sessionId
      }
    })
  });
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mx-auto size-6 animate-spin" }) });
  const {
    session,
    questions,
    answers
  } = data;
  const ansBy = new Map(answers.map((a) => [a.question_id, a]));
  const passed = (session.score ?? 0) >= 80;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter mx-auto max-w-4xl px-4 py-10 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
            session.discipline,
            " · ",
            session.role,
            " · ",
            session.difficulty,
            " · ",
            session.mode
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 text-3xl font-bold", children: [
            "Overall score: ",
            session.score ?? 0,
            "%"
          ] })
        ] }),
        passed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "size-4" }),
          " Credential awarded"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4" }),
          " Keep practicing"
        ] })
      ] }),
      session.overall_feedback && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: session.overall_feedback }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/setup", className: "rounded-md px-4 py-2 text-sm font-semibold", style: {
          background: "var(--color-accent)",
          color: "var(--color-accent-foreground)"
        }, children: "Try another" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/history", className: "rounded-md border px-4 py-2 text-sm font-semibold", children: "History" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "rounded-md border px-4 py-2 text-sm font-semibold", children: "Dashboard" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-6 space-y-4", children: questions.map((q, i) => {
      const a = ansBy.get(q.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold", children: [
            "Q",
            i + 1,
            ". ",
            q.prompt
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold", children: [
            a?.score ?? 0,
            "/10"
          ] })
        ] }),
        a?.answer_text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm", children: a.answer_text }),
        a?.feedback && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Feedback: " }),
          a.feedback
        ] }),
        a?.strengths && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-emerald-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Strengths: " }),
          a.strengths
        ] }),
        a?.weaknesses && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-amber-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Improve: " }),
          a.weaknesses
        ] })
      ] }, q.id);
    }) })
  ] });
}
export {
  ResultPage as component
};

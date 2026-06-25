import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listMySessions } from "./interview.functions-tzugvOsH.mjs";
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
function HistoryPage() {
  const fn = useServerFn(listMySessions);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["my-interviews"],
    queryFn: () => fn()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter mx-auto max-w-5xl px-4 py-10 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Your interviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/setup", className: "rounded-md px-4 py-2 text-sm font-semibold", style: {
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)"
      }, children: "New interview" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Loading…" }) : !data?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No interviews yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Difficulty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Score" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-medium", children: s.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 capitalize", children: s.mode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 capitalize", children: s.difficulty }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: s.status === "completed" ? `${s.score}%` : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-700", children: "In progress" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-muted-foreground", children: new Date(s.started_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/interview/result/$sessionId", params: {
          sessionId: s.id
        }, className: "text-primary hover:underline", children: "Open" }) })
      ] }, s.id)) })
    ] }) })
  ] });
}
export {
  HistoryPage as component
};

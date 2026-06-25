import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { l as listModulesPublic } from "./learning.functions-DVWMKT2n.mjs";
import { l as listMyCredentials } from "./assessments.functions-Wkj1GgOB.mjs";
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
function Assessments() {
  const mFn = useServerFn(listModulesPublic);
  const cFn = useServerFn(listMyCredentials);
  const mods = useQuery({
    queryKey: ["modules"],
    queryFn: () => mFn()
  });
  const creds = useQuery({
    queryKey: ["my-creds"],
    queryFn: () => cFn()
  });
  const earned = new Set((creds.data ?? []).map((c) => c.module_id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Assessments" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Pick a module and certify. 80% required to pass." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: (mods.data ?? []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/learn/$discipline/$topic", params: {
      discipline: m.discipline,
      topic: m.section_slug
    }, className: "lift rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: m.title }),
        earned.has(m.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-2 py-0.5 text-xs", children: "Certified" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground", children: m.discipline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: m.description })
    ] }, m.id)) })
  ] });
}
export {
  Assessments as component
};

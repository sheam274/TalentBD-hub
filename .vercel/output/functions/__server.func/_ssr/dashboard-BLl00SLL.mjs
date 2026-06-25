import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { h as adminStats } from "./admin.functions-DNQHmt7W.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
function AdminDash() {
  const fn = useServerFn(adminStats);
  const q = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fn()
  });
  const s = q.data ?? {
    users: 0,
    modules: 0,
    jobs: 0,
    credentials: 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Admin overview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-4 md:grid-cols-4", children: Object.entries(s).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: k }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-3xl font-bold", children: v })
    ] }, k)) })
  ] });
}
export {
  AdminDash as component
};

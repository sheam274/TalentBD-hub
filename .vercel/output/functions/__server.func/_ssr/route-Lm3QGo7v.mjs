import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, a as useServerFn, g as getMyProfile } from "./router-BajK73Jd.mjs";
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
function AdminLayout() {
  const {
    user
  } = useAuth();
  const fn = useServerFn(getMyProfile);
  const q = useQuery({
    queryKey: ["me"],
    queryFn: () => fn(),
    enabled: !!user
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-muted-foreground", children: "Loading…" });
  if (!q.data?.isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Admin only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "You don't have admin privileges." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "mt-4 inline-block rounded-md border px-4 py-2 text-sm", children: "Back to dashboard" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mb-6 flex flex-wrap gap-2 border-b pb-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/dashboard", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/users", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Job seekers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/employers", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Employers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/companies", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Companies" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/jobs", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Jobs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/applications", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Applications" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/interviews", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Interviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/letters", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Appointment letters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/modules", className: "rounded-md border px-3 py-1.5", activeProps: {
        style: {
          background: "var(--color-primary)",
          color: "white"
        }
      }, children: "Modules" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  AdminLayout as component
};

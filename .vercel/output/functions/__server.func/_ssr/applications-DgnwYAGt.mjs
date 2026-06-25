import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { i as adminListApplications, e as adminDeleteRow } from "./admin.functions-DNQHmt7W.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
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
function Page() {
  const fn = useServerFn(adminListApplications);
  const delFn = useServerFn(adminDeleteRow);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-apps"],
    queryFn: () => fn()
  });
  const m = useMutation({
    mutationFn: (id) => delFn({
      data: {
        table: "job_applications",
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-apps"]
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Applications" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 overflow-x-auto rounded-xl border bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Job" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Applicant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Applied" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (q.data ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          a.job?.job_title,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "· ",
            a.job?.company
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: a.applicant?.name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-2 py-0.5 text-xs", children: a.stage ?? a.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: new Date(a.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => m.mutate(a.id), className: "rounded-md border px-2 py-1 text-xs", children: "Delete" }) })
      ] }, a.id)) })
    ] }) })
  ] });
}
export {
  Page as component
};

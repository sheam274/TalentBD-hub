import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { c as employerListApplicants, f as updateApplicationStage } from "./employer.functions-81fpkVPZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
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
const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected"];
function Page() {
  const fn = useServerFn(employerListApplicants);
  const stageFn = useServerFn(updateApplicationStage);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["emp-apps"],
    queryFn: () => fn({
      data: {}
    })
  });
  const m = useMutation({
    mutationFn: (p) => stageFn({
      data: p
    }),
    onSuccess: () => {
      toast.success("Stage updated");
      qc.invalidateQueries({
        queryKey: ["emp-apps"]
      });
    }
  });
  const list = q.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Applicants" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Move applicants through the hiring pipeline." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6", children: STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold capitalize", children: stage }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-[10px]", children: list.filter((a) => (a.stage ?? a.status) === stage).length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: list.filter((a) => (a.stage ?? a.status) === stage).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border p-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/employer/applicants/$appId", params: {
          appId: a.id
        }, className: "font-semibold hover:underline", children: a.applicant?.name ?? "Candidate" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: a.job?.job_title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: a.stage ?? a.status, onChange: (e) => m.mutate({
          id: a.id,
          stage: e.target.value
        }), className: "mt-1 w-full rounded border px-1 py-0.5 text-[11px]", children: STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
      ] }, a.id)) })
    ] }, stage)) })
  ] });
}
export {
  Page as component
};

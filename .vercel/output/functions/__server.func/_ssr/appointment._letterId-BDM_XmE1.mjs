import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as Route$d, a as useServerFn } from "./router-B8OUd1qE.mjs";
import { a as getLetter, b as acceptLetter } from "./hiring.functions-BXo_Q1ek.mjs";
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
import "./server-XhNC2-Ux.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
function Page() {
  const {
    letterId
  } = Route$d.useParams();
  const fn = useServerFn(getLetter);
  const acceptFn = useServerFn(acceptLetter);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["letter", letterId],
    queryFn: () => fn({
      data: {
        id: letterId
      }
    })
  });
  const m = useMutation({
    mutationFn: () => acceptFn({
      data: {
        id: letterId
      }
    }),
    onSuccess: () => {
      toast.success("Offer accepted!");
      qc.invalidateQueries({
        queryKey: ["letter", letterId]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-10 text-center", children: "Loading…" });
  const l = q.data;
  if (!l) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-10 text-center", children: "Letter not found." });
  const canAccept = !l.accepted_at;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-8 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between print:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Appointment Letter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => window.print(), className: "rounded-md border px-3 py-1.5 text-sm", children: "Print / Save PDF" }),
        canAccept && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => m.mutate(), className: "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground", children: "Accept offer" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mt-5 rounded-xl border bg-white p-8 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: l.application?.job?.company ?? "Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Letter of Appointment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
          "Issued ",
          new Date(l.issued_at).toLocaleDateString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "To:" }),
          " ",
          l.application?.applicant?.name ?? "Candidate"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Position:" }),
          " ",
          l.position
        ] }),
        l.salary && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Compensation:" }),
          " ",
          l.salary
        ] }),
        l.start_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Start date:" }),
          " ",
          new Date(l.start_date).toLocaleDateString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-5 whitespace-pre-wrap text-sm leading-7", children: l.body }),
      l.accepted_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700", children: [
        "Accepted on ",
        new Date(l.accepted_at).toLocaleString()
      ] })
    ] })
  ] });
}
export {
  Page as component
};

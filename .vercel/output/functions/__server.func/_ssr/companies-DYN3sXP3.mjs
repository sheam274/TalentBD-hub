import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { k as adminListCompanies, m as adminUpsertCompany, n as adminDeleteCompany } from "./jobs.functions-ChLsVKAv.mjs";
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
const empty = {
  name: "",
  slug: "",
  logo_url: "",
  website: "",
  industry: "",
  location: "",
  description: ""
};
function AdminCompanies() {
  const listFn = useServerFn(adminListCompanies);
  const upFn = useServerFn(adminUpsertCompany);
  const delFn = useServerFn(adminDeleteCompany);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () => listFn()
  });
  const [form, setForm] = reactExports.useState(empty);
  const save = useMutation({
    mutationFn: () => upFn({
      data: form
    }),
    onSuccess: () => {
      toast.success("Saved");
      setForm(empty);
      qc.invalidateQueries({
        queryKey: ["admin-companies"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: (id) => delFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-companies"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_360px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: (q.data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "/",
          c.slug,
          " · ",
          c.industry ?? "—",
          " · ",
          c.location ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(c), className: "rounded-md border px-3 py-1.5 text-xs", children: "Edit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(c.id), className: "rounded-md border px-3 py-1.5 text-xs text-destructive", children: "Delete" })
      ] })
    ] }, c.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "glass rounded-xl p-4 h-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: form.id ? "Edit company" : "New company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
        [["name", "Name"], ["slug", "Slug (lowercase-dashes)"], ["industry", "Industry"], ["location", "Location"], ["logo_url", "Logo URL"], ["website", "Website URL"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: label, value: form[k] ?? "", onChange: (e) => setForm({
          ...form,
          [k]: e.target.value
        }), className: "w-full rounded-md border px-3 py-1.5" }, k)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Description", value: form.description ?? "", onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }), className: "w-full rounded-md border px-3 py-1.5", rows: 3 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save.mutate(), className: "rounded-md px-3 py-1.5 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: "Save" }),
        form.id && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(empty), className: "rounded-md border px-3 py-1.5 text-sm", children: "New" })
      ] })
    ] })
  ] });
}
export {
  AdminCompanies as component
};

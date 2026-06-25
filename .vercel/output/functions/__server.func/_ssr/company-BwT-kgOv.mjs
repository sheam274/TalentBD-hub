import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { g as getMyCompany, u as updateMyCompany, d as createCompanyForMe } from "./employer.functions-DBgtNhCp.mjs";
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
  const getFn = useServerFn(getMyCompany);
  const updFn = useServerFn(updateMyCompany);
  const createFn = useServerFn(createCompanyForMe);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["my-company"],
    queryFn: () => getFn()
  });
  const [form, setForm] = reactExports.useState({});
  const [newCo, setNewCo] = reactExports.useState({
    name: "",
    website: ""
  });
  reactExports.useEffect(() => {
    if (q.data) {
      const c = q.data.company ?? {};
      setForm({
        name: c.name ?? "",
        website: c.website ?? "",
        logo_url: c.logo_url ?? "",
        industry: c.industry ?? "",
        location: c.location ?? "",
        description: c.description ?? ""
      });
    }
  }, [q.data]);
  const update = useMutation({
    mutationFn: () => updFn({
      data: form
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["my-company"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const create = useMutation({
    mutationFn: () => createFn({
      data: newCo
    }),
    onSuccess: () => {
      toast.success("Company created");
      qc.invalidateQueries({
        queryKey: ["my-company"]
      });
      qc.invalidateQueries({
        queryKey: ["me"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading…" });
  if (!q.data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Create your company" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newCo.name, onChange: (e) => setNewCo({
          ...newCo,
          name: e.target.value
        }), placeholder: "Company name", className: "w-full rounded-md border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newCo.website, onChange: (e) => setNewCo({
          ...newCo,
          website: e.target.value
        }), placeholder: "https://example.com", className: "w-full rounded-md border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => create.mutate(), disabled: !newCo.name, className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Create" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl rounded-xl border bg-white p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Company profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-1 gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name ?? "", onChange: (e) => setForm({
        ...form,
        name: e.target.value
      }), className: "w-full rounded-md border px-3 py-2 text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.website ?? "", onChange: (e) => setForm({
        ...form,
        website: e.target.value
      }), className: "w-full rounded-md border px-3 py-2 text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Logo URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.logo_url ?? "", onChange: (e) => setForm({
        ...form,
        logo_url: e.target.value
      }), className: "w-full rounded-md border px-3 py-2 text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Industry", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.industry ?? "", onChange: (e) => setForm({
        ...form,
        industry: e.target.value
      }), className: "w-full rounded-md border px-3 py-2 text-sm" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.location ?? "", onChange: (e) => setForm({
        ...form,
        location: e.target.value
      }), className: "w-full rounded-md border px-3 py-2 text-sm" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "About the company", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description ?? "", onChange: (e) => setForm({
      ...form,
      description: e.target.value
    }), rows: 5, className: "w-full rounded-md border px-3 py-2 text-sm" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => update.mutate(), className: "mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Save changes" })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    children
  ] });
}
export {
  Page as component
};

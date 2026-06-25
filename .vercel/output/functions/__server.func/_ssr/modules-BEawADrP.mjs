import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-B8OUd1qE.mjs";
import { l as listModulesPublic, a as adminUpsertModule, b as adminDeleteModule } from "./learning.functions-DVWMKT2n.mjs";
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
function AdminModules() {
  const listFn = useServerFn(listModulesPublic);
  const upFn = useServerFn(adminUpsertModule);
  const delFn = useServerFn(adminDeleteModule);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["modules"],
    queryFn: () => listFn()
  });
  const [form, setForm] = reactExports.useState({
    id: "",
    discipline: "cse",
    section_slug: "",
    title: "",
    description: "",
    video_url: "",
    documentation_body: ""
  });
  const save = useMutation({
    mutationFn: () => upFn({
      data: {
        ...form,
        id: form.id || void 0
      }
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["modules"]
      });
      setForm({
        id: "",
        discipline: "cse",
        section_slug: "",
        title: "",
        description: "",
        video_url: "",
        documentation_body: ""
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
        queryKey: ["modules"]
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Modules" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold", children: [
          form.id ? "Edit" : "Add",
          " module"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.discipline, onChange: (e) => setForm({
            ...form,
            discipline: e.target.value
          }), className: "w-full rounded-md border px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cse", children: "CSE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "eee", children: "EEE" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "civil", children: "Civil" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "section-slug", value: form.section_slug, onChange: (e) => setForm({
            ...form,
            section_slug: e.target.value
          }), className: "w-full rounded-md border px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Title", value: form.title, onChange: (e) => setForm({
            ...form,
            title: e.target.value
          }), className: "w-full rounded-md border px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Description", value: form.description, onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }), className: "w-full rounded-md border px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "YouTube embed URL", value: form.video_url, onChange: (e) => setForm({
            ...form,
            video_url: e.target.value
          }), className: "w-full rounded-md border px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Markdown documentation", rows: 6, value: form.documentation_body, onChange: (e) => setForm({
            ...form,
            documentation_body: e.target.value
          }), className: "w-full rounded-md border px-3 py-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save.mutate(), disabled: save.isPending, className: "rounded-md px-4 py-2 font-semibold", style: {
            background: "var(--color-primary)",
            color: "var(--color-primary-foreground)"
          }, children: save.isPending ? "…" : "Save" }),
          form.id && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
            id: "",
            discipline: "cse",
            section_slug: "",
            title: "",
            description: "",
            video_url: "",
            documentation_body: ""
          }), className: "ml-2 rounded-md border px-4 py-2", children: "Cancel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Existing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 divide-y text-sm", children: (q.data ?? []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: m.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              m.discipline,
              " / ",
              m.section_slug
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
              id: m.id,
              discipline: m.discipline,
              section_slug: m.section_slug,
              title: m.title,
              description: m.description ?? "",
              video_url: "",
              documentation_body: ""
            }), className: "rounded-md border px-2 py-1 text-xs", children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(m.id), className: "rounded-md px-2 py-1 text-xs text-white", style: {
              background: "var(--color-destructive)"
            }, children: "Del" })
          ] })
        ] }, m.id)) })
      ] })
    ] })
  ] });
}
export {
  AdminModules as component
};

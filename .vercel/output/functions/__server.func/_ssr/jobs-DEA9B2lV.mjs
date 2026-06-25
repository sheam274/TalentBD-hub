import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { e as employerListJobs, a as employerUpsertJob, b as employerDeleteJob } from "./employer.functions-81fpkVPZ.mjs";
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
const empty = {
  id: void 0,
  job_title: "",
  description: "",
  is_remote: false,
  is_live: true,
  salary_range: "",
  requirements: [],
  discipline: "",
  category: "",
  location: "",
  experience_level: "",
  job_type: "Full-time",
  application_deadline: ""
};
function Page() {
  const listFn = useServerFn(employerListJobs);
  const upFn = useServerFn(employerUpsertJob);
  const delFn = useServerFn(employerDeleteJob);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["emp-jobs"],
    queryFn: () => listFn()
  });
  const [form, setForm] = reactExports.useState(null);
  const save = useMutation({
    mutationFn: () => {
      const reqs = typeof form.requirements === "string" ? form.requirements.split(",").map((s) => s.trim()).filter(Boolean) : form.requirements;
      return upFn({
        data: {
          ...form,
          requirements: reqs
        }
      });
    },
    onSuccess: () => {
      toast.success("Saved");
      setForm(null);
      qc.invalidateQueries({
        queryKey: ["emp-jobs"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: (id) => delFn({
      data: {
        id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["emp-jobs"]
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "My jobs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
        ...empty
      }), className: "rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground", children: "+ New job" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2", children: [
      (q.data ?? []).map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: j.job_title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            j.location ?? (j.is_remote ? "Remote" : "—"),
            " · ",
            j.is_live ? "Live" : "Draft"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
            ...j,
            requirements: (j.requirements ?? []).join(", ")
          }), className: "rounded-md border px-3 py-1.5 text-xs", children: "Edit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove.mutate(j.id), className: "rounded-md border px-3 py-1.5 text-xs", children: "Delete" })
        ] })
      ] }, j.id)),
      (q.data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No jobs posted yet." })
    ] }),
    form && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: () => setForm(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: form.id ? "Edit job" : "New job" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-1 gap-2 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.job_title ?? "", onChange: (e) => setForm({
          ...form,
          job_title: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Location", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.location ?? "", onChange: (e) => setForm({
          ...form,
          location: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Discipline", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.discipline ?? "", onChange: (e) => setForm({
          ...form,
          discipline: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.category ?? "", onChange: (e) => setForm({
          ...form,
          category: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Experience", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.experience_level ?? "", onChange: (e) => setForm({
          ...form,
          experience_level: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Job type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.job_type ?? "", onChange: (e) => setForm({
          ...form,
          job_type: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Salary range", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.salary_range ?? "", onChange: (e) => setForm({
          ...form,
          salary_range: e.target.value
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Deadline", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", value: form.application_deadline ?? "", onChange: (e) => setForm({
          ...form,
          application_deadline: e.target.value
        }), className: "inp" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Requirements (comma-separated)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.requirements ?? "", onChange: (e) => setForm({
        ...form,
        requirements: e.target.value
      }), className: "inp" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(In, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 6, value: form.description ?? "", onChange: (e) => setForm({
        ...form,
        description: e.target.value
      }), className: "inp" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!form.is_remote, onChange: (e) => setForm({
            ...form,
            is_remote: e.target.checked
          }) }),
          " Remote"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: !!form.is_live, onChange: (e) => setForm({
            ...form,
            is_live: e.target.checked
          }) }),
          " Live"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save.mutate(), disabled: !form.job_title, className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "rounded-md border px-4 py-2 text-sm", children: "Cancel" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp{width:100%;border:1px solid hsl(var(--border));border-radius:.375rem;padding:.5rem .75rem;font-size:.875rem}` })
  ] });
}
function In({
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

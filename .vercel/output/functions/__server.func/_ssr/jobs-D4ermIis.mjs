import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { f as adminListJobs, h as adminUpsertJob, i as adminToggleJobLive, j as adminDeleteJob } from "./jobs.functions-Dys0FdxM.mjs";
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
function AdminJobs() {
  const listFn = useServerFn(adminListJobs);
  const upFn = useServerFn(adminUpsertJob);
  const toggleFn = useServerFn(adminToggleJobLive);
  const delFn = useServerFn(adminDeleteJob);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => listFn()
  });
  const [f, setF] = reactExports.useState({
    id: "",
    job_title: "",
    company: "",
    description: "",
    salary_range: "",
    discipline: "cse",
    is_remote: false,
    is_live: true,
    requirements: ""
  });
  const save = useMutation({
    mutationFn: () => upFn({
      data: {
        id: f.id || void 0,
        job_title: f.job_title,
        company: f.company,
        description: f.description,
        salary_range: f.salary_range,
        discipline: f.discipline,
        is_remote: f.is_remote,
        is_live: f.is_live,
        requirements: f.requirements.split(",").map((s) => s.trim()).filter(Boolean)
      }
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["admin-jobs"]
      });
      qc.invalidateQueries({
        queryKey: ["jobs"]
      });
      setF({
        id: "",
        job_title: "",
        company: "",
        description: "",
        salary_range: "",
        discipline: "cse",
        is_remote: false,
        is_live: true,
        requirements: ""
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const toggle = useMutation({
    mutationFn: (j) => toggleFn({
      data: {
        id: j.id,
        is_live: !j.is_live
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["admin-jobs"]
    })
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
        queryKey: ["admin-jobs"]
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Jobs" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5 space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold", children: [
          f.id ? "Edit" : "Add",
          " job"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Job title", value: f.job_title, onChange: (e) => setF({
          ...f,
          job_title: e.target.value
        }), className: "w-full rounded-md border px-3 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Company", value: f.company, onChange: (e) => setF({
          ...f,
          company: e.target.value
        }), className: "w-full rounded-md border px-3 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Description", value: f.description, onChange: (e) => setF({
          ...f,
          description: e.target.value
        }), className: "w-full rounded-md border px-3 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Salary range", value: f.salary_range, onChange: (e) => setF({
          ...f,
          salary_range: e.target.value
        }), className: "w-full rounded-md border px-3 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Requirements (comma sep)", value: f.requirements, onChange: (e) => setF({
          ...f,
          requirements: e.target.value
        }), className: "w-full rounded-md border px-3 py-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: f.discipline, onChange: (e) => setF({
          ...f,
          discipline: e.target.value
        }), className: "w-full rounded-md border px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cse", children: "CSE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "eee", children: "EEE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "civil", children: "Civil" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_remote, onChange: (e) => setF({
            ...f,
            is_remote: e.target.checked
          }) }),
          " Remote"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_live, onChange: (e) => setF({
            ...f,
            is_live: e.target.checked
          }) }),
          " Live"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => save.mutate(), className: "rounded-md px-4 py-2 font-semibold", style: {
          background: "var(--color-primary)",
          color: "var(--color-primary-foreground)"
        }, children: "Save" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "All jobs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 divide-y text-sm", children: (q.data ?? []).map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
              j.job_title,
              " ",
              j.is_live && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-live ml-1", children: "Live" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              j.company,
              " · ",
              j.is_remote ? "Remote" : "On-site"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF({
              id: j.id,
              job_title: j.job_title ?? "",
              company: j.company ?? "",
              description: j.description ?? "",
              salary_range: j.salary_range ?? "",
              discipline: j.discipline ?? "cse",
              is_remote: !!j.is_remote,
              is_live: !!j.is_live,
              requirements: (j.requirements ?? []).join(", ")
            }), className: "rounded-md border px-2 py-1 text-xs", children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle.mutate(j), className: "rounded-md border px-2 py-1 text-xs", children: j.is_live ? "Unpublish" : "Publish" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(j.id), className: "rounded-md px-2 py-1 text-xs text-white", style: {
              background: "var(--color-destructive)"
            }, children: "Del" })
          ] })
        ] }, j.id)) })
      ] })
    ] })
  ] });
}
export {
  AdminJobs as component
};

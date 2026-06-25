import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn } from "./router-BajK73Jd.mjs";
import { a as adminListUsers, b as adminSetRole, c as adminAdjustCredential } from "./admin.functions-DNQHmt7W.mjs";
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
function AdminUsers() {
  const listFn = useServerFn(adminListUsers);
  const roleFn = useServerFn(adminSetRole);
  const credFn = useServerFn(adminAdjustCredential);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listFn()
  });
  const [credForm, setCredForm] = reactExports.useState({
    userId: "",
    name: "",
    score: "100"
  });
  const setRole = useMutation({
    mutationFn: (v) => roleFn({
      data: {
        userId: v.userId,
        role: "admin",
        grant: v.grant
      }
    }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({
        queryKey: ["admin-users"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const addCred = useMutation({
    mutationFn: () => credFn({
      data: {
        userId: credForm.userId,
        credentialName: credForm.name,
        score: Number(credForm.score)
      }
    }),
    onSuccess: () => {
      toast.success("Credential added");
      qc.invalidateQueries({
        queryKey: ["admin-users"]
      });
      setCredForm({
        userId: "",
        name: "",
        score: "100"
      });
    }
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Loading…" });
  const data = q.data;
  const isAdmin = (uid) => data?.roles.some((r) => r.user_id === uid && r.role === "admin");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Users" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 overflow-x-auto rounded-xl border bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Discipline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Credentials" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data?.profiles.map((p) => {
        const userCreds = data.credentials.filter((c) => c.user_id === p.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: p.name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: p.discipline ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: userCreds.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: isAdmin(p.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-muted px-2 py-0.5 text-xs", children: "Admin" }) : "Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRole.mutate({
              userId: p.id,
              grant: !isAdmin(p.id)
            }), className: "rounded-md border px-2 py-1 text-xs", children: isAdmin(p.id) ? "Revoke admin" : "Grant admin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCredForm({
              userId: p.id,
              name: "",
              score: "100"
            }), className: "ml-2 rounded-md border px-2 py-1 text-xs", children: "Add credential" })
          ] })
        ] }, p.id);
      }) })
    ] }) }),
    credForm.userId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 max-w-md rounded-xl border bg-white p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Add credential" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Credential name", value: credForm.name, onChange: (e) => setCredForm({
        ...credForm,
        name: e.target.value
      }), className: "mt-2 w-full rounded-md border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: "0", max: "100", value: credForm.score, onChange: (e) => setCredForm({
        ...credForm,
        score: e.target.value
      }), className: "mt-2 w-full rounded-md border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addCred.mutate(), disabled: !credForm.name, className: "rounded-md px-3 py-1.5 text-sm font-semibold", style: {
          background: "var(--color-primary)",
          color: "var(--color-primary-foreground)"
        }, children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCredForm({
          userId: "",
          name: "",
          score: "100"
        }), className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" })
      ] })
    ] })
  ] });
}
export {
  AdminUsers as component
};

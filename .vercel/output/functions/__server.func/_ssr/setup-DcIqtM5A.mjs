import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { e as Route$j, a as useServerFn } from "./router-B8OUd1qE.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as startInterview } from "./interview.functions-BJ7_yH4c.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { d as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "./server-XhNC2-Ux.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BkCqN-4J.mjs";
import "../_libs/zod.mjs";
const DISCIPLINES = ["CSE", "EEE", "Civil", "Mechanical", "Business", "Other"];
const ROLES = ["Software Engineer", "Frontend Engineer", "Backend Engineer", "Data Analyst", "ML Engineer", "DevOps Engineer", "Electrical Engineer", "Civil Engineer", "Product Manager"];
function SetupPage() {
  const {
    mode: initialMode
  } = Route$j.useSearch();
  const nav = useNavigate();
  const startFn = useServerFn(startInterview);
  const [discipline, setDiscipline] = reactExports.useState("CSE");
  const [role, setRole] = reactExports.useState("Software Engineer");
  const [difficulty, setDifficulty] = reactExports.useState("medium");
  const [mode, setMode] = reactExports.useState(initialMode ?? "text");
  const [count, setCount] = reactExports.useState(5);
  const [err, setErr] = reactExports.useState(null);
  const m = useMutation({
    mutationFn: () => startFn({
      data: {
        discipline,
        role,
        difficulty,
        mode,
        count
      }
    }),
    onSuccess: ({
      sessionId
    }) => nav({
      to: "/interview/session/$sessionId",
      params: {
        sessionId
      }
    }),
    onError: (e) => setErr(e?.message ?? "Failed to start")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter mx-auto max-w-3xl px-4 py-10 md:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Set up your interview" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "AI will generate questions tailored to your selection." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Discipline", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "w-full rounded-md border px-3 py-2", value: discipline, onChange: (e) => setDiscipline(e.target.value), children: DISCIPLINES.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: d }, d)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Role", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { list: "roles", className: "w-full rounded-md border px-3 py-2", value: role, onChange: (e) => setRole(e.target.value), placeholder: "e.g. Software Engineer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "roles", children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r }, r)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Difficulty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["easy", "medium", "hard"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setDifficulty(d), className: `rounded-md border px-4 py-2 text-sm capitalize ${difficulty === d ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`, children: d }, d)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mode", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-4", children: [{
        id: "text",
        label: "Text Q&A"
      }, {
        id: "voice",
        label: "Voice"
      }, {
        id: "video",
        label: "Live Video"
      }, {
        id: "mcq",
        label: "MCQ"
      }].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode(o.id), className: `rounded-md border px-3 py-2 text-sm ${mode === o.id ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`, children: o.label }, o.id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: `Number of questions: ${count}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 3, max: 15, value: count, onChange: (e) => setCount(parseInt(e.target.value)), className: "w-full" }) }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setErr(null);
        m.mutate();
      }, disabled: m.isPending, className: "inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-semibold disabled:opacity-60", style: {
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)"
      }, children: [
        m.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
        m.isPending ? "Generating questions…" : "Start interview"
      ] })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1 block text-sm font-semibold", children: label }),
    children
  ] });
}
export {
  SetupPage as component
};

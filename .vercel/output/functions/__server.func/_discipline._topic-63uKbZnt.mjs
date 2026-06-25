import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQuery, b as useMutation } from "./_libs/tanstack__react-query.mjs";
import { h as Route$3, a as useServerFn } from "./_ssr/router-B8OUd1qE.mjs";
import { g as getModulePublic } from "./_ssr/learning.functions-DVWMKT2n.mjs";
import { s as submitQuiz } from "./_ssr/assessments.functions-Wkj1GgOB.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/client-Bnm4-7qk.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/server-XhNC2-Ux.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_ssr/auth-middleware-BkCqN-4J.mjs";
import "./_libs/lucide-react.mjs";
import "./_libs/zod.mjs";
function Topic() {
  const {
    discipline,
    topic
  } = Route$3.useParams();
  const fn = useServerFn(getModulePublic);
  const subFn = useServerFn(submitQuiz);
  const q = useQuery({
    queryKey: ["module", discipline, topic],
    queryFn: () => fn({
      data: {
        discipline,
        slug: topic
      }
    })
  });
  const [docOpen, setDocOpen] = reactExports.useState(false);
  const [answers, setAnswers] = reactExports.useState({});
  const [result, setResult] = reactExports.useState(null);
  const submit = useMutation({
    mutationFn: (vars) => subFn({
      data: {
        moduleId: vars.moduleId,
        answers
      }
    }),
    onSuccess: (r) => {
      setResult({
        score: r.score,
        passed: r.passed
      });
      r.passed ? toast.success(`Passed! Credential saved (${r.score}%)`) : toast.error(`Score ${r.score}%. Need 80% to certify.`);
    },
    onError: (e) => toast.error(e.message)
  });
  if (q.isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-muted-foreground", children: "Loading…" });
  if (!q.data) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 text-center", children: [
    "Not found. ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/learn", children: "Back" })
  ] });
  const {
    module: m,
    quizzes
  } = q.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/learn", className: "text-sm", style: {
      color: "var(--color-primary)"
    }, children: "← All tracks" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-3xl font-bold", children: m.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: m.description }),
    m.video_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: m.video_url, title: m.title, className: "h-full w-full", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setDocOpen((v) => !v), className: "flex w-full items-center justify-between p-4 text-left font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📖 Documentation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: docOpen ? "Hide" : "Show" })
      ] }),
      docOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap border-t p-4 text-sm leading-relaxed", children: m.documentation_body })
    ] }),
    Array.isArray(m.resources) && m.resources.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border bg-white p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold flex items-center gap-2", children: [
        "📚 Recommended resources ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "(W3Schools, MDN, official docs)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: m.resources.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: r.url, target: "_blank", rel: "noreferrer", className: "lift flex items-center gap-3 rounded-lg border bg-white/70 p-3 text-sm hover:bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex size-9 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold", style: {
          background: r.type === "pdf" ? "oklch(0.55 0.2 25)" : "var(--color-primary)"
        }, children: r.type === "pdf" ? "PDF" : "DOC" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.label })
      ] }) }, i)) })
    ] }),
    quizzes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border bg-white p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Assessment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Score 80% or higher to earn a credential." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-5", children: quizzes.map((qz, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
          idx + 1,
          ". ",
          qz.question
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid gap-2", children: qz.choices.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: qz.id, value: c, checked: answers[qz.id] === c, onChange: () => setAnswers({
            ...answers,
            [qz.id]: c
          }) }),
          c
        ] }, c)) })
      ] }, qz.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submit.isPending || Object.keys(answers).length < quizzes.length, onClick: () => submit.mutate({
        moduleId: m.id
      }), className: "mt-5 rounded-md px-5 py-2 font-semibold disabled:opacity-50", style: {
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)"
      }, children: submit.isPending ? "Scoring…" : "Submit answers" }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md border p-3 text-sm", style: {
        background: result.passed ? "color-mix(in oklab, var(--color-accent) 15%, white)" : void 0
      }, children: [
        "You scored ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
          result.score,
          "%"
        ] }),
        " — ",
        result.passed ? "credential earned." : "try again to certify."
      ] })
    ] })
  ] });
}
export {
  Topic as component
};

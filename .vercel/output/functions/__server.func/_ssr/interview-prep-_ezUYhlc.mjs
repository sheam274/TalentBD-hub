import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { h as MessageSquare, i as CodeXml, B as Building2, j as CircleCheck } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const TABS = [{
  id: "behavioral",
  label: "Behavioral",
  icon: MessageSquare,
  qs: ["Tell me about a time you failed and what you learned.", "Describe a conflict with a teammate and how you resolved it.", "Walk me through your most impactful project.", "How do you prioritize when everything is urgent?", "Why TalentBD / why this company?"]
}, {
  id: "technical",
  label: "Technical (Eng)",
  icon: CodeXml,
  qs: ["Reverse a linked list in O(n) time and O(1) extra space.", "Explain how indexes work in a relational database.", "What happens when you type a URL into a browser and hit enter?", "Design a URL shortener (rate limits, key generation, storage).", "Difference between TCP and UDP, and when to use each."]
}, {
  id: "system",
  label: "System Design",
  icon: Building2,
  qs: ["Design a job board like bdjobs.com.", "Design a CV/ATS parser at scale.", "How would you build a chat assistant for 1M users?", "Design a salary insights dashboard with real-time updates.", "Trade-offs between SQL and NoSQL for a learning platform."]
}, {
  id: "checklist",
  label: "Day-of checklist",
  icon: CircleCheck,
  qs: ["Researched 3 facts about the company and the interviewer.", "Tested camera, mic, and internet on the actual link.", "Printed CV + portfolio links open in a tab.", "Prepared 3 STAR stories covering ownership, conflict, failure.", "Have 2 thoughtful questions ready for them."]
}];
function InterviewPrep() {
  const [tab, setTab] = reactExports.useState(TABS[0].id);
  const active = TABS.find((t) => t.id === tab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollReveal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold", children: [
        "Interview ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "prep" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Bite-sized prompts and checklists, organized for behavioral, technical, and system-design rounds." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.id), className: `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "text-white shadow-md" : "bg-white/60 hover:bg-white"}`, style: tab === t.id ? {
      background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
      borderColor: "transparent"
    } : {}, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
      t.label
    ] }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 glass rounded-xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: active.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: active.qs.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 rounded-lg bg-white/50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white", style: {
          background: "var(--color-primary)"
        }, children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: q })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cv-builder", className: "rounded-md px-4 py-2 text-sm font-semibold text-white", style: {
          background: "var(--color-primary)"
        }, children: "Polish your CV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "rounded-md border bg-white/60 px-4 py-2 text-sm font-semibold", children: "Apply to jobs" })
      ] })
    ] }) })
  ] });
}
export {
  InterviewPrep as component
};

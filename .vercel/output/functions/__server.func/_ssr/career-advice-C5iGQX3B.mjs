import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { k as BookOpen, l as Briefcase, A as Award, m as Target, n as Mail, U as Users } from "../_libs/lucide-react.mjs";
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
const ARTICLES = [{
  icon: BookOpen,
  title: "How to write a CV that beats ATS bots",
  body: "Pick the right keywords, structure your experience, and use measurable bullets. Most Bangladeshi CVs fail the ATS — here's how to fix yours.",
  to: "/cv-builder",
  cta: "Open the CV builder"
}, {
  icon: Briefcase,
  title: "From local job to global remote",
  body: "A step-by-step playbook to land your first international remote role from Dhaka or Chittagong — including timezone strategy and Stripe/Wise payouts.",
  to: "/jobs?remote=remote",
  cta: "See remote jobs"
}, {
  icon: Award,
  title: "Why certifications matter in BD",
  body: "Verified credentials shave 30%+ off your job search. Pick the right track, pass the assessment, and signal credibility to employers.",
  to: "/learn",
  cta: "Browse learning tracks"
}, {
  icon: Target,
  title: "Salary negotiation in Bangladesh",
  body: "Use market data to negotiate offers — without burning bridges. Scripts, ranges, and what to do when they say 'this is our final offer'.",
  to: "/salaries",
  cta: "View salary insights"
}, {
  icon: Mail,
  title: "Cold-emailing recruiters that works",
  body: "A four-line template that gets 30%+ reply rates from hiring managers at BD startups and global remote teams.",
  to: "/career-advice",
  cta: "Read template"
}, {
  icon: Users,
  title: "Networking on LinkedIn from Bangladesh",
  body: "What to post, who to follow, and how to ask for referrals without sounding desperate.",
  to: "/career-advice",
  cta: "Read guide"
}];
function CareerAdvice() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollReveal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold", children: [
        "Career ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "advice" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Curated playbooks built for engineers and professionals in Bangladesh — from your first CV to landing a global remote role." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: ARTICLES.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 3 * 80, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "lift glass rounded-xl p-6 h-full flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-11 items-center justify-center rounded-xl text-white shadow-lg", style: {
        background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(a.icon, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-lg font-bold leading-tight", children: a.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground flex-1", children: a.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: a.to, className: "mt-4 inline-flex items-center text-sm font-semibold", style: {
        color: "var(--color-primary)"
      }, children: [
        a.cta,
        " →"
      ] })
    ] }) }, a.title)) })
  ] });
}
export {
  CareerAdvice as component
};

import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { c as Sparkles, o as ArrowRight } from "../_libs/lucide-react.mjs";
const CATS = [{
  name: "IT/Software",
  icon: "💻",
  category: "IT/Software"
}, {
  name: "Engineering",
  icon: "⚙️",
  category: "Engineering"
}, {
  name: "Banking/Finance",
  icon: "🏦",
  category: "Banking/Finance"
}, {
  name: "Marketing",
  icon: "📣",
  category: "Marketing"
}, {
  name: "Design",
  icon: "🎨",
  category: "Design"
}, {
  name: "Healthcare",
  icon: "🩺",
  category: "Healthcare"
}, {
  name: "Education",
  icon: "🎓",
  category: "Education"
}, {
  name: "Sales",
  icon: "💼",
  category: "Sales"
}];
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden min-h-[640px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CseHeroScene, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5", style: {
            color: "var(--color-primary)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Premium · Bangladesh's #1 learn-and-earn" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl", children: [
          "Build skills.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Earn credentials.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Land the job." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-xl text-base text-muted-foreground md:text-lg", children: "TalentBD is Bangladesh's premium learn-and-earn platform — courses, verified certifications, a dual-style CV builder, an ATS parser, and a local + global jobs marketplace." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/auth", className: "shimmer inline-flex items-center gap-2 rounded-md px-5 py-3 font-semibold text-white shadow-lg", style: {
            background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))"
          }, children: [
            "Get started free ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/jobs", className: "rounded-md border bg-white/70 px-5 py-3 font-semibold backdrop-blur hover:bg-white", children: "Browse jobs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-9 grid max-w-md grid-cols-3 gap-3", children: [["12+", "Courses"], ["3", "Disciplines"], ["100%", "Free start"]].map(([n, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-extrabold text-gradient", children: n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: l })
        ] }, l)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute right-4 bottom-6 z-20 hidden md:block w-[280px] lg:w-[320px] xl:w-[360px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative macbook-tilt", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-10 rounded-[40px] opacity-40 blur-3xl", style: {
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacbookHero, {})
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crossover grid gap-4 rounded-2xl glass p-6 md:grid-cols-3", children: [{
      title: "Learn",
      body: "Structured tracks across web dev, networking, VLSI, power systems, BIM and more.",
      href: "/learn"
    }, {
      title: "Certify",
      body: "Pass timed quizzes to write a verified credential straight to your profile.",
      href: "/assessments"
    }, {
      title: "Get hired",
      body: "Apply to vetted local and global remote engineering roles.",
      href: "/jobs"
    }].map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i * 80, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.href, className: "lift rounded-xl bg-white/70 backdrop-blur p-5 h-full block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gradient", children: c.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: c.body })
    ] }) }, c.title)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-20 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollReveal, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Popular job categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Like bdjobs — but with built-in learning to get you hired faster." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4", children: CATS.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i % 4 * 60, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/jobs?category=${encodeURIComponent(c.category)}`, className: "lift glass rounded-xl p-5 block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: c.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-semibold", children: c.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "View jobs →" })
      ] }) }, c.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 pb-20 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold", children: "Disciplines we cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: [{
        d: "Computer Science",
        disc: "cse",
        thumb: "thumb-cse",
        items: [{
          label: "Web Development",
          slug: "web-development"
        }, {
          label: "Networking",
          slug: "networking"
        }, {
          label: "Data Science",
          slug: "data-science"
        }, {
          label: "Mobile Apps",
          slug: "mobile-apps"
        }, {
          label: "3D Animation",
          slug: "3d-animation"
        }, {
          label: "Digital Marketing",
          slug: "digital-marketing"
        }]
      }, {
        d: "Electrical & Electronic",
        disc: "eee",
        thumb: "thumb-eee",
        items: [{
          label: "Power Systems",
          slug: "power-systems"
        }, {
          label: "VLSI",
          slug: "vlsi"
        }, {
          label: "Industrial Automation",
          slug: "industrial-automation"
        }]
      }, {
        d: "Civil Engineering",
        disc: "civil",
        thumb: "thumb-civil",
        items: [{
          label: "Structural",
          slug: "structural"
        }, {
          label: "CAD & BIM",
          slug: "cad-bim"
        }, {
          label: "Project Management",
          slug: "project-management"
        }]
      }].map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { delay: i * 100, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lift glass rounded-xl overflow-hidden h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/learn#${g.disc}`, className: `${g.thumb} thumb-grid h-28 relative block group`, "aria-label": `Open ${g.d} tracks`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-end justify-between p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-white", style: {
              textShadow: "0 2px 8px rgba(0,0,0,0.55)"
            }, children: g.d }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/90 text-xs font-semibold opacity-0 group-hover:opacity-100 transition", children: "Explore →" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "p-5 space-y-1 text-sm text-foreground/80 flex-1", children: g.items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `/learn/${g.disc}/${it.slug}`, className: "block rounded-md px-2 py-1 -mx-2 hover:bg-primary/10 hover:text-primary transition", children: [
          "• ",
          it.label
        ] }) }, it.slug)) })
      ] }) }, g.d)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 pb-20 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-dark rounded-2xl p-10 text-center", style: {
      background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-white", children: "Ready to grow your career?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/85", children: "Sign up free and start learning today." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/auth", className: "mt-5 inline-block rounded-md px-6 py-3 font-semibold shimmer", style: {
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)"
      }, children: "Create free account" })
    ] }) }) })
  ] });
}
function CseHeroScene() {
  const chips = [{
    t: "const job = await apply()",
    cls: "",
    x: "4%",
    y: "12%",
    d: "0s"
  }, {
    t: "git commit -m 'shipped 🚀'",
    cls: "commit",
    x: "62%",
    y: "8%",
    d: "2s"
  }, {
    t: "💼 Senior Frontend · Dhaka",
    cls: "briefcase",
    x: "70%",
    y: "70%",
    d: "4s"
  }, {
    t: "<Resume ats-ready />",
    cls: "",
    x: "10%",
    y: "62%",
    d: "6s"
  }, {
    t: "npm run build ✓",
    cls: "commit",
    x: "48%",
    y: "40%",
    d: "1s"
  }, {
    t: "💼 Remote · USD 80k",
    cls: "briefcase",
    x: "30%",
    y: "80%",
    d: "3s"
  }, {
    t: "function getHired() {}",
    cls: "",
    x: "82%",
    y: "32%",
    d: "5s"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cse-scene", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "cse-net", viewBox: "0 0 1200 600", preserveAspectRatio: "none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "edge", d: "M120,120 L320,260 L560,180 L820,300 L1080,200" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "edge", d: "M180,460 L380,360 L600,440 L860,360 L1100,460", style: {
        animationDelay: "1.5s"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "edge", d: "M320,260 L380,360" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "edge", d: "M560,180 L600,440", style: {
        animationDelay: "0.8s"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "edge", d: "M820,300 L860,360" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node", cx: "120", cy: "120", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node b", cx: "320", cy: "260", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node", cx: "560", cy: "180", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node b", cx: "820", cy: "300", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node", cx: "1080", cy: "200", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node b", cx: "380", cy: "360", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node", cx: "600", cy: "440", r: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { className: "node b", cx: "860", cy: "360", r: "3" })
    ] }),
    chips.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `chip ${c.cls}`, style: {
      left: c.x,
      top: c.y,
      animationDelay: c.d
    }, children: c.t }, i))
  ] });
}
function MacbookHero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "macbook", "aria-label": "Code preview running inside a MacBook Pro", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-lid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "macbook-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-bezel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "macbook-notch" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-display", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mac-window", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mac-traffic", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mac-title", children: "talentbd ~ /career" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mac-code", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ln", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "$" }),
            " talentbd login ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "--as student" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ln out", children: "→ welcome, future engineer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ln", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "$" }),
            " learn react ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "--track cse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ln out", children: "→ progress ████████░░ 80%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ln", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "$" }),
            " certify frontend"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ln ok", children: "→ credential issued ✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ln", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "$" }),
            " apply ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "--job" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: '"Frontend @ Pathao"' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caret" })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "macbook-base", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-keyboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-trackpad" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macbook-shadow" })
  ] });
}
export {
  Landing as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as ScrollReveal } from "./ScrollReveal-C8kHaTTr.mjs";
import { f as TrendingUp, g as Search } from "../_libs/lucide-react.mjs";
const ROWS = [{
  role: "Software Engineer",
  category: "IT/Software",
  entry: "৳35-55k",
  mid: "৳70-120k",
  senior: "৳150-280k",
  remote: "$2k-6k/mo"
}, {
  role: "Frontend Developer (React)",
  category: "IT/Software",
  entry: "৳30-50k",
  mid: "৳65-110k",
  senior: "৳140-240k",
  remote: "$1.8k-5k/mo"
}, {
  role: "Backend Developer (Node/Java)",
  category: "IT/Software",
  entry: "৳35-55k",
  mid: "৳75-130k",
  senior: "৳160-300k",
  remote: "$2.2k-6.5k/mo"
}, {
  role: "Data Scientist",
  category: "IT/Software",
  entry: "৳45-70k",
  mid: "৳90-150k",
  senior: "৳180-320k",
  remote: "$2.5k-7k/mo"
}, {
  role: "Mobile Developer (Flutter/RN)",
  category: "IT/Software",
  entry: "৳35-55k",
  mid: "৳70-120k",
  senior: "৳150-260k",
  remote: "$2k-6k/mo"
}, {
  role: "DevOps / SRE",
  category: "IT/Software",
  entry: "৳45-70k",
  mid: "৳90-160k",
  senior: "৳180-330k",
  remote: "$2.8k-7.5k/mo"
}, {
  role: "UI/UX Designer",
  category: "Design",
  entry: "৳30-50k",
  mid: "৳60-110k",
  senior: "৳130-220k",
  remote: "$1.5k-4.5k/mo"
}, {
  role: "Electrical Engineer",
  category: "Engineering",
  entry: "৳30-50k",
  mid: "৳60-110k",
  senior: "৳130-230k",
  remote: "—"
}, {
  role: "Civil / Structural Engineer",
  category: "Engineering",
  entry: "৳28-48k",
  mid: "৳55-100k",
  senior: "৳120-200k",
  remote: "—"
}, {
  role: "Project Manager (Construction)",
  category: "Engineering",
  entry: "৳40-65k",
  mid: "৳80-140k",
  senior: "৳160-280k",
  remote: "—"
}, {
  role: "Bank Officer (PO/MTO)",
  category: "Banking/Finance",
  entry: "৳35-50k",
  mid: "৳70-120k",
  senior: "৳150-280k",
  remote: "—"
}, {
  role: "Financial Analyst",
  category: "Banking/Finance",
  entry: "৳40-60k",
  mid: "৳80-140k",
  senior: "৳160-300k",
  remote: "$1.8k-4.5k/mo"
}, {
  role: "Digital Marketer",
  category: "Marketing",
  entry: "৳25-45k",
  mid: "৳55-100k",
  senior: "৳120-200k",
  remote: "$1.5k-4k/mo"
}, {
  role: "Sales Executive",
  category: "Sales",
  entry: "৳22-40k + comm.",
  mid: "৳45-90k + comm.",
  senior: "৳110-200k + comm.",
  remote: "—"
}];
function Salaries() {
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("");
  const cats = reactExports.useMemo(() => Array.from(new Set(ROWS.map((r) => r.category))), []);
  const filtered = reactExports.useMemo(() => ROWS.filter((r) => (!cat || r.category === cat) && (!q || r.role.toLowerCase().includes(q.toLowerCase()))), [q, cat]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollReveal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3.5", style: {
          color: "var(--color-primary)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Live market benchmarks" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 text-4xl font-extrabold", children: [
        "Salary ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "insights" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Indicative monthly pay ranges across Bangladesh and global remote markets. Use the numbers to negotiate confidently." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 glass rounded-xl p-4 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search role e.g. React, DevOps", className: "w-full rounded-md border bg-white/60 pl-9 pr-3 py-2 text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: cat, onChange: (e) => setCat(e.target.value), className: "rounded-md border bg-white/60 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All categories" }),
        cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollReveal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-hidden rounded-xl glass", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-white/40 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold hidden md:table-cell", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Entry" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Mid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Senior" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold hidden md:table-cell", children: "Remote (USD)" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-white/30 hover:bg-white/30 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: r.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 hidden md:table-cell text-muted-foreground", children: r.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.entry }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-semibold", style: {
            color: "var(--color-primary)"
          }, children: r.mid }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: r.senior }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 hidden md:table-cell", children: r.remote })
        ] }, r.role)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-6 text-center text-muted-foreground", children: "No roles match those filters." }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "Ranges are indicative, based on industry benchmarks and TalentBD employer listings. Actual offers vary by company, location, and experience." })
  ] });
}
export {
  Salaries as component
};

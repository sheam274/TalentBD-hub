import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
const SECTOR_KEYWORDS = {
  "Web Development": ["react", "javascript", "typescript", "css", "html", "node", "next", "tailwind", "redux", "vite"],
  "Data Science": ["python", "pandas", "numpy", "scikit", "tensorflow", "pytorch", "sql", "statistics", "ml", "ai"],
  "Networking": ["tcp", "ip", "routing", "bgp", "ospf", "vlan", "firewall", "linux", "cisco"],
  "Mobile App Development": ["react native", "flutter", "kotlin", "swift", "android", "ios"],
  "VLSI Design": ["verilog", "systemverilog", "uvm", "cmos", "rtl", "synthesis", "vlsi"],
  "Power Systems": ["power", "matlab", "transmission", "load flow", "etap", "protection", "smart grid"],
  "Industrial Automation": ["plc", "scada", "hmi", "ladder", "siemens", "rockwell", "automation"],
  "Structural Engineering": ["etabs", "staad", "rcc", "steel design", "concrete", "structural"],
  "CAD & BIM": ["autocad", "revit", "navisworks", "bim", "cad", "civil 3d"],
  "Project Management": ["pmp", "scheduling", "wbs", "primavera", "ms project", "estimation"],
  "Digital Marketing": ["seo", "sem", "google ads", "analytics", "content", "social media"],
  "3D Animation": ["blender", "maya", "3ds max", "rigging", "modeling", "animation"]
};
function score(text) {
  const lc = text.toLowerCase();
  return Object.entries(SECTOR_KEYWORDS).map(([sector, kws]) => {
    const hits = kws.filter((k) => lc.includes(k));
    return {
      sector,
      score: Math.round(hits.length / kws.length * 100),
      hits
    };
  }).sort((a, b) => b.score - a.score);
}
function Parser() {
  const [text, setText] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  async function onFile(f) {
    const t = await f.text();
    setText(t);
    setResults(score(t));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "ATS CV Parser" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Drop a .txt resume or paste text — we'll match it to engineering sectors." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    }, className: "mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Drag & drop a .txt file here" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "my-2 text-xs text-muted-foreground", children: "or" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold", style: {
        background: "var(--color-accent)",
        color: "var(--color-accent-foreground)"
      }, children: [
        "Choose file",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".txt", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        } })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: text, onChange: (e) => {
      setText(e.target.value);
      setResults(score(e.target.value));
    }, placeholder: "…or paste resume text here", rows: 8, className: "mt-4 w-full rounded-md border bg-white px-3 py-2 text-sm" }),
    results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Sector matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-2", children: results.slice(0, 8).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border bg-white p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.sector }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
            r.score,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 w-full overflow-hidden rounded bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full", style: {
          width: `${r.score}%`,
          background: "var(--color-accent)"
        } }) }),
        r.hits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Matched: ",
          r.hits.join(", ")
        ] })
      ] }, r.sector)) })
    ] })
  ] });
}
export {
  Parser as component
};

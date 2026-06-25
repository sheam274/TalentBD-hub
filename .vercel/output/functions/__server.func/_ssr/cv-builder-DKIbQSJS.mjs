import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as useServerFn, c as createSsrRpc } from "./router-B8OUd1qE.mjs";
import { c as createServerFn } from "./server-XhNC2-Ux.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BkCqN-4J.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { v as Save, P as Printer, w as Plus, x as Trash2, n as Mail, y as Phone, q as MapPin, G as Globe, a as Linkedin, z as Github } from "../_libs/lucide-react.mjs";
import { o as objectType, r as recordType, s as stringType, u as unknownType, e as enumType } from "../_libs/zod.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const getMyCv = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("50a89d37646baf31fb5cfceca91efaf174c133a13989eed656ea3547fc022ecf"));
const cvSchema = objectType({
  selected_style: enumType(["standard", "premium"]),
  builder_payload: recordType(stringType(), unknownType())
});
const saveMyCv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => cvSchema.parse(i)).handler(createSsrRpc("93625428332452d0174b887b663341128b259874cabc5f35e8635c80cc39234e"));
const uid = () => Math.random().toString(36).slice(2, 9);
const empty = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  photo: "",
  summary: "",
  skills: "",
  languages: "",
  experience: [],
  education: [],
  projects: []
};
function migrate(p) {
  if (!p) return empty;
  return {
    ...empty,
    ...p,
    experience: Array.isArray(p.experience) ? p.experience : typeof p.experience === "string" && p.experience ? [{
      id: uid(),
      role: "",
      company: "",
      period: "",
      bullets: p.experience
    }] : [],
    education: Array.isArray(p.education) ? p.education : typeof p.education === "string" && p.education ? [{
      id: uid(),
      degree: "",
      school: "",
      period: "",
      details: p.education
    }] : [],
    projects: Array.isArray(p.projects) ? p.projects : []
  };
}
function CvBuilder() {
  const getFn = useServerFn(getMyCv);
  const saveFn = useServerFn(saveMyCv);
  const q = useQuery({
    queryKey: ["my-cv"],
    queryFn: () => getFn()
  });
  const [style, setStyle] = reactExports.useState("standard");
  const [data, setData] = reactExports.useState(empty);
  reactExports.useEffect(() => {
    if (q.data) {
      setStyle(q.data.selected_style ?? "standard");
      setData(migrate(q.data.builder_payload));
    }
  }, [q.data]);
  const save = useMutation({
    mutationFn: () => saveFn({
      data: {
        selected_style: style,
        builder_payload: data
      }
    }),
    onSuccess: () => toast.success("CV saved"),
    onError: (e) => toast.error(e.message)
  });
  function set(k, v) {
    setData((d) => ({
      ...d,
      [k]: v
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 md:px-6 page-enter", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-extrabold", children: [
          "CV ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "Builder" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Real-time preview · ATS-friendly · Print to PDF" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: style, onChange: (e) => setStyle(e.target.value), className: "rounded-md border px-3 py-2 text-sm bg-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "standard", children: "Standard (single column)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "premium", children: "Premium (two-column)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => save.mutate(), disabled: save.isPending, className: "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50", style: {
          background: "var(--color-primary)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
          " Save"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
          " Print / PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print space-y-5 rounded-xl border bg-white p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Personal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Full name", value: data.name, onChange: (v) => set("name", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Title / Role", value: data.title, onChange: (v) => set("title", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Email", value: data.email, onChange: (v) => set("email", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Phone", value: data.phone, onChange: (v) => set("phone", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Location", value: data.location, onChange: (v) => set("location", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Website", value: data.website, onChange: (v) => set("website", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "LinkedIn", value: data.linkedin, onChange: (v) => set("linkedin", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "GitHub", value: data.github, onChange: (v) => set("github", v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Photo URL (optional)", value: data.photo, onChange: (v) => set("photo", v), className: "col-span-2" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: data.summary, onChange: (v) => set("summary", v), rows: 3, placeholder: "2-3 sentence professional summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Skills & Languages", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { label: "Skills (comma separated)", value: data.skills, onChange: (v) => set("skills", v), placeholder: "React, Node.js, SQL, AWS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { label: "Languages", value: data.languages, onChange: (v) => set("languages", v), placeholder: "English (fluent), Bengali (native)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeater, { title: "Experience", items: data.experience, onChange: (items) => set("experience", items), create: () => ({
          id: uid(),
          role: "",
          company: "",
          period: "",
          bullets: ""
        }), render: (item, update) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Role", value: item.role, onChange: (v) => update({
              ...item,
              role: v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Company", value: item.company, onChange: (v) => update({
              ...item,
              company: v
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Period (e.g. 2022 - Present)", value: item.period, onChange: (v) => update({
            ...item,
            period: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { label: "Bullets (one per line)", value: item.bullets, onChange: (v) => update({
            ...item,
            bullets: v
          }), rows: 4 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeater, { title: "Education", items: data.education, onChange: (items) => set("education", items), create: () => ({
          id: uid(),
          degree: "",
          school: "",
          period: "",
          details: ""
        }), render: (item, update) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Degree", value: item.degree, onChange: (v) => update({
              ...item,
              degree: v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "School", value: item.school, onChange: (v) => update({
              ...item,
              school: v
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Period", value: item.period, onChange: (v) => update({
            ...item,
            period: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { label: "Details", value: item.details, onChange: (v) => update({
            ...item,
            details: v
          }), rows: 2 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Repeater, { title: "Projects", items: data.projects, onChange: (items) => set("projects", items), create: () => ({
          id: uid(),
          name: "",
          link: "",
          description: ""
        }), render: (item, update) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Name", value: item.name, onChange: (v) => update({
              ...item,
              name: v
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Link", value: item.link, onChange: (v) => update({
              ...item,
              link: v
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { label: "Description", value: item.description, onChange: (v) => update({
            ...item,
            description: v
          }), rows: 2 })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:sticky lg:top-20 lg:self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cv-print-area rounded-xl border bg-white p-8 shadow-sm", children: style === "standard" ? /* @__PURE__ */ jsxRuntimeExports.jsx(StandardCv, { d: data }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PremiumCv, { d: data }) }) })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children })
  ] });
}
function Input({
  label,
  value,
  onChange,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), className: "mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" })
  ] });
}
function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows, placeholder, value, onChange: (e) => onChange(e.target.value), className: "mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" })
  ] });
}
function Repeater({
  title,
  items,
  onChange,
  create,
  render
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wide text-muted-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onChange([...items, create()]), className: "inline-flex items-center gap-1 text-xs font-semibold", style: {
        color: "var(--color-primary)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-3", children: [
      items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border p-3 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange(items.filter((x) => x.id !== it.id)), className: "absolute top-2 right-2 text-muted-foreground hover:text-destructive", "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: render(it, (n) => onChange(items.map((x) => x.id === it.id ? n : x))) })
      ] }, it.id)),
      items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No entries yet. Click Add to create one." })
    ] })
  ] });
}
function ContactBar({
  d
}) {
  const items = [{
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3" }),
    t: d.email
  }, {
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
    t: d.phone
  }, {
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
    t: d.location
  }, {
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-3" }),
    t: d.website
  }, {
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "size-3" }),
    t: d.linkedin
  }, {
    i: /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "size-3" }),
    t: d.github
  }].filter((x) => x.t);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-700", children: items.map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
    x.i,
    x.t
  ] }, i)) });
}
function StandardCv({
  d
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-black text-[13px] leading-snug", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b-2 border-black pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: d.name || "Your Name" }),
      d.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: d.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactBar, { d }) })
    ] }),
    d.summary && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Professional Summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: d.summary }) }),
    d.skills && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Skills", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: d.skills }) }),
    d.experience.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Experience", children: d.experience.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          e.role,
          e.company && ` · ${e.company}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: e.period })
      ] }),
      e.bullets && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ml-4 list-disc text-[12.5px]", children: e.bullets.split("\n").filter(Boolean).map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b.replace(/^[-•*]\s*/, "") }, i)) })
    ] }, e.id)) }),
    d.projects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Projects", children: d.projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
        p.name,
        p.link && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-normal text-xs", children: p.link })
      ] }),
      p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12.5px]", children: p.description })
    ] }, p.id)) }),
    d.education.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Education", children: d.education.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          e.degree,
          e.school && ` · ${e.school}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: e.period })
      ] }),
      e.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12.5px]", children: e.details })
    ] }, e.id)) }),
    d.languages && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Languages", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: d.languages }) })
  ] });
}
function PremiumCv({
  d
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4 text-[12.5px] leading-snug text-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "col-span-1 rounded-md p-4 text-white", style: {
      background: "var(--color-primary)"
    }, children: [
      d.photo && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.photo, alt: "", className: "mb-3 size-24 rounded-full object-cover ring-2 ring-white/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold leading-tight", children: d.name || "Your Name" }),
      d.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs opacity-90", children: d.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-1.5 text-[11px]", children: [
        d.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3 mt-0.5 shrink-0" }),
          d.email
        ] }),
        d.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3 mt-0.5 shrink-0" }),
          d.phone
        ] }),
        d.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3 mt-0.5 shrink-0" }),
          d.location
        ] }),
        d.website && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-3 mt-0.5 shrink-0" }),
          d.website
        ] }),
        d.linkedin && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "size-3 mt-0.5 shrink-0" }),
          d.linkedin
        ] }),
        d.github && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Github, { className: "size-3 mt-0.5 shrink-0" }),
          d.github
        ] })
      ] }),
      d.skills && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-bold uppercase tracking-wider", style: {
          color: "var(--color-accent)"
        }, children: "Skills" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: d.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-white/15 px-1.5 py-0.5 text-[10px]", children: s }, s)) })
      ] }),
      d.languages && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-bold uppercase tracking-wider", style: {
          color: "var(--color-accent)"
        }, children: "Languages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px]", children: d.languages })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "col-span-2 space-y-3", children: [
      d.summary && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Summary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: d.summary }) }),
      d.experience.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Experience", children: d.experience.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            e.role,
            e.company && ` · ${e.company}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: e.period })
        ] }),
        e.bullets && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ml-4 list-disc", children: e.bullets.split("\n").filter(Boolean).map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b.replace(/^[-•*]\s*/, "") }, i)) })
      ] }, e.id)) }),
      d.projects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Projects", children: d.projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
          p.name,
          p.link && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-normal text-xs", children: p.link })
        ] }),
        p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: p.description })
      ] }, p.id)) }),
      d.education.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CvSection, { h: "Education", children: d.education.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            e.degree,
            e.school && ` · ${e.school}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal", children: e.period })
        ] }),
        e.details && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: e.details })
      ] }, e.id)) })
    ] })
  ] });
}
function CvSection({
  h,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "border-b border-current/20 pb-0.5 text-[11px] font-bold uppercase tracking-wider", style: {
      color: "var(--color-primary)"
    }, children: h }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children })
  ] });
}
export {
  CvBuilder as component
};

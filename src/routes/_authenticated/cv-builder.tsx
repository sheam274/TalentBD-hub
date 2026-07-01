import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getMyCv, saveMyCv } from "@/lib/cv.functions";
import { toast } from "sonner";
import { Plus, Trash2, Mail, Phone, MapPin, Globe, Linkedin, Github, Printer, Save, Upload, X, FileDown, GraduationCap, Briefcase, PersonStanding, Award, BadgeCheck, Code2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cv-builder")({
  head: () => ({ meta: [{ title: "CV Builder — TalentBD" }, { name: "description", content: "Build a professional, print-ready CV with standard or premium layouts." }] }),
  component: CvBuilder,
});

type Experience = { id: string; role: string; company: string; period: string; bullets: string; tech?: string };
type Education = { id: string; degree: string; school: string; period: string; details: string; gpa?: string };
type Project = { id: string; name: string; link: string; description: string; tech?: string };
type Certification = { id: string; name: string; issuer: string; year: string };
type Award = { id: string; title: string; detail: string; year: string };
type Coding = { id: string; platform: string; handle: string; link: string; rating: string };

type Payload = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string;
  summary: string;
  skills: string;
  languages: string;
  coursework: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  coding: Coding[];
};

const uid = () => Math.random().toString(36).slice(2, 9);

const empty: Payload = {
  name: "", title: "", email: "", phone: "", location: "",
  website: "", linkedin: "", github: "", photo: "",
  summary: "", skills: "", languages: "", coursework: "",
  experience: [], education: [], projects: [],
  certifications: [], awards: [], coding: [],
};

function migrate(p: any): Payload {
  if (!p) return empty;
  return {
    ...empty,
    ...p,
    experience: Array.isArray(p.experience)
      ? p.experience
      : typeof p.experience === "string" && p.experience
      ? [{ id: uid(), role: "", company: "", period: "", bullets: p.experience }]
      : [],
    education: Array.isArray(p.education)
      ? p.education
      : typeof p.education === "string" && p.education
      ? [{ id: uid(), degree: "", school: "", period: "", details: p.education }]
      : [],
    projects: Array.isArray(p.projects) ? p.projects : [],
    certifications: Array.isArray(p.certifications) ? p.certifications : [],
    awards: Array.isArray(p.awards) ? p.awards : [],
    coding: Array.isArray(p.coding) ? p.coding : [],
  };
}

function CvBuilder() {
  const getFn = useServerFn(getMyCv);
  const saveFn = useServerFn(saveMyCv);
  const qc = useQueryClient();
  const router = useRouter();
  const q = useQuery({ queryKey: ["my-cv"], queryFn: () => getFn() });
  const [style, setStyle] = useState<"standard" | "premium">("premium");
  const [data, setData] = useState<Payload>(empty);

  useEffect(() => {
    if (q.data) {
      setStyle((q.data.selected_style as any) ?? "premium");
      setData(migrate(q.data.builder_payload));
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: { selected_style: style, builder_payload: data as any } }),
    onSuccess: async (result) => {
      toast.success("CV saved");
      // Write the saved profile into the shared dashboard cache immediately,
      // then force a network fallback in case another dashboard query is active.
      qc.setQueryData(["me"], (current: any) => ({
        ...(current ?? {}),
        profile: result.profile,
      }));
      qc.setQueryData(["my-cv"], (current: any) => ({
        ...(current ?? {}),
        user_id: result.profile.id,
        selected_style: style,
        builder_payload: data,
        updated_at: result.cvUpdatedAt,
      }));
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["me"] }),
        qc.invalidateQueries({ queryKey: ["my-cv"] }),
        qc.refetchQueries({ queryKey: ["me"], type: "all" }),
        qc.refetchQueries({ queryKey: ["my-cv"], type: "all" }),
        router.invalidate({ sync: true }),
      ]);
    },
    onError: (e: any) => toast.error(e.message),
  });

  function set<K extends keyof Payload>(k: K, v: Payload[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function onPhotoFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please choose an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2 MB"); return; }
    const reader = new FileReader();
    reader.onload = () => set("photo", String(reader.result || ""));
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsDataURL(file);
  }

  function cvFileBase() {
    const slug = (s: string) =>
      s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const parts = [slug(data.name || "cv"), slug(data.title || ""), "cv"].filter(Boolean);
    return parts.join("-");
  }

  function printCv() {
    const node = document.querySelector(".cv-print-area");
    if (!node) { window.print(); return; }
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) { window.print(); return; }
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map((el) => el.outerHTML)
      .join("\n");
    // Title becomes the default filename in the browser's Save as PDF dialog.
    const title = cvFileBase();
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>${styles}<style>@page{size:A4;margin:10mm}html,body{margin:0;background:#fff}.cv-print-area{width:210mm;min-height:297mm;box-shadow:none!important;border:0!important;margin:0!important;padding:10mm!important;background:#fff!important}</style></head><body><div class="cv-print-area">${(node as HTMLElement).innerHTML}</div></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  }

  async function downloadPdf() {
    const node = document.querySelector(".cv-print-area") as HTMLElement | null;
    if (!node) return;
    try {
      const mod: any = await import("html2pdf.js");
      const html2pdf = mod.default ?? mod;
      const filename = `${cvFileBase()}.pdf`;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(node)
        .save();
    } catch (e: any) {
      toast.error(e?.message || "Could not generate PDF");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 md:px-6 page-enter">
      <div className="no-print flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold">CV <span className="text-gradient">Builder</span></h1>
          <p className="text-sm text-muted-foreground">Real-time preview · ATS-friendly · Print to PDF</p>
        </div>
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-2">
          <select aria-label="CV template style" value={style} onChange={(e) => setStyle(e.target.value as any)} className="flex-1 sm:flex-none rounded-md border px-3 py-2 text-sm bg-white">
            <option value="standard">Standard (single column)</option>
            <option value="premium">Premium (two-column)</option>
          </select>
          <button onClick={() => save.mutate()} disabled={save.isPending} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: "var(--color-primary)" }}>
            <Save className="size-4" /> Save
          </button>
          <button onClick={printCv} className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold">
            <Printer className="size-4" /> Print / PDF
          </button>
          <button onClick={downloadPdf} className="inline-flex items-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-semibold">
            <FileDown className="size-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="no-print space-y-5 rounded-xl border bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {data.photo ? (
                <img src={data.photo} alt="Profile" className="size-14 rounded-full object-cover ring-2 ring-black/5" />
              ) : (
                <div className="size-14 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">No photo</div>
              )}
              {data.photo && (
                <button type="button" onClick={() => set("photo", "")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                  <X className="size-3" /> Remove
                </button>
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 text-xs font-semibold hover:bg-muted">
              <Upload className="size-3.5" /> Add photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPhotoFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <BigTechChecklist d={data} />
          <Section title="Personal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full name" value={data.name} onChange={(v) => set("name", v)} />
              <Input label="Title / Role" value={data.title} onChange={(v) => set("title", v)} />
              <Input label="Email" value={data.email} onChange={(v) => set("email", v)} />
              <Input label="Phone" value={data.phone} onChange={(v) => set("phone", v)} />
              <Input label="Location" value={data.location} onChange={(v) => set("location", v)} />
              <Input label="Website" value={data.website} onChange={(v) => set("website", v)} />
              <Input label="LinkedIn" value={data.linkedin} onChange={(v) => set("linkedin", v)} />
              <Input label="GitHub" value={data.github} onChange={(v) => set("github", v)} />
            </div>
          </Section>

          <Section title="Summary">
            <Textarea value={data.summary} onChange={(v) => set("summary", v)} rows={3} placeholder="2-3 sentence professional summary" />
          </Section>

          <Section title="Skills & Languages">
            <Textarea label="Skills (comma separated)" value={data.skills} onChange={(v) => set("skills", v)} placeholder="React, Node.js, SQL, AWS" />
            <SuggestionPicker label="Suggested skills for CSE / big-tech" groups={SKILL_GROUPS} value={data.skills} onAdd={(t) => set("skills", appendCsv(data.skills, t))} />
            <Textarea label="Languages" value={data.languages} onChange={(v) => set("languages", v)} placeholder="English (fluent), Bengali (native)" />
            <SuggestionPicker label="Suggested languages" groups={LANGUAGE_GROUPS} value={data.languages} onAdd={(t) => set("languages", appendCsv(data.languages, t))} />
            <Textarea label="Relevant Coursework" value={data.coursework} onChange={(v) => set("coursework", v)} placeholder="Data Structures, Algorithms, Operating Systems, Distributed Systems, Machine Learning" />
            <SuggestionPicker label="Suggested coursework" groups={COURSEWORK_GROUPS} value={data.coursework} onAdd={(t) => set("coursework", appendCsv(data.coursework, t))} />
          </Section>

          <Repeater
            title="Experience"
            items={data.experience}
            onChange={(items) => set("experience", items)}
            create={() => ({ id: uid(), role: "", company: "", period: "", bullets: "", tech: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Role" value={item.role} onChange={(v) => update({ ...item, role: v })} />
                  <Input label="Company" value={item.company} onChange={(v) => update({ ...item, company: v })} />
                </div>
                <Input label="Period (e.g. 2022 - Present)" value={item.period} onChange={(v) => update({ ...item, period: v })} />
                <Input label="Tech stack" value={item.tech ?? ""} onChange={(v) => update({ ...item, tech: v })} />
                <Textarea label="Bullets (one per line)" value={item.bullets} onChange={(v) => update({ ...item, bullets: v })} rows={4} />
              </>
            )}
          />

          <Repeater
            title="Education"
            items={data.education}
            onChange={(items) => set("education", items)}
            create={() => ({ id: uid(), degree: "", school: "", period: "", details: "", gpa: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Degree" value={item.degree} onChange={(v) => update({ ...item, degree: v })} />
                  <Input label="School" value={item.school} onChange={(v) => update({ ...item, school: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Period" value={item.period} onChange={(v) => update({ ...item, period: v })} />
                  <Input label="CGPA / GPA" value={item.gpa ?? ""} onChange={(v) => update({ ...item, gpa: v })} />
                </div>
                <Textarea label="Details" value={item.details} onChange={(v) => update({ ...item, details: v })} rows={2} />
              </>
            )}
          />

          <Repeater
            title="Project Showcase"
            items={data.projects}
            onChange={(items) => set("projects", items)}
            create={() => ({ id: uid(), name: "", link: "", description: "", tech: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                  <Input label="Link" value={item.link} onChange={(v) => update({ ...item, link: v })} />
                </div>
                <Input label="Tech stack" value={item.tech ?? ""} onChange={(v) => update({ ...item, tech: v })} />
                <Textarea label="Description" value={item.description} onChange={(v) => update({ ...item, description: v })} rows={2} />
              </>
            )}
          />

          <Repeater
            title="Certifications"
            items={data.certifications}
            onChange={(items) => set("certifications", items)}
            create={() => ({ id: uid(), name: "", issuer: "", year: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Name" value={item.name} onChange={(v) => update({ ...item, name: v })} />
                  <Input label="Issuer" value={item.issuer} onChange={(v) => update({ ...item, issuer: v })} />
                </div>
                <Input label="Year" value={item.year} onChange={(v) => update({ ...item, year: v })} />
              </>
            )}
          />

          <Repeater
            title="Awards & Achievements"
            items={data.awards}
            onChange={(items) => set("awards", items)}
            create={() => ({ id: uid(), title: "", detail: "", year: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                  <Input label="Year" value={item.year} onChange={(v) => update({ ...item, year: v })} />
                </div>
                <Textarea label="Detail" value={item.detail} onChange={(v) => update({ ...item, detail: v })} rows={2} />
              </>
            )}
          />

          <Repeater
            title="Coding Profiles"
            items={data.coding}
            onChange={(items) => set("coding", items)}
            create={() => ({ id: uid(), platform: "", handle: "", link: "", rating: "" })}
            render={(item, update) => (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Platform (LeetCode, Codeforces, HackerRank…)" value={item.platform} onChange={(v) => update({ ...item, platform: v })} />
                  <Input label="Handle / Username" value={item.handle} onChange={(v) => update({ ...item, handle: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input label="Profile link" value={item.link} onChange={(v) => update({ ...item, link: v })} />
                  <Input label="Rating / Rank (optional)" value={item.rating} onChange={(v) => update({ ...item, rating: v })} />
                </div>
              </>
            )}
          />
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <CvSheet>
            {style === "standard" ? <StandardCv d={data} /> : <PremiumCv d={data} />}
          </CvSheet>
        </div>
      </div>
    </div>
  );
}

/* --- Form primitives --- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
function Input({ label, value, onChange, className = "" }: { label?: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-[11px] font-medium text-muted-foreground">{label}</span>}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" />
    </label>
  );
}
function Textarea({ label, value, onChange, rows = 3, placeholder }: { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      {label && <span className="text-[11px] font-medium text-muted-foreground">{label}</span>}
      <textarea rows={rows} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="mt-0.5 w-full rounded-md border px-2.5 py-1.5 text-sm" />
    </label>
  );
}
function Repeater<T extends { id: string }>({
  title, items, onChange, create, render,
}: { title: string; items: T[]; onChange: (items: T[]) => void; create: () => T; render: (item: T, update: (n: T) => void) => React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h2>
        <button onClick={() => onChange([...items, create()])} className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
          <Plus className="size-3.5" /> Add
        </button>
      </div>
      <div className="mt-2 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="rounded-md border p-3 relative">
            <button onClick={() => onChange(items.filter((x) => x.id !== it.id))} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" aria-label="Remove">
              <Trash2 className="size-3.5" />
            </button>
            <div className="space-y-2">
              {render(it, (n) => onChange(items.map((x) => (x.id === it.id ? n : x))))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No entries yet. Click Add to create one.</p>
        )}
      </div>
    </div>
  );
}

/* --- CV previews --- */
function ContactBar({ d }: { d: Payload }) {
  const items = [
    { i: <Mail className="size-3" />, t: d.email },
    { i: <Phone className="size-3" />, t: d.phone },
    { i: <MapPin className="size-3" />, t: d.location },
    { i: <Globe className="size-3" />, t: d.website },
    { i: <Linkedin className="size-3" />, t: d.linkedin },
    { i: <Github className="size-3" />, t: d.github },
  ].filter((x) => x.t);
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      {items.map((x, i) => (
        <span key={i} className="inline-flex items-center gap-1">{x.i}{x.t}</span>
      ))}
    </div>
  );
}

function StandardCv({ d }: { d: Payload }) {
  return (
    <div className="text-black text-[13px] leading-snug">
      <header className="border-b-2 border-black pb-2">
        <h2 className="text-2xl font-bold tracking-tight">{d.name || "Your Name"}</h2>
        {d.title && <p className="text-sm font-medium">{d.title}</p>}
        <div className="mt-1.5"><ContactBar d={d} /></div>
      </header>
      {d.summary && <CvSection h="Professional Summary"><p>{d.summary}</p></CvSection>}
      {d.skills && <CvSection h="Skills"><p>{d.skills}</p></CvSection>}
      {d.coursework && <CvSection h="Relevant Coursework"><p>{d.coursework}</p></CvSection>}
      {d.experience.length > 0 && (
        <CvSection h="Experience">
          {d.experience.map((e) => (
            <div key={e.id} className="mb-2.5">
              <div className="flex justify-between font-semibold"><span>{e.role}{e.company && ` · ${e.company}`}</span><span className="text-xs font-normal">{e.period}</span></div>
              {e.tech && <div className="text-[12px] italic text-black/70">Tech: {e.tech}</div>}
              {e.bullets && (
                <ul className="ml-4 list-disc text-[12.5px]">
                  {e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b.replace(/^[-•*]\s*/, "")}</li>)}
                </ul>
              )}
            </div>
          ))}
        </CvSection>
      )}
      {d.projects.length > 0 && (
        <CvSection h="Project Showcase">
          {d.projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <div className="font-semibold">
                {p.name}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="ml-2 font-normal text-xs underline">
                    {p.link}
                  </a>
                )}
              </div>
              {p.tech && <div className="text-[12px] italic text-black/70">Tech: {p.tech}</div>}
              {p.description && <p className="text-[12.5px]">{p.description}</p>}
            </div>
          ))}
        </CvSection>
      )}
      {d.education.length > 0 && (
        <CvSection h="Education">
          {d.education.map((e) => (
            <div key={e.id} className="mb-1.5">
              <div className="flex justify-between font-semibold"><span>{e.degree}{e.school && ` · ${e.school}`}{e.gpa && <span className="font-normal"> · CGPA {e.gpa}</span>}</span><span className="text-xs font-normal">{e.period}</span></div>
              {e.details && <p className="text-[12.5px]">{e.details}</p>}
            </div>
          ))}
        </CvSection>
      )}
      {d.certifications.length > 0 && (
        <CvSection h="Certifications">
          {d.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-[12.5px]"><span><span className="font-semibold">{c.name}</span>{c.issuer && ` · ${c.issuer}`}</span><span className="text-xs">{c.year}</span></div>
          ))}
        </CvSection>
      )}
      {d.awards.length > 0 && (
        <CvSection h="Awards & Achievements">
          {d.awards.map((a) => (
            <div key={a.id} className="mb-1 text-[12.5px]">
              <div className="flex justify-between font-semibold"><span>{a.title}</span><span className="text-xs font-normal">{a.year}</span></div>
              {a.detail && <p>{a.detail}</p>}
            </div>
          ))}
        </CvSection>
      )}
      {d.coding.length > 0 && (
        <CvSection h="Coding Profiles">
          <ul className="text-[12.5px] space-y-0.5">
            {d.coding.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.platform}</span>
                {c.handle && ` — ${c.handle}`}
                {c.rating && ` (${c.rating})`}
                {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="ml-2 text-xs underline">{c.link}</a>}
              </li>
            ))}
          </ul>
        </CvSection>
      )}
      {d.languages && <CvSection h="Languages"><p>{d.languages}</p></CvSection>}
    </div>
  );
}

function PremiumCv({ d }: { d: Payload }) {
  const PEACH = "#f6b088";
  const PEACH_SOFT = "#fbe3d1";
  const BG = "#fdf3ec";
  const ACCENT = "#f0895a";
  return (
    <div className="relative text-black text-[12.5px] leading-snug overflow-hidden" style={{ background: BG }}>
      {/* Decorative angled peach shapes (like the template) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-40 h-64 w-64 rotate-12" style={{ background: PEACH_SOFT, opacity: 0.55, borderRadius: 12 }} />
        <div className="absolute -right-24 bottom-24 h-72 w-72 -rotate-12" style={{ background: PEACH_SOFT, opacity: 0.55, borderRadius: 12 }} />
      </div>
      {/* Grey angled banner behind header */}
      <div aria-hidden className="absolute top-0 right-0 h-40 w-2/3" style={{ background: "linear-gradient(135deg,#eef1f4 0%,#e6ebef 60%,transparent 100%)", clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }} />

      <div className="relative p-8">
        {/* Header */}
        <div className="grid grid-cols-[auto,1fr] items-center gap-6">
          <div className="shrink-0">
            {d.photo ? (
              <img src={d.photo} alt="" className="size-32 rounded-full object-cover ring-4 ring-white shadow-md" />
            ) : (
              <div className="size-32 rounded-full ring-4 ring-white shadow-md" style={{ background: "#dfe4ea" }} />
            )}
          </div>
          <div className="pt-4 min-w-0">
            <h2 className="text-[34px] font-extrabold uppercase tracking-[0.06em] text-center leading-tight">{d.name || "Your Name"}</h2>
            <div className="mx-auto mt-1 h-[2px] w-[85%] bg-black/80" />
            {d.title && <p className="mt-2 text-center text-[15px] text-black/70">{d.title}</p>}
          </div>
        </div>

        {/* Body grid */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {/* Left column */}
          <div className="col-span-1 space-y-4 min-w-0">
            <TopcvCard>
              <ul className="space-y-2 text-[12.5px] break-words">
                {d.email && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><Mail className="size-3" /></IconBadge><span className="min-w-0 break-all">{d.email}</span></li>}
                {d.phone && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><Phone className="size-3" /></IconBadge><span className="min-w-0 break-all">{d.phone}</span></li>}
                {d.website && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><Globe className="size-3" /></IconBadge><span className="min-w-0 break-all">{d.website}</span></li>}
                {d.location && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><MapPin className="size-3" /></IconBadge><span className="min-w-0 break-words">{d.location}</span></li>}
                {d.linkedin && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><Linkedin className="size-3" /></IconBadge><span className="min-w-0 break-all">{d.linkedin}</span></li>}
                {d.github && <li className="flex items-start gap-2.5"><IconBadge color={ACCENT}><Github className="size-3" /></IconBadge><span className="min-w-0 break-all">{d.github}</span></li>}
              </ul>
            </TopcvCard>

            {d.summary && (
              <TopcvCard header="OBJECTIVE"><p>{d.summary}</p></TopcvCard>
            )}

            {d.skills && (
              <TopcvCard header="SKILLS">
                <p className="whitespace-pre-line">{d.skills}</p>
              </TopcvCard>
            )}

            {d.coursework && (
              <TopcvCard header="COURSEWORK">
                <p className="whitespace-pre-line">{d.coursework}</p>
              </TopcvCard>
            )}

            {d.coding.length > 0 && (
              <TopcvCard header="CODING PROFILES">
                <ul className="space-y-1.5 text-[12px]">
                  {d.coding.map((c) => (
                    <li key={c.id} className="flex items-start gap-2">
                      <Code2 className="size-3.5 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                      <span className="min-w-0 break-words">
                        <span className="font-semibold">{c.platform}</span>
                        {c.handle && <> — {c.handle}</>}
                        {c.rating && <> ({c.rating})</>}
                        {c.link && <div className="text-[11px] text-black/60 break-all">{c.link}</div>}
                      </span>
                    </li>
                  ))}
                </ul>
              </TopcvCard>
            )}

            {d.languages && (
              <TopcvCard header="INTERESTS"><p>{d.languages}</p></TopcvCard>
            )}
          </div>

          {/* Right column */}
          <div className="col-span-2 space-y-4 min-w-0">
            {d.education.length > 0 && (
              <TopcvCard header="EDUCATION">
                {d.education.map((e) => (
                  <div key={e.id} className="mb-3 last:mb-0 flex gap-2.5">
                    <GraduationCap className="size-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <div className="flex-1">
                      <div className="font-semibold">{e.school}{e.degree && <span className="font-normal">, {e.degree}</span>}{e.gpa && <span className="font-normal"> · CGPA {e.gpa}</span>}</div>
                      {e.period && <div className="text-[12px] text-black/70">{e.period}</div>}
                      {e.details && <div className="text-[12px]">{e.details}</div>}
                    </div>
                  </div>
                ))}
              </TopcvCard>
            )}

            {d.experience.length > 0 && (
              <TopcvCard header="WORK EXPERIENCE">
                {d.experience.map((e) => (
                  <div key={e.id} className="mb-4 last:mb-0 flex gap-2.5">
                    <Briefcase className="size-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <div className="flex-1">
                      <div className="font-semibold">{e.company}{e.role && <span className="font-normal">, {e.role}</span>}</div>
                      {e.period && <div className="text-[12px] text-black/70">{e.period}</div>}
                      {e.tech && <div className="text-[12px] italic text-black/70">Tech: {e.tech}</div>}
                      {e.bullets && (
                        <ul className="mt-1 space-y-0.5 text-[12px]">
                          {e.bullets.split("\n").filter(Boolean).map((b, i) => (
                            <li key={i}>- {b.replace(/^[-•*]\s*/, "")}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </TopcvCard>
            )}

            {d.projects.length > 0 && (
              <TopcvCard header="PROJECT SHOWCASE">
                {d.projects.map((p) => (
                  <div key={p.id} className="mb-3 last:mb-0 flex gap-2.5">
                    <PersonStanding className="size-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <div className="flex-1">
                      <div className="font-semibold">
                        {p.name}
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noreferrer" className="ml-2 font-normal text-[11px] text-black/70 underline underline-offset-2">
                            {p.link}
                          </a>
                        )}
                      </div>
                      {p.tech && <div className="text-[12px] italic text-black/70">Tech: {p.tech}</div>}
                      {p.description && <p className="text-[12px]">{p.description}</p>}
                    </div>
                  </div>
                ))}
              </TopcvCard>
            )}

            {d.certifications.length > 0 && (
              <TopcvCard header="CERTIFICATIONS">
                {d.certifications.map((c) => (
                  <div key={c.id} className="mb-2 last:mb-0 flex gap-2.5">
                    <BadgeCheck className="size-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <div className="flex-1 flex justify-between gap-2">
                      <div>
                        <span className="font-semibold">{c.name}</span>
                        {c.issuer && <span className="text-[12px] text-black/70"> · {c.issuer}</span>}
                      </div>
                      {c.year && <div className="text-[12px] text-black/70 shrink-0">{c.year}</div>}
                    </div>
                  </div>
                ))}
              </TopcvCard>
            )}

            {d.awards.length > 0 && (
              <TopcvCard header="AWARDS & ACHIEVEMENTS">
                {d.awards.map((a) => (
                  <div key={a.id} className="mb-2 last:mb-0 flex gap-2.5">
                    <Award className="size-4 mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="font-semibold">{a.title}</span>
                        {a.year && <span className="text-[12px] text-black/70">{a.year}</span>}
                      </div>
                      {a.detail && <div className="text-[12px]">{a.detail}</div>}
                    </div>
                  </div>
                ))}
              </TopcvCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopcvCard({ header, children }: { header?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
      {header && (
        <div className="px-4 py-2 text-[13px] font-bold tracking-wide text-black" style={{ background: "#f6b088" }}>
          {header}
        </div>
      )}
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function IconBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: color }}>
      {children}
    </span>
  );
}

/**
 * CvSheet — renders children at a fixed A4 size (794 × 1123 px @ 96dpi) so the
 * template looks pixel-identical on every device and in print. On smaller
 * viewports we scale the sheet down with `transform: scale()` to fit the
 * available width; print CSS resets the transform so PDFs are full-size.
 */
function CvSheet({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const A4_W = 794;
  const A4_H = 1123;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(Math.min(1, w / A4_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="cv-sheet-wrap w-full" style={{ height: A4_H * scale }}>
      <div
        className="cv-print-area bg-white shadow-sm border rounded-xl overflow-hidden"
        style={{
          width: A4_W,
          minHeight: A4_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CvSection({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section className="mt-3">
      <h3 className="border-b border-current/20 pb-0.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--color-primary)" }}>{h}</h3>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function BigTechChecklist({ d }: { d: Payload }) {
  const metricRe = /\b\d+(\.\d+)?\s*(%|x|k|m|ms|s|users?|requests?|qps|rps|gb|mb)\b|\b(reduced|improved|increased|decreased|saved|shipped|scaled|led|built)\b.*\b\d/i;
  const bulletsAll = d.experience.flatMap((e) => e.bullets.split("\n").map((b) => b.trim()).filter(Boolean));
  const projBullets = d.projects.map((p) => p.description).filter(Boolean);
  const hasMetrics = [...bulletsAll, ...projBullets].some((b) => metricRe.test(b));
  const skillsCount = d.skills.split(",").map((s) => s.trim()).filter(Boolean).length;

  const checks: { ok: boolean; label: string; hint?: string }[] = [
    { ok: !!d.summary && d.summary.length >= 80, label: "Professional summary (2–3 sentences)", hint: "Lead with role, focus area, and standout achievement." },
    { ok: !!d.coursework.trim(), label: "Relevant coursework", hint: "DSA, OS, Distributed Systems, DBMS, ML — signals CS fundamentals." },
    { ok: skillsCount >= 6, label: "At least 6 concrete skills", hint: "Languages + frameworks + cloud/infra + tools." },
    { ok: d.projects.length >= 2, label: "2+ substantive projects", hint: "Show scope, tech stack, and a link (GitHub / live demo)." },
    { ok: d.projects.every((p) => !!p.tech), label: "Tech stack on every project" },
    { ok: d.projects.every((p) => !!p.link), label: "Link on every project", hint: "GitHub repo or deployed URL." },
    { ok: d.experience.length >= 1, label: "At least one experience entry (internship, RA, OSS counts)" },
    { ok: d.experience.every((e) => !!e.tech), label: "Tech stack on every role" },
    { ok: hasMetrics, label: "Quantified impact (metrics: %, users, ms, x-faster…)", hint: "Rewrite bullets as: action + tech + measurable result." },
    { ok: d.coding.length >= 1, label: "Coding profile (LeetCode / Codeforces)", hint: "Include handle + link; rating optional but recommended." },
    { ok: !!d.github, label: "GitHub link in header" },
    { ok: !!d.linkedin, label: "LinkedIn link in header" },
    { ok: d.education.some((e) => !!e.gpa), label: "CGPA on education (if ≥ 3.3/4)" },
    { ok: d.certifications.length >= 1, label: "Certification or notable award", hint: "AWS, GCP, or a hackathon / ICPC placement." },
  ];

  const done = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const pct = Math.round((done / total) * 100);
  const missing = checks.filter((c) => !c.ok);

  return (
    <section className="no-print rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">Big-Tech Resume Readiness</h3>
        </div>
        <span className="text-xs font-semibold tabular-nums">{done}/{total} · {pct}%</span>
      </header>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {checks.map((c, i) => (
          <li key={i} className="flex items-start gap-2">
            {c.ok ? (
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
            )}
            <span className={c.ok ? "text-muted-foreground line-through" : ""}>
              {c.label}
              {!c.ok && c.hint && <span className="ml-1 text-muted-foreground">— {c.hint}</span>}
            </span>
          </li>
        ))}
      </ul>
      {missing.length > 0 && (
        <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-900">
          <strong>Next up:</strong> {missing.slice(0, 3).map((m) => m.label).join(" · ")}
        </p>
      )}
    </section>
  );
}

/* --- Suggestion picker --- */
type SuggestGroup = { label: string; items: string[] };

const SKILL_GROUPS: SuggestGroup[] = [
  { label: "Languages", items: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin", "Swift", "SQL", "Bash"] },
  { label: "Frontend", items: ["React", "Next.js", "TanStack Start", "Vue", "Svelte", "Tailwind CSS", "Redux", "React Native"] },
  { label: "Backend", items: ["Node.js", "Express", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "GraphQL", "gRPC", "REST APIs"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Elasticsearch", "Supabase"] },
  { label: "Cloud & DevOps", items: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "GitHub Actions", "Linux", "Nginx"] },
  { label: "CS Fundamentals", items: ["Data Structures", "Algorithms", "System Design", "OOP", "Operating Systems", "Networking", "DBMS"] },
  { label: "AI / ML / Data", items: ["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "LLMs", "RAG", "Prompt Engineering", "OpenCV"] },
  { label: "Tools", items: ["Git", "GitHub", "Jira", "Figma", "Postman", "VS Code", "Vim"] },
];

const LANGUAGE_GROUPS: SuggestGroup[] = [
  { label: "Common", items: ["English (fluent)", "English (professional)", "Bengali (native)", "Hindi (conversational)", "Urdu (conversational)", "Arabic (basic)", "French (basic)", "German (basic)", "Spanish (basic)", "Japanese (basic)", "Mandarin (basic)"] },
];

const COURSEWORK_GROUPS: SuggestGroup[] = [
  { label: "Core CSE", items: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "Database Systems", "Computer Architecture", "Discrete Mathematics", "Theory of Computation", "Compilers", "Software Engineering"] },
  { label: "Advanced", items: ["Distributed Systems", "Machine Learning", "Deep Learning", "Artificial Intelligence", "Computer Graphics", "Cryptography", "Cloud Computing", "Information Security", "Parallel Computing", "Human-Computer Interaction"] },
];

function appendCsv(current: string, token: string): string {
  const existing = current.split(",").map((s) => s.trim()).filter(Boolean);
  if (existing.some((e) => e.toLowerCase() === token.toLowerCase())) return current;
  return [...existing, token].join(", ");
}

function SuggestionPicker({ label, groups, value, onAdd }: { label: string; groups: SuggestGroup[]; value: string; onAdd: (t: string) => void }) {
  const selected = new Set(value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
  return (
    <div className="rounded-md border border-dashed bg-muted/30 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label} — click to add</p>
      <div className="mt-2 space-y-2">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="text-[10px] font-medium text-muted-foreground/80">{g.label}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {g.items.map((it) => {
                const isOn = selected.has(it.toLowerCase());
                return (
                  <button
                    key={it}
                    type="button"
                    onClick={() => onAdd(it)}
                    disabled={isOn}
                    className={`rounded-full border px-2 py-0.5 text-[11px] transition ${isOn ? "border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default" : "border-border bg-white hover:border-primary hover:text-primary"}`}
                  >
                    {isOn ? "✓ " : "+ "}{it}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

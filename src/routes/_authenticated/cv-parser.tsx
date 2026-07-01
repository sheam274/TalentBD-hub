import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listJobsPublic } from "@/lib/jobs.functions";
import { analyzeCvForJob } from "@/lib/cv-ai.functions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2, XCircle, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cv-parser")({
  head: () => ({ meta: [{ title: "ATS CV Parser — Learn & Earn" }, { name: "description", content: "Parse a resume to find engineering sector matches." }] }),
  component: Parser,
});

const SECTOR_KEYWORDS: Record<string, string[]> = {
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
  "3D Animation": ["blender", "maya", "3ds max", "rigging", "modeling", "animation"],
};

function score(text: string) {
  const lc = text.toLowerCase();
  return Object.entries(SECTOR_KEYWORDS).map(([sector, kws]) => {
    const hits = kws.filter((k) => lc.includes(k));
    return { sector, score: Math.round((hits.length / kws.length) * 100), hits };
  }).sort((a, b) => b.score - a.score);
}

function Parser() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<ReturnType<typeof score>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const listJobs = useServerFn(listJobsPublic);
  const jobsQ = useQuery({ queryKey: ["parser-jobs"], queryFn: () => listJobs(), staleTime: 60_000 });
  const jobs = jobsQ.data ?? [];
  const selectedJob = useMemo(() => jobs.find((j: any) => j.id === selectedJobId), [jobs, selectedJobId]);

  const analyzeFn = useServerFn(analyzeCvForJob);
  const analyze = useMutation({
    mutationFn: () => analyzeFn({ data: {
      cvText: text,
      jobTitle: selectedJob?.title ?? "",
      jobCompany: selectedJob?.company ?? null,
      jobDescription: [selectedJob?.description, (selectedJob?.requirements as string[] | null)?.join("\n")].filter(Boolean).join("\n\n") || null,
    } }),
  });
  const analysis = analyze.data?.ok ? analyze.data.analysis : null;
  const analyzeError = analyze.data && !analyze.data.ok ? analyze.data.error : null;

  async function onFile(f: File) {
    const t = await f.text();
    setText(t);
    setResults(score(t));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 page-enter">
      <h1 className="text-3xl font-bold">ATS CV Parser</h1>
      <p className="mt-1 text-muted-foreground">Drop a .txt resume or paste text — we'll match it to engineering sectors.</p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
        className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-8 text-center"
      >
        <p className="text-sm text-muted-foreground">Drag &amp; drop a .txt file here</p>
        <p className="my-2 text-xs text-muted-foreground">or</p>
        <label className="cursor-pointer rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
          Choose file
          <input type="file" accept=".txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
        </label>
      </div>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setResults(score(e.target.value)); }}
        placeholder="…or paste resume text here"
        rows={8}
        className="mt-4 w-full rounded-md border bg-white px-3 py-2 text-sm"
      />

      <div className="mt-6 rounded-xl border bg-white p-5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-[var(--color-primary)]" />
          <h2 className="text-lg font-semibold">Analyze for a specific job</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Pick a live job and let AI score your CV against it in real time.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Select value={selectedJobId} onValueChange={(v) => { setSelectedJobId(v); analyze.reset(); }}>
            <SelectTrigger aria-label="Choose interested job" className="bg-white">
              <SelectValue placeholder={jobsQ.isLoading ? "Loading jobs…" : "Choose an interested job"} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {jobs.map((j: any) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}{j.company ? ` · ${j.company}` : ""}{j.location ? ` · ${j.location}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => analyze.mutate()}
            disabled={!text.trim() || !selectedJobId || analyze.isPending}
            className="gap-2"
          >
            {analyze.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {analyze.isPending ? "Analyzing…" : "Analyze CV"}
          </Button>
        </div>
        {analyzeError && <p className="mt-3 text-sm text-rose-600">{analyzeError}</p>}
        {analyze.isError && <p className="mt-3 text-sm text-rose-600">Analysis failed. Try again.</p>}

        {analysis && (
          <div className="mt-5 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard label="Job match" value={analysis.matchScore} />
              <ScoreCard label="ATS parse quality" value={analysis.atsScore} />
            </div>
            {analysis.verdict && (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm"><span className="font-semibold">Verdict:</span> {analysis.verdict}</div>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              <KeywordList title="Matched keywords" items={analysis.matchedKeywords} tone="good" />
              <KeywordList title="Missing keywords" items={analysis.missingKeywords} tone="bad" />
            </div>
            <BulletList title="Strengths" items={analysis.strengths} icon="good" />
            <BulletList title="Gaps" items={analysis.gaps} icon="bad" />
            <BulletList title="Suggested improvements" items={analysis.improvements} />
            {analysis.tailoredSummary && (
              <div className="rounded-lg border bg-white p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tailored summary</div>
                <p className="mt-1 text-sm">{analysis.tailoredSummary}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Sector matches</h2>
          <div className="mt-3 space-y-2">
            {results.slice(0, 8).map((r) => (
              <div key={r.sector} className="rounded-md border bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.sector}</span>
                  <span className="text-sm font-semibold">{r.score}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded bg-muted">
                  <div className="h-full" style={{ width: `${r.score}%`, background: "var(--color-accent)" }} />
                </div>
                {r.hits.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Matched: {r.hits.join(", ")}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const tone = value >= 75 ? "emerald" : value >= 50 ? "amber" : "rose";
  const bg = tone === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : tone === "amber" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-rose-50 border-rose-200 text-rose-700";
  return (
    <div className={`rounded-lg border p-3 ${bg}`}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}%</div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded bg-white/60">
        <div className="h-full" style={{ width: `${value}%`, background: "currentColor", opacity: 0.7 }} />
      </div>
    </div>
  );
}

function KeywordList({ title, items, tone }: { title: string; items: string[]; tone: "good" | "bad" }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
        {items.map((k) => (
          <span key={k} className={`rounded-full px-2 py-0.5 text-xs ${tone === "good" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{k}</span>
        ))}
      </div>
    </div>
  );
}

function BulletList({ title, items, icon }: { title: string; items: string[]; icon?: "good" | "bad" }) {
  if (!items.length) return null;
  const Icon = icon === "good" ? CheckCircle2 : icon === "bad" ? XCircle : Sparkles;
  const color = icon === "good" ? "text-emerald-600" : icon === "bad" ? "text-rose-600" : "text-[var(--color-primary)]";
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-2 space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { startInterview } from "@/lib/interview.functions";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const search = z.object({ mode: z.enum(["text", "voice", "video", "mcq"]).optional() });

export const Route = createFileRoute("/_authenticated/interview/setup")({
  head: () => ({ meta: [{ title: "Set up your interview" }] }),
  validateSearch: (s) => search.parse(s),
  component: SetupPage,
});

const DISCIPLINES = ["CSE", "EEE", "Civil", "Mechanical", "Business", "Other"];
const ROLES = ["Software Engineer", "Frontend Engineer", "Backend Engineer", "Data Analyst", "ML Engineer", "DevOps Engineer", "Electrical Engineer", "Civil Engineer", "Product Manager"];

function SetupPage() {
  const { mode: initialMode } = Route.useSearch();
  const nav = useNavigate();
  const startFn = useServerFn(startInterview);
  const [discipline, setDiscipline] = useState("CSE");
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [mode, setMode] = useState<"text" | "voice" | "video" | "mcq">(initialMode ?? "text");
  const [count, setCount] = useState(5);
  const [err, setErr] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: () => startFn({ data: { discipline, role, difficulty, mode, count } }),
    onSuccess: ({ sessionId }) => nav({ to: "/interview/session/$sessionId", params: { sessionId } }),
    onError: (e: any) => setErr(e?.message ?? "Failed to start"),
  });

  return (
    <div className="page-enter mx-auto max-w-3xl px-4 py-6 sm:py-10 md:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Set up your interview</h1>
      <p className="mt-1 text-muted-foreground">AI will generate questions tailored to your selection.</p>

      <div className="mt-6 space-y-5 rounded-2xl border bg-white p-4 sm:p-6 shadow-sm">
        <Field label="Discipline">
          <select className="w-full rounded-md border px-3 py-2" value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
            {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Role">
          <input list="roles" className="w-full rounded-md border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Software Engineer" />
          <datalist id="roles">{ROLES.map((r) => <option key={r} value={r} />)}</datalist>
        </Field>

        <Field label="Difficulty">
          <div className="flex flex-wrap gap-2">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDifficulty(d)} className={`flex-1 sm:flex-none rounded-md border px-4 py-2 text-sm capitalize ${difficulty === d ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`}>{d}</button>
            ))}
          </div>
        </Field>

        <Field label="Mode">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([
              { id: "text", label: "Text Q&A" },
              { id: "voice", label: "Voice" },
              { id: "video", label: "Live Video" },
              { id: "mcq", label: "MCQ" },
            ] as const).map((o) => (
              <button key={o.id} type="button" onClick={() => setMode(o.id)} className={`rounded-md border px-3 py-2 text-sm ${mode === o.id ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`}>{o.label}</button>
            ))}
          </div>
        </Field>

        <Field label={`Number of questions: ${count}`}>
          <input type="range" min={3} max={15} value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-full" />
        </Field>

        {err && <div className="rounded-md border border-destructive/30 bg-danger-soft p-3 text-sm text-destructive">{err}</div>}

        <button
          onClick={() => { setErr(null); m.mutate(); }}
          disabled={m.isPending}
          className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-semibold disabled:opacity-60"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
        >
          {m.isPending && <Loader2 className="size-4 animate-spin" />}
          {m.isPending ? "Generating questions…" : "Start interview"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
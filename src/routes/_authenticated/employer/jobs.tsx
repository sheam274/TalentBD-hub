import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerListJobs, employerUpsertJob, employerDeleteJob } from "@/lib/employer.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employer/jobs")({
  head: () => ({ meta: [{ title: "My jobs" }] }),
  component: Page,
});

const empty = {
  id: undefined as string | undefined,
  job_title: "",
  description: "",
  is_remote: false,
  is_live: true,
  salary_range: "",
  requirements: [] as string[],
  discipline: "",
  category: "",
  location: "",
  experience_level: "",
  job_type: "Full-time",
  application_deadline: "",
};

function Page() {
  const listFn = useServerFn(employerListJobs);
  const upFn = useServerFn(employerUpsertJob);
  const delFn = useServerFn(employerDeleteJob);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["emp-jobs"], queryFn: () => listFn() });
  const [form, setForm] = useState<any>(null);

  const save = useMutation({
    mutationFn: () => {
      const reqs = typeof form.requirements === "string"
        ? form.requirements.split(",").map((s: string) => s.trim()).filter(Boolean)
        : form.requirements;
      return upFn({ data: { ...form, requirements: reqs } });
    },
    onSuccess: () => { toast.success("Saved"); setForm(null); qc.invalidateQueries({ queryKey: ["emp-jobs"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["emp-jobs"] }); },
  });

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My jobs</h1>
        <button onClick={() => setForm({ ...empty })} className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">+ New job</button>
      </header>
      <div className="mt-5 space-y-2">
        {(q.data ?? []).map((j: any) => (
          <div key={j.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white p-3">
            <div>
              <div className="font-semibold">{j.job_title}</div>
              <div className="text-xs text-muted-foreground">{j.location ?? (j.is_remote ? "Remote" : "—")} · {j.is_live ? "Live" : "Draft"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setForm({ ...j, requirements: (j.requirements ?? []).join(", ") })} className="rounded-md border px-3 py-1.5 text-xs">Edit</button>
              <button onClick={() => remove.mutate(j.id)} className="rounded-md border px-3 py-1.5 text-xs">Delete</button>
            </div>
          </div>
        ))}
        {(q.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No jobs posted yet.</p>}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setForm(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">{form.id ? "Edit job" : "New job"}</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              <In label="Title"><input value={form.job_title ?? ""} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="inp" /></In>
              <In label="Location"><input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="inp" /></In>
              <In label="Discipline"><input value={form.discipline ?? ""} onChange={(e) => setForm({ ...form, discipline: e.target.value })} className="inp" /></In>
              <In label="Category"><input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className="inp" /></In>
              <In label="Experience"><input value={form.experience_level ?? ""} onChange={(e) => setForm({ ...form, experience_level: e.target.value })} className="inp" /></In>
              <In label="Job type"><input value={form.job_type ?? ""} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="inp" /></In>
              <In label="Salary range"><input value={form.salary_range ?? ""} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} className="inp" /></In>
              <In label="Deadline"><input type="date" value={form.application_deadline ?? ""} onChange={(e) => setForm({ ...form, application_deadline: e.target.value })} className="inp" /></In>
            </div>
            <In label="Requirements (comma-separated)">
              <input value={form.requirements ?? ""} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="inp" />
            </In>
            <In label="Description">
              <textarea rows={6} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="inp" />
            </In>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_remote} onChange={(e) => setForm({ ...form, is_remote: e.target.checked })} /> Remote</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.is_live} onChange={(e) => setForm({ ...form, is_live: e.target.checked })} /> Live</label>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => save.mutate()} disabled={!form.job_title} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
              <button onClick={() => setForm(null)} className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.inp{width:100%;border:1px solid hsl(var(--border));border-radius:.375rem;padding:.5rem .75rem;font-size:.875rem}`}</style>
    </div>
  );
}

function In({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyCompany, updateMyCompany, createCompanyForMe } from "@/lib/employer.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employer/company")({
  head: () => ({ meta: [{ title: "Company profile" }] }),
  component: Page,
});

function Page() {
  const getFn = useServerFn(getMyCompany);
  const updFn = useServerFn(updateMyCompany);
  const createFn = useServerFn(createCompanyForMe);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["my-company"], queryFn: () => getFn() });
  const [form, setForm] = useState<any>({});
  const [newCo, setNewCo] = useState({ name: "", website: "" });

  useEffect(() => {
    if (q.data) {
      const c: any = (q.data as any).company ?? {};
      setForm({
        name: c.name ?? "",
        website: c.website ?? "",
        logo_url: c.logo_url ?? "",
        industry: c.industry ?? "",
        location: c.location ?? "",
        description: c.description ?? "",
      });
    }
  }, [q.data]);

  const update = useMutation({
    mutationFn: () => updFn({ data: form }),
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["my-company"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const create = useMutation({
    mutationFn: () => createFn({ data: newCo }),
    onSuccess: () => { toast.success("Company created"); qc.invalidateQueries({ queryKey: ["my-company"] }); qc.invalidateQueries({ queryKey: ["me"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (q.isLoading) return <p>Loading…</p>;

  if (!q.data) {
    return (
      <div className="max-w-lg rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Create your company</h2>
        <div className="mt-3 space-y-2">
          <input value={newCo.name} onChange={(e) => setNewCo({ ...newCo, name: e.target.value })} placeholder="Company name" className="w-full rounded-md border px-3 py-2 text-sm" />
          <input value={newCo.website} onChange={(e) => setNewCo({ ...newCo, website: e.target.value })} placeholder="https://example.com" className="w-full rounded-md border px-3 py-2 text-sm" />
          <button onClick={() => create.mutate()} disabled={!newCo.name} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-xl border bg-white p-5">
      <h2 className="text-lg font-semibold">Company profile</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Name"><input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></Field>
        <Field label="Website"><input value={form.website ?? ""} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></Field>
        <Field label="Logo URL"><input value={form.logo_url ?? ""} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></Field>
        <Field label="Industry"><input value={form.industry ?? ""} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></Field>
        <Field label="Location"><input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" /></Field>
      </div>
      <Field label="About the company">
        <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full rounded-md border px-3 py-2 text-sm" />
      </Field>
      <button onClick={() => update.mutate()} className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save changes</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
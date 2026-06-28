import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { adminDeleteCompany, adminListCompanies, adminUpsertCompany } from "@/lib/jobs.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/companies")({
  head: () => ({ meta: [{ title: "Admin · Companies — TalentBD" }] }),
  component: AdminCompanies,
});

const empty = { name: "", slug: "", logo_url: "", website: "", industry: "", location: "", description: "" };

function AdminCompanies() {
  const listFn = useServerFn(adminListCompanies);
  const upFn = useServerFn(adminUpsertCompany);
  const delFn = useServerFn(adminDeleteCompany);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-companies"], queryFn: () => listFn() });
  const [form, setForm] = useState<any>(empty);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const save = useMutation({
    mutationFn: () => upFn({ data: form }),
    onSuccess: () => { toast.success("Saved"); setForm(empty); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const companies = (q.data ?? []) as any[];
  const industries = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.industry && s.add(c.industry));
    return Array.from(s).sort();
  }, [companies]);
  const locations = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.location && s.add(c.location));
    return Array.from(s).sort();
  }, [companies]);

  const filtered = companies.filter((c) => {
    if (industryFilter !== "all" && c.industry !== industryFilter) return false;
    if (locationFilter !== "all" && c.location !== locationFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (![c.name, c.slug, c.industry, c.location].some((v) => (v ?? "").toLowerCase().includes(s))) return false;
    }
    return true;
  });

  const totalWithWebsite = companies.filter((c) => c.website).length;
  const totalWithLogo = companies.filter((c) => c.logo_url).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total companies", companies.length],
          ["Industries", industries.length],
          ["With website", totalWithWebsite],
          ["With logo", totalWithLogo],
        ].map(([label, value]) => (
          <div key={label as string} className="glass rounded-xl p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value as number}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, slug, industry, location…"
              className="flex-1 min-w-[200px] rounded-md border px-3 py-1.5 text-sm"
            />
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm">
              <option value="all">All industries</option>
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm">
              <option value="all">All locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground glass rounded-xl p-6 text-center">No companies match these filters.</p>
          ) : (
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Company</th>
                    <th className="px-3 py-2">Industry</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Website</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c: any) => (
                    <tr key={c.id} className="border-t border-border/40">
                      <td className="px-3 py-2">
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">/{c.slug}</div>
                      </td>
                      <td className="px-3 py-2">{c.industry ?? "—"}</td>
                      <td className="px-3 py-2">{c.location ?? "—"}</td>
                      <td className="px-3 py-2">
                        {c.website ? <a href={c.website} target="_blank" rel="noreferrer" className="text-primary underline">Visit</a> : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => setForm(c)} className="rounded-md border px-3 py-1 text-xs mr-2">Edit</button>
                        <button onClick={() => { if (confirm(`Delete ${c.name}?`)) del.mutate(c.id); }} className="rounded-md border px-3 py-1 text-xs text-destructive">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      <aside className="glass rounded-xl p-4 h-fit">
        <h3 className="font-semibold">{form.id ? "Edit company" : "New company"}</h3>
        <div className="mt-3 space-y-2 text-sm">
          {[
            ["name", "Name"], ["slug", "Slug (lowercase-dashes)"], ["industry", "Industry"],
            ["location", "Location"], ["logo_url", "Logo URL"], ["website", "Website URL"],
          ].map(([k, label]) => (
            <input key={k} placeholder={label} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full rounded-md border px-3 py-1.5" />
          ))}
          <textarea placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border px-3 py-1.5" rows={3} />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => save.mutate()} className="rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Save</button>
          {form.id && <button onClick={() => setForm(empty)} className="rounded-md border px-3 py-1.5 text-sm">New</button>}
        </div>
      </aside>
    </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListEmployers } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/employers")({
  head: () => ({ meta: [{ title: "Admin — Employers" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(adminListEmployers);
  const q = useQuery({ queryKey: ["admin-employers"], queryFn: () => fn() });
  if (q.isLoading) return <p>Loading…</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold">Employers</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase"><tr><th className="p-3">Name</th><th className="p-3">Companies</th></tr></thead>
          <tbody>
            {(q.data ?? []).map((u: any) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name ?? "—"}</td>
                <td className="p-3">{u.companies?.map((c: any) => c.company?.name).filter(Boolean).join(", ") || "—"}</td>
              </tr>
            ))}
            {(q.data ?? []).length === 0 && <tr><td className="p-3 text-muted-foreground" colSpan={2}>No employer accounts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
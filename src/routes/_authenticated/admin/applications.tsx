import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListApplications, adminDeleteRow } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({ meta: [{ title: "Admin — Applications" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(adminListApplications);
  const delFn = useServerFn(adminDeleteRow);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-apps"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (id: string) => delFn({ data: { table: "job_applications", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-apps"] }); },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Applications</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase"><tr><th className="p-3">Job</th><th className="p-3">Applicant</th><th className="p-3">Stage</th><th className="p-3">Applied</th><th className="p-3"></th></tr></thead>
          <tbody>
            {(q.data ?? []).map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.job?.job_title} <span className="text-xs text-muted-foreground">· {a.job?.company}</span></td>
                <td className="p-3">{a.applicant?.name ?? "—"}</td>
                <td className="p-3"><span className="rounded bg-muted px-2 py-0.5 text-xs">{a.stage ?? a.status}</span></td>
                <td className="p-3 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="p-3"><button onClick={() => m.mutate(a.id)} className="rounded-md border px-2 py-1 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
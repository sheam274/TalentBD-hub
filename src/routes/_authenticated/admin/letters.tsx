import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListLetters, adminDeleteRow } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/letters")({
  head: () => ({ meta: [{ title: "Admin — Appointment letters" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(adminListLetters);
  const delFn = useServerFn(adminDeleteRow);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-letters"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (id: string) => delFn({ data: { table: "appointment_letters", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-letters"] }); },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Appointment letters</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase"><tr><th className="p-3">Position</th><th className="p-3">Job</th><th className="p-3">Issued</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody>
            {(q.data ?? []).map((l: any) => (
              <tr key={l.id} className="border-t">
                <td className="p-3"><Link to="/appointment/$letterId" params={{ letterId: l.id }} className="text-primary underline">{l.position}</Link></td>
                <td className="p-3">{l.application?.job?.job_title}</td>
                <td className="p-3 text-xs">{new Date(l.issued_at).toLocaleDateString()}</td>
                <td className="p-3 text-xs">{l.accepted_at ? "Accepted" : "Pending"}</td>
                <td className="p-3"><button onClick={() => m.mutate(l.id)} className="rounded-md border px-2 py-1 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
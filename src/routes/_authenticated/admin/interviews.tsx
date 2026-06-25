import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListInvitations, adminDeleteRow } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/interviews")({
  head: () => ({ meta: [{ title: "Admin — Interviews" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(adminListInvitations);
  const delFn = useServerFn(adminDeleteRow);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-inv"], queryFn: () => fn() });
  const m = useMutation({
    mutationFn: (id: string) => delFn({ data: { table: "interview_invitations", id } }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-inv"] }); },
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Interview invitations</h1>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase"><tr><th className="p-3">When</th><th className="p-3">Job</th><th className="p-3">Provider</th><th className="p-3">Link</th><th className="p-3"></th></tr></thead>
          <tbody>
            {(q.data ?? []).map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{new Date(i.scheduled_at).toLocaleString()}</td>
                <td className="p-3">{i.application?.job?.job_title}</td>
                <td className="p-3">{i.provider ?? "—"}</td>
                <td className="p-3 truncate max-w-xs"><a className="text-primary underline" href={i.meeting_url} target="_blank" rel="noreferrer">link</a></td>
                <td className="p-3"><button onClick={() => m.mutate(i.id)} className="rounded-md border px-2 py-1 text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
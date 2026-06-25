import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerListApplicants, updateApplicationStage } from "@/lib/employer.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employer/applicants")({
  head: () => ({ meta: [{ title: "Applicants" }] }),
  component: Page,
});

const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;

function Page() {
  const fn = useServerFn(employerListApplicants);
  const stageFn = useServerFn(updateApplicationStage);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["emp-apps"], queryFn: () => fn({ data: {} }) });
  const m = useMutation({
    mutationFn: (p: { id: string; stage: any }) => stageFn({ data: p }),
    onSuccess: () => { toast.success("Stage updated"); qc.invalidateQueries({ queryKey: ["emp-apps"] }); },
  });

  const list = q.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Applicants</h1>
      <p className="text-sm text-muted-foreground">Move applicants through the hiring pipeline.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage) => (
          <div key={stage} className="rounded-xl border bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold capitalize">{stage}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{list.filter((a: any) => (a.stage ?? a.status) === stage).length}</span>
            </div>
            <div className="space-y-2">
              {list.filter((a: any) => (a.stage ?? a.status) === stage).map((a: any) => (
                <div key={a.id} className="rounded-md border p-2 text-xs">
                  <Link to="/employer/applicants/$appId" params={{ appId: a.id }} className="font-semibold hover:underline">{a.applicant?.name ?? "Candidate"}</Link>
                  <div className="text-[11px] text-muted-foreground">{a.job?.job_title}</div>
                  <select
                    value={a.stage ?? a.status}
                    onChange={(e) => m.mutate({ id: a.id, stage: e.target.value })}
                    className="mt-1 w-full rounded border px-1 py-0.5 text-[11px]"
                  >
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { applyToJob, getJobPublic, getMyApplicationForJob } from "@/lib/jobs.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowLeft, Building2, MapPin, Briefcase, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId/apply")({
  head: () => ({
    meta: [
      { title: "Review & apply — TalentBD" },
      { name: "description", content: "Review the job and choose how to apply." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { jobId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const getJobFn = useServerFn(getJobPublic);
  const getAppFn = useServerFn(getMyApplicationForJob);
  const applyFn = useServerFn(applyToJob);

  const jobQ = useQuery({ queryKey: ["job", jobId], queryFn: () => getJobFn({ data: { id: jobId } }) });
  const appQ = useQuery({
    queryKey: ["my-app", jobId],
    queryFn: () => getAppFn({ data: { jobId } }),
    enabled: !!user,
  });

  const [cover, setCover] = useState("");
  const [method, setMethod] = useState<"internal" | "external">("internal");

  const apply = useMutation({
    mutationFn: (vars: { method: "internal" | "external" }) =>
      applyFn({ data: { jobId, coverNote: cover, method: vars.method } }),
    onSuccess: (_res, vars) => {
      toast.success("Application submitted");
      qc.invalidateQueries({ queryKey: ["my-app", jobId] });
      qc.invalidateQueries({ queryKey: ["my-apps"] });
      if (vars.method === "external" && externalUrl) {
        window.open(externalUrl, "_blank", "noopener,noreferrer");
      }
      navigate({ to: "/my-applications" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (jobQ.isLoading) return <p className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">Loading…</p>;
  const j = jobQ.data;
  if (!j) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
    </div>
  );

  const alreadyApplied = !!appQ.data;
  const externalUrl: string | null = (j as any).external_url ?? (j as any).apply_url ?? null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 page-enter">
      <Link to="/jobs/$jobId" params={{ jobId }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="size-4" /> Back to job details
      </Link>

      <div className="mt-4 glass rounded-2xl p-6">
        <h1 className="text-2xl font-bold">Review & apply</h1>
        <p className="mt-1 text-sm text-muted-foreground">Confirm the role and choose how you'd like to apply.</p>

        <div className="mt-5 rounded-xl border p-4">
          <h2 className="text-lg font-semibold">{j.job_title}</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Building2 className="size-4" /> {j.company}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {j.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{j.location}</span>}
            {j.is_remote && <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5">Remote</span>}
            {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{j.job_type}</span>}
            {j.salary_range && <span style={{ color: "var(--color-primary)" }} className="font-medium">{j.salary_range}</span>}
          </div>
        </div>

        {alreadyApplied ? (
          <div className="mt-5 rounded-xl border bg-emerald-50 p-4 text-sm">
            <p className="inline-flex items-center gap-2 font-medium text-emerald-800">
              <CheckCircle2 className="size-4" /> You've already applied to this job ({appQ.data!.status}).
            </p>
            <Link to="/my-applications" className="mt-2 inline-block underline text-emerald-900">Track in dashboard →</Link>
          </div>
        ) : !user ? (
          <div className="mt-5 rounded-xl border p-4 text-sm">
            <p>You need an account to apply.</p>
            <Link to="/auth" className="mt-2 inline-block rounded-md px-4 py-2 text-white" style={{ background: "var(--color-primary)" }}>Sign in to continue</Link>
          </div>
        ) : (
          <>
            <h3 className="mt-6 text-sm font-semibold uppercase text-muted-foreground">Choose how to apply</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setMethod("internal")}
                className={`text-left rounded-xl border p-4 transition ${method === "internal" ? "border-primary ring-2 ring-primary/30" : "hover:bg-white/60"}`}
              >
                <div className="flex items-center gap-2 font-semibold"><FileText className="size-4" /> Apply through TalentBD</div>
                <p className="mt-1 text-xs text-muted-foreground">Send your profile and an optional note. Track status in your dashboard.</p>
              </button>
              <button
                type="button"
                onClick={() => setMethod("external")}
                disabled={!externalUrl}
                className={`text-left rounded-xl border p-4 transition disabled:opacity-50 disabled:cursor-not-allowed ${method === "external" ? "border-primary ring-2 ring-primary/30" : "hover:bg-white/60"}`}
              >
                <div className="flex items-center gap-2 font-semibold"><ExternalLink className="size-4" /> Apply on company site</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {externalUrl ? "Open the employer's application page in a new tab." : "Not available for this job."}
                </p>
              </button>
            </div>

            {method === "internal" ? (
              <div className="mt-5">
                <label className="text-sm font-medium">Cover note (optional)</label>
                <textarea
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Why you're a great fit…"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Link to="/jobs/$jobId" params={{ jobId }} className="rounded-md border px-4 py-2 text-sm">Cancel</Link>
                  <button
                    onClick={() => apply.mutate({ method: "internal" })}
                    disabled={apply.isPending}
                    className="rounded-md px-4 py-2 text-sm font-semibold text-white"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {apply.isPending ? "Submitting…" : "Submit application"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex justify-end gap-2">
                <Link to="/jobs/$jobId" params={{ jobId }} className="rounded-md border px-4 py-2 text-sm">Cancel</Link>
                <button
                  onClick={() => apply.mutate({ method: "external" })}
                  disabled={apply.isPending || !externalUrl}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white inline-flex items-center gap-1 disabled:opacity-50"
                  style={{ background: "var(--color-primary)" }}
                >
                  {apply.isPending ? "Recording…" : <>Continue on company site <ExternalLink className="size-4" /></>}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
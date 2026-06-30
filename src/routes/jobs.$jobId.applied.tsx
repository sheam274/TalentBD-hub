import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getJobPublic, getMyApplicationForJob } from "@/lib/jobs.functions";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  FileText,
  Calendar,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId/applied")({
  head: () => ({
    meta: [
      { title: "Application submitted — TalentBD" },
      { name: "description", content: "Your application and CV were shared with the company." },
    ],
  }),
  component: AppliedPage,
});

function AppliedPage() {
  const { jobId } = Route.useParams();
  const { user } = useAuth();

  const getJobFn = useServerFn(getJobPublic);
  const getAppFn = useServerFn(getMyApplicationForJob);

  const jobQ = useQuery({ queryKey: ["job", jobId], queryFn: () => getJobFn({ data: { id: jobId } }) });
  const appQ = useQuery({
    queryKey: ["my-app", jobId],
    queryFn: () => getAppFn({ data: { jobId } }),
    enabled: !!user,
  });

  if (jobQ.isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  const j = jobQ.data;
  if (!j) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Job not found</h1>
        <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
      </div>
    );
  }

  const externalUrl: string | null = (j as any).external_url ?? (j as any).apply_url ?? null;
  const appliedAt = appQ.data?.created_at ? new Date(appQ.data.created_at) : new Date();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 page-enter">
      <Link
        to="/jobs/$jobId"
        params={{ jobId }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to job details
      </Link>

      {/* Success banner */}
      <div className="mt-4 glass rounded-2xl p-6 border border-success/30 bg-success-soft">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="size-8 shrink-0 text-success" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-success">Application submitted!</h1>
            <p className="mt-1 text-sm text-foreground/80">
              Your profile and CV have been sent to <span className="font-semibold">{j.company}</span>. They'll
              review and reach out via your dashboard or email.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Submitted on {appliedAt.toLocaleDateString(undefined, { dateStyle: "long" })} at{" "}
              {appliedAt.toLocaleTimeString(undefined, { timeStyle: "short" })}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/my-applications"
            className="rounded-md px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--color-primary)" }}
          >
            Track in dashboard
          </Link>
          <Link to="/jobs" className="rounded-md border px-4 py-2 text-sm font-semibold">
            Browse more jobs
          </Link>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm font-semibold"
            >
              Open company page <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>

      {/* Full job details */}
      <div className="mt-6 glass rounded-2xl p-6">
        <h2 className="text-xl font-bold">{j.job_title}</h2>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Building2 className="size-4" /> {j.company}
        </p>

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {j.location && (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {j.location}
              {j.is_remote && (
                <span className="rounded badge-success px-2 py-0.5 text-xs">Remote</span>
              )}
            </span>
          )}
          {j.job_type && (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Briefcase className="size-4" /> {j.job_type}
            </span>
          )}
          {j.salary_range && (
            <span className="inline-flex items-center gap-2 font-medium" style={{ color: "var(--color-primary)" }}>
              <DollarSign className="size-4" /> {j.salary_range}
            </span>
          )}
          {(j as any).application_deadline && (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" /> Apply by{" "}
              {new Date((j as any).application_deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {j.description && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Job description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{j.description}</p>
          </div>
        )}

        {Array.isArray((j as any).requirements) && (j as any).requirements.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">Requirements</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {(j as any).requirements.map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray((j as any).tags) && (j as any).tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(j as any).tags.map((t: string) => (
              <span key={t} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* What was shared */}
      <div className="mt-6 glass rounded-2xl p-6">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground">
          <FileText className="size-4" /> What was shared with {j.company}
        </h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="inline-flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 text-success" /> Your TalentBD profile (name, contact, skills)
          </li>
          <li className="inline-flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 text-success" /> Your latest CV from the CV builder
          </li>
          {appQ.data?.cover_note && (
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 text-success" /> Your cover note
            </li>
          )}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Need to update your CV?{" "}
          <Link to="/cv-builder" className="underline">
            Edit in CV Builder
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
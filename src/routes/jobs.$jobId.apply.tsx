import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { applyToJob, getJobPublic, getMyApplicationForJob } from "@/lib/jobs.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { ArrowLeft, Building2, MapPin, Briefcase, ExternalLink, FileText, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function trackAnalytics(event: string, detail: Record<string, unknown>) {
  try {
    if (typeof window === "undefined") return;
    const payload = { event, ...detail, timestamp: new Date().toISOString() };
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent(`analytics:${event}`, { detail: payload }));
  } catch {
    /* analytics must never break the flow */
  }
}

const MIN_COVER = 20;
const MAX_COVER = 2000;

const internalSchema = z.object({
  method: z.literal("internal"),
  coverNote: z
    .string()
    .trim()
    .min(MIN_COVER, `Cover note must be at least ${MIN_COVER} characters`)
    .max(MAX_COVER, `Cover note must be under ${MAX_COVER} characters`),
});

const externalSchema = z.object({
  method: z.literal("external"),
  externalUrl: z.string().url("This job has no valid external link"),
  coverNote: z.string().trim().max(MAX_COVER, `Cover note must be under ${MAX_COVER} characters`).optional(),
});

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

  const storageKey = `talentbd:apply-draft:${jobId}`;
  const [cover, setCover] = useState("");
  const [method, setMethod] = useState<"internal" | "external">("internal");
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMethod, setSuccessMethod] = useState<"internal" | "external" | null>(null);
  const [pendingMethod, setPendingMethod] = useState<"internal" | "external" | null>(null);
  const hydrated = useRef(false);

  // Load draft once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { cover?: string; method?: "internal" | "external" };
        if (typeof saved.cover === "string") setCover(saved.cover);
        if (saved.method === "internal" || saved.method === "external") setMethod(saved.method);
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, [storageKey]);

  // Persist draft on change (after hydration)
  useEffect(() => {
    if (typeof window === "undefined" || !hydrated.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ cover, method }));
    } catch {
      /* ignore quota */
    }
  }, [cover, method, storageKey]);

  const apply = useMutation({
    mutationFn: (vars: { method: "internal" | "external" }) =>
      applyFn({ data: { jobId, coverNote: cover.trim(), method: vars.method } }),
    onSuccess: (_res, vars) => {
      toast.success("Application submitted");
      try {
        if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
      qc.invalidateQueries({ queryKey: ["my-app", jobId] });
      qc.invalidateQueries({ queryKey: ["my-apps"] });
      const job = jobQ.data;
      const baseDetail = {
        jobId,
        jobTitle: job?.job_title,
        company: job?.company,
        method: vars.method,
        isRemote: !!job?.is_remote,
      };
      trackAnalytics("job_apply_success", baseDetail);
      trackAnalytics("job_apply_success_dialog_opened", baseDetail);
      setConfirmOpen(false);
      setSuccessMethod(vars.method);
      setSuccessOpen(true);
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (jobQ.isLoading) return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="sr-only">Loading application form</h1>
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
  const j = jobQ.data;
  if (!j) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Job not found</h1>
      <Link to="/jobs" className="mt-4 inline-block underline">Back to jobs</Link>
    </div>
  );

  const alreadyApplied = !!appQ.data;
  const externalUrl: string | null = (j as any).external_url ?? (j as any).apply_url ?? null;

  const submit = (chosen: "internal" | "external") => {
    setError(null);
    const parsed =
      chosen === "internal"
        ? internalSchema.safeParse({ method: chosen, coverNote: cover })
        : externalSchema.safeParse({ method: chosen, externalUrl, coverNote: cover });
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Invalid input";
      setError(msg);
      toast.error(msg);
      return;
    }
    setPendingMethod(chosen);
    setConfirmOpen(true);
  };

  const coverLen = cover.trim().length;
  const coverTooShort = method === "internal" && coverLen > 0 && coverLen < MIN_COVER;
  const coverTooLong = coverLen > MAX_COVER;

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
            {j.is_remote && <span className="rounded badge-success px-2 py-0.5">Remote</span>}
            {j.job_type && <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{j.job_type}</span>}
            {j.salary_range && <span style={{ color: "var(--color-primary)" }} className="font-medium">{j.salary_range}</span>}
          </div>
        </div>

        {alreadyApplied ? (
          <div className="mt-5 rounded-xl border border-success/30 bg-success-soft p-4 text-sm">
            <p className="inline-flex items-center gap-2 font-medium text-success">
              <CheckCircle2 className="size-4" /> You've already applied to this job ({appQ.data!.status}).
            </p>
            <Link to="/my-applications" className="mt-2 inline-block font-semibold underline text-success hover:opacity-80">Track in dashboard →</Link>
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
                <label className="text-sm font-medium">
                  Cover note <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  rows={6}
                  maxLength={MAX_COVER}
                  aria-invalid={coverTooShort || coverTooLong}
                  className={`mt-2 w-full rounded-md border px-3 py-2 text-sm ${coverTooShort || coverTooLong ? "border-destructive" : ""}`}
                  placeholder="Why you're a great fit…"
                />
                <div className="mt-1 flex justify-between text-xs">
                  <span className={coverTooShort ? "text-destructive" : "text-muted-foreground"}>
                    Min {MIN_COVER} characters
                  </span>
                  <span className={coverTooLong ? "text-destructive" : "text-muted-foreground"}>
                    {coverLen}/{MAX_COVER}
                  </span>
                </div>
                {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
                <div className="mt-4 flex justify-end gap-2">
                  <Link to="/jobs/$jobId" params={{ jobId }} className="rounded-md border px-4 py-2 text-sm">Cancel</Link>
                  <button
                    onClick={() => submit("internal")}
                    disabled={apply.isPending || coverLen < MIN_COVER || coverTooLong}
                    className="rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
                  onClick={() => submit("external")}
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm your application</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingMethod === "external" ? (
                <>You'll be redirected to <span className="font-medium">{j.company}</span>'s site to finish applying for <span className="font-medium">{j.job_title}</span>. We'll record this application in your dashboard.</>
              ) : (
                <>Submit your application for <span className="font-medium">{j.job_title}</span> at <span className="font-medium">{j.company}</span>? Your profile and latest CV will be sent with your cover note.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {apply.isError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <p className="font-medium">Couldn't submit your application</p>
              <p className="mt-1 text-xs opacity-90">
                {(apply.error as Error)?.message ?? "Something went wrong. Please try again."}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={apply.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={apply.isPending || !pendingMethod}
              onClick={(e) => {
                e.preventDefault();
                if (pendingMethod) {
                  apply.reset();
                  apply.mutate({ method: pendingMethod });
                }
              }}
              style={{ background: "var(--color-primary)" }}
            >
              {apply.isPending ? "Submitting…" : apply.isError ? "Try again" : "Confirm & apply"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={successOpen}
        onOpenChange={(open) => {
          if (!open && successOpen) {
            trackAnalytics("job_apply_success_dialog_closed", {
              jobId,
              jobTitle: j.job_title,
              company: j.company,
              method: successMethod,
              reason: "dismissed",
            });
          }
          setSuccessOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-5 text-success" /> Application submitted
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your application for <span className="font-medium">{j.job_title}</span> at{" "}
              <span className="font-medium">{j.company}</span> has been sent.
              {successMethod === "external" && externalUrl
                ? " We'll also open the employer's site so you can finish on their portal."
                : " Track its status anytime from your dashboard."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                const targetUrl = `/jobs/${jobId}/applied`;
                trackAnalytics("job_apply_view_confirmation_clicked", {
                  jobId,
                  jobTitle: j.job_title,
                  company: j.company,
                  method: successMethod,
                  hasExternalUrl: !!externalUrl,
                  targetUrl,
                  externalUrl: successMethod === "external" ? externalUrl : null,
                });
                trackAnalytics("job_apply_success_dialog_closed", {
                  jobId,
                  jobTitle: j.job_title,
                  company: j.company,
                  method: successMethod,
                  reason: "view_confirmation",
                });
                if (successMethod === "external" && externalUrl) {
                  window.open(externalUrl, "_blank", "noopener,noreferrer");
                }
                setSuccessOpen(false);
                navigate({ to: "/jobs/$jobId/applied", params: { jobId } })
                  .then(() => {
                    trackAnalytics("job_apply_confirmation_page_opened", {
                      jobId,
                      jobTitle: j.job_title,
                      company: j.company,
                      method: successMethod,
                      targetUrl,
                      navigationSuccess: true,
                    });
                  })
                  .catch((err: unknown) => {
                    trackAnalytics("job_apply_confirmation_page_opened", {
                      jobId,
                      jobTitle: j.job_title,
                      company: j.company,
                      method: successMethod,
                      targetUrl,
                      navigationSuccess: false,
                      error: err instanceof Error ? err.message : String(err),
                    });
                  });
              }}
              style={{ background: "var(--color-primary)" }}
            >
              View confirmation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
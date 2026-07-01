import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/profile.functions";
import { listMyCredentials } from "@/lib/assessments.functions";
import { listJobsPublic, listMyApplications } from "@/lib/jobs.functions";
import { getMyCv } from "@/lib/cv.functions";
import { FileText, User, Pencil, Eye, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Learn & Earn" }] }),
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const profileFn = useServerFn(getMyProfile);
  const credsFn = useServerFn(listMyCredentials);
  const jobsFn = useServerFn(listJobsPublic);
  const appsFn = useServerFn(listMyApplications);
  const cvFn = useServerFn(getMyCv);
  const profile = useQuery({ queryKey: ["me"], queryFn: () => profileFn() });
  const creds = useQuery({ queryKey: ["my-creds"], queryFn: () => credsFn() });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: () => jobsFn() });
  const apps = useQuery({ queryKey: ["my-apps"], queryFn: () => appsFn() });
  const cv = useQuery({ queryKey: ["my-cv"], queryFn: () => cvFn() });

  const p = profile.data?.profile;
  const isAdmin = profile.data?.isAdmin;
  const hasCv = !!cv.data;
  const cvPayload = (cv.data?.builder_payload ?? {}) as Record<string, unknown>;
  const cvName = typeof cvPayload.name === "string" ? cvPayload.name.trim() : "";
  const cvTitle = typeof cvPayload.title === "string" ? cvPayload.title.trim() : "";
  const cvPhoto = typeof cvPayload.photo === "string" ? cvPayload.photo.trim() : "";
  const displayedName = p?.name || cvName || "Engineer";
  const displayedDiscipline = p?.discipline || cvTitle;
  const displayedAvatar = p?.avatar_url || cvPhoto;
  const displayedSkills = (p?.skills?.length ?? 0) > 0 ? p?.skills ?? [] : parseSkillList(cvPayload.skills);

  useEffect(() => {
    const uid = profile.data?.profile?.id;
    if (!uid) return;
    const channel = supabase
      .channel(`dashboard-${uid}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles", filter: `id=eq.${uid}` }, () => {
        qc.invalidateQueries({ queryKey: ["me"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "cv_records", filter: `user_id=eq.${uid}` }, () => {
        qc.invalidateQueries({ queryKey: ["my-cv"] });
        qc.invalidateQueries({ queryKey: ["me"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc, profile.data?.profile?.id]);

  return (
    <div className="page-enter">
      <section style={{ background: "var(--color-primary)" }} className="text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10 md:py-14 md:px-6">
          <div className="glass-dark rounded-2xl p-4 sm:p-6">
            <p className="text-sm text-white">Welcome back</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white break-words">{displayedName}</h1>
            <p className="mt-1 text-sm text-white">{displayedDiscipline ? `Discipline: ${displayedDiscipline}` : "Set your discipline in CV Builder"}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Credentials" value={creds.data?.length ?? 0} />
              <Metric label="Skills" value={displayedSkills.length} />
              <Metric label="Applications" value={apps.data?.length ?? 0} />
              <Metric label="Live jobs" value={jobs.data?.length ?? 0} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 mt-4 sm:mt-0">
        <div className="crossover grid grid-cols-2 gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-4">
          <QuickAction to="/learn" label="Start learning" />
          <QuickAction to="/assessments" label="Take assessment" />
          <QuickAction to="/cv-builder" label="Build CV" />
          <QuickAction to="/cv-parser" label="Parse resume" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 pb-10 sm:pt-8 md:pt-10 md:px-6">
        {/* Profile & CV */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {displayedAvatar ? (
                  <img src={displayedAvatar} alt="Profile" className="size-11 rounded-full object-cover ring-2 ring-primary/10" />
                ) : (
                  <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="size-5" />
                  </div>
                )}
                <h2 className="font-semibold">My profile</h2>
              </div>
              <Link to="/cv-builder" className="inline-flex items-center gap-1 text-sm underline" style={{ color: "var(--color-primary)" }}>
                <Pencil className="size-3.5" /> Edit
              </Link>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex gap-2"><dt className="w-24 text-muted-foreground">Name</dt><dd className="font-medium break-words">{displayedName}</dd></div>
              <div className="flex gap-2"><dt className="w-24 text-muted-foreground">Discipline</dt><dd className="break-words">{displayedDiscipline || "—"}</dd></div>
              <div className="flex gap-2"><dt className="w-24 text-muted-foreground">Skills</dt>
                <dd className="flex flex-wrap gap-1">
                  {displayedSkills.length > 0
                    ? displayedSkills.map((s: string) => <span key={s} className="rounded-full border px-2 py-0.5 text-xs">{s}</span>)
                    : <span className="text-muted-foreground">—</span>}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Your profile is auto-shared with every job application.</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 font-semibold">
                <FileText className="size-4" /> My CV
              </h2>
              {hasCv && (
                <span className="rounded-full badge-success px-2 py-0.5 text-[11px] font-semibold">Ready</span>
              )}
            </div>
            {hasCv ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Style: <span className="font-medium text-foreground">{cv.data?.selected_style ?? "standard"}</span>
                  {cv.data?.updated_at && <> · Updated {new Date(cv.data.updated_at).toLocaleDateString()}</>}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/cv-builder" className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
                    <Eye className="size-4" /> View / Edit CV
                  </Link>
                  <Link to="/cv-parser" className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm">Upload / parse resume</Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">You haven't created a CV yet. Build one so it can be auto-submitted with your job applications.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/cv-builder" className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
                    <Plus className="size-4" /> Create CV
                  </Link>
                  <Link to="/cv-parser" className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm">Upload existing</Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Recent credentials">
            {creds.data?.length ? (
              <ul className="space-y-2 text-sm">
                {creds.data.slice(0, 5).map((c: any) => (
                  <li key={c.id} className="flex justify-between border-b pb-2 last:border-0">
                    <span>{c.credential_name}</span>
                    <span className="font-semibold">{c.score}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No credentials yet. <Link to="/assessments" className="underline">Take an assessment</Link>.</p>
            )}
          </Card>
          <Card title="My applications">
            {(apps.data?.length ?? 0) > 0 ? (
              <>
                <ul className="space-y-2 text-sm">
                  {apps.data!.slice(0, 5).map((a: any) => (
                    <li key={a.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0">
                      <Link to="/jobs/$jobId" params={{ jobId: a.job?.id ?? "" }} className="truncate hover:underline">
                        {a.job?.job_title ?? "Job removed"} <span className="text-muted-foreground">— {a.job?.company}</span>
                      </Link>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${appColor(a.status)}`}>{a.status}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/my-applications" className="mt-3 inline-block text-sm" style={{ color: "var(--color-primary)" }}>Track all →</Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No applications yet. <Link to="/jobs" className="underline">Find a job</Link>.</p>
            )}
          </Card>
          <Card title="Latest jobs">
            <ul className="space-y-2 text-sm">
              {(jobs.data ?? []).slice(0, 5).map((j: any) => (
                <li key={j.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <Link to="/jobs/$jobId" params={{ jobId: j.id }} className="truncate hover:underline">{j.job_title} — <span className="text-muted-foreground">{j.company}</span></Link>
                  {j.is_remote ? <span className="rounded bg-muted px-2 py-0.5 text-xs">Remote</span> : null}
                </li>
              ))}
            </ul>
            <Link to="/jobs" className="mt-3 inline-block text-sm" style={{ color: "var(--color-primary)" }}>View all →</Link>
          </Card>
        </div>
        {isAdmin && (
          <div className="mt-6 rounded-xl border bg-white p-4">
            <h2 className="font-semibold">Admin tools</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <Link to="/admin/dashboard" className="rounded-md border px-3 py-1.5">Admin dashboard</Link>
              <Link to="/admin/modules" className="rounded-md border px-3 py-1.5">Modules</Link>
              <Link to="/admin/jobs" className="rounded-md border px-3 py-1.5">Jobs</Link>
              <Link to="/admin/users" className="rounded-md border px-3 py-1.5">Users</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/30 bg-black/30 p-4">
      <div className="text-xs uppercase tracking-wide text-white">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
function QuickAction({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to as any} className="lift rounded-xl border p-4 text-center font-medium" style={{ borderColor: "var(--color-border)" }}>
      {label}
    </Link>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function appColor(s: string) {
  if (s === "accepted") return "badge-success";
  if (s === "rejected") return "badge-danger";
  if (s === "reviewing") return "badge-warning";
  return "badge-neutral";
}

function parseSkillList(value: unknown) {
  if (typeof value === "string") return value.split(",").map((skill) => skill.trim()).filter(Boolean);
  if (Array.isArray(value)) return value.map(String).map((skill) => skill.trim()).filter(Boolean);
  return [];
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerListJobs, employerListApplicants, getMyCompany } from "@/lib/employer.functions";

export const Route = createFileRoute("/_authenticated/employer/dashboard")({
  head: () => ({ meta: [{ title: "Employer Dashboard" }] }),
  component: Page,
});

function Page() {
  const jobsFn = useServerFn(employerListJobs);
  const appsFn = useServerFn(employerListApplicants);
  const meFn = useServerFn(getMyCompany);
  const me = useQuery({ queryKey: ["my-company"], queryFn: () => meFn() });
  const jobs = useQuery({ queryKey: ["emp-jobs"], queryFn: () => jobsFn(), enabled: !!me.data });
  const apps = useQuery({ queryKey: ["emp-apps"], queryFn: () => appsFn({ data: {} }), enabled: !!me.data });

  if (!me.isLoading && !me.data) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">No company linked</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account isn't connected to a company yet. Create one to start posting jobs.
        </p>
        <Link to="/employer/company" className="mt-3 inline-block rounded-md border px-3 py-1.5 text-sm">Create company</Link>
      </div>
    );
  }

  const list = apps.data ?? [];
  const stages = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;
  const counts = Object.fromEntries(stages.map((s) => [s, list.filter((a: any) => (a.stage ?? a.status) === s).length]));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome, {(me.data as any)?.company?.name}</h1>
        <p className="text-sm text-muted-foreground">Manage your jobs, applicants, interviews and offers.</p>
      </header>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Active jobs" value={(jobs.data ?? []).filter((j: any) => j.is_live).length} />
        <Stat label="Total applicants" value={list.length} />
        <Stat label="In interview" value={counts.interview ?? 0} />
        <Stat label="Hired" value={counts.hired ?? 0} />
      </div>
      <div className="rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Applicant pipeline</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-6">
          {stages.map((s) => (
            <div key={s} className="rounded-md border p-3 text-center">
              <div className="text-2xl font-bold">{counts[s] ?? 0}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{s}</div>
            </div>
          ))}
        </div>
        <Link to="/employer/applicants" className="mt-4 inline-block text-sm underline">View all applicants →</Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
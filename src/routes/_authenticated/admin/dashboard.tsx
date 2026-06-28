import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin — Overview" }] }),
  component: AdminDash,
});

type StatKey =
  | "users" | "employers" | "companies" | "jobs" | "liveJobs"
  | "cachedJobs" | "applications" | "interviews" | "letters"
  | "modules" | "credentials";

const CARDS: { key: StatKey; label: string; to?: string; hint: string }[] = [
  { key: "users", label: "Job seekers", to: "/admin/users", hint: "Profiles & roles" },
  { key: "employers", label: "Employers", to: "/admin/employers", hint: "Employer accounts" },
  { key: "companies", label: "Companies", to: "/admin/companies", hint: "Company directory" },
  { key: "jobs", label: "Jobs (total)", to: "/admin/jobs", hint: "All marketplace jobs" },
  { key: "liveJobs", label: "Jobs (live)", to: "/admin/jobs", hint: "Published & visible" },
  { key: "cachedJobs", label: "Live API cache", to: "/admin/jobs", hint: "Synced external jobs" },
  { key: "applications", label: "Applications", to: "/admin/applications", hint: "Submitted applications" },
  { key: "interviews", label: "Interviews", to: "/admin/interviews", hint: "Interview sessions" },
  { key: "letters", label: "Appointment letters", to: "/admin/letters", hint: "Issued letters" },
  { key: "modules", label: "Learning modules", to: "/admin/modules", hint: "Topics & quizzes" },
  { key: "credentials", label: "Credentials", hint: "Earned by users" },
];

function AdminDash() {
  const fn = useServerFn(adminStats);
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });
  const s = (q.data ?? {}) as Partial<Record<StatKey, number>>;
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin overview</h1>
          <p className="text-sm text-muted-foreground">Live counts across every module in TalentBD.</p>
        </div>
        <button
          onClick={() => q.refetch()}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
        >
          {q.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {q.error && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          Failed to load stats: {(q.error as Error).message}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => {
          const value = s[c.key] ?? 0;
          const inner = (
            <div className="h-full rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
              <div className="mt-1 text-3xl font-bold">{q.isLoading ? "…" : value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>
              {c.to && <div className="mt-3 text-xs font-medium text-primary">Manage →</div>}
            </div>
          );
          return c.to ? (
            <Link key={c.key} to={c.to} className="block">{inner}</Link>
          ) : (
            <div key={c.key}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

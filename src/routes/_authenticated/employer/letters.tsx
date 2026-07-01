import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerListLetters } from "@/lib/employer.functions";

export const Route = createFileRoute("/_authenticated/employer/letters")({
  head: () => ({ meta: [{ title: "Appointment letters" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(employerListLetters);
  const q = useQuery({ queryKey: ["emp-letters"], queryFn: () => fn() });
  const list = q.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Appointment letters</h1>
      <p className="text-sm text-muted-foreground">Issued offers and hires across your company.</p>

      {q.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {!q.isLoading && list.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">
          You haven't issued any appointment letters yet. Open an applicant and use "Issue appointment letter" to hire them.
        </p>
      )}

      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {list.map((l: any) => (
          <li key={l.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{l.position}</div>
                <div className="text-xs text-muted-foreground">{l.application?.applicant?.name ?? "Candidate"} · {l.application?.job?.job_title}</div>
              </div>
              {l.accepted_at ? (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Accepted</span>
              ) : (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">Pending</span>
              )}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {l.salary && <span>{l.salary}</span>}
              {l.start_date && <span className="ml-2">Starts {new Date(l.start_date).toLocaleDateString()}</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <Link to="/appointment/$letterId" params={{ letterId: l.id }} className="rounded-md border px-3 py-1.5 text-xs font-semibold">View letter</Link>
              <Link to="/employer/applicants/$appId" params={{ appId: l.application_id }} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Open applicant</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
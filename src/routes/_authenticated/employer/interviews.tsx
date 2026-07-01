import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerListInterviews } from "@/lib/employer.functions";

export const Route = createFileRoute("/_authenticated/employer/interviews")({
  head: () => ({ meta: [{ title: "Interviews" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(employerListInterviews);
  const q = useQuery({ queryKey: ["emp-interviews"], queryFn: () => fn() });
  const list = q.data ?? [];
  const now = Date.now();
  const upcoming = list.filter((i: any) => new Date(i.scheduled_at).getTime() >= now);
  const past = list.filter((i: any) => new Date(i.scheduled_at).getTime() < now);

  return (
    <div>
      <h1 className="text-2xl font-bold">Interviews</h1>
      <p className="text-sm text-muted-foreground">All scheduled interviews for your company's applicants.</p>

      {q.isLoading && <p className="mt-4 text-sm text-muted-foreground">Loading…</p>}
      {!q.isLoading && list.length === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">No interviews scheduled yet. Open an applicant to schedule one.</p>
      )}

      {upcoming.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Upcoming</h2>
          <ul className="mt-2 space-y-2">
            {upcoming.map((i: any) => <Row key={i.id} i={i} />)}
          </ul>
        </section>
      )}
      {past.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">Past</h2>
          <ul className="mt-2 space-y-2 opacity-80">
            {past.map((i: any) => <Row key={i.id} i={i} />)}
          </ul>
        </section>
      )}
    </div>
  );
}

function Row({ i }: { i: any }) {
  return (
    <li className="flex flex-col gap-2 rounded-xl border bg-white p-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-semibold">{i.application?.applicant?.name ?? "Candidate"}</div>
        <div className="text-xs text-muted-foreground">{i.application?.job?.job_title}</div>
        <div className="mt-1 text-xs">
          <span className="font-medium">{new Date(i.scheduled_at).toLocaleString()}</span>
          {i.provider && <span className="ml-2 rounded bg-muted px-1.5 py-0.5">{i.provider}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <a href={i.meeting_url} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-1.5 text-xs font-semibold">Join</a>
        <Link to="/employer/applicants/$appId" params={{ appId: i.application_id }} className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Open applicant</Link>
      </div>
    </li>
  );
}
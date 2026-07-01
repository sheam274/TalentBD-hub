import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/employer")({
  component: EmployerLayout,
});

function EmployerLayout() {
  const fn = useServerFn(getMyProfile);
  const q = useQuery({ queryKey: ["me"], queryFn: () => fn() });

  if (q.isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!q.data?.isEmployer && !q.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Employer access only</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for registered company accounts. Sign up as an employer to post jobs and manage applicants.
        </p>
        <Link to="/auth" className="mt-4 inline-block rounded-md border px-4 py-2 text-sm">Sign up as employer</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 page-enter">
      <nav className="mb-6 flex flex-wrap gap-2 border-b pb-3 text-sm">
        <Link to="/employer/dashboard" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Overview</Link>
        <Link to="/employer/company" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Company</Link>
        <Link to="/employer/jobs" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Jobs</Link>
        <Link to="/employer/applicants" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Applicants</Link>
        <Link to="/employer/interviews" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Interviews</Link>
        <Link to="/employer/letters" className="rounded-md border px-3 py-1.5" activeProps={{ style: { background: "var(--color-primary)", color: "white" } }}>Appointment letters</Link>
      </nav>
      <Outlet />
    </div>
  );
}
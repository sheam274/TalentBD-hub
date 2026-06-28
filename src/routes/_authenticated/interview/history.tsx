import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMySessions } from "@/lib/interview.functions";

export const Route = createFileRoute("/_authenticated/interview/history")({
  head: () => ({ meta: [{ title: "Interview history" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const fn = useServerFn(listMySessions);
  const { data, isLoading } = useQuery({ queryKey: ["my-interviews"], queryFn: () => fn() });

  return (
    <div className="page-enter mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your interviews</h1>
        <Link to="/interview/setup" className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>New interview</Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : !data?.length ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No interviews yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Mode</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.role}</td>
                  <td className="px-4 py-2 capitalize">{s.mode}</td>
                  <td className="px-4 py-2 capitalize">{s.difficulty}</td>
                  <td className="px-4 py-2">{s.status === "completed" ? `${s.score}%` : <span className="text-warning">In progress</span>}</td>
                  <td className="px-4 py-2 text-muted-foreground">{new Date(s.started_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">
                    <Link to="/interview/result/$sessionId" params={{ sessionId: s.id }} className="text-primary hover:underline">Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
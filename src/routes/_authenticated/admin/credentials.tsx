import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListUsers } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/credentials")({
  head: () => ({ meta: [{ title: "Admin — Credentials" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(adminListUsers);
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => fn() });
  if (q.isLoading) return <p>Loading…</p>;
  const profileMap = new Map((q.data?.profiles ?? []).map((p: any) => [p.id, p]));
  const creds = q.data?.credentials ?? [];
  return (
    <div>
      <h1 className="text-2xl font-bold">Credentials</h1>
      <p className="text-sm text-muted-foreground">All verified skills and quiz scores.</p>
      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Credential</th>
              <th className="p-3">Score</th>
              <th className="p-3">Verified</th>
            </tr>
          </thead>
          <tbody>
            {creds.map((c: any, i: number) => {
              const p: any = profileMap.get(c.user_id);
              return (
                <tr key={i} className="border-t">
                  <td className="p-3">{p?.name ?? c.user_id.slice(0, 8)}</td>
                  <td className="p-3">{c.credential_name}</td>
                  <td className="p-3">{c.score}</td>
                  <td className="p-3 text-xs">{c.verified_at ? new Date(c.verified_at).toLocaleDateString() : "—"}</td>
                </tr>
              );
            })}
            {creds.length === 0 && (
              <tr><td className="p-3 text-muted-foreground" colSpan={4}>No credentials yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
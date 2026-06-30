import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListUsers, adminSetRole, adminAdjustCredential, adminPromoteByEmail, adminListAdmins } from "@/lib/admin.functions";
import { toast } from "sonner";
import { useMemo, useState } from "react";
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

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Admin — Users" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const listFn = useServerFn(adminListUsers);
  const roleFn = useServerFn(adminSetRole);
  const credFn = useServerFn(adminAdjustCredential);
  const promoteFn = useServerFn(adminPromoteByEmail);
  const adminsFn = useServerFn(adminListAdmins);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });
  const admins = useQuery({ queryKey: ["admin-admins"], queryFn: () => adminsFn() });
  const [promoteEmail, setPromoteEmail] = useState("");
  const [credForm, setCredForm] = useState<{ userId: string; name: string; score: string }>({ userId: "", name: "", score: "100" });
  const [search, setSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "student" | "employer">("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [revokeTarget, setRevokeTarget] = useState<{ id: string; email: string | null; name: string | null } | null>(null);
  const [revokeInput, setRevokeInput] = useState("");

  const setRole = useMutation({
    mutationFn: (v: { userId: string; grant: boolean }) => roleFn({ data: { userId: v.userId, role: "admin", grant: v.grant } }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const promote = useMutation({
    mutationFn: (email: string) => promoteFn({ data: { email, role: "admin", grant: true } }),
    onSuccess: (r: any) => {
      toast.success(`Granted admin to ${r.email ?? r.userId}`);
      setPromoteEmail("");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (e: any) => toast.error(e.message),
  });
  const addCred = useMutation({
    mutationFn: () => credFn({ data: { userId: credForm.userId, credentialName: credForm.name, score: Number(credForm.score) } }),
    onSuccess: () => { toast.success("Credential added"); qc.invalidateQueries({ queryKey: ["admin-users"] }); setCredForm({ userId: "", name: "", score: "100" }); },
  });

  const data = q.data;
  const isAdmin = (uid: string) => data?.roles.some((r: any) => r.user_id === uid && r.role === "admin");
  const rolesOf = (uid: string) =>
    (data?.roles ?? []).filter((r: any) => r.user_id === uid).map((r: any) => r.role as string);

  const emailMap = useMemo(() => {
    const m = new Map<string, string>();
    (admins.data ?? []).forEach((a: any) => { if (a?.id && a?.email) m.set(a.id, a.email); });
    return m;
  }, [admins.data]);
  const nameMap = useMemo(() => {
    const m = new Map<string, string>();
    (data?.profiles ?? []).forEach((p: any) => { if (p?.id && p?.name) m.set(p.id, p.name); });
    (admins.data ?? []).forEach((a: any) => { if (a?.id && a?.name && !m.has(a.id)) m.set(a.id, a.name); });
    return m;
  }, [data, admins.data]);
  const openRevoke = (uid: string) => {
    setRevokeInput("");
    setRevokeTarget({ id: uid, email: emailMap.get(uid) ?? null, name: nameMap.get(uid) ?? null });
    if (!emailMap.has(uid)) qc.invalidateQueries({ queryKey: ["admin-admins"] });
  };

  const disciplines = useMemo(() => {
    const set = new Set<string>();
    (data?.profiles ?? []).forEach((p: any) => p.discipline && set.add(p.discipline));
    return Array.from(set).sort();
  }, [data]);

  if (q.isLoading) return <p>Loading…</p>;

  const filtered = (data?.profiles ?? []).filter((p: any) => {
    const roles = rolesOf(p.id);
    if (roleFilter !== "all" && !roles.includes(roleFilter)) return false;
    if (disciplineFilter !== "all" && p.discipline !== disciplineFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(p.name ?? "").toLowerCase().includes(s) && !p.id.includes(s)) return false;
    }
    return true;
  });

  const totalAdmins = (data?.roles ?? []).filter((r: any) => r.role === "admin").length;
  const totalEmployers = (data?.roles ?? []).filter((r: any) => r.role === "employer").length;
  const totalCreds = (data?.credentials ?? []).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-sm text-muted-foreground">Profiles, roles, and earned credentials.</p>

      <div className="mt-5 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold">Current admins</h2>
          <span className="text-xs text-muted-foreground">
            {admins.isFetching ? "Refreshing…" : `${admins.data?.length ?? 0} total`}
          </span>
          <div className="ml-auto flex gap-2">
            <input
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Search admins by name or email…"
              className="w-64 rounded-md border px-3 py-1.5 text-sm"
            />
            <button
              onClick={() => {
                qc.invalidateQueries({ queryKey: ["admin-admins"] });
                qc.invalidateQueries({ queryKey: ["admin-users"] });
              }}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
        {admins.isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : (() => {
          const s = adminSearch.trim().toLowerCase();
          const rows = (admins.data ?? []).filter((a: any) =>
            !s || (a.name ?? "").toLowerCase().includes(s) || (a.email ?? "").toLowerCase().includes(s) || a.id.includes(s),
          );
          if (rows.length === 0) {
            return <p className="mt-3 text-sm text-muted-foreground">{s ? "No admins match your search." : "No admins yet."}</p>;
          }
          return (
            <div className="mt-3 overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-xs uppercase">
                  <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">User ID</th><th className="p-2 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {rows.map((a: any) => (
                    <tr key={a.id} className="border-t">
                      <td className="p-2 font-medium">{a.name ?? "—"}</td>
                      <td className="p-2">{a.email ?? "—"}</td>
                      <td className="p-2 text-xs text-muted-foreground">{a.id.slice(0, 8)}…</td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => openRevoke(a.id)}
                          className="rounded-md border px-2 py-1 text-xs"
                        >
                          Revoke admin
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(e) => { e.preventDefault(); if (promoteEmail) promote.mutate(promoteEmail); }}
        >
          <input
            type="email"
            required
            placeholder="user@example.com"
            value={promoteEmail}
            onChange={(e) => setPromoteEmail(e.target.value)}
            className="w-72 rounded-md border px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={promote.isPending}
            className="rounded-md px-3 py-1.5 text-sm font-semibold"
            style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
          >
            {promote.isPending ? "Promoting…" : "Promote to admin"}
          </button>
        </form>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: data?.profiles.length ?? 0 },
          { label: "Admins", value: totalAdmins },
          { label: "Employers", value: totalEmployers },
          { label: "Credentials issued", value: totalCreds },
        ].map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <div className="text-xs uppercase text-muted-foreground">{c.label}</div>
            <div className="mt-1 text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or id…"
          className="w-64 rounded-md border px-3 py-1.5 text-sm"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="rounded-md border px-2 py-1.5 text-sm">
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="employer">Employer</option>
          <option value="student">Student</option>
        </select>
        <select value={disciplineFilter} onChange={(e) => setDisciplineFilter(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm">
          <option value="all">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <span className="ml-auto text-xs text-muted-foreground">Showing {filtered.length} of {data?.profiles.length ?? 0}</span>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase">
            <tr><th className="p-3">Name</th><th className="p-3">Discipline</th><th className="p-3">Joined</th><th className="p-3">Credentials</th><th className="p-3">Roles</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((p: any) => {
              const userCreds = (data?.credentials ?? []).filter((c: any) => c.user_id === p.id);
              const roles = rolesOf(p.id);
              return (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div>{p.name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.id.slice(0, 8)}</div>
                  </td>
                  <td className="p-3">{p.discipline ?? "—"}</td>
                  <td className="p-3 text-xs">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                  <td className="p-3">{userCreds.length}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {roles.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      {roles.map((r) => (
                        <span key={r} className="rounded bg-muted px-2 py-0.5 text-xs">{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        const revoking = isAdmin(p.id);
                        if (revoking) { openRevoke(p.id); return; }
                        setRole.mutate({ userId: p.id, grant: true });
                      }}
                      className="rounded-md border px-2 py-1 text-xs"
                    >
                      {isAdmin(p.id) ? "Revoke admin" : "Grant admin"}
                    </button>
                    <button onClick={() => setCredForm({ userId: p.id, name: "", score: "100" })} className="ml-2 rounded-md border px-2 py-1 text-xs">Add credential</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td className="p-3 text-muted-foreground" colSpan={6}>No users match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {credForm.userId && (
        <div className="mt-5 max-w-md rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Add credential</h3>
          <input placeholder="Credential name" value={credForm.name} onChange={(e) => setCredForm({ ...credForm, name: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
          <input type="number" min="0" max="100" value={credForm.score} onChange={(e) => setCredForm({ ...credForm, score: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm" />
          <div className="mt-3 flex gap-2">
            <button onClick={() => addCred.mutate()} disabled={!credForm.name} className="rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>Save</button>
            <button onClick={() => setCredForm({ userId: "", name: "", score: "100" })} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <AlertDialog open={!!revokeTarget} onOpenChange={(o) => { if (!o) { setRevokeTarget(null); setRevokeInput(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke admin privileges?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <div>
                  You are about to revoke admin access from{" "}
                  <span className="font-semibold">{revokeTarget?.name ?? "this user"}</span>
                  {revokeTarget?.email && <> (<span className="font-mono">{revokeTarget.email}</span>)</>}.
                </div>
                <div>
                  They will immediately lose access to the admin dashboard, user management,
                  database tools, and all admin-only data. This action takes effect right away
                  but can be reversed by re-granting the admin role.
                </div>
                {revokeTarget?.email ? (
                  <div>
                    Type <span className="font-mono font-semibold">{revokeTarget.email}</span> to confirm:
                    <input
                      autoFocus
                      value={revokeInput}
                      onChange={(e) => setRevokeInput(e.target.value)}
                      className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                      placeholder={revokeTarget.email}
                    />
                  </div>
                ) : (
                  <div className="text-muted-foreground">No email on file — confirm by clicking Revoke.</div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!!revokeTarget?.email && revokeInput.trim().toLowerCase() !== revokeTarget.email.toLowerCase()}
              onClick={() => {
                if (revokeTarget) setRole.mutate({ userId: revokeTarget.id, grant: false });
                setRevokeTarget(null);
                setRevokeInput("");
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Fragment, useState } from "react";
import { adminListAuditLogs } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
});

const TABLE_OPTIONS = [
  { v: "all", label: "All" },
  { v: "job_marketplace", label: "Jobs" },
  { v: "job_applications", label: "Applications" },
  { v: "interview_sessions", label: "Interviews" },
  { v: "appointment_letters", label: "Appointment letters" },
];
const OP_OPTIONS = ["all", "INSERT", "UPDATE", "DELETE"] as const;

function AuditPage() {
  const fn = useServerFn(adminListAuditLogs);
  const [table, setTable] = useState<string>("all");
  const [operation, setOperation] = useState<(typeof OP_OPTIONS)[number]>("all");
  const [actorEmail, setActorEmail] = useState("");
  const [rowId, setRowId] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const q = useQuery({
    queryKey: ["audit", table, operation, actorEmail, rowId],
    queryFn: () =>
      fn({
        data: {
          table: table as any,
          operation,
          actorEmail: actorEmail.trim() ? actorEmail.trim() : undefined,
          rowId: rowId.trim() ? rowId.trim() : undefined,
          limit: 150,
        },
      }),
  });

  const rows = q.data?.rows ?? [];
  const emails = q.data?.emailMap ?? {};

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Audit logs</h1>
        <p className="text-sm text-muted-foreground">
          Trace every insert, update, and delete on jobs, applications, interviews, and appointment letters.
        </p>
      </header>

      <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs font-medium">
          Table
          <select
            value={table}
            onChange={(e) => setTable(e.target.value)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            {TABLE_OPTIONS.map((o) => (
              <option key={o.v} value={o.v}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium">
          Operation
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            {OP_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium">
          Actor email
          <input
            value={actorEmail}
            onChange={(e) => setActorEmail(e.target.value)}
            placeholder="user@example.com"
            className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </label>
        <label className="text-xs font-medium">
          Row ID
          <input
            value={rowId}
            onChange={(e) => setRowId(e.target.value)}
            placeholder="uuid…"
            className="mt-1 w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      {q.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matching audit entries.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-left">
              <tr>
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Table</th>
                <th className="px-3 py-2">Op</th>
                <th className="px-3 py-2">Actor</th>
                <th className="px-3 py-2">Row</th>
                <th className="px-3 py-2">Changed</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any) => {
                const isOpen = expanded === r.id;
                return (
                  <Fragment key={r.id}>
                    <tr className="border-t align-top">
                      <td className="px-3 py-2 whitespace-nowrap">{new Date(r.occurred_at).toLocaleString()}</td>
                      <td className="px-3 py-2">{r.table_name}</td>
                      <td className="px-3 py-2">
                        <span className={
                          r.operation === "INSERT" ? "text-emerald-600" :
                          r.operation === "DELETE" ? "text-red-600" : "text-amber-600"
                        }>{r.operation}</span>
                      </td>
                      <td className="px-3 py-2">{r.actor_id ? (emails[r.actor_id] ?? r.actor_id.slice(0, 8)) : "system"}</td>
                      <td className="px-3 py-2 font-mono">{r.row_pk?.slice(0, 8) || "—"}</td>
                      <td className="px-3 py-2">{(r.changed_fields ?? []).join(", ") || "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => setExpanded(isOpen ? null : r.id)}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-t bg-muted/20">
                        <td colSpan={7} className="px-3 py-2">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <div className="mb-1 text-xs font-semibold">Old</div>
                              <pre className="max-h-64 overflow-auto rounded bg-background p-2 text-[11px]">
                                {r.old_data ? JSON.stringify(r.old_data, null, 2) : "—"}
                              </pre>
                            </div>
                            <div>
                              <div className="mb-1 text-xs font-semibold">New</div>
                              <pre className="max-h-64 overflow-auto rounded bg-background p-2 text-[11px]">
                                {r.new_data ? JSON.stringify(r.new_data, null, 2) : "—"}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
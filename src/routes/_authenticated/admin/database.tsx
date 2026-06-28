import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListTables, adminBrowseTable, ADMIN_BROWSABLE_TABLES, type AdminBrowsableTable } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/database")({
  component: DatabaseBrowser,
});

function DatabaseBrowser() {
  const listFn = useServerFn(adminListTables);
  const browseFn = useServerFn(adminBrowseTable);
  const [table, setTable] = useState<AdminBrowsableTable>("profiles");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const tables = useQuery({ queryKey: ["admin", "db", "tables"], queryFn: () => listFn() });
  const rows = useQuery({
    queryKey: ["admin", "db", table, page, pageSize, search],
    queryFn: () => browseFn({ data: { table, page, pageSize, search: search || undefined } }),
  });

  const totalPages = rows.data ? Math.max(1, Math.ceil(rows.data.total / pageSize)) : 1;

  return (
    <div className="grid gap-4 md:grid-cols-[240px_1fr]">
      <aside className="rounded-lg border bg-card p-3">
        <h2 className="mb-2 text-sm font-semibold">Tables</h2>
        <ul className="space-y-1">
          {(tables.data ?? ADMIN_BROWSABLE_TABLES.map((t) => ({ table: t, count: 0 }))).map((t) => (
            <li key={t.table}>
              <button
                onClick={() => { setTable(t.table as AdminBrowsableTable); setPage(0); setSearch(""); setSearchInput(""); }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted ${table === t.table ? "bg-muted font-medium" : ""}`}
              >
                <span className="truncate">{t.table}</span>
                <span className="ml-2 text-xs text-muted-foreground">{t.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">{table}</h1>
            <p className="text-xs text-muted-foreground">
              {rows.data ? `${rows.data.total} rows · page ${page + 1} / ${totalPages}` : "Loading…"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setPage(0); setSearch(searchInput.trim()); } }}
              placeholder="Filter by id (UUID)"
              className="w-56 rounded-md border px-2 py-1 text-sm"
            />
            <button
              onClick={() => { setPage(0); setSearch(searchInput.trim()); }}
              className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
            >Search</button>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>

        {rows.isLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.error ? (
          <div className="py-10 text-center text-sm text-destructive">{(rows.error as Error).message}</div>
        ) : !rows.data?.rows.length ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No rows.</div>
        ) : (
          <div className="max-h-[70vh] overflow-auto rounded border">
            <table className="w-full min-w-max text-xs">
              <thead className="sticky top-0 bg-muted">
                <tr>
                  {rows.data.columns.map((c) => (
                    <th key={c} className="border-b px-2 py-1.5 text-left font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.data.rows.map((r: any, i: number) => (
                  <tr key={i} className="hover:bg-muted/40">
                    {rows.data!.columns.map((c) => (
                      <td key={c} className="max-w-[320px] truncate border-b px-2 py-1.5 align-top" title={formatCell(r[c])}>
                        {formatCell(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          >Prev</button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          >Next</button>
        </div>
      </section>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
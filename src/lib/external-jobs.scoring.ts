export type ScorableJob = {
  id?: string;
  title?: string | null;
  company?: string | null;
  category?: string | null;
  tags?: string[] | null;
  publication_date?: string | null;
  [k: string]: unknown;
};

const stem = (w: string) => w.replace(/(ing|ers|er|s)$/i, "");

export function tokenize(search: string | undefined | null): string[] {
  return (search ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((t) => t.length >= 2)
    .map(stem);
}

export function scoreJob(j: ScorableJob, tokens: string[], now = Date.now()): number {
  const title = (j.title ?? "").toLowerCase();
  const company = (j.company ?? "").toLowerCase();
  const category = (j.category ?? "").toLowerCase();
  const tagStr = (j.tags ?? []).join(" ").toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (title.startsWith(t)) s += 14;
    else if (title.includes(` ${t}`) || title.includes(`${t} `)) s += 10;
    else if (title.includes(t)) s += 7;
    if (tagStr.includes(t)) s += 5;
    if (category.includes(t)) s += 4;
    if (company.includes(t)) s += 3;
  }
  if (j.publication_date) {
    const days = (now - new Date(j.publication_date).getTime()) / 86_400_000;
    if (!Number.isNaN(days) && days >= 0) s += Math.max(0, 10 - Math.min(10, days / 3));
  }
  return s;
}

/**
 * Pure relevance scoring + stable sorting. Ties break by recency, then by id
 * so pagination (consumer slicing) is deterministic across pages.
 */
export function scoreAndSortJobs<T extends ScorableJob>(
  jobs: T[],
  search?: string | null,
  now = Date.now(),
): T[] {
  const tokens = tokenize(search);
  const pool = tokens.length
    ? jobs.filter((j) => {
        const hay = `${j.title ?? ""} ${j.company ?? ""} ${j.category ?? ""} ${(j.tags ?? []).join(" ")}`.toLowerCase();
        return tokens.some((t) => hay.includes(t));
      })
    : jobs;
  return pool
    .map((j, i) => ({ j, i, s: scoreJob(j, tokens, now) }))
    .sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s;
      const da = a.j.publication_date ? new Date(a.j.publication_date).getTime() : 0;
      const db = b.j.publication_date ? new Date(b.j.publication_date).getTime() : 0;
      if (db !== da) return db - da;
      const ida = String(a.j.id ?? a.i);
      const idb = String(b.j.id ?? b.i);
      return ida < idb ? -1 : ida > idb ? 1 : 0;
    })
    .map((x) => x.j);
}
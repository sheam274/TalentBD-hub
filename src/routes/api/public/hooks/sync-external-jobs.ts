import { createFileRoute } from "@tanstack/react-router";

// Background sync: pulls live jobs from Remotive, Arbeitnow, RemoteOK,
// normalizes categories, dedupes by external_id, and upserts into
// public.external_jobs_cache.
//
// Trigger via cron (pg_cron) or manually:
//   POST /api/public/hooks/sync-external-jobs
//   Authorization: Bearer <JOBS_SYNC_SECRET>

const CATEGORY_MAP: Array<{ match: RegExp; category: string }> = [
  { match: /\b(software|developer|engineer|programming|backend|frontend|fullstack|full-stack|web dev)\b/i, category: "Software Development" },
  { match: /\b(devops|sre|site reliability|platform|infrastructure|cloud|kubernetes|aws|gcp|azure)\b/i, category: "DevOps / Cloud" },
  { match: /\b(data|analytics|analyst|scientist|ml|machine learning|ai|nlp)\b/i, category: "Data & AI" },
  { match: /\b(network|cisco|ccna|ccnp|noc|sysadmin|system admin)\b/i, category: "Network & Systems" },
  { match: /\b(security|infosec|cyber|pentest|appsec)\b/i, category: "Cybersecurity" },
  { match: /\b(mobile|ios|android|react native|flutter)\b/i, category: "Mobile" },
  { match: /\b(qa|quality|test|tester|sdet)\b/i, category: "QA / Testing" },
  { match: /\b(design|ux|ui|product designer|graphic)\b/i, category: "Design" },
  { match: /\b(product manager|product owner|program manager)\b/i, category: "Product Management" },
  { match: /\b(marketing|seo|growth|content|copywriter|social media)\b/i, category: "Marketing" },
  { match: /\b(sales|account executive|business development|bdr|sdr)\b/i, category: "Sales" },
  { match: /\b(support|customer success|customer service)\b/i, category: "Customer Support" },
  { match: /\b(finance|accounting|bookkeep|controller|cfo)\b/i, category: "Finance" },
  { match: /\b(hr|human resources|recruit|talent)\b/i, category: "HR / Recruiting" },
  { match: /\b(writer|writing|editor|journalist)\b/i, category: "Writing" },
  { match: /\b(teacher|tutor|education|instructor)\b/i, category: "Education" },
  { match: /\b(civil|mechanical|electrical|electronic|eee|construction)\b/i, category: "Engineering (Other)" },
];

function normalizeCategory(title: string, category: string | null, tags: string[]): string {
  const hay = `${title} ${category ?? ""} ${tags.join(" ")}`;
  for (const { match, category: cat } of CATEGORY_MAP) if (match.test(hay)) return cat;
  return "General";
}

type Row = {
  external_id: string;
  source: string;
  title: string;
  company: string;
  company_logo: string | null;
  category: string | null;
  normalized_category: string;
  job_type: string | null;
  location: string | null;
  is_remote: boolean;
  salary: string | null;
  url: string | null;
  tags: string[];
  publication_date: string | null;
};

async function fetchRemotive(headers: Record<string, string>): Promise<Row[]> {
  try {
    const r = await fetch("https://remotive.com/api/remote-jobs?limit=200", { headers });
    if (!r.ok) return [];
    const j: any = await r.json();
    return (j?.jobs ?? []).map((x: any): Row => {
      const tags = Array.isArray(x.tags) ? x.tags.slice(0, 12) : [];
      return {
        external_id: `rmtv-${x.id}`,
        source: "Remotive",
        title: x.title ?? "Untitled role",
        company: x.company_name ?? "Unknown",
        company_logo: x.company_logo ?? null,
        category: x.category ?? null,
        normalized_category: normalizeCategory(x.title ?? "", x.category ?? null, tags),
        job_type: x.job_type ?? null,
        location: x.candidate_required_location ?? "Worldwide",
        is_remote: true,
        salary: x.salary ?? null,
        url: x.url ?? null,
        tags,
        publication_date: x.publication_date ?? null,
      };
    });
  } catch { return []; }
}

async function fetchArbeitnow(headers: Record<string, string>): Promise<Row[]> {
  try {
    const r = await fetch("https://arbeitnow.com/api/job-board-api", { headers });
    if (!r.ok) return [];
    const j: any = await r.json();
    return (j?.data ?? []).map((x: any): Row => {
      const tags = Array.isArray(x.tags) ? x.tags.slice(0, 12) : [];
      return {
        external_id: `arbn-${x.slug}`,
        source: "Arbeitnow",
        title: x.title ?? "Untitled role",
        company: x.company_name ?? "Unknown",
        company_logo: null,
        category: tags[0] ?? null,
        normalized_category: normalizeCategory(x.title ?? "", null, tags),
        job_type: Array.isArray(x.job_types) ? x.job_types[0] ?? null : null,
        location: x.remote ? "Remote" : x.location ?? "Worldwide",
        is_remote: !!x.remote,
        salary: null,
        url: x.url ?? null,
        tags,
        publication_date: x.created_at ? new Date(x.created_at * 1000).toISOString() : null,
      };
    });
  } catch { return []; }
}

async function fetchRemoteOK(headers: Record<string, string>): Promise<Row[]> {
  try {
    const r = await fetch("https://remoteok.com/api", { headers });
    if (!r.ok) return [];
    const j: any = await r.json();
    const arr = Array.isArray(j) ? j.filter((x) => x && x.id) : [];
    return arr.map((x: any): Row => {
      const tags = Array.isArray(x.tags) ? x.tags.slice(0, 12) : [];
      const title = x.position ?? x.title ?? "Untitled role";
      return {
        external_id: `rmok-${x.id}`,
        source: "RemoteOK",
        title,
        company: x.company ?? "Unknown",
        company_logo: x.company_logo ?? x.logo ?? null,
        category: tags[0] ?? null,
        normalized_category: normalizeCategory(title, null, tags),
        job_type: null,
        location: x.location || "Remote",
        is_remote: true,
        salary: x.salary || (x.salary_min && x.salary_max ? `$${x.salary_min} - $${x.salary_max}` : null),
        url: x.url ?? (x.slug ? `https://remoteok.com/remote-jobs/${x.slug}` : null),
        tags,
        publication_date: x.date ?? null,
      };
    });
  } catch { return []; }
}

export type SyncResult = {
  ok: boolean;
  upserted: number;
  sources: Record<string, number>;
  error?: string;
};

export async function runJobSync(): Promise<SyncResult> {
  const headers = { "User-Agent": "TalentBD/1.0 (+sync)" };
  const [rmtv, arbn, rmok] = await Promise.all([
    fetchRemotive(headers), fetchArbeitnow(headers), fetchRemoteOK(headers),
  ]);

  // Dedupe by external_id (keep first occurrence)
  const seen = new Set<string>();
  const rows: Row[] = [];
  for (const r of [...rmtv, ...arbn, ...rmok]) {
    if (!r.external_id || seen.has(r.external_id)) continue;
    seen.add(r.external_id);
    rows.push(r);
  }

  const sources = { Remotive: rmtv.length, Arbeitnow: arbn.length, RemoteOK: rmok.length };
  if (rows.length === 0) return { ok: true, upserted: 0, sources };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Batch upserts to stay within payload limits
  const BATCH = 250;
  let upserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH).map((r) => ({ ...r, fetched_at: new Date().toISOString() }));
    const { error, count } = await supabaseAdmin
      .from("external_jobs_cache")
      .upsert(slice, { onConflict: "external_id", count: "exact" });
    if (error) return { ok: false, upserted, sources, error: error.message };
    upserted += count ?? slice.length;
  }

  await supabaseAdmin
    .from("external_jobs_cache")
    .delete()
    .lt("fetched_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

  return { ok: true, upserted, sources };
}

async function handle(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const expected = process.env.JOBS_SYNC_SECRET;
  if (!expected || token !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json" },
    });
  }
  const result = await runJobSync();
  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 500,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/hooks/sync-external-jobs")({
  server: {
    handlers: {
      POST: async ({ request }) => handle(request),
      GET: async ({ request }) => handle(request),
    },
  },
});
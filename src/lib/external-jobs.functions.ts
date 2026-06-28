import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Fetches real remote jobs from the public Remotive API (no auth required, CORS-free server-side).
 * https://remotive.com/api-documentation
 */
export const listRemoteJobsExternal = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) =>
    z
      .object({
        search: z.string().max(120).optional(),
        category: z.string().max(80).optional(),
        limit: z.number().int().min(1).max(300).optional(),
      })
      .parse(i ?? {}),
  )
  .handler(async ({ data }) => {
    const limit = data.limit ?? 150;
    const headers = { "User-Agent": "TalentBD/1.0 (+https://talentbd.app)" };

    // ---- Source 0: cached (synced) jobs from our DB ----
    let cached: any[] = [];
    try {
      const sb = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
      );
      let q = sb
        .from("external_jobs_cache")
        .select("external_id,source,title,company,company_logo,category,normalized_category,job_type,location,is_remote,salary,url,tags,publication_date")
        .order("publication_date", { ascending: false, nullsFirst: false })
        .limit(limit);
      if (data.category) q = q.ilike("normalized_category", `%${data.category}%`);
      if (data.search) q = q.or(
        `title.ilike.%${data.search}%,company.ilike.%${data.search}%,category.ilike.%${data.search}%`,
      );
      const { data: rows } = await q;
      cached = (rows ?? []).map((r) => ({
        id: r.external_id,
        title: r.title,
        company: r.company,
        company_logo: r.company_logo,
        category: r.normalized_category ?? r.category,
        job_type: r.job_type,
        location: r.location ?? "Worldwide",
        salary: r.salary,
        url: r.url,
        publication_date: r.publication_date,
        tags: r.tags ?? [],
        source: r.source,
        is_remote: !!r.is_remote,
      }));
    } catch { cached = []; }

    // ---- Source 1: Remotive ----
    // Fetch broad; we filter client-side so partial / multi-keyword queries
    // ("network engineering", "devops", etc.) still return results even when
    // the upstream API's strict search returns nothing.
    const remotiveParams = new URLSearchParams();
    if (data.category) remotiveParams.set("category", data.category);
    remotiveParams.set("limit", String(limit));
    const remotiveP = fetch(`https://remotive.com/api/remote-jobs?${remotiveParams.toString()}`, { headers })
      .then((r) => (r.ok ? r.json() : { jobs: [] }))
      .then((j: any) =>
        (Array.isArray(j?.jobs) ? j.jobs : []).map((j: any) => ({
          id: `rmtv-${j.id}`,
          title: j.title ?? "Untitled role",
          company: j.company_name ?? "Unknown company",
          company_logo: j.company_logo ?? null,
          category: j.category ?? null,
          job_type: j.job_type ?? null,
          location: j.candidate_required_location ?? "Worldwide",
          salary: j.salary ?? null,
          url: j.url ?? null,
          publication_date: j.publication_date ?? null,
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
          source: "Remotive",
          is_remote: true,
        })),
      )
      .catch(() => [] as any[]);

    // ---- Source 2: Arbeitnow (free remote/EU board) ----
    const arbeitnowP = fetch("https://arbeitnow.com/api/job-board-api", { headers })
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j: any) =>
        (Array.isArray(j?.data) ? j.data : []).map((j: any) => ({
          id: `arbn-${j.slug}`,
          title: j.title ?? "Untitled role",
          company: j.company_name ?? "Unknown company",
          company_logo: null,
          category: Array.isArray(j.tags) && j.tags[0] ? j.tags[0] : null,
          job_type: Array.isArray(j.job_types) && j.job_types[0] ? j.job_types[0] : null,
          location: j.remote ? "Remote" : j.location ?? "Worldwide",
          salary: null,
          url: j.url ?? null,
          publication_date: j.created_at ? new Date(j.created_at * 1000).toISOString() : null,
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
          source: "Arbeitnow",
          is_remote: !!j.remote,
        })),
      )
      .catch(() => [] as any[]);

    // ---- Source 3: RemoteOK ----
    const remoteokP = fetch("https://remoteok.com/api", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((j: any) => {
        const arr = Array.isArray(j) ? j.filter((x) => x && x.id) : [];
        return arr.map((j: any) => ({
          id: `rmok-${j.id}`,
          title: j.position ?? j.title ?? "Untitled role",
          company: j.company ?? "Unknown company",
          company_logo: j.company_logo ?? j.logo ?? null,
          category: Array.isArray(j.tags) && j.tags[0] ? j.tags[0] : null,
          job_type: null,
          location: j.location || "Remote",
          salary: j.salary || (j.salary_min && j.salary_max ? `$${j.salary_min} - $${j.salary_max}` : null),
          url: j.url ?? (j.slug ? `https://remoteok.com/remote-jobs/${j.slug}` : null),
          publication_date: j.date ?? null,
          tags: Array.isArray(j.tags) ? j.tags.slice(0, 8) : [],
          source: "RemoteOK",
          is_remote: true,
        }));
      })
      .catch(() => [] as any[]);

    const [remotive, arbeitnow, remoteok] = await Promise.all([remotiveP, arbeitnowP, remoteokP]);
    let combined = [...cached, ...remotive, ...arbeitnow, ...remoteok];

    // Dedupe by id (cached first wins).
    const seen = new Set<string>();
    const deduped = combined.filter((j) => {
      if (!j?.id || seen.has(j.id)) return false;
      seen.add(j.id);
      return true;
    });

    // ---- Server-side relevance scoring + sorting ----
    const stem = (w: string) => w.replace(/(ing|ers|er|s)$/i, "");
    const tokens = (data.search ?? "")
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((t) => t.length >= 2)
      .map(stem);

    const scoreOf = (j: any) => {
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
        const days = (Date.now() - new Date(j.publication_date).getTime()) / 86_400_000;
        if (!Number.isNaN(days) && days >= 0) s += Math.max(0, 10 - Math.min(10, days / 3));
      }
      return s;
    };

    let pool = deduped;
    if (tokens.length) {
      // Keep only jobs with at least one keyword hit anywhere searchable.
      pool = deduped.filter((j) => {
        const hay = `${j.title ?? ""} ${j.company ?? ""} ${j.category ?? ""} ${(j.tags ?? []).join(" ")}`.toLowerCase();
        return tokens.some((t) => hay.includes(t));
      });
    }

    const scored = pool
      .map((j) => ({ j, s: scoreOf(j) }))
      .sort((a, b) => {
        if (b.s !== a.s) return b.s - a.s;
        const da = a.j.publication_date ? new Date(a.j.publication_date).getTime() : 0;
        const db = b.j.publication_date ? new Date(b.j.publication_date).getTime() : 0;
        return db - da;
      })
      .map((x) => x.j);

    return scored.slice(0, limit * 2);
  });

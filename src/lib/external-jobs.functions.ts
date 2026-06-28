import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { scoreAndSortJobs } from "./external-jobs.scoring";

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

    // ---- Source 4: The Muse (global on-site + remote, no key) ----
    // Docs: https://www.themuse.com/developers/api/v2
    const musePages = [1, 2, 3];
    const museP = Promise.all(
      musePages.map((page) =>
        fetch(`https://www.themuse.com/api/public/jobs?page=${page}&descending=true`, { headers })
          .then((r) => (r.ok ? r.json() : { results: [] }))
          .then((j: any) => (Array.isArray(j?.results) ? j.results : []))
          .catch(() => [] as any[]),
      ),
    ).then((batches) =>
      batches.flat().map((j: any) => {
        const loc = Array.isArray(j.locations) && j.locations[0]?.name ? j.locations[0].name : "Worldwide";
        const isRemote = /remote|flexible/i.test(loc);
        return {
          id: `muse-${j.id}`,
          title: j.name ?? "Untitled role",
          company: j.company?.name ?? "Unknown company",
          company_logo: null,
          category: Array.isArray(j.categories) && j.categories[0]?.name ? j.categories[0].name : null,
          job_type: Array.isArray(j.levels) && j.levels[0]?.name ? j.levels[0].name : null,
          location: loc,
          salary: null,
          url: j.refs?.landing_page ?? null,
          publication_date: j.publication_date ?? null,
          tags: [
            ...(Array.isArray(j.categories) ? j.categories.map((c: any) => c.name).filter(Boolean) : []),
            ...(Array.isArray(j.levels) ? j.levels.map((l: any) => l.name).filter(Boolean) : []),
          ].slice(0, 8),
          source: "The Muse",
          is_remote: isRemote,
        };
      }),
    );

    // ---- Source 5: Jobicy (remote + hybrid, no key) ----
    // Docs: https://jobicy.com/jobs-rss-feed
    const jobicyP = fetch("https://jobicy.com/api/v2/remote-jobs?count=50", { headers })
      .then((r) => (r.ok ? r.json() : { jobs: [] }))
      .then((j: any) =>
        (Array.isArray(j?.jobs) ? j.jobs : []).map((j: any) => ({
          id: `jbcy-${j.id}`,
          title: j.jobTitle ?? "Untitled role",
          company: j.companyName ?? "Unknown company",
          company_logo: j.companyLogo ?? null,
          category: Array.isArray(j.jobIndustry) ? j.jobIndustry[0] : j.jobIndustry ?? null,
          job_type: Array.isArray(j.jobType) ? j.jobType[0] : j.jobType ?? null,
          location: j.jobGeo || "Anywhere",
          salary:
            j.annualSalaryMin && j.annualSalaryMax
              ? `${j.salaryCurrency ?? "USD"} ${j.annualSalaryMin}-${j.annualSalaryMax}`
              : null,
          url: j.url ?? null,
          publication_date: j.pubDate ?? null,
          tags: [
            ...(Array.isArray(j.jobIndustry) ? j.jobIndustry : []),
            ...(Array.isArray(j.jobLevel) ? j.jobLevel : []),
          ].slice(0, 8),
          source: "Jobicy",
          is_remote: true,
        })),
      )
      .catch(() => [] as any[]);

    const [remotive, arbeitnow, remoteok, muse, jobicy] = await Promise.all([
      remotiveP,
      arbeitnowP,
      remoteokP,
      museP,
      jobicyP,
    ]);
    let combined = [...cached, ...remotive, ...arbeitnow, ...remoteok, ...muse, ...jobicy];

    // Dedupe by id (cached first wins).
    const seen = new Set<string>();
    const deduped = combined.filter((j) => {
      if (!j?.id || seen.has(j.id)) return false;
      seen.add(j.id);
      return true;
    });

    // ---- Server-side relevance scoring + stable sorting ----
    const scored = scoreAndSortJobs(deduped, data.search);
    return scored.slice(0, limit * 2);
  });

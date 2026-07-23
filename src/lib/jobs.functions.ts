import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicClient } from "@/integrations/supabase/client";
import { z } from "zod";

export const listJobsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient
    .from("job_marketplace")
    .select("*")
    .eq("is_live", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getJobPublic = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: job, error } = await publicClient
      .from("job_marketplace")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return job;
  });

export const getMyApplicationForJob = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ jobId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("job_applications")
      .select("id, status, created_at, cover_note")
      .eq("job_id", data.jobId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return app;
  });

export const listCompaniesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const [{ data: dbCos, error }, { data: ext }] = await Promise.all([
    publicClient.from("companies").select("*").order("name"),
    publicClient
      .from("external_jobs_cache")
      .select("company, company_logo, location, source")
      .order("company"),
  ]);
  if (error) throw new Error(error.message);
  const list = [...(dbCos ?? [])];
  const seen = new Set(list.map((c: any) => (c.name || "").toLowerCase()));
  const grouped = new Map<string, { name: string; logo: string | null; location: string | null; count: number; source: string }>();
  for (const row of ext ?? []) {
    const name = (row as any).company?.trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    const key = name.toLowerCase();
    const prev = grouped.get(key);
    grouped.set(key, {
      name,
      logo: prev?.logo ?? (row as any).company_logo ?? null,
      location: prev?.location ?? (row as any).location ?? null,
      count: (prev?.count ?? 0) + 1,
      source: (row as any).source,
    });
  }
  for (const g of grouped.values()) {
    const slug =
      "ext-" +
      g.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    list.push({
      id: slug,
      name: g.name,
      slug,
      logo_url: g.logo,
      location: g.location,
      industry: null,
      website: null,
      description: `Live openings sourced from ${g.source}. Click through to view roles.`,
      is_external: true,
    } as any);
  }
  return list.sort((a: any, b: any) => a.name.localeCompare(b.name));
});

export const getCompanyBySlug = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(i))
  .handler(async ({ data }) => {
    if (data.slug.startsWith("ext-")) {
      const { data: rows, error: rowsError } = await publicClient
        .from("external_jobs_cache")
        .select("*")
        .order("publication_date", { ascending: false });
      if (rowsError) throw new Error(rowsError.message);
      const matches = (rows ?? []).filter(
        (r: any) =>
          "ext-" + r.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ===
          data.slug,
      );
      if (matches.length === 0) return null;
      const first: any = matches[0];
      return {
        company: {
          id: data.slug,
          name: first.company,
          slug: data.slug,
          logo_url: first.company_logo,
          location: first.location,
          industry: null,
          website: null,
          description: `Live openings from ${first.source}.`,
          is_external: true,
        },
        jobs: matches.map((m: any) => ({
          id: m.external_id,
          job_title: m.title,
          location: m.location,
          job_type: m.job_type,
          experience_level: null,
          is_remote: m.is_remote,
          is_featured: false,
          salary_range: m.salary,
          external_url: m.url,
          source: m.source,
        })),
      };
    }
    const { data: company, error } = await publicClient
      .from("companies")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!company) return null;
    const { data: jobs, error: jobsError } = await publicClient
      .from("job_marketplace")
      .select("*")
      .eq("is_live", true)
      .or(`company_id.eq.${company.id},company.eq.${company.name}`)
      .order("created_at", { ascending: false });
    if (jobsError) throw new Error(jobsError.message);
    return { company, jobs: jobs ?? [] };
  });

const jobSchema = z.object({
  id: z.string().uuid().optional(),
  job_title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().optional().nullable(),
  is_remote: z.boolean(),
  salary_range: z.string().optional().nullable(),
  requirements: z.array(z.string()),
  discipline: z.string().optional().nullable(),
  is_live: z.boolean(),
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  experience_level: z.string().optional().nullable(),
  job_type: z.string().optional().nullable(),
  application_deadline: z.string().optional().nullable(),
  is_featured: z.boolean().optional(),
  company_id: z.string().uuid().optional().nullable(),
});

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
}

export const adminListJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("job_marketplace")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => jobSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = data.id
      ? await context.supabase.from("job_marketplace").update(data).eq("id", data.id)
      : await context.supabase.from("job_marketplace").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleJobLive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; is_live: boolean }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("job_marketplace")
      .update({ is_live: data.is_live })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("job_marketplace").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Applications */

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      jobId: z.string().uuid(),
      coverNote: z.string().max(2000).optional(),
      method: z.enum(["internal", "external"]).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const method = data.method ?? "internal";
    const prefix = method === "external" ? "[Applied on company site] " : "";
    // Snapshot the applicant's profile + latest CV so the employer receives
    // it together with the application (auto-submitted with every apply).
    const [profileRes, cvRes] = await Promise.all([
      context.supabase.from("profiles").select("name, discipline, skills").eq("id", context.userId).maybeSingle(),
      context.supabase.from("cv_records").select("selected_style, builder_payload, updated_at").eq("user_id", context.userId).maybeSingle(),
    ]);
    const snapshotError = profileRes.error ?? cvRes.error;
    if (snapshotError) throw new Error(snapshotError.message);
    const profile = profileRes.data;
    const cv = cvRes.data;
    const snapshot = {
      profile: profile ?? null,
      cv: cv ?? null,
      submitted_at: new Date().toISOString(),
    };
    const body = (data.coverNote ?? "").trim();
    const note =
      `${prefix}${body}\n\n---APPLICANT_SNAPSHOT---\n${JSON.stringify(snapshot)}`.trim() || null;
    // Upsert so re-applying always attaches the applicant's LATEST CV/profile
    // snapshot to the employer's view of the application.
    const { error } = await context.supabase
      .from("job_applications")
      .upsert(
        {
          job_id: data.jobId,
          user_id: context.userId,
          cover_note: note,
          stage_updated_at: new Date().toISOString(),
        },
        { onConflict: "job_id,user_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true, method, resubmitted: true };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("job_applications")
      .select("id, status, created_at, cover_note, job:job_marketplace(id, job_title, company, location, is_remote, application_deadline)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const withdrawApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Companies admin */

const companySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, dashes only"),
  logo_url: z.string().url().optional().nullable().or(z.literal("")),
  website: z.string().url().optional().nullable().or(z.literal("")),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const adminListCompanies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase.from("companies").select("*").order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpsertCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => companySchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const payload = { ...data, logo_url: data.logo_url || null, website: data.website || null };
    const { error } = data.id
      ? await context.supabase.from("companies").update(payload).eq("id", data.id)
      : await context.supabase.from("companies").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("companies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Admin-only: manually trigger the external-jobs sync from the admin UI.
export const adminRunJobsSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const mod = await import("@/routes/api/public/hooks/sync-external-jobs");
    const startedAt = Date.now();
    const result = await mod.runJobSync();
    return { ...result, durationMs: Date.now() - startedAt };
  });

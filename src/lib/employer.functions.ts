import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function myCompany(supabase: any, userId: string) {
  const { data } = await supabase
    .from("company_members")
    .select("company_id, company:companies(*)")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (!data) throw new Error("No company linked to this account");
  return { companyId: data.company_id as string, company: data.company };
}

export const getMyCompany = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("company_members")
      .select("company_id, role, company:companies(*)")
      .eq("user_id", context.userId)
      .maybeSingle();
    return data;
  });

export const updateMyCompany = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      name: z.string().min(1).max(120),
      website: z.string().url().or(z.literal("")).optional().nullable(),
      logo_url: z.string().url().or(z.literal("")).optional().nullable(),
      industry: z.string().max(120).optional().nullable(),
      location: z.string().max(160).optional().nullable(),
      description: z.string().max(4000).optional().nullable(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { companyId } = await myCompany(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("companies")
      .update({
        name: data.name,
        website: data.website || null,
        logo_url: data.logo_url || null,
        industry: data.industry || null,
        location: data.location || null,
        description: data.description || null,
      })
      .eq("id", companyId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createCompanyForMe = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ name: z.string().min(1).max(120), website: z.string().url().or(z.literal("")).optional() }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const slug =
      data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
      "-" +
      context.userId.slice(0, 6);
    const { data: company, error } = await context.supabase
      .from("companies")
      .insert({ name: data.name, slug, website: data.website || null })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    const { error: e2 } = await context.supabase
      .from("company_members")
      .insert({ company_id: company.id, user_id: context.userId, role: "owner" });
    if (e2) throw new Error(e2.message);
    return { ok: true, companyId: company.id };
  });

export const employerListJobs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { companyId } = await myCompany(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("job_marketplace")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const jobInput = z.object({
  id: z.string().uuid().optional(),
  job_title: z.string().min(1).max(160),
  description: z.string().max(8000).optional().nullable(),
  is_remote: z.boolean(),
  salary_range: z.string().max(80).optional().nullable(),
  requirements: z.array(z.string().max(200)).max(20),
  discipline: z.string().max(80).optional().nullable(),
  is_live: z.boolean(),
  category: z.string().max(80).optional().nullable(),
  location: z.string().max(160).optional().nullable(),
  experience_level: z.string().max(80).optional().nullable(),
  job_type: z.string().max(80).optional().nullable(),
  application_deadline: z.string().optional().nullable(),
});

export const employerUpsertJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => jobInput.parse(i))
  .handler(async ({ data, context }) => {
    const { companyId, company } = await myCompany(context.supabase, context.userId);
    const payload = { ...data, company_id: companyId, company: (company as any)?.name ?? "" };
    const { error } = data.id
      ? await context.supabase.from("job_marketplace").update(payload).eq("id", data.id)
      : await context.supabase.from("job_marketplace").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const employerDeleteJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("job_marketplace").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const employerListApplicants = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ jobId: z.string().uuid().optional() }).parse(i))
  .handler(async ({ data, context }) => {
    const { companyId } = await myCompany(context.supabase, context.userId);
    let q = context.supabase
      .from("job_applications")
      .select("id, status, stage, created_at, cover_note, user_id, job:job_marketplace!inner(id, job_title, company_id), applicant:profiles(id, name, discipline)")
      .eq("job.company_id", companyId)
      .order("created_at", { ascending: false });
    if (data.jobId) q = q.eq("job_id", data.jobId);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const employerGetApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("job_applications")
      .select("*, job:job_marketplace(*), applicant:profiles(id, name, discipline, skills)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return app;
  });

export const updateApplicationStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      id: z.string().uuid(),
      stage: z.enum(["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"]),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .update({ stage: data.stage, stage_updated_at: new Date().toISOString(), status: data.stage })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
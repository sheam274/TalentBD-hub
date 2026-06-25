import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, name, discipline, created_at")
      .order("created_at", { ascending: false });
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const { data: creds } = await supabaseAdmin
      .from("user_credentials")
      .select("user_id, credential_name, score, verified_at")
      .order("verified_at", { ascending: false });
    return {
      profiles: profiles ?? [],
      roles: roles ?? [],
      credentials: creds ?? [],
    };
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      userId: z.string().uuid(),
      role: z.enum(["admin", "student"]),
      grant: z.boolean(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: data.userId, role: data.role })
        .select();
      if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminAdjustCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      userId: z.string().uuid(),
      credentialName: z.string().min(1),
      score: z.number().min(0).max(100),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("user_credentials").insert({
      user_id: data.userId,
      credential_name: data.credentialName,
      score: data.score,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ count: users }, { count: modules }, { count: jobs }, { count: creds }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("learning_modules").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("job_marketplace").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("user_credentials").select("*", { count: "exact", head: true }),
    ]);
    return { users: users ?? 0, modules: modules ?? 0, jobs: jobs ?? 0, credentials: creds ?? 0 };
  });

/* Admin views for new workflow tables */

export const adminListEmployers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "employer");
    const ids = (roles ?? []).map((r: any) => r.user_id);
    if (!ids.length) return [];
    const { data: profiles } = await supabaseAdmin.from("profiles").select("*").in("id", ids);
    const { data: members } = await supabaseAdmin
      .from("company_members")
      .select("user_id, role, company:companies(id, name, slug)")
      .in("user_id", ids);
    return (profiles ?? []).map((p: any) => ({
      ...p,
      companies: (members ?? []).filter((m: any) => m.user_id === p.id),
    }));
  });

export const adminListApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("job_applications")
      .select("id, status, stage, created_at, user_id, job:job_marketplace(id, job_title, company), applicant:profiles(name)")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const adminListInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("interview_invitations")
      .select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))")
      .order("scheduled_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const adminListLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("appointment_letters")
      .select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))")
      .order("issued_at", { ascending: false })
      .limit(200);
    return data ?? [];
  });

export const adminDeleteRow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      table: z.enum(["interview_invitations", "appointment_letters", "application_messages", "job_applications"]),
      id: z.string().uuid(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin as any).from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

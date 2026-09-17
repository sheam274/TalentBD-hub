import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (rolesError) throw new Error(rolesError.message);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
  // Defense-in-depth: main-admin CRUD is locked to the email allowlist even
  // if the admin role was granted by another means.
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: u, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (userError) throw new Error(userError.message);
  const email = (u?.user?.email ?? "").toLowerCase();
  const ALLOWED = ["sheam.rahman99@gmail.com", "sheam.rahman@outlook.com"];
  if (!ALLOWED.includes(email)) throw new Error("Forbidden");
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, discipline, created_at")
      .order("created_at", { ascending: false });
    if (profilesError) throw new Error(profilesError.message);
    const { data: roles, error: rolesError } = await supabaseAdmin.from("user_roles").select("user_id, role");
    if (rolesError) throw new Error(rolesError.message);
    const { data: creds, error: credsError } = await supabaseAdmin
      .from("user_credentials")
      .select("user_id, credential_name, score, verified_at")
      .order("verified_at", { ascending: false });
    if (credsError) throw new Error(credsError.message);
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

export const adminPromoteByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      email: z.string().trim().toLowerCase().email(),
      role: z.enum(["admin", "employer", "student"]).default("admin"),
      grant: z.boolean().default(true),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Find user by email via Auth Admin API
    let target: { id: string; email?: string } | null = null;
    for (let page = 1; page <= 20 && !target; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      const found = list.users.find((u) => (u.email ?? "").toLowerCase() === data.email);
      if (found) target = { id: found.id, email: found.email ?? undefined };
      if (list.users.length < 200) break;
    }
    if (!target) throw new Error(`No user found with email ${data.email}`);
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: target.id, role: data.role });
      if (error && !error.message.toLowerCase().includes("duplicate")) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", target.id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true, userId: target.id, email: target.email };
  });

export const adminListAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (rolesError) throw new Error(rolesError.message);
    const ids = (roles ?? []).map((r: any) => r.user_id);
    if (!ids.length) return [];
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("id, name, discipline, created_at")
      .in("id", ids);
    if (profilesError) throw new Error(profilesError.message);
    // Enrich with email via Auth Admin API
    const byId = new Map<string, string | undefined>();
    for (let page = 1; page <= 20; page++) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      list.users.forEach((u) => { if (ids.includes(u.id)) byId.set(u.id, u.email ?? undefined); });
      if (list.users.length < 200) break;
    }
    return (profiles ?? []).map((p: any) => ({ ...p, email: byId.get(p.id) ?? null }));
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("user_credentials").insert({
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
    const head = { count: "exact" as const, head: true };
    const [
      users, modules, jobs, creds, companies, applications,
      employers, interviews, letters, liveJobs, cachedJobs,
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", head),
      supabaseAdmin.from("learning_modules").select("*", head),
      supabaseAdmin.from("job_marketplace").select("*", head),
      supabaseAdmin.from("user_credentials").select("*", head),
      supabaseAdmin.from("companies").select("*", head),
      supabaseAdmin.from("job_applications").select("*", head),
      supabaseAdmin.from("user_roles").select("*", head).eq("role", "employer"),
      supabaseAdmin.from("interview_sessions").select("*", head),
      supabaseAdmin.from("appointment_letters").select("*", head),
      supabaseAdmin.from("job_marketplace").select("*", head).eq("is_live", true),
      supabaseAdmin.from("external_jobs_cache").select("*", head),
    ]);
    const statErr = [
      users, modules, jobs, creds, companies, applications,
      employers, interviews, letters, liveJobs, cachedJobs,
    ].find((r) => r.error);
    if (statErr?.error) throw new Error(statErr.error.message);
    return {
      users: users.count ?? 0,
      employers: employers.count ?? 0,
      companies: companies.count ?? 0,
      jobs: jobs.count ?? 0,
      liveJobs: liveJobs.count ?? 0,
      cachedJobs: cachedJobs.count ?? 0,
      applications: applications.count ?? 0,
      interviews: interviews.count ?? 0,
      letters: letters.count ?? 0,
      modules: modules.count ?? 0,
      credentials: creds.count ?? 0,
    };
  });

/* Admin views for new workflow tables */

export const adminListEmployers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "employer");
    if (rolesError) throw new Error(rolesError.message);
    const ids = (roles ?? []).map((r: any) => r.user_id);
    if (!ids.length) return [];
    const { data: profiles, error: profilesError } = await supabaseAdmin.from("profiles").select("*").in("id", ids);
    if (profilesError) throw new Error(profilesError.message);
    const { data: members, error: membersError } = await supabaseAdmin
      .from("company_members")
      .select("user_id, role, company:companies(id, name, slug)")
      .in("user_id", ids);
    if (membersError) throw new Error(membersError.message);
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
    const { data, error } = await supabaseAdmin
      .from("job_applications")
      .select("id, status, stage, created_at, user_id, job:job_marketplace(id, job_title, company), applicant:profiles(name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("interview_invitations")
      .select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))")
      .order("scheduled_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("appointment_letters")
      .select("*, application:job_applications(id, user_id, job:job_marketplace(job_title, company))")
      .order("issued_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
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

/* ============= Database browser ============= */

export const ADMIN_BROWSABLE_TABLES = [
  "profiles",
  "user_roles",
  "user_credentials",
  "companies",
  "company_members",
  "job_marketplace",
  "job_applications",
  "application_messages",
  "appointment_letters",
  "interview_sessions",
  "interview_invitations",
  "interview_questions",
  "interview_answers",
  "learning_modules",
  "skill_quizzes",
  "cv_records",
  "external_jobs_cache",
] as const;

export type AdminBrowsableTable = (typeof ADMIN_BROWSABLE_TABLES)[number];

export const adminListTables = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const results = await Promise.all(
      ADMIN_BROWSABLE_TABLES.map(async (t) => {
        const { count, error } = await (supabaseAdmin as any)
          .from(t)
          .select("*", { count: "exact", head: true });
        if (error) throw new Error(`${t}: ${error.message}`);
        return { table: t, count: count ?? 0 };
      }),
    );
    return results;
  });

export const adminBrowseTable = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      table: z.enum(ADMIN_BROWSABLE_TABLES as unknown as [string, ...string[]]),
      page: z.number().int().min(0).default(0),
      pageSize: z.number().int().min(1).max(100).default(25),
      search: z.string().trim().max(200).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const from = data.page * data.pageSize;
    const to = from + data.pageSize - 1;
    let q: any = (supabaseAdmin as any).from(data.table).select("*", { count: "exact" });
    if (data.search) {
      // Try matching by id if it looks like a uuid; otherwise no-op (table-specific search is out of scope)
      const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuid.test(data.search)) q = q.eq("id", data.search);
    }
    const { data: rows, count, error } = await q.range(from, to);
    if (error) throw new Error(error.message);
    const columns = rows && rows.length ? Object.keys(rows[0]) : [];
    return {
      table: data.table,
      page: data.page,
      pageSize: data.pageSize,
      total: count ?? 0,
      columns,
      rows: rows ?? [],
    };
  });

const AUDIT_TABLES = [
  "job_marketplace",
  "job_applications",
  "interview_sessions",
  "appointment_letters",
] as const;

export const adminListAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      table: z.enum(["all", ...AUDIT_TABLES] as unknown as [string, ...string[]]).default("all"),
      operation: z.enum(["all", "INSERT", "UPDATE", "DELETE"]).default("all"),
      actorEmail: z.string().trim().toLowerCase().optional(),
      rowId: z.string().trim().optional(),
      limit: z.number().int().min(1).max(500).default(100),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Optional email → user_id resolution
    let actorId: string | undefined;
    if (data.actorEmail) {
      for (let page = 1; page <= 10 && !actorId; page++) {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
        const found = list?.users.find((u) => (u.email ?? "").toLowerCase() === data.actorEmail);
        if (found) actorId = found.id;
        if (!list?.users.length || list.users.length < 200) break;
      }
      if (!actorId) return { rows: [], emailMap: {} as Record<string, string> };
    }

    let q: any = (supabaseAdmin as any)
      .from("audit_logs")
      .select("id, occurred_at, actor_id, table_name, row_pk, operation, changed_fields, old_data, new_data")
      .order("occurred_at", { ascending: false })
      .limit(data.limit);
    if (data.table !== "all") q = q.eq("table_name", data.table);
    if (data.operation !== "all") q = q.eq("operation", data.operation);
    if (actorId) q = q.eq("actor_id", actorId);
    if (data.rowId) q = q.eq("row_pk", data.rowId);

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    // Map actor_ids to emails for display
    const emailMap: Record<string, string> = {};
    const actorIds = Array.from(new Set((rows ?? []).map((r: any) => r.actor_id).filter(Boolean)));
    if (actorIds.length) {
      // Best-effort: page through auth users once
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      for (const u of list?.users ?? []) {
        if (u.email && actorIds.includes(u.id)) emailMap[u.id] = u.email;
      }
    }
    return { rows: rows ?? [], emailMap };
  });

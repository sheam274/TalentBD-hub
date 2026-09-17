import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (profileError) throw new Error(profileError.message);
    const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (rolesError) throw new Error(rolesError.message);
    const ALLOWED_ADMIN_EMAILS = ["sheam.rahman99@gmail.com", "sheam.rahman@outlook.com"];
    const email = (claims as { email?: string } | undefined)?.email?.toLowerCase() ?? "";
    const hasAdminRole = !!roles?.some((r: { role: string }) => r.role === "admin");
    const isAdmin = hasAdminRole && ALLOWED_ADMIN_EMAILS.includes(email);
    const isEmployer = !!roles?.some((r: { role: string }) => r.role === "employer");
    const { data: memberships, error: membershipsError } = await supabase
      .from("company_members")
      .select("company_id, role, company:companies(id, name, slug, logo_url)")
      .eq("user_id", userId);
    if (membershipsError) throw new Error(membershipsError.message);
    return { profile, isAdmin, isEmployer, memberships: memberships ?? [] };
  });

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { name?: string; discipline?: string; skills?: string[] }) => input)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name ?? null,
        discipline: data.discipline ?? null,
        skills: data.skills ?? [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

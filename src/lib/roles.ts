import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Emails permitted to exercise main-admin privileges. Admin-role grants are
 * only honoured for these accounts (defense-in-depth against a stray role row).
 */
export const ADMIN_EMAIL_ALLOWLIST = ["sheam.rahman99@gmail.com", "sheam.rahman@outlook.com"];

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  return ADMIN_EMAIL_ALLOWLIST.includes((email ?? "").toLowerCase());
}

type RoleRow = { role: string };

export function hasRole(roles: RoleRow[] | null | undefined, role: string): boolean {
  return !!roles?.some((r) => r.role === role);
}

/** Load the role rows for a user via their (RLS-scoped) Supabase client. */
export async function fetchUserRoles(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<RoleRow[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return data ?? [];
}

/** Throw "Forbidden" unless the user holds the admin role. */
export async function assertAdminRole(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const roles = await fetchUserRoles(supabase, userId);
  if (!hasRole(roles, "admin")) throw new Error("Forbidden");
}

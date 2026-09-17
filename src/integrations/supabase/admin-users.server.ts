// Server-only helpers around the Supabase Auth Admin API.
// The Auth Admin `listUsers` endpoint supports pagination but not filtering,
// so email lookups require scanning pages. These helpers centralise that
// pattern (and the main-admin allowlist check) so handlers don't duplicate it.
//
// Load inside server handlers only:
//   const { findAuthUserByEmail } = await import("@/integrations/supabase/admin-users.server");
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseAdmin } from "./client.server";
import type { Database } from "./types";
import { assertAdminRole, isAllowedAdminEmail } from "@/lib/roles";

const PER_PAGE = 200;
const DEFAULT_MAX_PAGES = 20;

/** Scan the auth users list for a matching email. Returns null if not found. */
export async function findAuthUserByEmail(
  email: string,
  maxPages = DEFAULT_MAX_PAGES,
): Promise<User | null> {
  const target = email.trim().toLowerCase();
  for (let page = 1; page <= maxPages; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) throw new Error(error.message);
    const found = data.users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (found) return found;
    if (data.users.length < PER_PAGE) break;
  }
  return null;
}

/** Build a { userId: email } map for the given ids by paging through auth users. */
export async function getEmailsByUserIds(
  userIds: string[],
  maxPages = DEFAULT_MAX_PAGES,
): Promise<Record<string, string>> {
  const wanted = new Set(userIds);
  const map: Record<string, string> = {};
  if (!wanted.size) return map;
  for (let page = 1; page <= maxPages; page++) {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE });
    for (const u of data?.users ?? []) {
      if (u.email && wanted.has(u.id)) map[u.id] = u.email;
    }
    if (!data?.users.length || data.users.length < PER_PAGE) break;
  }
  return map;
}

/**
 * Assert the user is a main admin: holds the admin role AND their auth email is
 * on the allowlist. Locks privileged CRUD to the allowlist even if the admin
 * role was granted by other means.
 */
export async function assertMainAdmin(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  await assertAdminRole(supabase, userId);
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (!isAllowedAdminEmail(data?.user?.email)) throw new Error("Forbidden");
}

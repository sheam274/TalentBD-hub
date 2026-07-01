import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkEmailExists = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ email: z.string().email() }).parse(data))
  .handler(async ({ data }): Promise<{ exists: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Best-effort search; admin listUsers supports pagination not filter, so scan first page.
    // For scale, consider a dedicated RPC. Emails are lowercased in auth.users.
    const email = data.email.trim().toLowerCase();
    let page = 1;
    const perPage = 200;
    for (let i = 0; i < 5; i++) {
      const { data: res, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) return { exists: false };
      if (res.users.some((u) => (u.email ?? "").toLowerCase() === email)) return { exists: true };
      if (res.users.length < perPage) break;
      page++;
    }
    return { exists: false };
  });
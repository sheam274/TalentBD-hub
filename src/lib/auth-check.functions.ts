import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkEmailExists = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ email: z.string().email() }).parse(data))
  .handler(async ({ data }): Promise<{ exists: boolean }> => {
    const { findAuthUserByEmail } = await import("@/integrations/supabase/admin-users.server");
    // Best-effort: scan up to 5 pages of auth users (listUsers can't filter by email).
    try {
      return { exists: !!(await findAuthUserByEmail(data.email, 5)) };
    } catch {
      return { exists: false };
    }
  });
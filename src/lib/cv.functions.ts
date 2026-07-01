import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getMyCv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("cv_records")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const cvSchema = z.object({
  selected_style: z.enum(["standard", "premium"]),
  builder_payload: z.record(z.string(), z.unknown()),
});

export const saveMyCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => cvSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("cv_records")
      .upsert(
        {
          user_id: userId,
          selected_style: data.selected_style,
          builder_payload: data.builder_payload as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(error.message);

    // Sync key fields into profiles so the dashboard reflects edits.
    const p = (data.builder_payload ?? {}) as Record<string, unknown>;
    const name = typeof p.name === "string" ? p.name.trim() : "";
    const discipline = typeof p.title === "string" ? p.title.trim() : "";
    const skills =
      typeof p.skills === "string"
        ? p.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(p.skills)
          ? (p.skills as unknown[]).map(String)
          : [];
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (name) patch.name = name;
    if (discipline) patch.discipline = discipline;
    patch.skills = skills;
    await supabase.from("profiles").update(patch).eq("id", userId);

    return { ok: true };
  });

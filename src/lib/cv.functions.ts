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
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("cv_records")
      .upsert(
        {
          user_id: userId,
          selected_style: data.selected_style,
          builder_payload: data.builder_payload as any,
          updated_at: now,
        },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(error.message);

    // Sync key fields into profiles so the dashboard reflects edits.
    const p = (data.builder_payload ?? {}) as Record<string, unknown>;
    const name = typeof p.name === "string" ? p.name.trim() : "";
    const discipline = typeof p.title === "string" ? p.title.trim() : "";
    const photo = typeof p.photo === "string" ? p.photo.trim() : "";
    const skills =
      typeof p.skills === "string"
        ? p.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : Array.isArray(p.skills)
          ? (p.skills as unknown[]).map(String)
          : [];
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          name: name || null,
          discipline: discipline || null,
          avatar_url: photo || null,
          skills,
          updated_at: now,
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();
    if (profileError) throw new Error(profileError.message);

    return {
      ok: true,
      profile,
      cvUpdatedAt: now,
    };
  });

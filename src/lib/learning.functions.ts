import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicClient } from "@/integrations/supabase/client";
import { z } from "zod";

export const listModulesPublic = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient
    .from("learning_modules")
    .select("id, discipline, section_slug, title, description, video_url")
    .order("discipline")
    .order("title");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getModulePublic = createServerFn({ method: "GET" })
  .inputValidator((i: { discipline: string; slug: string }) => i)
  .handler(async ({ data }) => {
    const { data: mod, error } = await publicClient
      .from("learning_modules")
      .select("*")
      .eq("discipline", data.discipline)
      .eq("section_slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!mod) return null;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: quizzes, error: quizzesError } = await supabaseAdmin
      .from("skill_quizzes")
      .select("id, question, choices")
      .eq("module_id", mod.id);
    if (quizzesError) throw new Error(quizzesError.message);
    return { module: mod, quizzes: quizzes ?? [] };
  });

const moduleSchema = z.object({
  id: z.string().uuid().optional(),
  discipline: z.string().min(1),
  section_slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  video_url: z.string().optional().nullable(),
  documentation_body: z.string().optional().nullable(),
});

export const adminUpsertModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => moduleSchema.parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (rolesError) throw new Error(rolesError.message);
    if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
    const payload = { ...data, updated_at: new Date().toISOString(), created_by: userId };
    const { error } = data.id
      ? await supabase.from("learning_modules").update(payload).eq("id", data.id)
      : await supabase.from("learning_modules").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (rolesError) throw new Error(rolesError.message);
    if (!roles?.some((r: { role: string }) => r.role === "admin")) throw new Error("Forbidden");
    const { error } = await supabase.from("learning_modules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getExamQuiz = createServerFn({ method: "GET" })
  .inputValidator((i: { slugs: string[] }) => i)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: mods, error: modsError } = await supabaseAdmin
      .from("learning_modules")
      .select("id, section_slug, title")
      .eq("discipline", "Computer Science")
      .in("section_slug", data.slugs);
    if (modsError) throw new Error(modsError.message);
    const modIds = (mods ?? []).map((m) => m.id);
    if (modIds.length === 0) return { modules: [], questions: [] };
    const { data: qs, error: qsError } = await supabaseAdmin
      .from("skill_quizzes")
      .select("id, module_id, question, choices")
      .in("module_id", modIds);
    if (qsError) throw new Error(qsError.message);
    const byId = new Map((mods ?? []).map((m) => [m.id, m]));
    const questions = (qs ?? []).map((q) => ({
      ...q,
      module_slug: byId.get(q.module_id)?.section_slug ?? "",
      module_title: byId.get(q.module_id)?.title ?? "",
    }));
    return { modules: mods ?? [], questions };
  });

export const gradeExamQuiz = createServerFn({ method: "POST" })
  .inputValidator((i: { answers: Record<string, string> }) => i)
  .handler(async ({ data }) => {
    const ids = Object.keys(data.answers);
    if (ids.length === 0) return { results: {} as Record<string, { correct: boolean; correct_answer: string }> };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: qs, error } = await supabaseAdmin
      .from("skill_quizzes")
      .select("id, correct_answer")
      .in("id", ids);
    if (error) throw new Error(error.message);
    const results: Record<string, { correct: boolean; correct_answer: string }> = {};
    for (const q of qs ?? []) {
      results[q.id] = {
        correct_answer: q.correct_answer,
        correct: data.answers[q.id] === q.correct_answer,
      };
    }
    return { results };
  });

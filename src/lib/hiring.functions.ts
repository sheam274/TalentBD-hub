import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

/* Messages */
export const listMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ applicationId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("application_messages")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({ applicationId: z.string().uuid(), body: z.string().min(1).max(4000) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("application_messages").insert({
      application_id: data.applicationId,
      sender_id: context.userId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* Interview invitations */
export const scheduleInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      scheduledAt: z.string().min(5),
      meetingUrl: z.string().url(),
      provider: z.string().max(40).optional(),
      notes: z.string().max(2000).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("interview_invitations").insert({
      application_id: data.applicationId,
      scheduled_at: data.scheduledAt,
      meeting_url: data.meetingUrl,
      provider: data.provider ?? null,
      notes: data.notes ?? null,
      created_by: context.userId,
    });
    if (error) throw new Error(error.message);
    await context.supabase
      .from("job_applications")
      .update({ stage: "interview", stage_updated_at: new Date().toISOString(), status: "interview" })
      .eq("id", data.applicationId);
    return { ok: true };
  });

export const listInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ applicationId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("interview_invitations")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("scheduled_at", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

/* Appointment letters */
export const issueAppointmentLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      applicationId: z.string().uuid(),
      position: z.string().min(1).max(160),
      salary: z.string().max(80).optional(),
      startDate: z.string().optional(),
      body: z.string().min(10).max(8000),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { data: letter, error } = await context.supabase
      .from("appointment_letters")
      .insert({
        application_id: data.applicationId,
        position: data.position,
        salary: data.salary ?? null,
        start_date: data.startDate || null,
        body: data.body,
        issued_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    await context.supabase
      .from("job_applications")
      .update({ stage: "offer", stage_updated_at: new Date().toISOString(), status: "offer" })
      .eq("id", data.applicationId);
    return { ok: true, id: letter.id as string };
  });

export const getLetter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: letter, error } = await context.supabase
      .from("appointment_letters")
      .select("*, application:job_applications(*, job:job_marketplace(job_title, company), applicant:profiles(name))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return letter;
  });

export const listLettersForApp = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ applicationId: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("appointment_letters")
      .select("*")
      .eq("application_id", data.applicationId)
      .order("issued_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const acceptLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: letter, error: e0 } = await context.supabase
      .from("appointment_letters")
      .select("application_id")
      .eq("id", data.id)
      .maybeSingle();
    if (e0 || !letter) throw new Error("Letter not found");
    const { error } = await context.supabase
      .from("appointment_letters")
      .update({ accepted_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await context.supabase
      .from("job_applications")
      .update({ stage: "hired", stage_updated_at: new Date().toISOString(), status: "hired" })
      .eq("id", letter.application_id);
    return { ok: true };
  });

/* Tracking page for applicants */
export const getMyApplicationTracking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("job_applications")
      .select("*, job:job_marketplace(*)")
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error || !app) throw new Error("Application not found");
    const [{ data: invites }, { data: letters }, { data: messages }] = await Promise.all([
      context.supabase.from("interview_invitations").select("*").eq("application_id", data.id).order("scheduled_at"),
      context.supabase.from("appointment_letters").select("*").eq("application_id", data.id).order("issued_at", { ascending: false }),
      context.supabase.from("application_messages").select("*").eq("application_id", data.id).order("created_at"),
    ]);
    return { app, invites: invites ?? [], letters: letters ?? [], messages: messages ?? [] };
  });
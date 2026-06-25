import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { employerGetApplication, updateApplicationStage } from "@/lib/employer.functions";
import { listMessages, sendMessage, scheduleInterview, listInvitations, issueAppointmentLetter, listLettersForApp } from "@/lib/hiring.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/employer/applicants/$appId")({
  head: () => ({ meta: [{ title: "Applicant" }] }),
  component: Page,
});

const STAGES = ["applied", "screening", "interview", "offer", "hired", "rejected"] as const;

function Page() {
  const { appId } = Route.useParams();
  const getFn = useServerFn(employerGetApplication);
  const stageFn = useServerFn(updateApplicationStage);
  const msgsFn = useServerFn(listMessages);
  const sendFn = useServerFn(sendMessage);
  const schedFn = useServerFn(scheduleInterview);
  const invFn = useServerFn(listInvitations);
  const issueFn = useServerFn(issueAppointmentLetter);
  const lettersFn = useServerFn(listLettersForApp);
  const qc = useQueryClient();

  const app = useQuery({ queryKey: ["emp-app", appId], queryFn: () => getFn({ data: { id: appId } }) });
  const msgs = useQuery({ queryKey: ["msgs", appId], queryFn: () => msgsFn({ data: { applicationId: appId } }), refetchInterval: 8000 });
  const inv = useQuery({ queryKey: ["inv", appId], queryFn: () => invFn({ data: { applicationId: appId } }) });
  const letters = useQuery({ queryKey: ["letters", appId], queryFn: () => lettersFn({ data: { applicationId: appId } }) });

  const [msg, setMsg] = useState("");
  const [schedule, setSchedule] = useState({ scheduledAt: "", meetingUrl: "", provider: "Zoom", notes: "" });
  const [offer, setOffer] = useState({ position: "", salary: "", startDate: "", body: "" });

  const sendM = useMutation({
    mutationFn: () => sendFn({ data: { applicationId: appId, body: msg } }),
    onSuccess: () => { setMsg(""); qc.invalidateQueries({ queryKey: ["msgs", appId] }); },
  });
  const stageM = useMutation({
    mutationFn: (s: any) => stageFn({ data: { id: appId, stage: s } }),
    onSuccess: () => { toast.success("Stage updated"); qc.invalidateQueries({ queryKey: ["emp-app", appId] }); },
  });
  const schedM = useMutation({
    mutationFn: () => schedFn({ data: { applicationId: appId, ...schedule } }),
    onSuccess: () => { toast.success("Interview scheduled"); setSchedule({ scheduledAt: "", meetingUrl: "", provider: "Zoom", notes: "" }); qc.invalidateQueries({ queryKey: ["inv", appId] }); qc.invalidateQueries({ queryKey: ["emp-app", appId] }); },
    onError: (e: any) => toast.error(e.message),
  });
  const issueM = useMutation({
    mutationFn: () => issueFn({ data: { applicationId: appId, ...offer } }),
    onSuccess: () => { toast.success("Appointment letter issued"); setOffer({ position: "", salary: "", startDate: "", body: "" }); qc.invalidateQueries({ queryKey: ["letters", appId] }); qc.invalidateQueries({ queryKey: ["emp-app", appId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (app.isLoading) return <p>Loading…</p>;
  const a: any = app.data;
  if (!a) return <p>Applicant not found.</p>;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="text-lg font-semibold">{a.applicant?.name ?? "Candidate"}</h2>
          <p className="text-xs text-muted-foreground">{a.applicant?.discipline}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Job:</span> {a.job?.job_title}</p>
          <p className="text-sm"><span className="font-semibold">Applied:</span> {new Date(a.created_at).toLocaleDateString()}</p>
          <div className="mt-3">
            <label className="block text-xs uppercase font-medium text-muted-foreground">Stage</label>
            <select defaultValue={a.stage ?? a.status} onChange={(e) => stageM.mutate(e.target.value)} className="mt-1 w-full rounded-md border px-2 py-1 text-sm">
              {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {a.cover_note && <div className="mt-3 rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">{a.cover_note}</div>}
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Schedule video interview</h3>
          <p className="text-xs text-muted-foreground">Paste any external meeting link (Zoom, Meet, Teams).</p>
          <div className="mt-2 space-y-2 text-sm">
            <input type="datetime-local" value={schedule.scheduledAt} onChange={(e) => setSchedule({ ...schedule, scheduledAt: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <input placeholder="https://zoom.us/j/..." value={schedule.meetingUrl} onChange={(e) => setSchedule({ ...schedule, meetingUrl: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <input placeholder="Provider (Zoom/Meet/Teams)" value={schedule.provider} onChange={(e) => setSchedule({ ...schedule, provider: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <textarea placeholder="Notes for the candidate" rows={2} value={schedule.notes} onChange={(e) => setSchedule({ ...schedule, notes: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <button onClick={() => schedM.mutate()} disabled={!schedule.scheduledAt || !schedule.meetingUrl} className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">Send invite</button>
          </div>
          {(inv.data ?? []).length > 0 && (
            <ul className="mt-3 space-y-1 text-xs">
              {(inv.data ?? []).map((i: any) => (
                <li key={i.id} className="rounded border p-2">
                  <div className="font-semibold">{new Date(i.scheduled_at).toLocaleString()}</div>
                  <a href={i.meeting_url} target="_blank" rel="noreferrer" className="text-primary underline">{i.provider ?? "Meeting link"}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Issue appointment letter</h3>
          <div className="mt-2 space-y-2 text-sm">
            <input placeholder="Position title" value={offer.position} onChange={(e) => setOffer({ ...offer, position: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <input placeholder="Salary (e.g. BDT 80,000 / month)" value={offer.salary} onChange={(e) => setOffer({ ...offer, salary: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <input type="date" value={offer.startDate} onChange={(e) => setOffer({ ...offer, startDate: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <textarea placeholder="Letter body…" rows={5} value={offer.body} onChange={(e) => setOffer({ ...offer, body: e.target.value })} className="w-full rounded-md border px-2 py-1.5" />
            <button onClick={() => issueM.mutate()} disabled={!offer.position || !offer.body} className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">Send appointment letter</button>
          </div>
          {(letters.data ?? []).map((l: any) => (
            <div key={l.id} className="mt-2 rounded border p-2 text-xs">
              <div className="font-semibold">{l.position}</div>
              <Link to="/appointment/$letterId" params={{ letterId: l.id }} className="text-primary underline">View letter</Link>
              {l.accepted_at && <span className="ml-2 text-emerald-600">Accepted</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 rounded-xl border bg-white p-4 flex flex-col" style={{ minHeight: 500 }}>
        <h3 className="font-semibold">Messages</h3>
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
          {(msgs.data ?? []).map((m: any) => (
            <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender_id === a.user_id ? "bg-muted" : "ml-auto bg-primary text-primary-foreground"}`}>
              {m.body}
              <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
          {(msgs.data ?? []).length === 0 && <p className="text-xs text-muted-foreground">No messages yet.</p>}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-md border px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && msg && sendM.mutate()} />
          <button onClick={() => sendM.mutate()} disabled={!msg} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">Send</button>
        </div>
      </div>
    </div>
  );
}
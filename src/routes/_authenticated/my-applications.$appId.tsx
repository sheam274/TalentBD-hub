import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyApplicationTracking, sendMessage } from "@/lib/hiring.functions";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/my-applications/$appId")({
  head: () => ({ meta: [{ title: "Application tracking" }] }),
  component: Page,
});

const STEPS = ["applied", "screening", "interview", "offer", "hired"] as const;

function Page() {
  const { appId } = Route.useParams();
  const fn = useServerFn(getMyApplicationTracking);
  const sendFn = useServerFn(sendMessage);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["track", appId], queryFn: () => fn({ data: { id: appId } }), refetchInterval: 10000 });
  const [msg, setMsg] = useState("");
  const send = useMutation({
    mutationFn: () => sendFn({ data: { applicationId: appId, body: msg } }),
    onSuccess: () => { setMsg(""); qc.invalidateQueries({ queryKey: ["track", appId] }); },
    onError: (e: any) => toast.error(e.message),
  });

  if (q.isLoading) return <div className="p-10 text-center">Loading…</div>;
  const d: any = q.data;
  if (!d) return <div className="p-10 text-center">Application not found.</div>;
  const stage = d.app.stage ?? d.app.status ?? "applied";
  const stageIdx = STEPS.indexOf(stage as any);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 page-enter">
      <Link to="/my-applications" className="text-sm text-muted-foreground hover:underline">← All applications</Link>
      <h1 className="mt-2 text-2xl font-bold">{d.app.job?.job_title}</h1>
      <p className="text-sm text-muted-foreground">{d.app.job?.company} · Applied {new Date(d.app.created_at).toLocaleDateString()}</p>

      <div className="mt-6 rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Status timeline</h2>
        <ol className="mt-3 grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className={`rounded-md border p-2 text-center text-xs ${i <= stageIdx ? "bg-primary text-primary-foreground" : ""}`}>
              <div className="font-semibold capitalize">{s}</div>
              <div className="text-[10px] opacity-80">Step {i + 1}</div>
            </li>
          ))}
        </ol>
        {stage === "rejected" && <p className="mt-3 text-sm text-destructive">This application was not selected.</p>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Interview invitations</h3>
          {(d.invites ?? []).length === 0 && <p className="mt-2 text-xs text-muted-foreground">No interviews scheduled yet.</p>}
          <ul className="mt-2 space-y-2 text-sm">
            {(d.invites ?? []).map((i: any) => (
              <li key={i.id} className="rounded border p-3">
                <div className="font-semibold">{new Date(i.scheduled_at).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{i.provider ?? "Video meeting"}</div>
                {i.notes && <p className="mt-1 text-xs">{i.notes}</p>}
                <a href={i.meeting_url} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Join meeting</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Appointment letter</h3>
          {(d.letters ?? []).length === 0 && <p className="mt-2 text-xs text-muted-foreground">No appointment letter yet.</p>}
          {(d.letters ?? []).map((l: any) => (
            <div key={l.id} className="mt-2 rounded border p-3 text-sm">
              <div className="font-semibold">{l.position}</div>
              {l.salary && <div className="text-xs">Salary: {l.salary}</div>}
              {l.start_date && <div className="text-xs">Start: {new Date(l.start_date).toLocaleDateString()}</div>}
              <Link to="/appointment/$letterId" params={{ letterId: l.id }} className="mt-2 inline-block rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Open letter</Link>
              {l.accepted_at && <span className="ml-2 text-xs text-success">Accepted</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4">
        <h3 className="font-semibold">Messages with employer</h3>
        <div className="mt-2 max-h-80 space-y-2 overflow-y-auto">
          {(d.messages ?? []).map((m: any) => (
            <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.sender_id === d.app.user_id ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.body}
              <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
          {(d.messages ?? []).length === 0 && <p className="text-xs text-muted-foreground">No messages yet.</p>}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Reply to employer…" className="flex-1 rounded-md border px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && msg && send.mutate()} />
          <button onClick={() => send.mutate()} disabled={!msg} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">Send</button>
        </div>
      </div>
    </div>
  );
}
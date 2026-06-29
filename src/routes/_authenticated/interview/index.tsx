import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listMySessions } from "@/lib/interview.functions";
import { Mic, Video, MessageSquare, ListChecks, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/_authenticated/interview/")({
  head: () => ({ meta: [{ title: "Give Interview — AI Interviewer" }] }),
  component: InterviewLanding,
});

const MODES = [
  { id: "text" as const, label: "Text Q&A", icon: MessageSquare, desc: "Typed answers, instant AI feedback." },
  { id: "voice" as const, label: "Voice", icon: Mic, desc: "Speak your answers, transcribed live." },
  { id: "video" as const, label: "Live Video", icon: Video, desc: "Recorded video answers with playback." },
  { id: "mcq" as const, label: "MCQ / Coding", icon: ListChecks, desc: "AI-generated, auto-graded." },
];

function InterviewLanding() {
  const fn = useServerFn(listMySessions);
  const { data } = useQuery({ queryKey: ["my-interviews"], queryFn: () => fn() });
  const recent = (data ?? []).slice(0, 5);

  return (
    <div className="page-enter">
      <section style={{ background: "var(--color-primary)" }} className="text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-14 md:px-6">
          <div className="glass-dark rounded-2xl p-5 sm:p-8">
            <p className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"><Sparkles className="size-3.5" /> AI Interviewer</p>
            <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold">Give an AI-graded interview</h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-white">Pick a role, choose a difficulty, and answer in text, voice, video, or MCQ. Our AI scores each answer, gives you per-question feedback, and issues a verifiable credential at 80%+.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/interview/setup" className="rounded-md px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>Start a new interview</Link>
              <Link to="/interview/history" className="rounded-md border-2 border-white px-4 sm:px-5 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-white/10">View history</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6">
        <h2 className="text-xl sm:text-2xl font-bold">Interview modes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODES.map((m) => (
            <Link key={m.id} to="/interview/setup" search={{ mode: m.id }} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <m.icon className="size-6 text-primary" />
              <div className="mt-3 font-semibold">{m.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:pb-16 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">Recent attempts</h2>
          <Link to="/interview/history" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border bg-white shadow-sm">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No interviews yet. Start your first one above.</div>
          ) : (
            <ul className="divide-y">
              {recent.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{s.role} <span className="text-xs text-muted-foreground">· {s.discipline} · {s.difficulty} · {s.mode}</span></div>
                    <div className="text-xs text-muted-foreground">{new Date(s.started_at).toLocaleString()}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {s.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full badge-success px-2 py-0.5 text-xs font-semibold"><Trophy className="size-3" /> {s.score}%</span>
                    ) : (
                      <span className="rounded-full badge-warning px-2 py-0.5 text-xs font-semibold">In progress</span>
                    )}
                    <Link to="/interview/result/$sessionId" params={{ sessionId: s.id }} className="text-sm text-primary hover:underline">Open</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
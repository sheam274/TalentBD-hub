import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Timer, Play, Pause, SkipForward, RotateCcw, CheckCircle2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/interview-prep/mock")({
  head: () => ({
    meta: [
      { title: "Mock interview (timed) — TalentBD" },
      { name: "description", content: "Timed mock interview for BD Govt IT, BCS, Big Tech, and Remote IT roles with role-specific questions." },
    ],
  }),
  component: MockInterview,
});

type TrackId = "bd-govt-it" | "bcs" | "big-tech" | "remote";
type Q = { q: string; hint?: string; seconds: number };

const TRACKS: Record<TrackId, { label: string; tagline: string; totalSeconds: number; questions: Q[] }> = {
  "bd-govt-it": {
    label: "BD Govt IT (BB AD-IT / BCC)",
    tagline: "Viva-style: CS fundamentals + Bangladesh ICT policy.",
    totalSeconds: 25 * 60,
    questions: [
      { q: "Explain 3NF with an example table that violates it.", seconds: 180, hint: "Talk about transitive dependency." },
      { q: "Given /26, how many usable hosts per subnet? Show the math.", seconds: 120 },
      { q: "Difference between process and thread; when to prefer multithreading?", seconds: 150 },
      { q: "Walk through OSI 7 layers with one protocol at each.", seconds: 180 },
      { q: "Write SQL to fetch the 2nd highest salary from Employees.", seconds: 180 },
      { q: "What is the role of BCC and a2i in Digital Bangladesh?", seconds: 150 },
      { q: "Explain ACID with a banking transaction example.", seconds: 180 },
      { q: "Compare symmetric vs asymmetric cryptography — where is each used?", seconds: 180 },
    ],
  },
  bcs: {
    label: "BCS (General + Technical)",
    tagline: "Viva panel: personality, GK, subject, ethics.",
    totalSeconds: 20 * 60,
    questions: [
      { q: "নিজের সম্পর্কে ২ মিনিটে বলুন (Bangla self-intro).", seconds: 120 },
      { q: "Salient features of the 1972 Constitution — name any four.", seconds: 150 },
      { q: "GDP vs GNI — explain with a Bangladesh example.", seconds: 150 },
      { q: "Translate a Bangla proverb of your choice and explain its meaning.", seconds: 120 },
      { q: "Why civil service over a private tech job?", seconds: 150 },
      { q: "For BCS (Computer): B-tree vs B+ tree and why DBs use B+.", seconds: 180 },
      { q: "Name three UN Sustainable Development Goals Bangladesh is progressing on.", seconds: 150 },
      { q: "How would you handle a conflict of interest as a public servant?", seconds: 150 },
    ],
  },
  "big-tech": {
    label: "Big Tech (FAANG / Stripe / Uber)",
    tagline: "45-min loop: DSA + system design + behavioral.",
    totalSeconds: 45 * 60,
    questions: [
      { q: "Two Sum: return indices of two nums that add to target. Discuss O(n) approach.", seconds: 300, hint: "Hashmap of complement." },
      { q: "Longest substring without repeating characters. Explain sliding window.", seconds: 360 },
      { q: "Design a URL shortener. Estimate QPS, storage, key generation.", seconds: 600 },
      { q: "Design Twitter home timeline for 300M users — fan-out on write vs read?", seconds: 600 },
      { q: "Tell me about a time you disagreed with your manager (STAR).", seconds: 240 },
      { q: "Describe your most ambiguous project and how you scoped it.", seconds: 240 },
      { q: "SQL vs NoSQL trade-offs for a real-time feed. Which and why?", seconds: 360 },
    ],
  },
  remote: {
    label: "Remote IT (Toptal / Turing / EU-US startups)",
    tagline: "Async take-home + live pair + culture fit.",
    totalSeconds: 30 * 60,
    questions: [
      { q: "Live pair: add keyboard navigation to a React <Menu /> component. Talk aloud.", seconds: 600 },
      { q: "Write a short async update to your team about a blocked task.", seconds: 180 },
      { q: "How do you handle a 6-hour timezone gap with your team?", seconds: 180 },
      { q: "Walk through your Git workflow on a 2-week feature branch.", seconds: 240 },
      { q: "Describe a production incident you owned end-to-end.", seconds: 300 },
      { q: "How do you stay unblocked when no teammate is online?", seconds: 180 },
      { q: "Explain JWT vs session cookies for a remote-first SaaS.", seconds: 300 },
    ],
  },
};

function fmt(s: number) {
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function MockInterview() {
  const [track, setTrack] = useState<TrackId>("bd-govt-it");
  const cfg = TRACKS[track];
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(cfg.questions[0].seconds);
  const [total, setTotal] = useState(cfg.totalSeconds);
  const [notes, setNotes] = useState<string[]>(Array(cfg.questions.length).fill(""));
  const [done, setDone] = useState<boolean[]>(Array(cfg.questions.length).fill(false));
  const [finished, setFinished] = useState(false);
  const tick = useRef<number | null>(null);

  function resetAll(t: TrackId = track) {
    const c = TRACKS[t];
    setTrack(t); setStarted(false); setPaused(false); setIdx(0);
    setRemaining(c.questions[0].seconds); setTotal(c.totalSeconds);
    setNotes(Array(c.questions.length).fill("")); setDone(Array(c.questions.length).fill(false));
    setFinished(false);
  }

  useEffect(() => {
    if (!started || paused || finished) return;
    tick.current = window.setInterval(() => {
      setTotal((t) => Math.max(0, t - 1));
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => { if (tick.current) window.clearInterval(tick.current); };
  }, [started, paused, finished]);

  useEffect(() => {
    if (total === 0 && started) setFinished(true);
  }, [total, started]);

  function next() {
    setDone((d) => { const c = [...d]; c[idx] = true; return c; });
    if (idx + 1 >= cfg.questions.length) { setFinished(true); return; }
    const n = idx + 1;
    setIdx(n); setRemaining(cfg.questions[n].seconds);
  }

  const completed = useMemo(() => done.filter(Boolean).length, [done]);
  const progress = Math.round((completed / cfg.questions.length) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 page-enter">
      <Link to="/interview-prep" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="size-4" /> Back to interview prep
      </Link>
      <h1 className="mt-2 text-4xl font-extrabold">Mock interview <span className="text-gradient">(timed)</span></h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">Pick a track, hit start, and answer aloud within the per-question timer. Jot notes for post-mortem review.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(TRACKS) as TrackId[]).map((id) => (
          <button
            key={id}
            onClick={() => resetAll(id)}
            disabled={started && !finished}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${track === id ? "text-white shadow-md" : "bg-white/60 hover:bg-white"} disabled:cursor-not-allowed disabled:opacity-60`}
            style={track === id ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))", borderColor: "transparent" } : {}}
          >
            {TRACKS[id].label}
          </button>
        ))}
      </div>

      <div className="mt-4 glass rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{cfg.label}</h2>
            <p className="text-sm text-muted-foreground">{cfg.tagline}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-white/70 px-4 py-2 text-sm font-mono font-bold">
            <Timer className="size-4 text-[var(--color-primary)]" /> {fmt(total)} <span className="text-muted-foreground">total</span>
          </div>
        </div>

        {!started ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={() => setStarted(true)} className="inline-flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>
              <Play className="size-4" /> Start mock ({cfg.questions.length} questions · {Math.round(cfg.totalSeconds / 60)} min)
            </button>
            <span className="text-xs text-muted-foreground">You'll get a per-question timer. Timebox your answers.</span>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Question {idx + 1} of {cfg.questions.length}</span>
              <span>{progress}% answered</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/60">
              <div className="h-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))" }} />
            </div>

            {!finished && (
              <div className="mt-4 rounded-lg border bg-white/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">This question</div>
                  <div className={`rounded-full px-3 py-1 text-xs font-mono font-bold ${remaining <= 15 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {fmt(remaining)}
                  </div>
                </div>
                <p className="mt-2 text-lg font-semibold">{cfg.questions[idx].q}</p>
                {cfg.questions[idx].hint && <p className="mt-1 text-xs text-muted-foreground">Hint: {cfg.questions[idx].hint}</p>}
                <textarea
                  value={notes[idx]}
                  onChange={(e) => setNotes((n) => { const c = [...n]; c[idx] = e.target.value; return c; })}
                  placeholder="Jot bullet points as you speak…"
                  rows={4}
                  className="mt-3 w-full rounded-md border bg-white px-3 py-2 text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => setPaused((p) => !p)} className="inline-flex items-center gap-1 rounded-md border bg-white/70 px-3 py-1.5 text-xs font-semibold">
                    {paused ? <Play className="size-3" /> : <Pause className="size-3" />} {paused ? "Resume" : "Pause"}
                  </button>
                  <button onClick={next} className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "var(--color-primary)" }}>
                    <SkipForward className="size-3" /> Next question
                  </button>
                  <button onClick={() => resetAll(track)} className="inline-flex items-center gap-1 rounded-md border bg-white/70 px-3 py-1.5 text-xs font-semibold">
                    <RotateCcw className="size-3" /> Restart
                  </button>
                </div>
              </div>
            )}

            {finished && (
              <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50/70 p-5">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="size-5" />
                  <h3 className="text-lg font-bold">Mock complete — review below</h3>
                </div>
                <ol className="mt-4 space-y-3">
                  {cfg.questions.map((q, i) => (
                    <li key={i} className="rounded-lg border bg-white/80 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Q{i + 1}</div>
                      <div className="text-sm font-semibold">{q.q}</div>
                      <div className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{notes[i]?.trim() || "(no notes)"}</div>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => resetAll(track)} className="rounded-md px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--color-primary)" }}>Retake</button>
                  <Link to="/interview-prep" className="rounded-md border bg-white/70 px-4 py-2 text-sm font-semibold">Back to prep</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
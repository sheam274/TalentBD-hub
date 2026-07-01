import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { getModulePublic, listModulesPublic } from "@/lib/learning.functions";
import { submitQuiz } from "@/lib/assessments.functions";
import { youtubeEmbed, youtubeThumb } from "@/lib/youtube";
import { YouTubeThumb } from "@/components/YouTubeThumb";
import { toast } from "sonner";
import { CSE_TUTORIALS, isCseDiscipline } from "@/lib/cse-tutorials";
import { BookOpen, ChevronRight, GraduationCap, ListTree, CheckCircle2, Circle, Sparkles, Clock, Award } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learn/$discipline/$topic")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.topic} — ${params.discipline.toUpperCase()} | Learn & Earn` },
      { name: "description", content: `Learn ${params.topic} (${params.discipline}) with video, docs, and a certifying quiz.` },
    ],
  }),
  component: Topic,
});

function Topic() {
  const { discipline, topic } = Route.useParams();
  const fn = useServerFn(getModulePublic);
  const subFn = useServerFn(submitQuiz);
  const listFn = useServerFn(listModulesPublic);
  const q = useQuery({ queryKey: ["module", discipline, topic], queryFn: () => fn({ data: { discipline, slug: topic } }) });
  const isCse = isCseDiscipline(discipline);
  const siblings = useQuery({
    queryKey: ["modules", "sidebar"],
    queryFn: () => listFn(),
    enabled: isCse,
    staleTime: 60_000,
  });
  const [docOpen, setDocOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [practice, setPractice] = useState<Record<number, number>>({});
  const [practiceResult, setPracticeResult] = useState<{ score: number; correct: number; total: number } | null>(null);
  const progressKey = `learn:progress:${discipline}:${topic}`;
  const [done, setDone] = useState<Record<string, boolean>>({});
  useEffect(() => {
    try { const raw = localStorage.getItem(progressKey); if (raw) setDone(JSON.parse(raw)); } catch {}
  }, [progressKey]);
  useEffect(() => {
    try { localStorage.setItem(progressKey, JSON.stringify(done)); } catch {}
  }, [progressKey, done]);
  const cseSiblings = useMemo(
    () => (siblings.data ?? []).filter((x: any) => isCseDiscipline(x.discipline)),
    [siblings.data],
  );
  const submit = useMutation({
    mutationFn: (vars: { moduleId: string }) => subFn({ data: { moduleId: vars.moduleId, answers } }),
    onSuccess: (r) => {
      setResult({ score: r.score, passed: r.passed });
      r.passed ? toast.success(`Passed! Credential saved (${r.score}%)`) : toast.error(`Score ${r.score}%. Need 80% to certify.`);
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (q.isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!q.data) return <div className="p-10 text-center">Not found. <Link to="/learn">Back</Link></div>;
  const { module: m, quizzes } = q.data;
  const tutorial = isCse ? CSE_TUTORIALS[topic] : undefined;
  const syllabus = tutorial?.sections ?? [];
  const completedCount = syllabus.filter((s) => done[s.id]).length;
  const pct = syllabus.length ? Math.round((completedCount / syllabus.length) * 100) : 0;

  function scorePractice() {
    if (!tutorial) return;
    const total = tutorial.practice.length;
    let correct = 0;
    tutorial.practice.forEach((p, i) => { if (practice[i] === p.answer) correct += 1; });
    setPracticeResult({ correct, total, score: Math.round((correct / total) * 100) });
  }

  const MainContent = (
    <>
      <Link to="/learn" className="text-sm" style={{ color: "var(--color-primary)" }}>← All tracks</Link>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold break-words">{m.title}</h1>
      <p className="mt-1 text-muted-foreground text-sm sm:text-base">{tutorial?.intro ?? m.description}</p>

      {tutorial && (
        <section aria-label="Module overview" className="mt-6 overflow-hidden rounded-2xl border bg-gradient-to-br from-white via-white to-[color-mix(in_oklab,var(--color-primary)_10%,white)] shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)]">
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                <Sparkles className="size-3" /> Module landing
              </span>
              <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight">Overview</h2>
              <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-foreground/80">{tutorial.intro}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1"><ListTree className="size-3.5" /> {syllabus.length} lessons</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1"><Clock className="size-3.5" /> ~{Math.max(15, syllabus.length * 8)} min</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1"><GraduationCap className="size-3.5" /> {tutorial.practice.length} practice Q</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1"><Award className="size-3.5" /> Certifiable · 80%</span>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Your progress</span>
                  <span style={{ color: "var(--color-primary)" }}>{completedCount}/{syllabus.length} · {pct}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${pct}%`, background: "var(--color-primary)" }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={`#${syllabus[0]?.id ?? ""}`} className="rounded-md px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "var(--color-primary)" }}>Start learning</a>
                  <button onClick={() => setDone({})} className="rounded-md border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Reset progress</button>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Syllabus</h3>
              <ol className="mt-3 space-y-1.5 text-sm">
                {syllabus.map((sec, i) => {
                  const isDone = !!done[sec.id];
                  return (
                    <li key={sec.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={isDone ? `Mark ${sec.title} incomplete` : `Mark ${sec.title} complete`}
                        onClick={() => setDone((d) => ({ ...d, [sec.id]: !d[sec.id] }))}
                        className="shrink-0"
                      >
                        {isDone ? <CheckCircle2 className="size-4" style={{ color: "var(--color-primary)" }} /> : <Circle className="size-4 text-muted-foreground" />}
                      </button>
                      <a href={`#${sec.id}`} className={`flex-1 truncate rounded px-1.5 py-1 hover:bg-muted ${isDone ? "line-through text-muted-foreground" : ""}`}>
                        <span className="mr-1.5 text-xs font-semibold text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                        {sec.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      )}

      {m.video_url && (() => {
        const embed = youtubeEmbed(m.video_url);
        const thumb = youtubeThumb(m.video_url);
        if (embed) {
          return (
            <div
              className="mt-6 aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-2xl bg-cover bg-center"
              style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
            >
              <iframe src={embed} title={m.title} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          );
        }
        return (
          <a href={m.video_url} target="_blank" rel="noreferrer" className="mt-6 relative block aspect-video w-full overflow-hidden rounded-xl border bg-black shadow-2xl group">
            <YouTubeThumb url={m.video_url} alt={`${m.title} preview`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 grid place-items-center bg-black/30 text-white text-sm font-semibold">▶ Open video</div>
          </a>
        );
      })()}

      {tutorial && (
        <div className="mt-8 space-y-6">
          {tutorial.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="rounded-xl border bg-white p-5 sm:p-6 shadow-sm scroll-mt-24">
              <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>{sec.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{sec.body}</p>
              {sec.code && (
                <div className="mt-3 rounded-lg border bg-[#0f172a] text-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-300">
                    <span>{sec.code.lang}</span>
                    <span className="opacity-60">Try it yourself</span>
                  </div>
                  <pre className="p-4 text-[13px] leading-relaxed overflow-x-auto"><code>{sec.code.source}</code></pre>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl border bg-white overflow-hidden">
        <button onClick={() => setDocOpen((v) => !v)} className="flex w-full items-center justify-between p-4 text-left font-semibold">
          <span className="flex items-center gap-2"><BookOpen className="size-4" /> Full documentation</span>
          <span className="text-sm text-muted-foreground">{docOpen ? "Hide" : "Show"}</span>
        </button>
        {docOpen && (
          <pre className="whitespace-pre-wrap break-words border-t p-4 text-sm leading-relaxed overflow-x-auto">{m.documentation_body}</pre>
        )}
      </div>

      {Array.isArray(m.resources) && m.resources.length > 0 && (
        <div className="mt-6 rounded-xl border bg-white p-5">
          <h2 className="font-semibold flex items-center gap-2">📚 Recommended resources</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {m.resources.map((r: any, i: number) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="lift flex items-center gap-3 rounded-lg border bg-white/70 p-3 text-sm hover:bg-white">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold" style={{ background: r.type === "pdf" ? "oklch(0.55 0.2 25)" : "var(--color-primary)" }}>
                    {r.type === "pdf" ? "PDF" : "DOC"}
                  </span>
                  <span className="font-medium">{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tutorial && tutorial.practice.length > 0 && (
        <div className="mt-8 rounded-xl border-2 bg-white p-4 sm:p-6" style={{ borderColor: "color-mix(in oklab, var(--color-primary) 30%, transparent)" }}>
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5" style={{ color: "var(--color-primary)" }} />
            <h2 className="text-lg sm:text-xl font-bold">Practice exam · {tutorial.practice.length} questions</h2>
          </div>
          <p className="text-sm text-muted-foreground">Untimed. Answers scored instantly — use it to prep for the certification below.</p>
          <ol className="mt-4 space-y-5">
            {tutorial.practice.map((p, i) => (
              <li key={i}>
                <p className="font-medium">{i + 1}. {p.q}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {p.choices.map((c, ci) => {
                    const selected = practice[i] === ci;
                    const done = practiceResult != null;
                    const correct = done && ci === p.answer;
                    const wrong = done && selected && ci !== p.answer;
                    return (
                      <label key={ci} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted ${correct ? "border-green-500 bg-green-50" : wrong ? "border-red-500 bg-red-50" : ""}`}>
                        <input type="radio" name={`p-${i}`} checked={selected} onChange={() => setPractice({ ...practice, [i]: ci })} />
                        {c}
                      </label>
                    );
                  })}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={scorePractice}
              disabled={Object.keys(practice).length < tutorial.practice.length}
              className="rounded-md px-5 py-2 font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--color-primary)" }}
            >
              Score my exam
            </button>
            {practiceResult && (
              <span className="text-sm">
                <strong>{practiceResult.correct}/{practiceResult.total}</strong> correct · {practiceResult.score}% {practiceResult.score >= 80 ? "🎉 you're certification-ready" : "— review the highlighted answers"}
              </span>
            )}
            <button onClick={() => { setPractice({}); setPracticeResult(null); }} className="text-xs text-muted-foreground underline">Reset</button>
          </div>
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="mt-8 rounded-xl border bg-white p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold">Official certification</h2>
          <p className="text-sm text-muted-foreground">Score 80% or higher to earn a credential on your profile.</p>
          <div className="mt-4 space-y-5">
            {quizzes.map((qz: any, idx: number) => (
              <div key={qz.id}>
                <p className="font-medium">{idx + 1}. {qz.question}</p>
                <div className="mt-2 grid gap-2">
                  {qz.choices.map((c: string) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                      <input type="radio" name={qz.id} value={c} checked={answers[qz.id] === c} onChange={() => setAnswers({ ...answers, [qz.id]: c })} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={submit.isPending || Object.keys(answers).length < quizzes.length}
            onClick={() => submit.mutate({ moduleId: m.id })}
            className="mt-5 rounded-md px-5 py-2 font-semibold disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}
          >
            {submit.isPending ? "Scoring…" : "Submit for credential"}
          </button>
          {result && (
            <div className="mt-4 rounded-md border p-3 text-sm" style={{ background: result.passed ? "color-mix(in oklab, var(--color-accent) 15%, white)" : undefined }}>
              You scored <strong>{result.score}%</strong> — {result.passed ? "credential earned." : "try again to certify."}
            </div>
          )}
        </div>
      )}
    </>
  );

  if (!isCse) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 md:px-6 page-enter">
        {MainContent}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:py-10 md:px-6 page-enter">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">{MainContent}</div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            {tutorial && (
              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <ListTree className="size-4" /> On this page
                </h3>
                <ul className="mt-3 space-y-1 text-sm">
                  {tutorial.sections.map((sec) => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`} className="flex items-center gap-1 rounded px-2 py-1.5 hover:bg-muted">
                        <ChevronRight className="size-3 opacity-60" /> {sec.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <BookOpen className="size-4" /> CSE tutorials
              </h3>
              <ul className="mt-3 space-y-1 text-sm">
                {cseSiblings.map((s: any) => {
                  const active = s.section_slug === topic;
                  return (
                    <li key={s.id}>
                      <Link
                        to="/learn/$discipline/$topic"
                        params={{ discipline: s.discipline, topic: s.section_slug }}
                        className={`flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted ${active ? "font-semibold" : ""}`}
                        style={active ? { background: "color-mix(in oklab, var(--color-primary) 12%, white)", color: "var(--color-primary)" } : undefined}
                      >
                        <ChevronRight className="size-3 opacity-60" /> {s.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

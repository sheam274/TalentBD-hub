import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { getExamQuiz } from "@/lib/learning.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Filter, RefreshCw, CheckCircle2, XCircle, BookOpen, ArrowRight } from "lucide-react";

type ExamId = "bb-ad-it" | "govt-it" | "big-tech" | "all";

const EXAMS: Record<ExamId, { label: string; blurb: string; slugs: string[] }> = {
  "bb-ad-it": {
    label: "Bangladesh Bank AD (IT)",
    blurb: "Networking, DBMS, OS, DS & Algo, security — the BB AD-IT core.",
    slugs: ["networking", "databases", "operating-systems", "data-structures", "algorithms", "cybersecurity"],
  },
  "govt-it": {
    label: "Govt IT / BCS (Technical)",
    blurb: "Fundamentals asked in BCS, BPSC & BASIS-style IT exams.",
    slugs: ["operating-systems", "networking", "databases", "web-development", "cybersecurity", "oop"],
  },
  "big-tech": {
    label: "Big Tech Interview",
    blurb: "FAANG-style DS/Algo, system design, OOP & CP patterns.",
    slugs: ["data-structures", "algorithms", "system-design", "oop", "competitive-programming"],
  },
  all: {
    label: "All CSE topics",
    blurb: "Every CSE module quiz in one mixed pool.",
    slugs: [
      "networking","databases","operating-systems","data-structures","algorithms",
      "cybersecurity","web-development","system-design","oop","competitive-programming",
      "machine-learning","cloud-devops","git-github",
    ],
  },
};

const EXAM_IDS: ExamId[] = ["bb-ad-it", "govt-it", "big-tech", "all"];

export const Route = createFileRoute("/_authenticated/learn/exam-prep")({
  validateSearch: (search: Record<string, unknown>): { exam: ExamId } => {
    const raw = search.exam;
    const exam = EXAM_IDS.includes(raw as ExamId) ? (raw as ExamId) : "bb-ad-it";
    return { exam };
  },
  head: () => ({ meta: [
    { title: "IT Job Exam Prep — BB AD-IT, Govt IT, Big Tech | TalentBD" },
    { name: "description", content: "Targeted quizzes by exam type for Bangladesh Bank AD-IT, government IT recruitment, and big-tech interviews." },
  ]}),
  component: ExamPrep,
});

function ExamPrep() {
  const { exam } = Route.useSearch();
  const cfg = EXAMS[exam];
  const navigate = useNavigate({ from: Route.fullPath });
  const fn = useServerFn(getExamQuiz);
  const q = useQuery({
    queryKey: ["exam-quiz", exam],
    queryFn: () => fn({ data: { slugs: cfg.slugs } }),
    staleTime: 60_000,
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    const list = [...(q.data?.questions ?? [])];
    // deterministic shuffle per seed
    const rand = mulberry32(seed || 1);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list.slice(0, 25);
  }, [q.data, seed]);

  const score = questions.reduce((s, qq) => s + (answers[qq.id] === qq.correct_answer ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const incorrect = submitted ? questions.filter((qq) => answers[qq.id] !== qq.correct_answer) : [];
  const unanswered = submitted ? questions.filter((qq) => !answers[qq.id]) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 page-enter">
      <div className="rounded-3xl border bg-gradient-to-br from-white to-[color-mix(in_oklab,var(--color-primary)_10%,white)] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Filter className="size-3.5" /> Exam-targeted practice
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight">IT Job Exam Prep</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">{cfg.blurb}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <div className="w-full sm:w-72">
            <Select
              value={exam}
              onValueChange={(v) => {
                setAnswers({}); setSubmitted(false); setSeed((s) => s + 1);
                navigate({ search: { exam: v as ExamId } });
              }}
            >
              <SelectTrigger aria-label="Exam type" className="bg-white">
                <SelectValue placeholder="Choose exam type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(EXAMS) as ExamId[]).map((id) => (
                  <SelectItem key={id} value={id}>{EXAMS[id].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(Object.keys(EXAMS) as ExamId[]).map((id) => (
            <Link
              key={id}
              to="/learn/exam-prep"
              search={{ exam: id }}
              onClick={() => { setAnswers({}); setSubmitted(false); setSeed((s) => s + 1); }}
              className={`hidden sm:inline-flex rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                id === exam
                  ? "bg-[var(--color-primary)] text-white border-transparent shadow"
                  : "bg-white hover:bg-muted"
              }`}
            >
              {EXAMS[id].label}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {cfg.slugs.map((s: string) => (
            <Badge key={s} variant="outline" className="bg-white/70">
              <Link to="/learn/$discipline/$topic" params={{ discipline: "Computer Science", topic: s }}>{s}</Link>
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-sm text-muted-foreground">
          {q.isLoading ? "Loading questions…" : `${questions.length} questions · pass mark 80%`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setAnswers({}); setSubmitted(false); setSeed((s) => s + 1); }}>
            <RefreshCw className="size-4" /> Reshuffle
          </Button>
          {submitted && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${pct >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              <Award className="size-4" /> {score}/{questions.length} · {pct}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        {submitted && (
          <Card className={`p-5 border-2 ${pct >= 80 ? "border-emerald-300 bg-emerald-50/50" : "border-amber-300 bg-amber-50/50"}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Exam review</div>
                <h2 className="mt-1 text-xl font-bold">
                  {pct >= 80 ? "Passed" : "Keep practising"} — {score}/{questions.length} ({pct}%)
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {questions.length - incorrect.length} correct · {incorrect.length - unanswered.length} wrong · {unanswered.length} skipped
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { setAnswers({}); setSubmitted(false); setSeed((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <RefreshCw className="size-4" /> Retake with new set
              </Button>
            </div>
            {incorrect.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Review these modules</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(incorrect.map((q) => q.module_slug))).filter(Boolean).map((slug) => (
                    <Link
                      key={slug}
                      to="/learn/$discipline/$topic"
                      params={{ discipline: "Computer Science", topic: slug }}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-medium hover:bg-muted"
                    >
                      <BookOpen className="size-3.5" /> {slug} <ArrowRight className="size-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
        {questions.map((qq, idx) => {
          const chosen = answers[qq.id];
          const correct = qq.correct_answer;
          const isRight = submitted && chosen === correct;
          const isSkipped = submitted && !chosen;
          return (
            <Card key={qq.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Q{idx + 1} · {qq.module_title}
                  </div>
                  <div className="mt-1 font-medium">{qq.question}</div>
                </div>
                {submitted && (
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    isRight ? "bg-emerald-100 text-emerald-700" : isSkipped ? "bg-muted text-muted-foreground" : "bg-rose-100 text-rose-700"
                  }`}>
                    {isRight ? <><CheckCircle2 className="size-3" /> Correct</> : isSkipped ? "Skipped" : <><XCircle className="size-3" /> Incorrect</>}
                  </span>
                )}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(qq.choices as string[]).map((c: string) => {
                  const isChosen = chosen === c;
                  const isCorrect = submitted && c === correct;
                  const isWrong = submitted && isChosen && c !== correct;
                  return (
                    <button
                      key={c}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [qq.id]: c }))}
                      className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-50"
                          : isWrong
                          ? "border-rose-400 bg-rose-50"
                          : isChosen
                          ? "border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_10%,white)]"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{c}</span>
                      {isCorrect && <CheckCircle2 className="size-4 text-emerald-600" />}
                      {isWrong && <XCircle className="size-4 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 rounded-lg border bg-muted/40 p-3 text-sm">
                  <div className="font-semibold text-foreground">Explanation</div>
                  <p className="mt-1 text-muted-foreground">
                    The correct answer is <span className="font-medium text-foreground">{correct}</span>.
                    {isRight ? " Nice — you got this one." : isSkipped ? " You skipped this question." : ` You picked "${chosen}".`}
                    {" "}Revisit the module for deeper context and worked examples.
                  </p>
                  {qq.module_slug && (
                    <Link
                      to="/learn/$discipline/$topic"
                      params={{ discipline: "Computer Science", topic: qq.module_slug }}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
                    >
                      Open {qq.module_title} <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {questions.length > 0 && (
        <div className="mt-6 flex justify-end">
          {!submitted ? (
            <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < questions.length}>
              Submit exam
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false); setSeed((s) => s + 1); }}>
              Retake
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
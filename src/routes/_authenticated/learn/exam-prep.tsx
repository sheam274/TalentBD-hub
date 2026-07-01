import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { getExamQuiz } from "@/lib/learning.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Filter, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

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

const searchSchema = z.object({
  exam: fallback(z.enum(["bb-ad-it", "govt-it", "big-tech", "all"]), "bb-ad-it").default("bb-ad-it"),
});

export const Route = createFileRoute("/_authenticated/learn/exam-prep")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [
    { title: "IT Job Exam Prep — BB AD-IT, Govt IT, Big Tech | TalentBD" },
    { name: "description", content: "Targeted quizzes by exam type for Bangladesh Bank AD-IT, government IT recruitment, and big-tech interviews." },
  ]}),
  component: ExamPrep,
});

function ExamPrep() {
  const { exam } = Route.useSearch();
  const cfg = EXAMS[exam];
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 page-enter">
      <div className="rounded-3xl border bg-gradient-to-br from-white to-[color-mix(in_oklab,var(--color-primary)_10%,white)] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Filter className="size-3.5" /> Exam-targeted practice
        </div>
        <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight">IT Job Exam Prep</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">{cfg.blurb}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(EXAMS) as ExamId[]).map((id) => (
            <Link
              key={id}
              to="/learn/exam-prep"
              search={{ exam: id }}
              onClick={() => { setAnswers({}); setSubmitted(false); setSeed((s) => s + 1); }}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
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
          {cfg.slugs.map((s) => (
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
        {questions.map((qq, idx) => {
          const chosen = answers[qq.id];
          const correct = qq.correct_answer;
          return (
            <Card key={qq.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Q{idx + 1} · {qq.module_title}
                  </div>
                  <div className="mt-1 font-medium">{qq.question}</div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {qq.choices.map((c: string) => {
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
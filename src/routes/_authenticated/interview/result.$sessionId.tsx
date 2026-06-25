import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "@/lib/interview.functions";
import { Loader2, Trophy, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/interview/result/$sessionId")({
  head: () => ({ meta: [{ title: "Interview result" }] }),
  component: ResultPage,
});

function ResultPage() {
  const { sessionId } = Route.useParams();
  const fn = useServerFn(getSession);
  const { data, isLoading } = useQuery({ queryKey: ["interview-result", sessionId], queryFn: () => fn({ data: { sessionId } }) });

  if (isLoading || !data) return <div className="p-10 text-center"><Loader2 className="mx-auto size-6 animate-spin" /></div>;
  const { session, questions, answers } = data;
  const ansBy = new Map(answers.map((a) => [a.question_id, a]));
  const passed = (session.score ?? 0) >= 80;

  return (
    <div className="page-enter mx-auto max-w-4xl px-4 py-10 md:px-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{session.discipline} · {session.role} · {session.difficulty} · {session.mode}</p>
            <h1 className="mt-1 text-3xl font-bold">Overall score: {session.score ?? 0}%</h1>
          </div>
          {passed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"><BadgeCheck className="size-4" /> Credential awarded</span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700"><Trophy className="size-4" /> Keep practicing</span>
          )}
        </div>
        {session.overall_feedback && <p className="mt-3 text-sm text-muted-foreground">{session.overall_feedback}</p>}
        <div className="mt-5 flex gap-3">
          <Link to="/interview/setup" className="rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>Try another</Link>
          <Link to="/interview/history" className="rounded-md border px-4 py-2 text-sm font-semibold">History</Link>
          <Link to="/dashboard" className="rounded-md border px-4 py-2 text-sm font-semibold">Dashboard</Link>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {questions.map((q, i) => {
          const a = ansBy.get(q.id);
          return (
            <div key={q.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">Q{i + 1}. {q.prompt}</p>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{a?.score ?? 0}/10</span>
              </div>
              {a?.answer_text && <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">{a.answer_text}</p>}
              {a?.feedback && <p className="mt-2 text-sm text-muted-foreground"><span className="font-semibold text-foreground">Feedback: </span>{a.feedback}</p>}
              {a?.strengths && <p className="mt-1 text-sm text-emerald-700"><span className="font-semibold">Strengths: </span>{a.strengths}</p>}
              {a?.weaknesses && <p className="mt-1 text-sm text-amber-700"><span className="font-semibold">Improve: </span>{a.weaknesses}</p>}
            </div>
          );
        })}
      </section>
    </div>
  );
}
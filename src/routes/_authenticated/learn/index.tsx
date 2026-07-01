import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listModulesPublic } from "@/lib/learning.functions";
import { ScrollReveal } from "@/components/ScrollReveal";
import { YouTubeThumb } from "@/components/YouTubeThumb";
import { BookOpen, PlayCircle, Award, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/learn/")({
  head: () => ({ meta: [{ title: "Learn — Engineering tracks | TalentBD" }, { name: "description", content: "Browse curated learning tracks across CSE, EEE, and Civil engineering." }] }),
  component: LearnIndex,
});

const disciplineMeta: Record<string, { label: string; thumb: string; icon: string; blurb: string }> = {
  cse: { label: "Computer Science", thumb: "thumb-cse", icon: "💻", blurb: "Web, networking, data, mobile and more." },
  eee: { label: "Electrical & Electronic", thumb: "thumb-eee", icon: "⚡", blurb: "Power, VLSI, automation." },
  civil: { label: "Civil Engineering", thumb: "thumb-civil", icon: "🏗️", blurb: "Structural, CAD, BIM." },
};

function disciplineKey(d: string): string {
  const s = d.toLowerCase();
  if (s.includes("computer")) return "cse";
  if (s.includes("electr")) return "eee";
  if (s.includes("civil")) return "civil";
  return s;
}

function LearnIndex() {
  const fn = useServerFn(listModulesPublic);
  const q = useQuery({ queryKey: ["modules"], queryFn: () => fn(), staleTime: 60_000 });
  const grouped = (q.data ?? []).reduce<Record<string, any[]>>((acc, m) => {
    (acc[m.discipline] ||= []).push(m);
    return acc;
  }, {});
  const DISCIPLINE_ORDER = ["cse", "eee", "civil"];
  const orderedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const ia = DISCIPLINE_ORDER.indexOf(disciplineKey(a));
    const ib = DISCIPLINE_ORDER.indexOf(disciplineKey(b));
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  const cseModules = (q.data ?? []).filter((m: any) => disciplineKey(m.discipline) === "cse");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6 page-enter">
      <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white via-white to-[color-mix(in_oklab,var(--color-primary)_8%,white)] p-6 sm:p-10 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_18%,transparent)] blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_20%,transparent)] blur-3xl" aria-hidden />
        <div className="relative flex items-end justify-between flex-wrap gap-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Curriculum · updated weekly
            </span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight">Learning <span className="text-gradient">tracks</span></h1>
            <p className="mt-2 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">Pick a discipline, watch the lessons, and earn a verified credential recruiters trust.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur"><PlayCircle className="size-4" style={{ color: "var(--color-primary)" }} /> Video</span>
            <span className="flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur"><BookOpen className="size-4" style={{ color: "var(--color-primary)" }} /> Docs</span>
            <span className="flex items-center gap-1.5 rounded-full border bg-white/70 px-3 py-1.5 shadow-sm backdrop-blur"><Award className="size-4" style={{ color: "var(--color-primary)" }} /> Cert</span>
          </div>
        </div>
      </div>

      {q.isLoading && (
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border bg-gradient-to-br from-muted/60 to-muted/20 animate-pulse" />
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-16">
        {orderedGroups.map(([disc, list]) => {
          const meta = disciplineMeta[disciplineKey(disc)] ?? { label: disc, thumb: "thumb-cse", icon: "📚", blurb: "" };
          return (
            <section key={disc}>
              <ScrollReveal>
                <div className="flex items-center gap-4">
                  <div className={`${meta.thumb} thumb-grid flex size-16 items-center justify-center rounded-2xl text-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-white/40`}>
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{meta.label}</h2>
                    <p className="text-sm text-muted-foreground">{meta.blurb} · <span className="font-medium text-foreground/80">{list.length} module{list.length === 1 ? "" : "s"}</span></p>
                  </div>
                </div>
              </ScrollReveal>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((m, i) => (
                  <ScrollReveal key={m.id} delay={(i % 3) * 80}>
                    <Link
                      to="/learn/$discipline/$topic"
                      params={{ discipline: m.discipline, topic: m.section_slug }}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_6px_20px_-10px_rgba(15,23,42,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.35)] hover:border-[color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
                    >
                      <div className={`${meta.thumb} thumb-grid relative h-40 overflow-hidden`}>
                        <YouTubeThumb
                          url={m.video_url}
                          alt={`${m.title} thumbnail`}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="size-16 text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition duration-300 group-hover:scale-110 group-hover:text-white" />
                        </div>
                        <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md ring-1 ring-white/10">
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h3 className="font-semibold leading-snug tracking-tight text-[15px] sm:text-base transition-colors group-hover:text-[var(--color-primary)]">{m.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{m.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-4 text-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 font-medium text-muted-foreground">
                            <Award className="size-3" /> Free · Certifiable
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--color-primary)" }}>
                            Start <span aria-hidden>→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          );
        })}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)]">
              <div className="px-4 py-3 text-white text-sm font-bold tracking-wide" style={{ background: "var(--color-primary)" }}>
                💻 CSE Tutorials
              </div>
              <ul className="max-h-[70vh] overflow-y-auto py-1 text-sm">
                {cseModules.length === 0 && (
                  <li className="px-4 py-3 text-muted-foreground text-xs">Loading topics…</li>
                )}
                {cseModules.map((m: any) => (
                  <li key={m.id}>
                    <Link
                      to="/learn/$discipline/$topic"
                      params={{ discipline: m.discipline, topic: m.section_slug }}
                      className="group flex items-center justify-between gap-2 border-b border-border/40 px-4 py-2.5 last:border-b-0 hover:bg-muted transition-colors"
                    >
                      <span className="truncate font-medium group-hover:text-[var(--color-primary)]">{m.title}</span>
                      <ChevronRight className="size-3.5 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-gradient-to-br from-[color-mix(in_oklab,var(--color-accent)_15%,white)] to-white p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold"><Award className="size-4" style={{ color: "var(--color-primary)" }} /> Certifications</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Every tutorial ends with a practice exam and an official quiz. Score 80%+ to earn a shareable credential.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

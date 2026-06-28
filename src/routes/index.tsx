import { createFileRoute } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowRight, Cpu, Zap, Building2, Briefcase, GraduationCap, LineChart, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalentBD — Learn skills, earn credentials, land jobs in Bangladesh" },
      { name: "description", content: "TalentBD is Bangladesh's learn-and-earn platform: courses, certifications, CV builder, ATS parser, and a local + global jobs marketplace." },
      { property: "og:title", content: "TalentBD" },
      { property: "og:description", content: "Build skills. Earn credentials. Land the job." },
    ],
  }),
  component: Landing,
});

const DISCIPLINES = [
  { name: "Computer Science", desc: "Web, mobile, data, networking and modern software engineering tracks.", icon: Cpu, href: "/learn#cse" },
  { name: "Electrical & Electronic", desc: "Power systems, VLSI, embedded design and industrial automation.", icon: Zap, href: "/learn#eee" },
  { name: "Civil Engineering", desc: "Structural, BIM/CAD and project management for the built world.", icon: Building2, href: "/learn#civil" },
  { name: "Banking & Finance", desc: "Land roles across local banks, fintech and global remote finance.", icon: LineChart, href: "/jobs?category=Banking%2FFinance" },
  { name: "Design & Creative", desc: "Product design, UI, motion and brand for digital products.", icon: GraduationCap, href: "/jobs?category=Design" },
  { name: "Sales & Marketing", desc: "Growth, brand and revenue roles across SaaS and consumer.", icon: Briefcase, href: "/jobs?category=Marketing" },
];

const STATS = [
  ["12k+", "Active Jobs"],
  ["450+", "Top Companies"],
  ["1.2k", "Expert Courses"],
  ["98%", "Hire Rate"],
];

const FEATURED_JOBS = [
  { initial: "P", color: "var(--eduma-ink)",   title: "Senior Frontend Engineer", meta: "Pathao • Dhaka, BD", tag: "Full-Time" },
  { initial: "B", color: "var(--eduma-red)",   title: "Backend Developer",        meta: "Brain Station 23 • Remote", tag: "Full-Time" },
  { initial: "G", color: "var(--eduma-navy)",  title: "Product Designer",         meta: "Grameenphone • Hybrid", tag: "Contract" },
];

const FEATURED_MODULES = [
  { tag: "Featured", title: "Full-Stack Web Development", desc: "Master React, Node and modern deployment workflows.", bg: "var(--eduma-ink)", href: "/learn#cse" },
  { tag: "Popular",  title: "Power Systems Essentials",   desc: "From transmission to smart grids, taught by industry leads.", bg: "var(--eduma-red)", href: "/learn#eee" },
];

function Landing() {
  return (
    <div className="page-enter bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:px-6 md:py-20">
        {/* Hero — asymmetric, stat-rich */}
        <ScrollReveal>
          <section className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            {/* Text */}
            <div className="space-y-8">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold tracking-wide"
                style={{
                  background: "color-mix(in oklab, var(--eduma-red) 10%, transparent)",
                  color: "var(--eduma-red)",
                }}
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--eduma-red)" }} />
                  <span className="relative inline-flex size-2 rounded-full" style={{ background: "var(--eduma-red)" }} />
                </span>
                Bangladesh's Career Community
              </div>

              <h1 className="text-5xl font-bold leading-tight lg:text-7xl" style={{ color: "var(--eduma-ink)" }}>
                Unlock Your <span style={{ color: "var(--eduma-red)" }}>Potential</span> With Expert Mentors
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                TalentBD bridges the gap between ambition and success. Explore 1,200+ curated courses, live jobs, and AI interview prep built by industry professionals.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-[10px] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--eduma-red)",
                    boxShadow: "0 12px 28px -8px color-mix(in oklab, var(--eduma-red) 45%, transparent)",
                  }}
                >
                  Explore Jobs <ArrowRight className="size-5" />
                </a>
                <a
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-[10px] border-2 bg-white px-8 py-4 font-semibold transition-all hover:text-[var(--eduma-red)]"
                  style={{
                    color: "var(--eduma-ink)",
                    borderColor: "color-mix(in oklab, var(--eduma-ink) 10%, transparent)",
                  }}
                >
                  View Curriculum
                </a>
              </div>

              <div className="grid grid-cols-3 gap-8 border-t pt-10" style={{ borderColor: "color-mix(in oklab, var(--eduma-ink) 6%, transparent)" }}>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "var(--eduma-ink)" }}>15k+</div>
                  <div className="text-sm font-medium text-muted-foreground">Graduates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "var(--eduma-ink)" }}>4.9</div>
                  <div className="text-sm font-medium text-muted-foreground">User Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: "var(--eduma-ink)" }}>250+</div>
                  <div className="text-sm font-medium text-muted-foreground">Instructors</div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              {/* Decorative glows */}
              <div className="pointer-events-none absolute -left-10 -top-10 -z-10 size-48 rounded-full blur-3xl" style={{ background: "color-mix(in oklab, var(--eduma-red) 12%, transparent)" }} />
              <div className="pointer-events-none absolute -bottom-10 -right-10 -z-10 size-48 rounded-full blur-3xl" style={{ background: "color-mix(in oklab, var(--eduma-gold) 14%, transparent)" }} />

              {/* Hero panel */}
              <div
                className="relative h-[560px] overflow-hidden rounded-[10px] shadow-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--eduma-ink) 92%, transparent) 0%, color-mix(in oklab, var(--eduma-red) 55%, var(--eduma-ink)) 100%)",
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--eduma-gold) 40%, transparent) 0%, transparent 40%), radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--eduma-red) 50%, transparent) 0%, transparent 45%)",
                }} />
                <div className="relative flex h-full flex-col justify-end p-8 text-white">
                  <Sparkles className="mb-4 size-10" style={{ color: "var(--eduma-gold)" }} />
                  <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--eduma-gold)" }}>
                    Learn · Apply · Grow
                  </p>
                  <h3 className="mt-2 text-3xl font-bold leading-tight">
                    Built for the next generation of Bangladeshi talent.
                  </h3>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -right-6 -top-6 z-10 flex items-center gap-4 rounded-[10px] border bg-white p-5 shadow-xl" style={{ borderColor: "color-mix(in oklab, var(--eduma-ink) 6%, transparent)" }}>
                <div className="flex size-12 items-center justify-center rounded-full" style={{ background: "var(--eduma-gold)", color: "var(--eduma-ink)" }}>
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "var(--eduma-ink)" }}>Certified Courses</div>
                  <div className="text-xs text-muted-foreground">Industry Recognized</div>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-8 -left-8 z-10 rounded-[10px] p-6 shadow-2xl text-white" style={{ background: "var(--eduma-ink)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <div className="size-10 rounded-full border-2" style={{ borderColor: "var(--eduma-ink)", background: "color-mix(in oklab, var(--eduma-gold) 70%, white)" }} />
                    <div className="size-10 rounded-full border-2" style={{ borderColor: "var(--eduma-ink)", background: "color-mix(in oklab, var(--eduma-red) 60%, white)" }} />
                    <div className="flex size-10 items-center justify-center rounded-full border-2 text-[10px] font-bold" style={{ borderColor: "var(--eduma-ink)", background: "var(--eduma-red)" }}>
                      +5k
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--eduma-gold)" }}>Joined this month</div>
                    <div className="text-sm font-medium">Join our active community</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Stats band */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(([n, l], i) => (
            <ScrollReveal key={l} delay={i * 60}>
              <div className="rounded-3xl border border-border bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-1 text-4xl font-bold" style={{ color: "var(--eduma-ink)", fontFamily: "Space Grotesk, sans-serif" }}>
                  {n}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{l}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Disciplines grid */}
        <section>
          <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--eduma-ink)" }}>
                Browse Disciplines
              </h2>
              <div className="h-1.5 w-12 rounded-full" style={{ background: "var(--eduma-red)" }} />
            </div>
            <a
              href="/jobs"
              className="border-b-2 pb-1 text-sm font-bold uppercase tracking-widest transition-all hover:border-[var(--eduma-red)]"
              style={{ color: "var(--eduma-red)", borderColor: "color-mix(in oklab, var(--eduma-red) 20%, transparent)" }}
            >
              View All Categories
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d, i) => {
              const Icon = d.icon;
              return (
                <ScrollReveal key={d.name} delay={(i % 3) * 80}>
                  <a
                    href={d.href}
                    className="group block h-full rounded-3xl border border-border bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div
                      className="mb-8 flex size-14 items-center justify-center rounded-2xl transition-colors group-hover:bg-[var(--eduma-ink)]"
                      style={{ background: "var(--eduma-red-soft)" }}
                    >
                      <Icon className="size-6 transition-colors group-hover:text-white" style={{ color: "var(--eduma-red)" }} />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold" style={{ color: "var(--eduma-ink)" }}>
                      {d.name}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">{d.desc}</p>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Dual: Jobs + Learning */}
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Jobs */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--eduma-ink)" }}>
              Premium Roles
              <span className="h-[2px] flex-1 bg-border" />
            </h3>
            <div className="space-y-4">
              {FEATURED_JOBS.map((j) => (
                <a
                  key={j.title}
                  href="/jobs"
                  className="group flex cursor-pointer items-center rounded-2xl border border-border bg-white p-6 shadow-sm transition-colors hover:border-[var(--eduma-red)]"
                >
                  <div
                    className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white"
                    style={{ background: j.color }}
                  >
                    {j.initial}
                  </div>
                  <div className="ml-5 flex-1">
                    <h4 className="text-lg font-bold" style={{ color: "var(--eduma-ink)" }}>{j.title}</h4>
                    <p className="text-sm text-muted-foreground">{j.meta}</p>
                  </div>
                  <div
                    className="rounded-full px-4 py-1.5 text-xs font-bold transition-colors group-hover:bg-[var(--eduma-red)] group-hover:text-white"
                    style={{ background: "var(--eduma-red-soft)", color: "var(--eduma-red)" }}
                  >
                    {j.tag}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--eduma-ink)" }}>
              Learning Modules
              <span className="h-[2px] flex-1 bg-border" />
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {FEATURED_MODULES.map((m) => (
                <a
                  key={m.title}
                  href={m.href}
                  className="group relative flex h-60 cursor-pointer flex-col justify-end overflow-hidden rounded-3xl p-8"
                  style={{ background: m.bg }}
                >
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{ background: "linear-gradient(to top, var(--eduma-ink), transparent)" }}
                  />
                  <div
                    className="absolute left-8 top-8 rounded-xl border p-3 text-xs font-bold uppercase tracking-tighter text-white backdrop-blur-md"
                    style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.1)" }}
                  >
                    {m.tag}
                  </div>
                  <div className="relative z-10">
                    <h4 className="mb-2 text-2xl font-bold text-white">{m.title}</h4>
                    <p className="text-sm text-white/70">{m.desc}</p>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: "var(--eduma-red)" }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <ScrollReveal>
          <section
            className="relative overflow-hidden rounded-[2.5rem] p-10 text-center text-white shadow-xl md:p-16"
            style={{ background: "linear-gradient(135deg, var(--eduma-ink), var(--eduma-navy))" }}
          >
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">Ready to grow your career?</h2>
            <p className="mb-7 text-white/75">Join thousands of Bangladeshi engineers learning, certifying and getting hired on TalentBD.</p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[var(--eduma-navy)]"
              style={{ background: "var(--eduma-red)" }}
            >
              Create free account <ArrowRight className="size-4" />
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}



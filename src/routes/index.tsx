import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CtaButton } from "@/components/CtaButton";
import { ArrowRight, Cpu, Zap, Building2, Briefcase, GraduationCap, LineChart } from "lucide-react";

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

const LEARNING_MODULES = [
  { title: "Full-Stack Web Development", desc: "Master React, Node and modern deployment workflows.", bg: "var(--eduma-ink)", href: "/learn#cse" },
  { title: "Power Systems Essentials",   desc: "From transmission to smart grids, taught by industry leads.", bg: "var(--eduma-red)", href: "/learn#eee" },
];

function Landing() {
  return (
    <div className="page-enter bg-background">
      {/* Hero — Ink Ambient Glow (premium dark) */}
      <section
        className="relative w-full overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:py-28 lg:py-36"
        style={{ background: "linear-gradient(160deg, #fffaf5 0%, #e0c3fc 55%, #ffb088 100%)" }}
      >
        {/* Dotted grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(40,20,60,0.18) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/4 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: "color-mix(in oklab, var(--eduma-red) 100%, transparent)", opacity: 0.18 }}
        />
        <div
          className="pointer-events-none absolute bottom-1/4 left-1/3 size-[400px] rounded-full blur-[130px]"
          style={{ background: "color-mix(in oklab, var(--eduma-gold) 100%, transparent)", opacity: 0.14 }}
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500 ring-2 ring-green-400/40" />
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--eduma-ink)]/80">
              The Premium Talent Network
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-[2rem] font-extrabold leading-[1.15] tracking-tight text-[var(--eduma-ink)] sm:text-5xl sm:leading-[1.1] md:text-6xl md:leading-[1.05] lg:text-7xl">
            Build skills.
            <br />
            Earn credentials.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--eduma-red), var(--eduma-gold))",
              }}
            >
              Land the job.
            </span>
          </h1>

          {/* Subhead */}
          <p className="mb-10 max-w-2xl text-base leading-[1.65] text-[var(--eduma-ink)]/75 sm:text-lg md:text-xl md:leading-[1.7]">
            TalentBD is Bangladesh's premium learn-and-earn platform — courses, verified
            certifications, a dual-style CV builder, an ATS parser, and a local + global jobs
            marketplace.
          </p>

          {/* CTAs */}
          <nav
            aria-label="Primary hero actions"
            className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:gap-5"
          >
            <CtaButton
              to="/jobs"
              variant="primary"
              aria-label="Browse Live Jobs — view live engineering roles"
            >
              <span>Browse Live Jobs</span>
              <ArrowRight aria-hidden="true" focusable="false" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </CtaButton>
            <CtaButton
              to="/learn"
              variant="secondary"
              aria-label="Start Learning Free — open engineering modules"
            >
              <span>Start Learning Free</span>
              <GraduationCap aria-hidden="true" focusable="false" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />
            </CtaButton>
          </nav>

          {/* Trust */}
          <div className="mt-20 w-full max-w-xl border-t border-white/5 pt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
              Trusted by innovators worldwide
            </p>
            <div className="flex flex-nowrap items-center justify-center gap-x-4 sm:gap-x-6 overflow-x-auto whitespace-nowrap">
              {[
                { name: "Pathao", color: "#E2136E", style: "italic font-extrabold" },
                { name: "BrainStation 23", color: "#F58220", style: "font-bold" },
                { name: "bKash", color: "#E2136E", style: "font-extrabold tracking-tight" },
                { name: "Grameenphone", color: "#00A6E2", style: "font-bold" },
              ].map((c) => (
                <span
                  key={c.name}
                  aria-label={`${c.name} logo`}
                  className={`shrink-0 rounded-md bg-white px-3 py-1.5 text-sm sm:text-base ${c.style}`}
                  style={{ color: c.color, fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:px-6 md:py-20">

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
              className="border-b-2 pb-1 text-sm font-bold uppercase tracking-widest transition-all hover:border-[var(--eduma-red-strong)]"
              style={{ color: "var(--eduma-red-strong)", borderColor: "color-mix(in oklab, var(--eduma-red-strong) 30%, transparent)" }}
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
                      <Icon className="size-6 transition-colors group-hover:text-white" style={{ color: "var(--eduma-red-strong)" }} />
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
        <div className="flex flex-col gap-12">
          {/* Jobs — single full-width card */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--eduma-ink)" }}>
              Premium Roles
              <span className="h-[2px] flex-1 bg-border" />
            </h3>
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
              <div className="divide-y divide-border">
                {FEATURED_JOBS.map((j) => (
                  <a
                    key={j.title}
                    href="/jobs"
                    className="group flex cursor-pointer items-center py-5 first:pt-0 last:pb-0 transition-colors"
                  >
                    <div
                      className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white"
                      style={{ background: j.color }}
                    >
                      {j.initial}
                    </div>
                    <div className="ml-5 flex-1">
                      <h4 className="text-lg font-bold transition-colors group-hover:text-[var(--eduma-red-strong)]" style={{ color: "var(--eduma-ink)" }}>{j.title}</h4>
                      <p className="text-sm text-muted-foreground">{j.meta}</p>
                    </div>
                    <div
                      className="rounded-full px-4 py-1.5 text-xs font-bold transition-colors group-hover:bg-[var(--eduma-red-strong)] group-hover:text-white"
                      style={{ background: "var(--eduma-red-soft)", color: "var(--eduma-red-strong)" }}
                    >
                      {j.tag}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Modules — split card: animation | content */}
          <div className="space-y-8">
            <h3 className="flex items-center gap-4 text-2xl font-bold md:text-3xl" style={{ color: "var(--eduma-ink)" }}>
              Learning Modules
              <span className="h-[2px] flex-1 bg-border" />
            </h3>
            <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-white shadow-sm md:grid-cols-2">
              {/* Left — animated visual */}
              <div
                className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-10"
                style={{ background: "linear-gradient(135deg, var(--eduma-ink), var(--eduma-navy))" }}
              >
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div
                  className="absolute -left-10 -top-10 size-64 rounded-full blur-3xl animate-pulse"
                  style={{ background: "color-mix(in oklab, var(--eduma-red) 70%, transparent)", opacity: 0.5 }}
                />
                <div
                  className="absolute -bottom-12 -right-8 size-72 rounded-full blur-3xl animate-pulse"
                  style={{ background: "color-mix(in oklab, var(--eduma-gold) 70%, transparent)", opacity: 0.4, animationDelay: "1s" }}
                />
                <div className="relative z-10 text-center">
                  <div className="mb-4 inline-flex size-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 animate-[scale-in_0.6s_ease-out]">
                    <GraduationCap className="size-10 text-white" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">Learn • Build • Earn</p>
                </div>
              </div>

              {/* Right — module list */}
              <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
                {LEARNING_MODULES.map((m) => (
                  <a
                    key={m.title}
                    href={m.href}
                    className="group relative flex flex-1 cursor-pointer flex-col justify-center gap-2 overflow-hidden rounded-2xl p-6"
                    style={{ background: m.bg }}
                  >
                    <div
                      className="absolute inset-0 opacity-80"
                      style={{ background: "linear-gradient(to top, var(--eduma-ink), transparent)" }}
                    />
                    <h4 className="relative z-10 text-lg font-bold leading-tight text-white md:text-xl">{m.title}</h4>
                    <p className="relative z-10 text-sm leading-relaxed text-white/80">{m.desc}</p>
                    <div
                      className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: "var(--eduma-red)" }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <ScrollReveal>
          <section
            className="relative overflow-hidden rounded-[2.5rem] border border-border bg-white p-10 text-center shadow-xl md:p-16"
          >
            <h2 className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: "var(--eduma-ink)" }}>Ready to grow your career?</h2>
            <p className="mb-7 text-muted-foreground">Join thousands of Bangladeshi engineers learning, certifying and getting hired on TalentBD.</p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[var(--eduma-navy)]"
              style={{ background: "var(--eduma-red-strong)" }}
            >
              Create free account <ArrowRight className="size-4" />
            </a>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}



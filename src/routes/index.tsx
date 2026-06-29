import { createFileRoute, Link } from "@tanstack/react-router";
import { ScrollReveal } from "@/components/ScrollReveal";
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

const FEATURED_MODULES = [
  { tag: "Featured", title: "Full-Stack Web Development", desc: "Master React, Node and modern deployment workflows.", bg: "var(--eduma-ink)", href: "/learn#cse" },
  { tag: "Popular",  title: "Power Systems Essentials",   desc: "From transmission to smart grids, taught by industry leads.", bg: "var(--eduma-red)", href: "/learn#eee" },
];

function Landing() {
  return (
    <div className="page-enter bg-background">
      {/* Hero — Ink Ambient Glow (premium dark) */}
      <section
        className="relative w-full overflow-hidden px-6 py-24 md:py-32"
        style={{ background: "var(--eduma-ink)" }}
      >
        {/* Dotted grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
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
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">
              The Premium Talent Network
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
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
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/60 sm:text-xl">
            Connect with deeply vetted developers, designers, and tech leaders steering Bangladesh's
            most ambitious teams — learn, apply, and grow on one premium platform.
          </p>

          {/* CTAs */}
          <nav
            aria-label="Primary hero actions"
            className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <Link
              to="/jobs"
              aria-label="Browse Live Jobs — view live engineering roles"
              className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] px-8 py-4 text-center text-sm font-bold tracking-wide text-white shadow-lg outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--eduma-red-hover)] focus-visible:ring-2 focus-visible:ring-[var(--eduma-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--eduma-ink)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
              style={{
                background: "var(--eduma-red-strong)",
                boxShadow: "0 12px 28px -8px color-mix(in oklab, var(--eduma-red-strong) 55%, transparent)",
              }}
            >
              <span>Browse Live Jobs</span>
              <ArrowRight aria-hidden="true" focusable="false" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
            <Link
              to="/learn"
              aria-label="Start Learning Free — open engineering modules"
              className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-white/25 bg-white/10 px-8 py-4 text-center text-sm font-bold tracking-wide text-white outline-none backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--eduma-gold)] hover:bg-white/15 hover:text-[var(--eduma-gold)] focus-visible:ring-2 focus-visible:ring-[var(--eduma-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--eduma-ink)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
            >
              <span>Start Learning Free</span>
              <GraduationCap aria-hidden="true" focusable="false" className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />
            </Link>
          </nav>

          {/* Trust */}
          <div className="mt-20 w-full max-w-xl border-t border-white/5 pt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-white/40">
              Trusted by innovators worldwide
            </p>
            <div className="flex items-center justify-center gap-8 text-sm font-bold tracking-wider text-white/50">
              <span>PATHAO</span>
              <span>BRAINSTATION</span>
              <span>BKASH</span>
              <span>GRAMEENPHONE</span>
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
                    className="rounded-full px-4 py-1.5 text-xs font-bold transition-colors group-hover:bg-[var(--eduma-red-strong)] group-hover:text-white"
                    style={{ background: "var(--eduma-red-soft)", color: "var(--eduma-red-strong)" }}
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



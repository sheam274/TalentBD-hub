import { createFileRoute } from "@tanstack/react-router";
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
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 md:px-6 md:py-20">
        {/* Hero — rounded premium navy slab */}
        <ScrollReveal>
          <section
            className="relative overflow-hidden rounded-[2.5rem] border p-10 text-white shadow-2xl md:p-20"
            style={{ background: "var(--eduma-ink)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="relative z-10 max-w-2xl">
              <span
                className="mb-6 inline-block rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-widest"
                style={{ background: "color-mix(in oklab, var(--eduma-red) 18%, transparent)", color: "var(--eduma-gold)", borderColor: "color-mix(in oklab, var(--eduma-red) 35%, transparent)" }}
              >
                Premium Career Portal · Bangladesh
              </span>
              <h1 className="mb-8 text-4xl font-bold leading-[1.05] tracking-tight md:text-7xl">
                Elevate Your <span style={{ color: "var(--eduma-red)" }}>Career</span> with TalentBD
              </h1>
              <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-300/85 md:text-xl">
                Connect with top-tier local and global opportunities, world-class learning modules,
                and verified credentials — built for the modern engineering professional.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[var(--eduma-navy)] md:px-10 md:py-5"
                  style={{ background: "var(--eduma-red)", boxShadow: "0 12px 28px -8px color-mix(in oklab, var(--eduma-red) 45%, transparent)" }}
                >
                  Explore Jobs <ArrowRight className="size-4" />
                </a>
                <a
                  href="/learn"
                  className="rounded-xl border px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 md:px-10 md:py-5"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.2)" }}
                >
                  Start Learning
                </a>
              </div>
            </div>
            {/* Premium glow accents */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-[30rem] rounded-full opacity-40"
              style={{ background: "var(--eduma-navy)", filter: "blur(120px)" }}
            />
            <div
              className="pointer-events-none absolute bottom-0 right-40 size-80 rounded-full opacity-20"
              style={{ background: "var(--eduma-red)", filter: "blur(100px)" }}
            />
          </section>
        </ScrollReveal>

        {/* Stats band */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map(([n, l], i) => (
            <ScrollReveal key={l} delay={i * 60}>
              <div className="rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-1 text-4xl font-bold" style={{ color: "var(--eduma-ink)", fontFamily: "Space Grotesk, sans-serif" }}>
                  {n}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{l}</div>
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
                    className="group block h-full rounded-3xl border border-slate-100 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
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
                    <p className="leading-relaxed text-slate-500">{d.desc}</p>
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
              <span className="h-[2px] flex-1 bg-slate-200/60" />
            </h3>
            <div className="space-y-4">
              {FEATURED_JOBS.map((j) => (
                <a
                  key={j.title}
                  href="/jobs"
                  className="group flex cursor-pointer items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-colors hover:border-[var(--eduma-red)]"
                >
                  <div
                    className="flex size-12 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white"
                    style={{ background: j.color }}
                  >
                    {j.initial}
                  </div>
                  <div className="ml-5 flex-1">
                    <h4 className="text-lg font-bold" style={{ color: "var(--eduma-ink)" }}>{j.title}</h4>
                    <p className="text-sm text-slate-500">{j.meta}</p>
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
              <span className="h-[2px] flex-1 bg-slate-200/60" />
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



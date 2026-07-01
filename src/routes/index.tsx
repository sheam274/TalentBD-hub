import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CtaButton } from "@/components/CtaButton";
import { ArrowRight, Code2, Bolt, HardHat, Landmark, Palette, Megaphone, GraduationCap } from "lucide-react";
import pathaoAsset from "@/assets/partners/pathao.png.asset.json";
import brainstationAsset from "@/assets/partners/brainstation.png.asset.json";
import bkashAsset from "@/assets/partners/bkash.png.asset.json";
import grameenphoneAsset from "@/assets/partners/grameenphone.png.asset.json";
import learningVideoAsset from "@/assets/learning-modules.mp4.asset.json";
import heroVideoAsset from "@/assets/hero-talent.mp4.asset.json";

const PARTNER_LOGOS = [
  { name: "Pathao", url: pathaoAsset.url },
  { name: "Brain Station 23", url: brainstationAsset.url },
  { name: "bKash", url: bkashAsset.url },
  { name: "Grameenphone", url: grameenphoneAsset.url },
];

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
  { name: "Computer Science", desc: "Web, mobile, data, networking and modern software engineering tracks.", icon: Code2, href: "/learn#cse" },
  { name: "Electrical & Electronic", desc: "Power systems, VLSI, embedded design and industrial automation.", icon: Bolt, href: "/learn#eee" },
  { name: "Civil Engineering", desc: "Structural, BIM/CAD and project management for the built world.", icon: HardHat, href: "/learn#civil" },
  { name: "Banking & Finance", desc: "Land roles across local banks, fintech and global remote finance.", icon: Landmark, href: "/jobs?category=Banking%2FFinance" },
  { name: "Design & Creative", desc: "Product design, UI, motion and brand for digital products.", icon: Palette, href: "/jobs?category=Design" },
  { name: "Sales & Marketing", desc: "Growth, brand and revenue roles across SaaS and consumer.", icon: Megaphone, href: "/jobs?category=Marketing" },
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
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroVideoSrc, setHeroVideoSrc] = useState<string | null>(null);
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  useEffect(() => {
    const el = heroVideoRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setHeroVideoSrc(heroVideoAsset.url);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setHeroVideoSrc(heroVideoAsset.url);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="page-enter bg-background">
      {/* Hero — Ink Ambient Glow (premium dark) */}
      <section
        className="relative flex min-h-[calc(100svh-var(--header-h,4rem))] w-full flex-col justify-center overflow-hidden px-5 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12 md:pt-8 md:pb-12 lg:pt-10 lg:pb-14"
        style={{
          background:
            "radial-gradient(1200px 600px at 12% 0%, rgba(255,182,6,0.22), transparent 60%)," +
            "radial-gradient(1000px 700px at 90% 20%, rgba(254,82,82,0.20), transparent 60%)," +
            "radial-gradient(900px 800px at 50% 110%, rgba(17,17,39,0.10), transparent 65%)," +
            "linear-gradient(160deg, #fff7ee 0%, #ffe9d6 45%, #ffd3c4 100%)",
        }}
      >
        {/* Dotted grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(17,17,39,0.18) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
          }}
        />
        {/* Ambient orbs */}
        <div
          className="pointer-events-none absolute -left-24 top-10 size-[520px] rounded-full blur-[130px]"
          style={{ background: "var(--eduma-red)", opacity: 0.22 }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 size-[460px] rounded-full blur-[140px]"
          style={{ background: "var(--eduma-gold)", opacity: 0.28 }}
        />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left card — text + CTAs */}
            <div className="flex flex-col justify-center rounded-3xl px-2 pt-2 pb-6 sm:px-4 sm:pt-4 sm:pb-8 md:px-6 md:pt-6 md:pb-10 lg:pr-8 text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 self-center rounded-full border border-[var(--eduma-ink)]/10 bg-white/70 px-4 py-2 shadow-sm backdrop-blur lg:self-start">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-green-500 ring-2 ring-green-400/40" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--eduma-ink)]">
                  The Premium Talent Network
                </span>
              </div>

              <h1 className="mb-5 text-[2.15rem] font-extrabold leading-[1.1] tracking-tight text-[var(--eduma-ink)] sm:text-5xl sm:leading-[1.05] md:text-6xl md:leading-[1.02] lg:text-[4.25rem]">
                Build skills.
                <br />
                Earn credentials.
                <br />
                <span
                  className="bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(254,82,82,0.25)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, var(--eduma-red-strong) 0%, #b8350f 55%, #8a5a00 100%)",
                  }}
                >
                  Land the job.
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-base leading-[1.65] text-[var(--eduma-ink)]/85 sm:text-lg md:leading-[1.7] mx-auto lg:mx-0">
                TalentBD is Bangladesh's premium learn-and-earn platform — courses, verified
                certifications, a dual-style CV builder, an ATS parser, and a local + global jobs
                marketplace.
              </p>

              <nav
                aria-label="Primary hero actions"
                className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 justify-center lg:justify-start"
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
            </div>

            {/* Right — borderless video, blended into hero */}
            <div className="relative mx-auto w-full max-w-[640px] aspect-[4/3] sm:aspect-video lg:aspect-[5/4] lg:max-w-none lg:h-full">
              <video
                ref={heroVideoRef}
                {...(heroVideoSrc ? { src: heroVideoSrc } : {})}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="Bangladeshi professionals learning and working"
                className={`absolute inset-0 size-full object-cover [object-position:50%_35%] sm:[object-position:50%_45%] lg:[object-position:50%_50%] transition-opacity duration-500 ${heroVideoReady ? "opacity-100" : "opacity-0"}`}
                onCanPlay={() => setHeroVideoReady(true)}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  v.playbackRate = 1;
                  // Skip the last frame to avoid the freeze-frame pause before loop restart
                  const trim = 0.15;
                  const onTime = () => {
                    if (v.duration && v.currentTime >= v.duration - trim) {
                      v.currentTime = 0.05;
                      v.play().catch(() => {});
                    }
                  };
                  v.addEventListener("timeupdate", onTime);
                }}
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                  maskImage:
                    "radial-gradient(ellipse at center, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                }}
              />
              {/* Loading skeleton — shown until video can play */}
              {!heroVideoReady && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(254,82,82,0.18), rgba(255,182,6,0.18) 60%, rgba(17,17,39,0.10))",
                    WebkitMaskImage:
                      "radial-gradient(ellipse at center, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse at center, #000 40%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                  }}
                />
              )}
              {/* Warm glow that bleeds into the hero background */}
              <div
                className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(254,82,82,0.25), transparent 60%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(254,82,82,0.10), transparent 40%, rgba(255,182,6,0.12))",
                }}
              />
            </div>
          </div>

          {/* Trust */}
          <div className="mt-10 md:mt-12 w-full border-t border-[var(--eduma-ink)]/10 pt-6 md:pt-8 text-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--eduma-ink)]">
              Trusted by innovators worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-12">
              {PARTNER_LOGOS.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.url}
                  alt={`${logo.name} — trusted TalentBD hiring partner`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(min-width: 640px) 160px, 120px"
                  width={160}
                  height={56}
                  className="h-12 w-auto object-contain opacity-90 transition duration-300 hover:opacity-100 hover:scale-105 sm:h-14"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-12 pb-6 md:px-6 md:pt-20 md:pb-10">

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
              {/* Left — module preview video */}
              <div
                className="relative aspect-video w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[320px]"
                style={{ background: "linear-gradient(135deg, var(--eduma-ink), var(--eduma-navy))" }}
              >
                <video
                  src={learningVideoAsset.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Learning modules preview"
                  className="absolute inset-0 size-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(11,16,32,0.85), rgba(11,16,32,0.15) 55%, transparent)" }}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 p-5 sm:p-6">
                  <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25">
                    <GraduationCap className="size-6 text-white" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/85 sm:text-xs">Learn • Build • Earn</p>
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



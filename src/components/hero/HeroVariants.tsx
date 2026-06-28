import { ArrowRight, Search, Play, Star, GraduationCap, Briefcase, Sparkles, TrendingUp, Award, Users, Code2, Palette, Megaphone, Brain } from "lucide-react";

const ink = "var(--eduma-ink)";
const red = "var(--eduma-red)";
const gold = "var(--eduma-gold)";
const mix = (token: string, pct: number) => `color-mix(in oklab, ${token} ${pct}%, transparent)`;

/* ---------- Variant A: Centered editorial ---------- */
export function HeroCenteredEditorial() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full blur-3xl" style={{ background: mix(gold, 14) }} />
      <div className="pointer-events-none absolute -bottom-12 -right-12 size-56 rounded-full blur-3xl" style={{ background: mix(red, 10) }} />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <span className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold tracking-wide" style={{ background: mix(red, 10), color: red }}>
          THE ULTIMATE LEARNING PLATFORM
        </span>

        <h1 className="mt-6 text-5xl font-bold leading-[1.15] md:text-6xl" style={{ color: ink }}>
          Advance Your Career with <br />
          <span style={{ color: red }}>Expert-Led</span> Online Courses
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Join 25,000+ students worldwide. Access high-quality video tutorials, interactive quizzes, and
          professional certifications across technology, business, and creative arts.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="/learn" className="rounded-[10px] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: red, boxShadow: `0 12px 28px -8px ${mix(red, 45)}` }}>
            Explore All Courses
          </a>
          <a href="/jobs" className="rounded-[10px] border-2 bg-white px-8 py-4 font-semibold transition-all hover:text-[var(--eduma-red)]"
            style={{ color: ink, borderColor: mix(ink, 10) }}>
            View Live Jobs
          </a>
        </div>

        <div className="mt-16 border-t pt-10" style={{ borderColor: mix(ink, 6) }}>
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by leading organizations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50">
            {["Pathao", "BrainStation", "Grameenphone", "bKash", "Daraz"].map((n) => (
              <span key={n} className="text-lg font-bold tracking-tight" style={{ color: ink }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Variant B: Course marketplace grid ---------- */
export function HeroMarketplaceGrid() {
  const cats = [
    { icon: Code2, label: "Web Development", count: "840+ Courses", tint: gold, dark: false },
    { icon: Palette, label: "Graphic Design", count: "620+ Courses", tint: red, dark: false, offset: "mt-8" },
    { icon: Megaphone, label: "Digital Marketing", count: "415+ Courses", tint: ink, dark: false, offset: "-mt-8" },
    { icon: Brain, label: "Soft Skills", count: "290+ Courses", tint: gold, dark: true },
  ];
  return (
    <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-5">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold" style={{ background: mix(gold, 12), color: gold }}>
          <span className="size-2 rounded-full" style={{ background: gold }} />
          NEW COURSES ADDED WEEKLY
        </div>
        <h1 className="text-5xl font-bold leading-[1.1] lg:text-6xl" style={{ color: ink }}>
          Master New Skills with <span style={{ color: red }}>TalentBD</span> Marketplace
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
          Explore 5,000+ expert-led courses designed to bridge the talent gap in Bangladesh. Learn at your own pace from industry leaders.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/learn" className="rounded-[10px] px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: red, boxShadow: `0 12px 28px -8px ${mix(red, 45)}` }}>
            Browse Courses
          </a>
          <a href="/auth" className="rounded-[10px] border-2 px-8 py-4 font-semibold transition-all hover:text-white"
            style={{ color: ink, borderColor: ink }}
            onMouseOver={(e) => (e.currentTarget.style.background = ink)}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
            Become an Instructor
          </a>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-4 lg:col-span-7 lg:gap-6">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: mix(red, 6) }} />
        {cats.map(({ icon: Icon, label, count, tint, dark, offset }) => (
          <div key={label}
            className={`group rounded-[10px] border p-6 shadow-xl transition-transform hover:-translate-y-2 ${offset ?? ""}`}
            style={{
              background: dark ? ink : "white",
              borderColor: dark ? "transparent" : mix(ink, 6),
            }}>
            <div className="mb-4 flex size-12 items-center justify-center rounded-[10px]"
              style={{ background: dark ? "rgba(255,255,255,.1)" : mix(tint, 12), color: tint }}>
              <Icon className="size-6" />
            </div>
            <h3 className="mb-1 font-bold" style={{ color: dark ? "white" : ink }}>{label}</h3>
            <p className="text-xs" style={{ color: dark ? mix("white" as any, 60) : "var(--muted-foreground)" }}>{count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Variant C: Search-led immersive ---------- */
export function HeroSearchImmersive() {
  return (
    <section className="relative overflow-hidden rounded-[10px] py-20"
      style={{ background: `linear-gradient(135deg, ${ink} 0%, color-mix(in oklab, ${red} 40%, ${ink}) 100%)` }}>
      <div className="absolute inset-0 opacity-25" style={{
        backgroundImage:
          `radial-gradient(circle at 15% 25%, ${mix(gold, 40)} 0%, transparent 40%), radial-gradient(circle at 85% 75%, ${mix(red, 50)} 0%, transparent 45%)`,
      }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center text-white">
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold backdrop-blur"
          style={{ background: "rgba(255,255,255,.1)", color: gold }}>
          <Sparkles className="size-4" /> 12,000+ Live Jobs Today
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
          Find your next role in <span style={{ color: gold }}>seconds</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg" style={{ color: "rgba(255,255,255,.75)" }}>
          Search across local and global employers. Filter by remote, on-site, salary, and skill — powered by TalentBD's AI matching.
        </p>

        <form action="/jobs" className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-[10px] bg-white p-2 shadow-2xl sm:flex-row">
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="size-5 text-muted-foreground" />
            <input name="q" placeholder="Job title, skill, or company" className="w-full bg-transparent py-3 text-base outline-none" style={{ color: ink }} />
          </div>
          <button className="rounded-[10px] px-6 py-3 font-semibold text-white" style={{ background: red }}>
            Search Jobs
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm" style={{ color: "rgba(255,255,255,.7)" }}>
          <span>Popular:</span>
          {["Frontend", "Data Analyst", "Network Engineer", "UI Designer"].map((t) => (
            <a key={t} href={`/jobs?q=${encodeURIComponent(t)}`} className="rounded-full px-3 py-1 transition-colors hover:text-white"
              style={{ background: "rgba(255,255,255,.08)" }}>{t}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Variant D: Dual-path (Learn / Earn) ---------- */
export function HeroDualPath() {
  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: mix(red, 10), color: red }}>
          ONE PLATFORM · TWO PATHS
        </span>
        <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl" style={{ color: ink }}>
          Build skills. <span style={{ color: red }}>Land the job.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Whether you're starting fresh or scaling up, TalentBD pairs world-class learning with Bangladesh's most active jobs marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Learn card */}
        <a href="/learn" className="group relative overflow-hidden rounded-[10px] p-8 text-white shadow-xl transition-transform hover:-translate-y-1"
          style={{ background: `linear-gradient(135deg, ${ink} 0%, color-mix(in oklab, ${ink} 80%, ${red}) 100%)` }}>
          <GraduationCap className="size-10" style={{ color: gold }} />
          <h3 className="mt-4 text-3xl font-bold">Learn a skill</h3>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "rgba(255,255,255,.75)" }}>
            1,200+ expert-led courses across engineering, design, and business — with certifications recruiters trust.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: gold }}>
            Start learning <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
          <Play className="absolute -bottom-6 -right-6 size-32 opacity-10" />
        </a>

        {/* Earn card */}
        <a href="/jobs" className="group relative overflow-hidden rounded-[10px] p-8 text-white shadow-xl transition-transform hover:-translate-y-1"
          style={{ background: `linear-gradient(135deg, ${red} 0%, color-mix(in oklab, ${red} 70%, ${gold}) 100%)` }}>
          <Briefcase className="size-10 text-white" />
          <h3 className="mt-4 text-3xl font-bold">Land a job</h3>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "rgba(255,255,255,.85)" }}>
            12,000+ live roles synced from top employers — remote, hybrid, and on-site, with AI interview prep built in.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
            Browse jobs <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
          <TrendingUp className="absolute -bottom-6 -right-6 size-32 opacity-15" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: Users, n: "50k+", l: "Active Users" },
          { icon: Briefcase, n: "12k+", l: "Live Jobs" },
          { icon: Award, n: "1.2k", l: "Courses" },
          { icon: Star, n: "4.9", l: "Avg. Rating" },
        ].map(({ icon: Icon, n, l }) => (
          <div key={l} className="rounded-[10px] border bg-white p-5 text-center" style={{ borderColor: mix(ink, 6) }}>
            <Icon className="mx-auto mb-2 size-5" style={{ color: red }} />
            <div className="text-2xl font-bold" style={{ color: ink }}>{n}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

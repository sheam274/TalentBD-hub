import { BrandMark } from "@/components/Brand";
import { Facebook, Linkedin, Twitter, Youtube, Globe } from "lucide-react";

type Col = { title: string; links: { label: string; href: string }[] };

const columns: Col[] = [
  {
    title: "Jobs",
    links: [
      { label: "All jobs", href: "/jobs" },
      { label: "Remote jobs", href: "/jobs?remote=remote" },
      { label: "IT / Software", href: "/jobs?category=IT%2FSoftware" },
      { label: "Engineering", href: "/jobs?category=Engineering" },
      { label: "Banking / Finance", href: "/jobs?category=Banking%2FFinance" },
      { label: "Marketing", href: "/jobs?category=Marketing" },
      { label: "Internships", href: "/jobs?type=Internship" },
      { label: "Hot / Featured", href: "/jobs#featured" },
    ],
  },
  {
    title: "Companies",
    links: [
      { label: "Browse companies", href: "/companies" },
      { label: "Top employers", href: "/companies" },
      { label: "Salaries", href: "/salaries" },
      { label: "Company reviews", href: "/companies" },
    ],
  },
  {
    title: "Career",
    links: [
      { label: "CV Builder", href: "/cv-builder" },
      { label: "CV / ATS Parser", href: "/cv-parser" },
      { label: "Career advice", href: "/career-advice" },
      { label: "Interview prep", href: "/interview-prep" },
      { label: "My applications", href: "/my-applications" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "All tracks", href: "/learn" },
      { label: "Certifications", href: "/assessments" },
      { label: "Computer Science", href: "/learn" },
      { label: "Electrical & Electronic", href: "/learn" },
      { label: "Civil Engineering", href: "/learn" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About TalentBD", href: "/" },
      { label: "For employers", href: "/auth" },
      { label: "Help center", href: "/career-advice" },
      { label: "Sign in", href: "/auth" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-eduma-ink-2 bg-eduma-ink font-sans text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 md:grid-cols-[1.2fr_3fr]">
          <div>
            <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary p-1.5 shadow-md">
                <BrandMark size={28} />
              </span>
              <span className="text-xl text-white">Talent<span style={{ color: "var(--eduma-red)" }}>BD</span></span>
              <span
                className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--eduma-red)" }}
              >Premium</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              Bangladesh's premium learn-and-earn platform. Build skills, earn verified credentials, and land local or global remote jobs.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { Icon: Globe, href: "https://w3schools.com", label: "Website" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`TalentBD on ${label}`}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-primary/60 hover:text-white"
                >
                  <Icon className="size-4" aria-hidden="true" focusable="false" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: "var(--eduma-red)" }}>{col.title}</h2>
                <ul className="mt-4 space-y-3 text-sm text-white/75">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="transition-colors hover:text-white">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:grid-cols-4 text-center">
          {[
            ["10K+", "Active learners"],
            ["500+", "Live jobs"],
            ["120+", "Hiring companies"],
            ["80%", "Pass rate to certify"],
          ].map(([n, l]) => (
            <div key={l as string}>
              <div className="text-2xl font-extrabold" style={{ color: "var(--eduma-red)" }}>{n}</div>
              <div className="mt-1 text-xs text-white/50">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-white/50 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} TalentBD. Built in Bangladesh.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/" className="transition-colors hover:text-white">Privacy</a>
            <a href="/" className="transition-colors hover:text-white">Terms</a>
            <a href="/" className="transition-colors hover:text-white">Cookie policy</a>
            <a href="/" className="transition-colors hover:text-white">Accessibility</a>
            <span className="flex items-center gap-1.5 font-mono" style={{ color: "#4ade80" }}>
              <span className="size-2 animate-pulse rounded-full" style={{ background: "#4ade80" }} />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

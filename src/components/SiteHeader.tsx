import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { BrandMark } from "@/components/Brand";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";
import { useQuery } from "@tanstack/react-query";

type NavItem = { to: string; label: string; children?: { to: string; label: string; desc?: string }[] };

const adminNav: NavItem = {
  to: "/admin/dashboard",
  label: "Admin",
  children: [
    { to: "/admin/dashboard", label: "Dashboard", desc: "Overview & stats" },
    { to: "/admin/users", label: "Users", desc: "Manage user accounts" },
    { to: "/admin/employers", label: "Employers", desc: "Company accounts" },
    { to: "/admin/applications", label: "Applications", desc: "All job applications" },
    { to: "/admin/interviews", label: "Interviews", desc: "Scheduled interviews" },
    { to: "/admin/letters", label: "Appointment letters", desc: "Issued offers" },
    { to: "/admin/jobs", label: "Jobs", desc: "Post & manage jobs" },
    { to: "/admin/companies", label: "Companies", desc: "Company profiles" },
    { to: "/admin/modules", label: "Modules", desc: "Learning modules" },
  ],
};

const baseNav: NavItem[] = [
  {
    to: "/jobs",
    label: "Jobs",
    children: [
      { to: "/jobs", label: "All jobs", desc: "Local Bangladesh + global remote" },
      { to: "/jobs?remote=remote", label: "Remote jobs", desc: "Live feed via Remotive" },
      { to: "/jobs?type=Internship", label: "Internships", desc: "Kickstart your career" },
      { to: "/salaries", label: "Salaries", desc: "Pay benchmarks by role" },
    ],
  },
  {
    to: "/companies",
    label: "Companies",
    children: [
      { to: "/companies", label: "Browse companies", desc: "Profiles & open roles" },
      { to: "/salaries", label: "Salary insights", desc: "Compensation data" },
    ],
  },
  {
    to: "/learn",
    label: "Learn",
    children: [
      { to: "/learn", label: "All tracks", desc: "CSE, EEE & Civil" },
      { to: "/assessments", label: "Certifications", desc: "Verified credentials" },
    ],
  },
  {
    to: "/career-advice",
    label: "Career",
    children: [
      { to: "/career-advice", label: "Career advice", desc: "Guides & playbooks" },
      { to: "/interview-prep", label: "Interview prep", desc: "Practice + checklists" },
      { to: "/interview", label: "Give Interview", desc: "AI-graded live interviews" },
      { to: "/cv-builder", label: "CV Builder", desc: "Standard + Premium templates" },
      { to: "/cv-parser", label: "CV / ATS Parser", desc: "Match your CV to a job" },
    ],
  },
];

const employerNav: NavItem = {
  to: "/employer/dashboard",
  label: "Employer",
  children: [
    { to: "/employer/dashboard", label: "Dashboard", desc: "Hiring overview" },
    { to: "/employer/jobs", label: "Job postings", desc: "Create & manage jobs" },
    { to: "/employer/applicants", label: "Applicants", desc: "Pipeline & messaging" },
    { to: "/employer/company", label: "Company profile", desc: "Branding & details" },
  ],
};

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const nav = useNavigate();

  const fetchProfile = useServerFn(getMyProfile);
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchProfile({}),
    enabled: !!user,
  });
  const isAdmin = profileData?.isAdmin ?? false;
  const isEmployer = profileData?.isEmployer ?? false;

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-header text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight group">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-white/10 p-1 ring-1 ring-white/20 transition group-hover:bg-white/20">
            <BrandMark size={28} />
          </span>
          <span className="text-lg">TalentBD</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition" activeProps={{ style: { color: "#fff", textDecoration: "underline", textDecorationColor: "var(--color-accent)", textDecorationThickness: "3px", textUnderlineOffset: "6px" } }} activeOptions={{ exact: true }}>Home</Link>
          {baseNav.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setHover(item.label)} onMouseLeave={() => setHover(null)}>
              <a
                href={item.to}
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition"
              >
                {item.label}
                {item.children && <ChevronDown className="size-3.5 opacity-70" />}
              </a>
              {item.children && hover === item.label && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="min-w-[260px] rounded-xl border border-border bg-popover p-2 shadow-2xl text-popover-foreground">
                    {item.children.map((c) => (
                      <a
                        key={c.to + c.label}
                        href={c.to}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="font-semibold">{c.label}</div>
                        {c.desc && <div className="text-xs text-muted-foreground">{c.desc}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {user && (
            <Link to="/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition" activeProps={{ style: { color: "#fff", textDecoration: "underline", textDecorationColor: "var(--color-accent)", textDecorationThickness: "3px", textUnderlineOffset: "6px" } }}>Dashboard</Link>
          )}
          {user && (
            <Link to="/my-applications" className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition" activeProps={{ style: { color: "#fff", textDecoration: "underline", textDecorationColor: "var(--color-accent)", textDecorationThickness: "3px", textUnderlineOffset: "6px" } }}>Applications</Link>
          )}
          {user && isEmployer && (
            <div className="relative" onMouseEnter={() => setHover("Employer")} onMouseLeave={() => setHover(null)}>
              <a href="/employer/dashboard" className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition">
                Employer <ChevronDown className="size-3.5 opacity-70" />
              </a>
              {hover === "Employer" && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="min-w-[260px] rounded-xl border border-border bg-popover p-2 shadow-2xl text-popover-foreground">
                    {employerNav.children?.map((c) => (
                      <a key={c.to + c.label} href={c.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <div className="font-semibold">{c.label}</div>
                        {c.desc && <div className="text-xs text-muted-foreground">{c.desc}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {user && isAdmin && (
            <div className="relative" onMouseEnter={() => setHover("Admin")} onMouseLeave={() => setHover(null)}>
              <a href="/admin/dashboard" className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition">
                <ShieldCheck className="size-3.5" /> Admin <ChevronDown className="size-3.5 opacity-70" />
              </a>
              {hover === "Admin" && (
                <div className="absolute left-0 top-full pt-2 z-50">
                  <div className="min-w-[260px] rounded-xl border border-border bg-popover p-2 shadow-2xl text-popover-foreground">
                    {adminNav.children?.map((c) => (
                      <a key={c.to + c.label} href={c.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        <div className="font-semibold">{c.label}</div>
                        {c.desc && <div className="text-xs text-muted-foreground">{c.desc}</div>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {user ? (
            <button onClick={signOut} className="ml-2 inline-flex items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
              <LogOut className="size-4" /> Sign out
            </button>
          ) : (
            <Link to="/auth" className="ml-2 rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
              Sign in
            </Link>
          )}
        </nav>

        <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 px-4 pb-4 glass-header max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-1 pt-2">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Home</Link>
            {baseNav.map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-2 mt-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">{item.label}</div>
                {(item.children ?? [{ to: item.to, label: item.label }]).map((c) => (
                  <a key={c.to + c.label} href={c.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                    {c.label}
                  </a>
                ))}
              </div>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Dashboard</Link>
                {isAdmin && (
                  <div className="border-t border-white/10 pt-2 mt-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1"><ShieldCheck className="size-3" /> Admin</div>
                    {adminNav.children?.map((c) => (
                      <a key={c.to + c.label} href={c.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
                <Link to="/my-applications" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">My applications</Link>
                <button onClick={signOut} className="mt-2 rounded-md border border-white/30 px-3 py-2 text-left text-sm">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="mt-2 rounded-md px-3 py-2 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

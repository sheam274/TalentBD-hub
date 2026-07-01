import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, X, LogOut, ChevronDown, ShieldCheck, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
      { to: "/learn/exam-prep", label: "IT Job Exam Prep", desc: "BB AD-IT, BCS, Big Tech quizzes" },
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
  const currentHref = useRouterState({
    select: (s) => s.location.pathname + (s.location.searchStr ? `?${s.location.searchStr}` : ""),
  });
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isChildActive = (to: string) => {
    if (to.includes("?")) {
      const [path, query] = to.split("?");
      if (currentPath !== path) return false;
      const wanted = new URLSearchParams(query);
      const current = new URLSearchParams(
        currentHref.includes("?") ? currentHref.split("?")[1] : "",
      );
      for (const [k, v] of wanted) {
        if (current.get(k) !== v) return false;
      }
      return true;
    }
    return currentPath === to || currentPath.startsWith(to + "/");
  };
  const isParentActive = (children?: { to: string }[]) =>
    !!children?.some((c) => isChildActive(c.to));
  const activeChildCls =
    "bg-accent/15 text-accent ring-1 ring-accent/40";
  const activeParentCls =
    "bg-white/10 ring-1 ring-white/30";

  const fetchProfile = useServerFn(getMyProfile);
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchProfile({}),
    enabled: !!user,
  });
  const isAdmin = profileData?.isAdmin ?? false;
  const isEmployer = profileData?.isEmployer ?? false;
  const displayName =
    profileData?.profile?.name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Account");
  const initials = displayName
    .split(/\s+/)
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const set = () => {
      document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full glass-header text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-bold tracking-tight group shrink-0">
          <span className="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg bg-white/10 p-1 ring-1 ring-white/20 transition group-hover:bg-white/20 shrink-0">
            <BrandMark size={28} />
          </span>
          <span className="text-base sm:text-lg truncate">TalentBD</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/" className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition" activeProps={{ style: { color: "#fff", textDecoration: "underline", textDecorationColor: "var(--color-accent)", textDecorationThickness: "3px", textUnderlineOffset: "6px" } }} activeOptions={{ exact: true }}>Home</Link>
          {baseNav.map((item) => (
            <div key={item.label} className="relative" onMouseEnter={() => setHover(item.label)} onMouseLeave={() => setHover(null)}>
              <a
                href={item.to}
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-accent hover:text-accent-foreground transition ${isParentActive(item.children) ? activeParentCls : ""}`}
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
                        aria-current={isChildActive(c.to) ? "page" : undefined}
                        className={`block rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${isChildActive(c.to) ? activeChildCls : ""}`}
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
            <div className="relative ml-2" onMouseEnter={() => setHover("Account")} onMouseLeave={() => setHover(null)}>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 py-1 pl-1 pr-3 text-sm hover:bg-accent hover:text-accent-foreground transition"
                aria-haspopup="menu"
                aria-expanded={hover === "Account"}
              >
                <span className="inline-flex size-7 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
                  {initials || <UserIcon className="size-4" />}
                </span>
                <span className="max-w-[140px] truncate font-medium">{displayName}</span>
                <ChevronDown className="size-3.5 opacity-70" />
              </button>
              {hover === "Account" && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="min-w-[240px] rounded-xl border border-border bg-popover p-2 shadow-2xl text-popover-foreground">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <div className="text-sm font-semibold truncate">{displayName}</div>
                      {user.email && <div className="text-xs text-muted-foreground truncate">{user.email}</div>}
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                      <UserIcon className="size-4" /> Profile
                    </Link>
                    <button onClick={signOut} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground">
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="ml-2 rounded-md px-3 py-1.5 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>
              Sign in
            </Link>
          )}
        </nav>

        <button
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 -mr-1 text-white hover:bg-white/10 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 px-3 sm:px-4 pb-4 glass-header max-h-[calc(100vh-3.5rem)] overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-1 pt-2">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Home</Link>
            {baseNav.map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-2 mt-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85">{item.label}</div>
                {(item.children ?? [{ to: item.to, label: item.label }]).map((c) => (
                  <a key={c.to + c.label} href={c.to} onClick={() => setOpen(false)} aria-current={isChildActive(c.to) ? "page" : undefined} className={`block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${isChildActive(c.to) ? activeChildCls : ""}`}>
                    {c.label}
                  </a>
                ))}
              </div>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">Dashboard</Link>
                {isEmployer && (
                  <div className="border-t border-white/10 pt-2 mt-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85">Employer</div>
                    {employerNav.children?.map((c) => (
                      <a key={c.to + c.label} href={c.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
                {isAdmin && (
                  <div className="border-t border-white/10 pt-2 mt-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/85 flex items-center gap-1"><ShieldCheck className="size-3" /> Admin</div>
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

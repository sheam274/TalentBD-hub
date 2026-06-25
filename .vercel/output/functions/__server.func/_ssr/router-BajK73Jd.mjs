import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as redirect, m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-Bnm4-7qk.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-By-0JTie.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-C8nPQS-C.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { C as ChevronDown, S as ShieldCheck, L as LogOut, X, M as Menu, F as Facebook, a as Linkedin, T as Twitter, Y as Youtube, G as Globe, b as MessageCircle, c as Sparkles, d as LoaderCircle, e as Send } from "../_libs/lucide-react.mjs";
import { o as objectType, e as enumType, a as arrayType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-bFQiS4iX.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const AuthCtx = reactExports.createContext({ session: null, user: null, loading: true });
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthCtx.Provider, { value: { session, user: session?.user ?? null, loading }, children });
}
function useAuth() {
  return reactExports.useContext(AuthCtx);
}
const logoUrl = "/assets/talentbd-logo-C-1NNsqd.png";
function BrandMark({ size = 32, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: logoUrl,
      alt: "TalentBD",
      width: size,
      height: size,
      className: `object-contain ${className}`,
      style: { width: size, height: size }
    }
  );
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getMyProfile = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5dbf46616266e7bfe81c82694a91090a42de6200b3efc1b9d156faf41ac3a479"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("7925c3de14b795fe0f44175e37721342e39650bcc4169fdaac8d4b16f73f5b1b"));
const adminNav = {
  children: [
    { to: "/admin/dashboard", label: "Dashboard", desc: "Overview & stats" },
    { to: "/admin/users", label: "Users", desc: "Manage user accounts" },
    { to: "/admin/employers", label: "Employers", desc: "Company accounts" },
    { to: "/admin/applications", label: "Applications", desc: "All job applications" },
    { to: "/admin/interviews", label: "Interviews", desc: "Scheduled interviews" },
    { to: "/admin/letters", label: "Appointment letters", desc: "Issued offers" },
    { to: "/admin/jobs", label: "Jobs", desc: "Post & manage jobs" },
    { to: "/admin/companies", label: "Companies", desc: "Company profiles" },
    { to: "/admin/modules", label: "Modules", desc: "Learning modules" }
  ]
};
const baseNav = [
  {
    to: "/jobs",
    label: "Jobs",
    children: [
      { to: "/jobs", label: "All jobs", desc: "Local Bangladesh + global remote" },
      { to: "/jobs?remote=remote", label: "Remote jobs", desc: "Live feed via Remotive" },
      { to: "/jobs?type=Internship", label: "Internships", desc: "Kickstart your career" },
      { to: "/salaries", label: "Salaries", desc: "Pay benchmarks by role" }
    ]
  },
  {
    to: "/companies",
    label: "Companies",
    children: [
      { to: "/companies", label: "Browse companies", desc: "Profiles & open roles" },
      { to: "/salaries", label: "Salary insights", desc: "Compensation data" }
    ]
  },
  {
    to: "/learn",
    label: "Learn",
    children: [
      { to: "/learn", label: "All tracks", desc: "CSE, EEE & Civil" },
      { to: "/assessments", label: "Certifications", desc: "Verified credentials" }
    ]
  },
  {
    to: "/career-advice",
    label: "Career",
    children: [
      { to: "/career-advice", label: "Career advice", desc: "Guides & playbooks" },
      { to: "/interview-prep", label: "Interview prep", desc: "Practice + checklists" },
      { to: "/interview", label: "Give Interview", desc: "AI-graded live interviews" },
      { to: "/cv-builder", label: "CV Builder", desc: "Standard + Premium templates" },
      { to: "/cv-parser", label: "CV / ATS Parser", desc: "Match your CV to a job" }
    ]
  }
];
const employerNav = {
  children: [
    { to: "/employer/dashboard", label: "Dashboard", desc: "Hiring overview" },
    { to: "/employer/jobs", label: "Job postings", desc: "Create & manage jobs" },
    { to: "/employer/applicants", label: "Applicants", desc: "Pipeline & messaging" },
    { to: "/employer/company", label: "Company profile", desc: "Branding & details" }
  ]
};
function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const [hover, setHover] = reactExports.useState(null);
  const nav = useNavigate();
  const fetchProfile = useServerFn(getMyProfile);
  const { data: profileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchProfile({}),
    enabled: !!user
  });
  const isAdmin = profileData?.isAdmin ?? false;
  const isEmployer = profileData?.isEmployer ?? false;
  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 w-full glass-header text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-bold tracking-tight group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex size-9 items-center justify-center rounded-lg bg-white/10 p-1 ring-1 ring-white/20 transition group-hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandMark, { size: 28 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "TalentBD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline ml-1 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90", children: "Premium" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-1 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition", activeProps: { style: { color: "var(--color-accent)", opacity: 1 } }, activeOptions: { exact: true }, children: "Home" }),
        baseNav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setHover(item.label), onMouseLeave: () => setHover(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: item.to,
              className: "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition",
              children: [
                item.label,
                item.children && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 opacity-70" })
              ]
            }
          ),
          item.children && hover === item.label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-full pt-2 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass min-w-[260px] rounded-xl border border-white/10 p-2 shadow-2xl text-foreground", children: item.children.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: c.to,
              className: "block rounded-lg px-3 py-2 text-sm hover:bg-white/60",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.label }),
                c.desc && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.desc })
              ]
            },
            c.to + c.label
          )) }) })
        ] }, item.label)),
        user && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition", activeProps: { style: { color: "var(--color-accent)", opacity: 1 } }, children: "Dashboard" }),
        user && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", className: "rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition", activeProps: { style: { color: "var(--color-accent)", opacity: 1 } }, children: "Applications" }),
        user && isEmployer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setHover("Employer"), onMouseLeave: () => setHover(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/employer/dashboard", className: "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition", children: [
            "Employer ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 opacity-70" })
          ] }),
          hover === "Employer" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-full pt-2 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass min-w-[260px] rounded-xl border border-white/10 p-2 shadow-2xl text-foreground", children: employerNav.children?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.to, className: "block rounded-lg px-3 py-2 text-sm hover:bg-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.label }),
            c.desc && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.desc })
          ] }, c.to + c.label)) }) })
        ] }),
        user && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", onMouseEnter: () => setHover("Admin"), onMouseLeave: () => setHover(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/admin/dashboard", className: "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5" }),
            " Admin ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 opacity-70" })
          ] }),
          hover === "Admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-full pt-2 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass min-w-[260px] rounded-xl border border-white/10 p-2 shadow-2xl text-foreground", children: adminNav.children?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: c.to, className: "block rounded-lg px-3 py-2 text-sm hover:bg-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: c.label }),
            c.desc && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: c.desc })
          ] }, c.to + c.label)) }) })
        ] }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "ml-2 inline-flex items-center gap-1 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
          " Sign out"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "ml-2 rounded-md px-3 py-1.5 text-sm font-semibold", style: { background: "var(--color-accent)", color: "var(--color-accent-foreground)" }, children: "Sign in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "lg:hidden", onClick: () => setOpen((v) => !v), "aria-label": "Menu", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden border-t border-white/10 px-4 pb-4 glass-header max-h-[80vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", onClick: () => setOpen(false), className: "rounded-md px-3 py-2 text-sm hover:bg-white/10", children: "Home" }),
      baseNav.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 pt-2 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60", children: item.label }),
        (item.children ?? [{ to: item.to, label: item.label }]).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.to, onClick: () => setOpen(false), className: "block rounded-md px-3 py-2 text-sm hover:bg-white/10", children: c.label }, c.to + c.label))
      ] }, item.label)),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", onClick: () => setOpen(false), className: "mt-2 rounded-md px-3 py-2 text-sm hover:bg-white/10", children: "Dashboard" }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 pt-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3" }),
            " Admin"
          ] }),
          adminNav.children?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.to, onClick: () => setOpen(false), className: "block rounded-md px-3 py-2 text-sm hover:bg-white/10", children: c.label }, c.to + c.label))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/my-applications", onClick: () => setOpen(false), className: "rounded-md px-3 py-2 text-sm hover:bg-white/10", children: "My applications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "mt-2 rounded-md border border-white/30 px-3 py-2 text-left text-sm", children: "Sign out" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", onClick: () => setOpen(false), className: "mt-2 rounded-md px-3 py-2 text-sm font-semibold", style: { background: "var(--color-accent)", color: "var(--color-accent-foreground)" }, children: "Sign in" })
    ] }) })
  ] });
}
const columns = [
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
      { label: "Hot / Featured", href: "/jobs#featured" }
    ]
  },
  {
    title: "Companies",
    links: [
      { label: "Browse companies", href: "/companies" },
      { label: "Top employers", href: "/companies" },
      { label: "Salaries", href: "/salaries" },
      { label: "Company reviews", href: "/companies" }
    ]
  },
  {
    title: "Career",
    links: [
      { label: "CV Builder", href: "/cv-builder" },
      { label: "CV / ATS Parser", href: "/cv-parser" },
      { label: "Career advice", href: "/career-advice" },
      { label: "Interview prep", href: "/interview-prep" },
      { label: "My applications", href: "/my-applications" }
    ]
  },
  {
    title: "Learn",
    links: [
      { label: "All tracks", href: "/learn" },
      { label: "Certifications", href: "/assessments" },
      { label: "Computer Science", href: "/learn" },
      { label: "Electrical & Electronic", href: "/learn" },
      { label: "Civil Engineering", href: "/learn" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About TalentBD", href: "/" },
      { label: "For employers", href: "/auth" },
      { label: "Help center", href: "/career-advice" },
      { label: "Sign in", href: "/auth" }
    ]
  }
];
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-[oklch(0.18_0.04_265)] text-white/90", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-14 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 md:grid-cols-[1.2fr_3fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "flex items-center gap-2 font-extrabold tracking-tight", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex size-10 items-center justify-center rounded-lg bg-white/10 p-1.5 ring-1 ring-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandMark, { size: 28 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: "TalentBD" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", children: "Premium" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-sm text-sm text-white/70", children: "Bangladesh's premium learn-and-earn platform. Build skills, earn verified credentials, and land local or global remote jobs." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex items-center gap-3", children: [
            { Icon: Facebook, href: "https://facebook.com" },
            { Icon: Linkedin, href: "https://linkedin.com" },
            { Icon: Twitter, href: "https://twitter.com" },
            { Icon: Youtube, href: "https://youtube.com" },
            { Icon: Globe, href: "https://w3schools.com" }
          ].map(({ Icon, href }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: "_blank", rel: "noreferrer", className: "inline-flex size-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/20 hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-white", children: col.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2 text-sm text-white/70", children: col.links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: l.href, className: "transition hover:text-white hover:underline", children: l.label }) }, l.label)) })
        ] }, col.title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-4 rounded-xl bg-white/5 p-5 ring-1 ring-white/10 md:grid-cols-4 text-center", children: [
        ["10K+", "Active learners"],
        ["500+", "Live jobs"],
        ["120+", "Hiring companies"],
        ["80%", "Pass rate to certify"]
      ].map(([n, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-extrabold text-gradient", children: n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/60", children: l })
      ] }, l)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10 px-4 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-white/60 md:flex-row md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " TalentBD. Built in Bangladesh."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "hover:text-white", children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "hover:text-white", children: "Terms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "hover:text-white", children: "Cookie policy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "hover:text-white", children: "Accessibility" })
      ] })
    ] }) })
  ] });
}
function AnimatedBackdrop() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "orb-bg", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "orb orb-a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "orb orb-b" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "orb orb-c" })
  ] });
}
const messageSchema = objectType({
  messages: arrayType(objectType({
    role: enumType(["user", "assistant", "system"]),
    content: stringType().min(1).max(4e3)
  })).min(1).max(30)
});
const talentChat = createServerFn({
  method: "POST"
}).inputValidator((i) => messageSchema.parse(i)).handler(createSsrRpc("350afbecb56701f5befabf131e494bd0549e911d7fc1292b2a974c03085567f1"));
const SUGGESTIONS = [
  "Suggest a 4-week CSE learning plan",
  "What skills do EEE jobs in Dhaka need?",
  "Improve my CV summary for fresher",
  "Best remote jobs for civil engineers"
];
function ChatAssistant() {
  const [open, setOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    { role: "assistant", content: "Hi! I'm your TalentBD career coach. Ask me about learning tracks, jobs, or your CV." }
  ]);
  const [input, setInput] = reactExports.useState("");
  const chatFn = useServerFn(talentChat);
  const endRef = reactExports.useRef(null);
  const send = useMutation({
    mutationFn: (next) => chatFn({ data: { messages: next } }),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    },
    onError: (e) => {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e.message}` }]);
    }
  });
  reactExports.useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);
  function submit(text) {
    const content = (text ?? input).trim();
    if (!content || send.isPending) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    send.mutate(next.filter((m) => m.role !== "assistant" || messages.indexOf(m) !== 0).slice(-20));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        "aria-label": "Open AI assistant",
        className: "fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105",
        style: {
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          boxShadow: "0 12px 32px -8px color-mix(in oklab, var(--color-primary) 60%, transparent)"
        },
        children: [
          open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-6" }),
          !open && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute -top-1 -right-1 flex size-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex size-3 rounded-full bg-white" })
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl",
        style: { height: "min(560px, 75vh)", background: "white" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-4 py-3 text-white",
              style: { background: "linear-gradient(135deg, var(--color-primary), oklch(0.45 0.18 250))" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: "TalentBD AI Coach" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] opacity-80", children: "Powered by Lovable AI · Always-on" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 overflow-y-auto p-3", style: { background: "color-mix(in oklab, var(--color-primary) 4%, white)" }, children: [
            messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "rounded-br-sm text-white" : "rounded-bl-sm border bg-white"}`,
                style: m.role === "user" ? { background: "var(--color-primary)" } : {},
                children: m.content
              }
            ) }, i)),
            send.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl rounded-bl-sm border bg-white px-3 py-2 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              " thinking…"
            ] }) }),
            messages.length <= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase text-muted-foreground", children: "Try asking" }),
              SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => submit(s),
                  className: "block w-full rounded-md border bg-white px-3 py-1.5 text-left text-xs hover:bg-muted",
                  children: s
                },
                s
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                submit();
              },
              className: "flex items-center gap-2 border-t bg-white p-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    placeholder: "Ask anything about careers…",
                    className: "flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2",
                    style: { "--tw-ring-color": "var(--color-accent)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "submit",
                    disabled: send.isPending || !input.trim(),
                    className: "rounded-md p-2 text-white disabled:opacity-50",
                    style: { background: "var(--color-primary)" },
                    "aria-label": "Send",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium", style: { background: "var(--color-primary)", color: "var(--color-primary-foreground)" }, children: "Go home" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "rounded-md px-4 py-2 text-sm font-medium", style: { background: "var(--color-primary)", color: "var(--color-primary-foreground)" }, children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-md border px-4 py-2 text-sm font-medium", children: "Go home" })
    ] })
  ] }) });
}
const Route$E = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TalentBD — Learn, earn credentials, land jobs in Bangladesh" },
      { name: "description", content: "TalentBD: Bangladesh's learn-and-earn platform with courses, certifications, CV builder, ATS parser, and a local + global jobs marketplace." },
      { property: "og:site_name", content: "TalentBD" },
      { property: "og:type", content: "website" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logoUrl },
      { rel: "apple-touch-icon", href: logoUrl }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function AuthSync() {
  const router2 = useRouter();
  const qc = useQueryClient();
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      if (event === "SIGNED_OUT") {
        qc.cancelQueries();
        qc.clear();
      } else {
        qc.invalidateQueries();
      }
      router2.invalidate();
    });
    return () => sub.subscription.unsubscribe();
  }, [router2, qc]);
  return null;
}
function RootComponent() {
  const { queryClient } = Route$E.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AuthSync, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBackdrop, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChatAssistant, {})
  ] }) });
}
const $$splitComponentImporter$D = () => import("./salaries-IX-Ac1XX.mjs");
const Route$D = createFileRoute("/salaries")({
  head: () => ({
    meta: [{
      title: "Salary insights — Bangladesh & remote | TalentBD"
    }, {
      name: "description",
      content: "Salary benchmarks for engineers, designers, and finance roles across Bangladesh and global remote markets."
    }, {
      property: "og:title",
      content: "Salary insights — TalentBD"
    }, {
      property: "og:description",
      content: "Pay benchmarks by role, level and location across BD + remote."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./interview-prep-_ezUYhlc.mjs");
const Route$C = createFileRoute("/interview-prep")({
  head: () => ({
    meta: [{
      title: "Interview preparation — TalentBD"
    }, {
      name: "description",
      content: "Practice questions, checklists, and behavioral frameworks to ace your next interview in Bangladesh or with a global remote team."
    }, {
      property: "og:title",
      content: "Interview prep — TalentBD"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./career-advice-C5iGQX3B.mjs");
const Route$B = createFileRoute("/career-advice")({
  head: () => ({
    meta: [{
      title: "Career advice & playbooks | TalentBD"
    }, {
      name: "description",
      content: "Practical, Bangladesh-specific career advice: writing a winning CV, acing interviews, negotiating salary, switching to remote, and more."
    }, {
      property: "og:title",
      content: "Career advice — TalentBD"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./auth-ButuGvsS.mjs");
const Route$A = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign in — Learn & Earn"
    }, {
      name: "description",
      content: "Sign in or create your Learn & Earn account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./route-BFsOu0JM.mjs");
const Route$z = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./index-DchCMhaQ.mjs");
const Route$y = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "TalentBD — Learn skills, earn credentials, land jobs in Bangladesh"
    }, {
      name: "description",
      content: "TalentBD is Bangladesh's learn-and-earn platform: courses, certifications, CV builder, ATS parser, and a local + global jobs marketplace."
    }, {
      property: "og:title",
      content: "TalentBD"
    }, {
      property: "og:description",
      content: "Build skills. Earn credentials. Land the job."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./jobs.index-UOHe5EWF.mjs");
const Route$x = createFileRoute("/jobs/")({
  head: () => ({
    meta: [{
      title: "Jobs in Bangladesh & Remote — TalentBD"
    }, {
      name: "description",
      content: "Find IT, engineering, banking, and remote jobs on TalentBD — Bangladesh's learn-and-earn platform."
    }, {
      property: "og:title",
      content: "Jobs — TalentBD"
    }, {
      property: "og:url",
      content: "/jobs"
    }],
    links: [{
      rel: "canonical",
      href: "/jobs"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./companies.index-Cops3KWC.mjs");
const Route$w = createFileRoute("/companies/")({
  head: () => ({
    meta: [{
      title: "Companies — TalentBD"
    }, {
      name: "description",
      content: "Browse employers hiring on TalentBD across Bangladesh and globally."
    }, {
      property: "og:title",
      content: "Companies — TalentBD"
    }, {
      property: "og:url",
      content: "/companies"
    }],
    links: [{
      rel: "canonical",
      href: "/companies"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitNotFoundComponentImporter$1 = () => import("./jobs._jobId-CL4F5kKb.mjs");
const $$splitErrorComponentImporter$1 = () => import("./jobs._jobId-B_i3ySIa.mjs");
const $$splitComponentImporter$v = () => import("./jobs._jobId-DXXZaBZ1.mjs");
const Route$v = createFileRoute("/jobs/$jobId")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Job details — TalentBD`
    }, {
      name: "description",
      content: "View full job details and apply on TalentBD."
    }],
    links: [{
      rel: "canonical",
      href: `/jobs/${params.jobId}`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent")
});
const $$splitNotFoundComponentImporter = () => import("./companies._slug-BxSl0-qz.mjs");
const $$splitErrorComponentImporter = () => import("./companies._slug-DSpLjg9r.mjs");
const $$splitComponentImporter$u = () => import("./companies._slug-CznXOfdB.mjs");
const Route$u = createFileRoute("/companies/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.slug} — Company · TalentBD`
    }, {
      name: "description",
      content: `Open roles, profile and details for ${params.slug} on TalentBD.`
    }, {
      property: "og:title",
      content: `${params.slug} on TalentBD`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$t = () => import("./my-applications-CASwW1EN.mjs");
const Route$t = createFileRoute("/_authenticated/my-applications")({
  head: () => ({
    meta: [{
      title: "My Applications — TalentBD"
    }, {
      name: "description",
      content: "Track jobs you've applied to on TalentBD."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./dashboard-BEzUsA5t.mjs");
const Route$s = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Learn & Earn"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./cv-parser-ZooGwRDY.mjs");
const Route$r = createFileRoute("/_authenticated/cv-parser")({
  head: () => ({
    meta: [{
      title: "ATS CV Parser — Learn & Earn"
    }, {
      name: "description",
      content: "Parse a resume to find engineering sector matches."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./cv-builder-wtWzESSr.mjs");
const Route$q = createFileRoute("/_authenticated/cv-builder")({
  head: () => ({
    meta: [{
      title: "CV Builder — TalentBD"
    }, {
      name: "description",
      content: "Build a professional, print-ready CV with standard or premium layouts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./assessments-LMkt1uHU.mjs");
const Route$p = createFileRoute("/_authenticated/assessments")({
  head: () => ({
    meta: [{
      title: "Assessments — Learn & Earn"
    }, {
      name: "description",
      content: "Take timed assessments to earn verified credentials."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./route-C8fq_-2v.mjs");
const Route$o = createFileRoute("/_authenticated/employer")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./route-Lm3QGo7v.mjs");
const Route$n = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./index-DD7fsyqA.mjs");
const Route$m = createFileRoute("/_authenticated/learn/")({
  head: () => ({
    meta: [{
      title: "Learn — Engineering tracks | TalentBD"
    }, {
      name: "description",
      content: "Browse curated learning tracks across CSE, EEE, and Civil engineering."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./index-Aht267pe.mjs");
const Route$l = createFileRoute("/_authenticated/interview/")({
  head: () => ({
    meta: [{
      title: "Give Interview — AI Interviewer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./my-applications._appId-pcAa-K7C.mjs");
const Route$k = createFileRoute("/_authenticated/my-applications/$appId")({
  head: () => ({
    meta: [{
      title: "Application tracking"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./setup-B_PBB-PS.mjs");
const search = objectType({
  mode: enumType(["text", "voice", "video", "mcq"]).optional()
});
const Route$j = createFileRoute("/_authenticated/interview/setup")({
  head: () => ({
    meta: [{
      title: "Set up your interview"
    }]
  }),
  validateSearch: (s) => search.parse(s),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./history-BODt6NHw.mjs");
const Route$i = createFileRoute("/_authenticated/interview/history")({
  head: () => ({
    meta: [{
      title: "Interview history"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./jobs-DEA9B2lV.mjs");
const Route$h = createFileRoute("/_authenticated/employer/jobs")({
  head: () => ({
    meta: [{
      title: "My jobs"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./dashboard-BTr0eDSA.mjs");
const Route$g = createFileRoute("/_authenticated/employer/dashboard")({
  head: () => ({
    meta: [{
      title: "Employer Dashboard"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./company-Scarpo0U.mjs");
const Route$f = createFileRoute("/_authenticated/employer/company")({
  head: () => ({
    meta: [{
      title: "Company profile"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./applicants-CT9DO4WM.mjs");
const Route$e = createFileRoute("/_authenticated/employer/applicants")({
  head: () => ({
    meta: [{
      title: "Applicants"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./appointment._letterId-Bks7KV6E.mjs");
const Route$d = createFileRoute("/_authenticated/appointment/$letterId")({
  head: () => ({
    meta: [{
      title: "Appointment letter"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./users-xSwiNaIf.mjs");
const Route$c = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [{
      title: "Admin — Users"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./modules-DVtzwVWH.mjs");
const Route$b = createFileRoute("/_authenticated/admin/modules")({
  head: () => ({
    meta: [{
      title: "Admin — Modules"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./letters-BLKZRBag.mjs");
const Route$a = createFileRoute("/_authenticated/admin/letters")({
  head: () => ({
    meta: [{
      title: "Admin — Appointment letters"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./jobs-D4ermIis.mjs");
const Route$9 = createFileRoute("/_authenticated/admin/jobs")({
  head: () => ({
    meta: [{
      title: "Admin — Jobs"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./interviews-BhUJ91jN.mjs");
const Route$8 = createFileRoute("/_authenticated/admin/interviews")({
  head: () => ({
    meta: [{
      title: "Admin — Interviews"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./employers-C2MJWiKZ.mjs");
const Route$7 = createFileRoute("/_authenticated/admin/employers")({
  head: () => ({
    meta: [{
      title: "Admin — Employers"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./dashboard-BLl00SLL.mjs");
const Route$6 = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({
    meta: [{
      title: "Admin — Overview"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./companies-BAHLtR2P.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/companies")({
  head: () => ({
    meta: [{
      title: "Admin · Companies — TalentBD"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./applications-DgnwYAGt.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [{
      title: "Admin — Applications"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_discipline._topic-CaGUmjV_.mjs");
const Route$3 = createFileRoute("/_authenticated/learn/$discipline/$topic")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.topic} — ${params.discipline.toUpperCase()} | Learn & Earn`
    }, {
      name: "description",
      content: `Learn ${params.topic} (${params.discipline}) with video, docs, and a certifying quiz.`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./session._sessionId-BLAud5m0.mjs");
const Route$2 = createFileRoute("/_authenticated/interview/session/$sessionId")({
  head: () => ({
    meta: [{
      title: "Interview session"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./result._sessionId-CyjYKIN3.mjs");
const Route$1 = createFileRoute("/_authenticated/interview/result/$sessionId")({
  head: () => ({
    meta: [{
      title: "Interview result"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./applicants._appId-Cixa6yMP.mjs");
const Route = createFileRoute("/_authenticated/employer/applicants/$appId")({
  head: () => ({
    meta: [{
      title: "Applicant"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SalariesRoute = Route$D.update({
  id: "/salaries",
  path: "/salaries",
  getParentRoute: () => Route$E
});
const InterviewPrepRoute = Route$C.update({
  id: "/interview-prep",
  path: "/interview-prep",
  getParentRoute: () => Route$E
});
const CareerAdviceRoute = Route$B.update({
  id: "/career-advice",
  path: "/career-advice",
  getParentRoute: () => Route$E
});
const AuthRoute = Route$A.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$E
});
const AuthenticatedRouteRoute = Route$z.update({
  id: "/_authenticated",
  getParentRoute: () => Route$E
});
const IndexRoute = Route$y.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$E
});
const JobsIndexRoute = Route$x.update({
  id: "/jobs/",
  path: "/jobs/",
  getParentRoute: () => Route$E
});
const CompaniesIndexRoute = Route$w.update({
  id: "/companies/",
  path: "/companies/",
  getParentRoute: () => Route$E
});
const JobsJobIdRoute = Route$v.update({
  id: "/jobs/$jobId",
  path: "/jobs/$jobId",
  getParentRoute: () => Route$E
});
const CompaniesSlugRoute = Route$u.update({
  id: "/companies/$slug",
  path: "/companies/$slug",
  getParentRoute: () => Route$E
});
const AuthenticatedMyApplicationsRoute = Route$t.update({
  id: "/my-applications",
  path: "/my-applications",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$s.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedCvParserRoute = Route$r.update({
  id: "/cv-parser",
  path: "/cv-parser",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedCvBuilderRoute = Route$q.update({
  id: "/cv-builder",
  path: "/cv-builder",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAssessmentsRoute = Route$p.update({
  id: "/assessments",
  path: "/assessments",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedEmployerRouteRoute = Route$o.update({
  id: "/employer",
  path: "/employer",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRouteRoute = Route$n.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedLearnIndexRoute = Route$m.update({
  id: "/learn/",
  path: "/learn/",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedInterviewIndexRoute = Route$l.update({
  id: "/interview/",
  path: "/interview/",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedMyApplicationsAppIdRoute = Route$k.update({
  id: "/$appId",
  path: "/$appId",
  getParentRoute: () => AuthenticatedMyApplicationsRoute
});
const AuthenticatedInterviewSetupRoute = Route$j.update({
  id: "/interview/setup",
  path: "/interview/setup",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedInterviewHistoryRoute = Route$i.update({
  id: "/interview/history",
  path: "/interview/history",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedEmployerJobsRoute = Route$h.update({
  id: "/jobs",
  path: "/jobs",
  getParentRoute: () => AuthenticatedEmployerRouteRoute
});
const AuthenticatedEmployerDashboardRoute = Route$g.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedEmployerRouteRoute
});
const AuthenticatedEmployerCompanyRoute = Route$f.update({
  id: "/company",
  path: "/company",
  getParentRoute: () => AuthenticatedEmployerRouteRoute
});
const AuthenticatedEmployerApplicantsRoute = Route$e.update({
  id: "/applicants",
  path: "/applicants",
  getParentRoute: () => AuthenticatedEmployerRouteRoute
});
const AuthenticatedAppointmentLetterIdRoute = Route$d.update({
  id: "/appointment/$letterId",
  path: "/appointment/$letterId",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminUsersRoute = Route$c.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminModulesRoute = Route$b.update({
  id: "/modules",
  path: "/modules",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminLettersRoute = Route$a.update({
  id: "/letters",
  path: "/letters",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminJobsRoute = Route$9.update({
  id: "/jobs",
  path: "/jobs",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminInterviewsRoute = Route$8.update({
  id: "/interviews",
  path: "/interviews",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminEmployersRoute = Route$7.update({
  id: "/employers",
  path: "/employers",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminDashboardRoute = Route$6.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminCompaniesRoute = Route$5.update({
  id: "/companies",
  path: "/companies",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedAdminApplicationsRoute = Route$4.update({
  id: "/applications",
  path: "/applications",
  getParentRoute: () => AuthenticatedAdminRouteRoute
});
const AuthenticatedLearnDisciplineTopicRoute = Route$3.update({
  id: "/learn/$discipline/$topic",
  path: "/learn/$discipline/$topic",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedInterviewSessionSessionIdRoute = Route$2.update({
  id: "/interview/session/$sessionId",
  path: "/interview/session/$sessionId",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedInterviewResultSessionIdRoute = Route$1.update({
  id: "/interview/result/$sessionId",
  path: "/interview/result/$sessionId",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedEmployerApplicantsAppIdRoute = Route.update({
  id: "/$appId",
  path: "/$appId",
  getParentRoute: () => AuthenticatedEmployerApplicantsRoute
});
const AuthenticatedAdminRouteRouteChildren = {
  AuthenticatedAdminApplicationsRoute,
  AuthenticatedAdminCompaniesRoute,
  AuthenticatedAdminDashboardRoute,
  AuthenticatedAdminEmployersRoute,
  AuthenticatedAdminInterviewsRoute,
  AuthenticatedAdminJobsRoute,
  AuthenticatedAdminLettersRoute,
  AuthenticatedAdminModulesRoute,
  AuthenticatedAdminUsersRoute
};
const AuthenticatedAdminRouteRouteWithChildren = AuthenticatedAdminRouteRoute._addFileChildren(
  AuthenticatedAdminRouteRouteChildren
);
const AuthenticatedEmployerApplicantsRouteChildren = {
  AuthenticatedEmployerApplicantsAppIdRoute
};
const AuthenticatedEmployerApplicantsRouteWithChildren = AuthenticatedEmployerApplicantsRoute._addFileChildren(
  AuthenticatedEmployerApplicantsRouteChildren
);
const AuthenticatedEmployerRouteRouteChildren = {
  AuthenticatedEmployerApplicantsRoute: AuthenticatedEmployerApplicantsRouteWithChildren,
  AuthenticatedEmployerCompanyRoute,
  AuthenticatedEmployerDashboardRoute,
  AuthenticatedEmployerJobsRoute
};
const AuthenticatedEmployerRouteRouteWithChildren = AuthenticatedEmployerRouteRoute._addFileChildren(
  AuthenticatedEmployerRouteRouteChildren
);
const AuthenticatedMyApplicationsRouteChildren = {
  AuthenticatedMyApplicationsAppIdRoute
};
const AuthenticatedMyApplicationsRouteWithChildren = AuthenticatedMyApplicationsRoute._addFileChildren(
  AuthenticatedMyApplicationsRouteChildren
);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRouteWithChildren,
  AuthenticatedEmployerRouteRoute: AuthenticatedEmployerRouteRouteWithChildren,
  AuthenticatedAssessmentsRoute,
  AuthenticatedCvBuilderRoute,
  AuthenticatedCvParserRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedMyApplicationsRoute: AuthenticatedMyApplicationsRouteWithChildren,
  AuthenticatedAppointmentLetterIdRoute,
  AuthenticatedInterviewHistoryRoute,
  AuthenticatedInterviewSetupRoute,
  AuthenticatedInterviewIndexRoute,
  AuthenticatedLearnIndexRoute,
  AuthenticatedInterviewResultSessionIdRoute,
  AuthenticatedInterviewSessionSessionIdRoute,
  AuthenticatedLearnDisciplineTopicRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AuthRoute,
  CareerAdviceRoute,
  InterviewPrepRoute,
  SalariesRoute,
  CompaniesSlugRoute,
  JobsJobIdRoute,
  CompaniesIndexRoute,
  JobsIndexRoute
};
const routeTree = Route$E._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$v as R,
  useServerFn as a,
  Route$u as b,
  createSsrRpc as c,
  Route$k as d,
  Route$j as e,
  Route$d as f,
  getMyProfile as g,
  Route$3 as h,
  Route$2 as i,
  Route$1 as j,
  Route as k,
  router as r,
  useAuth as u
};

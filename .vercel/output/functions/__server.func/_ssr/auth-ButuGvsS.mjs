import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-Bnm4-7qk.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { u as useAuth } from "./router-BajK73Jd.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./server-By-0JTie.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-C8nPQS-C.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/zod.mjs";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function AuthPage() {
  const {
    user
  } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [accountType, setAccountType] = reactExports.useState("student");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [companyName, setCompanyName] = reactExports.useState("");
  const [companyWebsite, setCompanyWebsite] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) nav({
      to: "/dashboard"
    });
  }, [user, nav]);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name,
              account_type: accountType,
              ...accountType === "employer" ? {
                company_name: companyName,
                company_website: companyWebsite
              } : {}
            }
          }
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm if required.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin
    });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-md px-4 py-12 md:px-6 page-enter", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: mode === "signin" ? "Sign in" : "Create account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: mode === "signup" ? "Sign up as a job seeker or as a company hiring talent." : "Access your learning, CV, and job applications." }),
    mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 gap-2", children: ["student", "employer"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setAccountType(t), className: `rounded-md border px-3 py-2 text-sm font-medium ${accountType === t ? "border-primary bg-primary text-primary-foreground" : "bg-white"}`, children: t === "student" ? "Job seeker" : "Employer / Company" }, t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: google, className: "mt-5 w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted", children: "Continue with Google" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 flex items-center gap-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      " or ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), required: true, placeholder: "Full name", className: "w-full rounded-md border px-3 py-2 text-sm" }),
      mode === "signup" && accountType === "employer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyName, onChange: (e) => setCompanyName(e.target.value), required: true, placeholder: "Company name", className: "w-full rounded-md border px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: companyWebsite, onChange: (e) => setCompanyWebsite(e.target.value), type: "url", placeholder: "Company website (optional)", className: "w-full rounded-md border px-3 py-2 text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: email, onChange: (e) => setEmail(e.target.value), required: true, type: "email", placeholder: "Email", className: "w-full rounded-md border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: password, onChange: (e) => setPassword(e.target.value), required: true, type: "password", minLength: 6, placeholder: "Password", className: "w-full rounded-md border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, className: "w-full rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60", style: {
        background: "var(--color-primary)",
        color: "var(--color-primary-foreground)"
      }, children: busy ? "…" : mode === "signin" ? "Sign in" : "Create account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "mt-4 w-full text-sm", style: {
      color: "var(--color-primary)"
    }, children: mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in" })
  ] }) });
}
export {
  AuthPage as component
};

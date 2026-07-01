import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { checkEmailExists } from "@/lib/auth-check.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Learn & Earn" },
      { name: "description", content: "Sign in or create your Learn & Earn account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [accountType, setAccountType] = useState<"student" | "employer">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => { if (user) nav({ to: "/dashboard" }); }, [user, nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
    try {
      if (mode === "signup") {
        if (otpSent) {
          const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: "signup" });
          if (error) throw error;
          toast.success("Email verified. Welcome!");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              name,
              account_type: accountType,
              ...(accountType === "employer"
                ? { company_name: companyName, company_website: companyWebsite }
                : {}),
            },
          },
        });
        if (error) throw error;
        setOtpSent(true);
        toast.success("We sent a 6-digit code to your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err: any) {
      const msg: string = err?.message ?? "Sign-in failed";
      const lower = msg.toLowerCase();
      if (mode === "signup" && otpSent) {
        setOtp("");
        setOtpError(lower.includes("expired") ? "Code expired. Request a new one." : "Invalid code");
      } else if (mode === "signin" && (lower.includes("invalid login") || lower.includes("invalid credentials"))) {
        // Determine which field is wrong by checking if the email is registered.
        try {
          const { exists } = await checkEmailExists({ data: { email } });
          if (exists) {
            setPassword("");
            setPasswordError("Incorrect password");
          } else {
            setEmail("");
            setEmailError("No account with this email");
          }
        } catch {
          setPassword("");
          setPasswordError("Incorrect password");
        }
      } else if (lower.includes("email not confirmed")) {
        setEmailError("Please confirm your email before signing in");
      } else if (lower.includes("user already registered") || lower.includes("already registered")) {
        setEmailError("An account with this email already exists");
      } else if (lower.includes("password")) {
        setPasswordError(msg);
      } else if (lower.includes("email")) {
        setEmailError(msg);
      } else {
        setFormError(msg);
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  async function resendOtp() {
    setBusy(true);
    setOtpError(null);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      toast.success("New code sent");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not resend code");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6 page-enter">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signup"
            ? "Sign up as a job seeker or as a company hiring talent."
            : "Access your learning, CV, and job applications."}
        </p>

        {mode === "signup" && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["student", "employer"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setAccountType(t)}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${accountType === t ? "border-primary bg-primary text-primary-foreground" : "bg-white"}`}
              >
                {t === "student" ? "Job seeker" : "Employer / Company"}
              </button>
            ))}
          </div>
        )}

        <button onClick={google} className="mt-5 w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
          Continue with Google
        </button>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className="w-full rounded-md border px-3 py-2 text-sm" />
          )}
          {mode === "signup" && accountType === "employer" && (
            <>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="Company name" className="w-full rounded-md border px-3 py-2 text-sm" />
              <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} type="url" placeholder="Company website (optional)" className="w-full rounded-md border px-3 py-2 text-sm" />
            </>
          )}
          <div>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(null); setFormError(null); }}
              required
              type="email"
              placeholder={emailError ?? "Email"}
              aria-invalid={!!emailError}
              className={`w-full rounded-md border px-3 py-2 text-sm ${emailError ? "border-red-500 placeholder:text-red-500" : ""}`}
            />
          </div>
          <div>
            <input
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(null); setFormError(null); }}
              required
              type="password"
              minLength={6}
              placeholder={passwordError ?? "Password"}
              aria-invalid={!!passwordError}
              className={`w-full rounded-md border px-3 py-2 text-sm ${passwordError ? "border-red-500 placeholder:text-red-500" : ""}`}
            />
          </div>
          <button disabled={busy} className="w-full rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          {formError && (
            <p role="alert" className="text-center text-sm text-red-600 font-medium">{formError}</p>
          )}
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm" style={{ color: "var(--color-primary)" }}>
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

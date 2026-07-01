import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const searchSchema = z.object({ email: z.string().email() });

export const Route = createFileRoute("/auth/otp")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Verify your email — Learn & Earn" },
      { name: "description", content: "Enter the 6-digit code we sent to your email." },
    ],
  }),
  component: OtpPage,
});

function OtpPage() {
  const { email } = Route.useSearch();
  const nav = useNavigate();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setOtpError(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otp, type: "signup" });
      if (error) throw error;
      // Confirm the session is active before navigating.
      let session = data.session ?? (await supabase.auth.getSession()).data.session;
      if (!session) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Session not established. Please sign in.");
      }
      const acct = data.user?.user_metadata?.account_type;
      toast.success("Email verified. Welcome!");
      nav({ to: acct === "employer" ? "/employer" : "/dashboard", replace: true });
    } catch (err: any) {
      const lower = String(err?.message ?? "").toLowerCase();
      setOtp("");
      setOtpError(lower.includes("expired") ? "Code expired. Request a new one." : "Invalid code");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (cooldown > 0) return;
    setBusy(true);
    setOtpError(null);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      setCooldown(60);
      toast.success("New code sent");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not resend code");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6 page-enter">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>.
        </p>
        <form onSubmit={verify} className="mt-5 space-y-3">
          <input
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(null); }}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder={otpError ?? "Enter 6-digit code"}
            aria-invalid={!!otpError}
            className={`w-full rounded-md border px-3 py-2 text-sm tracking-widest ${otpError ? "border-red-500 placeholder:text-red-500" : ""}`}
          />
          <button disabled={busy || otp.length !== 6} className="w-full rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60" style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {busy ? "…" : "Verify code"}
          </button>
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={resend}
              disabled={busy || cooldown > 0}
              className="underline text-muted-foreground disabled:no-underline disabled:opacity-60"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
            <Link to="/auth" className="underline text-muted-foreground">Use a different email</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
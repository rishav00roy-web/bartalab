"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      setBusy(false);
      if (error) return setError(error.message);
      setNotice("If that email has an account, a reset link is on its way.");
      setMode("signin");
      return;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      router.replace("/newsroom");
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setBusy(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.replace("/newsroom");
      router.refresh();
    } else {
      setNotice("Check your email for a confirmation link, then sign in.");
      setMode("signin");
    }
  }

  const signup = mode === "signup";
  const forgot = mode === "forgot";

  return (
    <main className="auth">
      <div className="card auth-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sj24-icon.png" alt="SJ24" width={72} height={72} className="auth-logo" />
        <h1>{signup ? "Join the SJ24 newsroom" : forgot ? "Reset your password" : "Sign in to the SJ24 newsroom"}</h1>
        <p className="lede">For SJ24 reporters and editors.</p>

        <form className="auth-form" onSubmit={submit}>
          {signup && (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                className="input"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {!forgot && (
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!signup && (
              <button
                type="button"
                className="link-btn forgot-link"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setNotice(null);
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="note" role="status">
              {notice}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={busy} aria-busy={busy}>
            {busy ? (signup ? "Creating account…" : forgot ? "Sending…" : "Signing in…") : signup ? "Create account" : forgot ? "Send reset link" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {signup || forgot ? "Already have an account? " : "New here? "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(signup || forgot ? "signin" : "signup");
              setError(null);
            }}
          >
            {signup || forgot ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </main>
  );
}

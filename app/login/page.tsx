"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
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

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(error.message);
      router.replace("/");
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
      router.replace("/");
      router.refresh();
    } else {
      setNotice("Check your email for a confirmation link, then sign in.");
      setMode("signin");
    }
  }

  const signup = mode === "signup";

  return (
    <main className="auth">
      <div className="card auth-card">
        <picture>
          <source srcSet="/logo-wordmark-dark.png" media="(prefers-color-scheme: dark)" />
          <img src="/logo-wordmark.png" alt="Bartalab" width={1380} height={370} className="auth-logo" />
        </picture>
        <h1>{signup ? "Create your account" : "Sign in"}</h1>
        <p className="lede">News and updates from your organization.</p>

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
          </div>

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

          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {signup ? "Already have an account? " : "New here? "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(signup ? "signin" : "signup");
              setError(null);
            }}
          >
            {signup ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </main>
  );
}

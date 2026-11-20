"use client";

import { useState, useTransition } from "react";
import { updateName } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [fullName, setFullName] = useState(name);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ kind: "note" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const res = await updateName(fullName);
      setMsg(res.error ? { kind: "error", text: res.error } : { kind: "note", text: "Name saved." });
    });
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) return setMsg({ kind: "error", text: error.message });
      setPassword("");
      setMsg({ kind: "note", text: "Password changed." });
    });
  }

  return (
    <div className="card profile-card">
      <form className="auth-form" onSubmit={saveName}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" value={email} disabled readOnly />
        </div>
        <div className="field">
          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            className="input"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending || fullName.trim() === name} aria-busy={pending}>
          Save name
        </button>
      </form>

      <form className="auth-form" onSubmit={savePassword}>
        <div className="field">
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            className="input"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-outline" disabled={pending || password.length < 6} aria-busy={pending}>
          Change password
        </button>
      </form>

      {msg && (
        <p className={msg.kind} role={msg.kind === "error" ? "alert" : "status"}>
          {msg.text}
        </p>
      )}
    </div>
  );
}

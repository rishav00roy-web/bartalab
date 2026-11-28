"use client";

import { useId, useState, useTransition } from "react";
import { signUpForBriefing } from "@/app/newsletter-actions";
import type { Lang } from "@/lib/sj24/i18n";

/** Morning briefing sign-up: email and language, saved to Supabase. */
export function NewsletterForm({ lang }: { lang: Lang }) {
  const as = lang === "as";
  const id = useId();
  const [email, setEmail] = useState("");
  const [choice, setChoice] = useState<Lang>(lang);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "done" | "invalid" | "unavailable">("idle");
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      let res: Awaited<ReturnType<typeof signUpForBriefing>>;
      try {
        res = await signUpForBriefing({ email, lang: choice, website });
      } catch {
        res = { ok: false, code: "unavailable" };
      }
      // Already on the list reads the same as a new sign-up, so the form never
      // reveals whether an address is registered.
      setState(res.code === "already" ? "done" : res.code);
      if (res.ok) setEmail("");
    });
  }

  if (state === "done") {
    return (
      <p className="sj-news-done" role="status">
        {as ? "ধন্যবাদ! আপোনাৰ ইমেইল তালিকাত যোগ কৰা হ'ল।" : "Thank you. You're on the list."}
      </p>
    );
  }

  return (
    <form className="sj-news-form" onSubmit={submit} noValidate>
      <label htmlFor={`${id}-email`} className="sj-news-label">
        {as ? "আপোনাৰ ইমেইল" : "Your email"}
      </label>
      <div className="sj-news-row">
        <input
          id={`${id}-email`}
          className="sj-news-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === "invalid" || undefined}
          aria-describedby={state !== "idle" ? `${id}-msg` : undefined}
        />
        <button type="submit" className="sj-btn" disabled={pending} aria-busy={pending}>
          {pending ? (as ? "যোগ কৰা হৈছে…" : "Signing up…") : as ? "যোগদান কৰক" : "Sign up"}
        </button>
      </div>
      <fieldset className="sj-news-lang">
        <legend>{as ? "ভাষা" : "Language"}</legend>
        {(["en", "as"] as const).map((l) => (
          <label key={l}>
            <input type="radio" name={`${id}-lang`} checked={choice === l} onChange={() => setChoice(l)} />
            <span lang={l}>{l === "en" ? "English" : "অসমীয়া"}</span>
          </label>
        ))}
      </fieldset>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sj-news-trap"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      {state === "invalid" && (
        <p id={`${id}-msg`} className="sj-news-error" role="alert">
          {as ? "এটা শুদ্ধ ইমেইল ঠিকনা দিয়ক।" : "Enter a valid email address, like name@example.com."}
        </p>
      )}
      {state === "unavailable" && (
        <p id={`${id}-msg`} className="sj-news-error" role="alert">
          {as ? "এতিয়া যোগদান কৰিব পৰা নগ'ল। পিছত চেষ্টা কৰক।" : "Sign-up isn't working right now. Please try again later."}
        </p>
      )}
    </form>
  );
}

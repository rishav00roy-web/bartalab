"use server";

import { createClient } from "@/lib/supabase/server";

export type SignupResult = { ok: boolean; code: "done" | "already" | "invalid" | "unavailable" };

// Adds an email to the morning briefing list (table: newsletter_signups).
export async function signUpForBriefing(input: { email: string; lang: string; website: string }): Promise<SignupResult> {
  // "website" is a hidden field people never see; bots fill it in.
  if (input.website) return { ok: true, code: "done" };

  const email = input.email.trim().toLowerCase();
  if (email.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, code: "invalid" };
  const lang = input.lang === "as" ? "as" : "en";

  // Until the Supabase table exists (or if Supabase isn't reachable), say so
  // plainly rather than pretending the address was saved.
  let error: { code?: string; message: string } | null;
  try {
    const supabase = await createClient();
    ({ error } = await supabase.from("newsletter_signups").insert({ email, lang }));
  } catch (e) {
    console.error("newsletter sign-up failed", e);
    return { ok: false, code: "unavailable" };
  }
  if (!error) return { ok: true, code: "done" };
  if (error.code === "23505") return { ok: true, code: "already" }; // unique violation: already signed up
  console.error("newsletter sign-up failed", error.code, error.message);
  return { ok: false, code: "unavailable" };
}

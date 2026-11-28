import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Email links (confirmation, password reset) land here and exchange the code for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/newsroom";
  // Only allow same-site relative paths.
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/newsroom";
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(`${origin}${safeNext}`);
}

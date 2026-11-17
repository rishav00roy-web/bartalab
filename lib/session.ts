import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

// Signed-in user plus profile; redirects to /login when signed out.
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, approved")
    .eq("id", user.id)
    .single<Profile>();
  const profile: Profile = data ?? {
    id: user.id,
    full_name: user.email ?? "You",
    role: "member",
    approved: false,
  };
  return { supabase, user, profile };
}

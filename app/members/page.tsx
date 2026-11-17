import { redirect } from "next/navigation";
import { MemberRow } from "@/components/MemberRow";
import { TopBar } from "@/components/TopBar";
import { getSession } from "@/lib/session";
import type { Member } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { supabase, profile } = await getSession();
  if (profile.role !== "admin") redirect("/");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, approved, created_at")
    .order("created_at", { ascending: false })
    .returns<Member[]>();

  const members = data ?? [];
  const pending = members.filter((m) => !m.approved);
  const active = members.filter((m) => m.approved);

  return (
    <>
      <TopBar profile={profile} current="members" pendingCount={pending.length} />
      <main className="feed">
        <div className="feed-head">
          <h1>Members</h1>
          <p>{active.length} active</p>
        </div>

        {error && (
          <p className="error" role="alert">
            Couldn&apos;t load members: {error.message}
          </p>
        )}

        <section className="card member-list" aria-labelledby="pending-h">
          <h2 id="pending-h" className="section-title">
            Waiting for approval
          </h2>
          {pending.length === 0 ? (
            <p className="muted-line">Nobody is waiting. New sign-ups show up here.</p>
          ) : (
            <ul>
              {pending.map((m) => (
                <MemberRow key={m.id} member={m} isSelf={m.id === profile.id} />
              ))}
            </ul>
          )}
        </section>

        <section className="card member-list" aria-labelledby="active-h">
          <h2 id="active-h" className="section-title">
            Active members
          </h2>
          <ul>
            {active.map((m) => (
              <MemberRow key={m.id} member={m} isSelf={m.id === profile.id} />
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

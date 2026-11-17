import { TopBar } from "./TopBar";
import type { Profile } from "@/lib/types";

export function Pending({ profile }: { profile: Profile }) {
  return (
    <>
      <TopBar profile={profile} />
      <main className="feed">
        <div className="card empty">
          <h1 className="empty-title">Waiting for approval</h1>
          <p>
            Thanks for joining, {profile.full_name}. An admin needs to approve your account before you
            can see posts. Check back soon.
          </p>
        </div>
      </main>
    </>
  );
}

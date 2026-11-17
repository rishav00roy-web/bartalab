import { ProfileForm } from "@/components/ProfileForm";
import { TopBar } from "@/components/TopBar";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { user, profile } = await getSession();
  return (
    <>
      <TopBar profile={profile} current="profile" />
      <main className="feed">
        <div className="feed-head">
          <h1>Your profile</h1>
        </div>
        <ProfileForm name={profile.full_name} email={user.email ?? ""} />
      </main>
    </>
  );
}

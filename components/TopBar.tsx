import Link from "next/link";
import { signOut } from "@/app/actions";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function TopBar({
  profile,
  current,
  pendingCount = 0,
}: {
  profile: Profile;
  current?: "feed" | "members" | "profile";
  pendingCount?: number;
}) {
  const isAdmin = profile.role === "admin";
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="Bartalab home">
          <img src="/mark.png" alt="" width={32} height={32} />
          <span className="brand-name">Bartalab</span>
        </Link>
        {profile.approved && (
          <nav className="topnav" aria-label="Main">
            <Link href="/" aria-current={current === "feed" ? "page" : undefined}>
              Feed
            </Link>
            {isAdmin && (
              <Link href="/members" aria-current={current === "members" ? "page" : undefined}>
                Members
                {pendingCount > 0 && (
                  <span className="badge" aria-label={`${pendingCount} waiting for approval`}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            )}
          </nav>
        )}
        <Link
          href="/profile"
          className="who"
          aria-current={current === "profile" ? "page" : undefined}
          aria-label="Your profile"
        >
          <span className="avatar avatar-sm" aria-hidden="true">
            {initials(profile.full_name)}
          </span>
          <span className="name">{profile.full_name}</span>
          {isAdmin && <span className="role-tag">Admin</span>}
        </Link>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

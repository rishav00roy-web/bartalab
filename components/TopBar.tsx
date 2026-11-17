import Link from "next/link";
import { signOut } from "@/app/actions";
import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

export function TopBar({ profile }: { profile: Profile }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label="Bartalab home">
          <picture>
            <source srcSet="/mark-dark.png" media="(prefers-color-scheme: dark)" />
            <img src="/mark.png" alt="" width={32} height={32} />
          </picture>
          Bartalab
        </Link>
        <div className="who">
          <span className="avatar avatar-sm" aria-hidden="true">
            {initials(profile.full_name)}
          </span>
          <span className="name">{profile.full_name}</span>
          {profile.role === "admin" && <span className="role-tag">Admin</span>}
        </div>
        <form action={signOut}>
          <button type="submit" className="btn btn-ghost btn-sm">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}

"use client";

import { useState, useTransition } from "react";
import { setMember } from "@/app/actions";
import { initials } from "@/lib/format";
import type { Member } from "@/lib/types";

export function MemberRow({ member, isSelf }: { member: Member; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(role: "admin" | "member", approved: boolean) {
    setError(null);
    startTransition(async () => {
      const res = await setMember(member.id, role, approved);
      if (res.error) setError(res.error);
    });
  }

  const joined = new Date(member.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="member-row">
      <span className="avatar avatar-sm" aria-hidden="true">
        {initials(member.full_name)}
      </span>
      <span className="member-info">
        <strong>
          {member.full_name}
          {isSelf && " (you)"}
        </strong>
        <small>
          {member.role === "admin" ? "Admin" : "Member"}, joined {joined}
        </small>
      </span>
      {!isSelf && (
        <span className="member-actions">
          {!member.approved ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={pending}
              onClick={() => run("member", true)}
            >
              Approve
            </button>
          ) : member.role === "member" ? (
            <>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={pending}
                onClick={() => run("admin", true)}
              >
                Make admin
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={pending}
                onClick={() => run("member", false)}
              >
                Remove access
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={pending}
              onClick={() => run("member", true)}
            >
              Make member
            </button>
          )}
        </span>
      )}
      {error && (
        <p className="error member-error" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}

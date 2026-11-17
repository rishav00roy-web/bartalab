"use client";

import { useTransition } from "react";
import { setPinned } from "@/app/actions";

export function PinButton({ postId, pinned }: { postId: string; pinned: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      disabled={pending}
      onClick={() => startTransition(async () => void (await setPinned(postId, !pinned)))}
    >
      {pinned ? "Unpin" : "Pin"}
    </button>
  );
}

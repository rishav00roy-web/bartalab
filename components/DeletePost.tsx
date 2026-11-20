"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@/app/actions";
import { Trash } from "./icons";

// Two-step inline confirm instead of a browser dialog.
export function DeletePost({ postId, mediaPath }: { postId: string; mediaPath: string | null }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>
        <Trash /> Delete
      </button>
    );
  }
  return (
    <span className="confirm-actions">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => setConfirming(false)}
        disabled={pending}
      >
        Keep
      </button>
      <button
        type="button"
        className="btn btn-danger btn-sm"
        disabled={pending}
        aria-busy={pending}
        onClick={() => startTransition(async () => void (await deletePost(postId, mediaPath)))}
      >
        {pending ? "Deleting…" : "Delete post"}
      </button>
    </span>
  );
}

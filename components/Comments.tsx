"use client";

import { useId, useState, useTransition } from "react";
import { addComment, deleteComment } from "@/app/actions";
import { initials, timeAgo } from "@/lib/format";
import type { Comment } from "@/lib/types";
import { Send, Trash } from "./icons";

const PREVIEW = 3;

export function Comments({
  postId,
  comments,
  userId,
  isAdmin,
}: {
  postId: string;
  comments: Comment[];
  userId: string;
  isAdmin: boolean;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputId = useId();

  const visible = showAll ? comments : comments.slice(-PREVIEW);
  const hidden = comments.length - visible.length;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await addComment(postId, text);
      if (res.error) return setError(res.error);
      setText("");
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteComment(id);
      if (res.error) setError(res.error);
    });
  }

  return (
    <section className="comments" aria-label="Comments">
      {hidden > 0 && (
        <button type="button" className="link-btn more-comments" onClick={() => setShowAll(true)}>
          View {hidden} earlier {hidden === 1 ? "comment" : "comments"}
        </button>
      )}

      {visible.map((c) => (
        <div key={c.id} className="comment">
          <span className="avatar avatar-sm" aria-hidden="true">
            {initials(c.author?.full_name ?? "")}
          </span>
          <div className="comment-bubble">
            <div className="comment-top">
              <strong>{c.author?.full_name ?? "Former member"}</strong>
              <time dateTime={c.created_at}>{timeAgo(c.created_at)}</time>
              {(c.author?.id === userId || isAdmin) && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  aria-label="Delete comment"
                  onClick={() => remove(c.id)}
                  disabled={pending}
                >
                  <Trash />
                </button>
              )}
            </div>
            <p>{c.body}</p>
          </div>
        </div>
      ))}

      <form className="comment-form" onSubmit={submit}>
        <label htmlFor={inputId} className="visually-hidden">
          Write a comment
        </label>
        <textarea
          id={inputId}
          className="textarea"
          placeholder="Write a comment…"
          value={text}
          maxLength={2000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending || !text.trim()}
          aria-label="Post comment"
        >
          <Send />
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

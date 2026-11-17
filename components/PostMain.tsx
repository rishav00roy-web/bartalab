"use client";

import { useId, useState, useTransition } from "react";
import { updatePost } from "@/app/actions";
import { hostOf, initials, timeAgo } from "@/lib/format";
import { normalizeLink } from "@/lib/links";
import { DeletePost } from "./DeletePost";
import { LinkIcon } from "./icons";

type Props = {
  postId: string;
  authorName: string;
  createdAt: string;
  body: string;
  linkUrl: string | null;
  mediaPath: string | null;
  isAdmin: boolean;
};

// Post header, text and link. Admins can edit text and link in place.
export function PostMain({ postId, authorName, createdAt, body, linkUrl, mediaPath, isAdmin }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [draftLink, setDraftLink] = useState(linkUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ids = { body: useId(), link: useId() };

  function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let link: string | null;
    try {
      link = normalizeLink(draftLink);
    } catch {
      return setError("That link doesn't look right. Check it and try again.");
    }
    if (!draft.trim() && !link && !mediaPath) {
      return setError("A post needs text, a link, or a picture.");
    }
    startTransition(async () => {
      const res = await updatePost(postId, draft, link);
      if (res.error) return setError(res.error);
      setEditing(false);
    });
  }

  function cancel() {
    setDraft(body);
    setDraftLink(linkUrl ?? "");
    setError(null);
    setEditing(false);
  }

  return (
    <>
      <header className="post-head">
        <span className="avatar" aria-hidden="true">
          {initials(authorName)}
        </span>
        <div className="post-meta">
          <span className="post-author" id={`p-${postId}`}>
            {authorName}
          </span>
          <time className="post-time" dateTime={createdAt}>
            {timeAgo(createdAt)}
          </time>
        </div>
        {isAdmin && !editing && (
          <span className="post-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
              Edit
            </button>
            <DeletePost postId={postId} mediaPath={mediaPath} />
          </span>
        )}
      </header>

      {editing ? (
        <form className="post-edit" onSubmit={save}>
          <div className="field">
            <label htmlFor={ids.body}>Text</label>
            <textarea
              id={ids.body}
              className="textarea"
              value={draft}
              maxLength={5000}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor={ids.link}>Link</label>
            <input
              id={ids.link}
              className="input"
              type="url"
              inputMode="url"
              placeholder="https://example.com/article"
              value={draftLink}
              onChange={(e) => setDraftLink(e.target.value)}
            />
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <div className="post-edit-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={cancel} disabled={pending}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <>
          {body && <div className="post-body">{body}</div>}
          {linkUrl && (
            <a className="post-link" href={linkUrl} target="_blank" rel="noopener noreferrer">
              <LinkIcon size={20} />
              <span>
                <strong>{hostOf(linkUrl)}</strong>
                <small>{linkUrl}</small>
              </span>
            </a>
          )}
        </>
      )}
    </>
  );
}

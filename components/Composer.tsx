"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { createPost } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/format";
import { normalizeLink } from "@/lib/links";
import { ImageIcon, LinkIcon, X } from "./icons";

const MAX_BYTES = 50 * 1024 * 1024;

export function Composer({ userId, name }: { userId: string; name: string }) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const ids = { body: useId(), file: useId(), link: useId() };

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isVideo = file?.type.startsWith("video/");
  const canPost = !pending && (body.trim() || file || link.trim());

  function pickFile(f: File | undefined) {
    setError(null);
    if (!f) return;
    if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
      return setError("Choose a picture or a video.");
    }
    if (f.size > MAX_BYTES) return setError("That file is over 50 MB. Choose a smaller one.");
    setFile(f);
  }

  function clearFile() {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    let linkUrl: string | null;
    try {
      linkUrl = normalizeLink(link);
    } catch {
      return setError("That link doesn't look right. Check it and try again.");
    }

    startTransition(async () => {
      let mediaPath: string | null = null;
      let mediaType: "image" | "video" | null = null;

      if (file) {
        setStatus(isVideo ? "Uploading video…" : "Uploading picture…");
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await createClient()
          .storage.from("post-media")
          .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
        if (upErr) {
          setStatus(null);
          return setError(`Upload failed: ${upErr.message}`);
        }
        mediaPath = path;
        mediaType = isVideo ? "video" : "image";
      }

      setStatus("Posting…");
      const res = await createPost({ body, linkUrl, mediaPath, mediaType });
      setStatus(null);
      if (res.error) return setError(res.error);

      setBody("");
      setLink("");
      setShowLink(false);
      clearFile();
      setStatus("Posted. Everyone can see it now.");
      setTimeout(() => setStatus(null), 3000);
    });
  }

  return (
    <form className="card composer" onSubmit={submit} aria-label="New post">
      <div className="composer-row">
        <span className="avatar" aria-hidden="true">
          {initials(name)}
        </span>
        <label htmlFor={ids.body} className="visually-hidden">
          What's the news?
        </label>
        <textarea
          id={ids.body}
          className="textarea"
          placeholder="Share news with everyone…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
        />
      </div>

      {preview && (
        <div className="composer-preview">
          {isVideo ? <video src={preview} controls /> : <img src={preview} alt="Selected picture" />}
          <button type="button" className="btn btn-outline btn-sm remove" onClick={clearFile}>
            <X /> Remove
          </button>
        </div>
      )}

      {showLink && (
        <div className="field">
          <label htmlFor={ids.link}>Link</label>
          <input
            id={ids.link}
            className="input"
            type="url"
            inputMode="url"
            placeholder="https://example.com/article"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="composer-tools">
        <input
          ref={fileRef}
          id={ids.file}
          className="file-input"
          type="file"
          accept="image/*,video/*"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        <label htmlFor={ids.file} className="btn btn-ghost btn-sm">
          <ImageIcon /> Photo or video
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          aria-pressed={showLink}
          onClick={() => {
            setShowLink((v) => !v);
            if (showLink) setLink("");
          }}
        >
          <LinkIcon /> Link
        </button>
        <span className="spacer" />
        {status && (
          <span className="post-time" role="status">
            {status}
          </span>
        )}
        <button type="submit" className="btn btn-cta" disabled={!canPost} aria-busy={pending}>
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}

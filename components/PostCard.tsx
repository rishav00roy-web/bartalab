import { mediaUrl } from "@/lib/format";
import type { Post, ReactionKind } from "@/lib/types";
import { Comments } from "./Comments";
import { PostMain } from "./PostMain";
import { Reactions } from "./Reactions";

export function PostCard({
  post,
  userId,
  isAdmin,
}: {
  post: Post;
  userId: string;
  isAdmin: boolean;
}) {
  const counts: Record<ReactionKind, number> = { like: 0, celebrate: 0, insightful: 0 };
  let mine: ReactionKind | null = null;
  for (const r of post.reactions) {
    counts[r.kind] += 1;
    if (r.user_id === userId) mine = r.kind;
  }
  const total = post.reactions.length;
  const commentCount = post.comments.length;
  const authorName = post.author?.full_name ?? "Admin";

  return (
    <article className={post.pinned ? "card post is-pinned" : "card post"} aria-labelledby={`p-${post.id}`}>
      <PostMain
        postId={post.id}
        authorName={authorName}
        createdAt={post.created_at}
        body={post.body}
        linkUrl={post.link_url}
        mediaPath={post.media_path}
        pinned={post.pinned}
        isAdmin={isAdmin}
      />

      {post.media_path && (
        <div className="post-media">
          {post.media_type === "video" ? (
            <video src={mediaUrl(post.media_path)} controls preload="metadata" playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(post.media_path)} alt={post.body ? post.body.slice(0, 120) : "Post picture"} loading="lazy" />
          )}
        </div>
      )}

      {(total > 0 || commentCount > 0) && (
        <div className="post-stats">
          <span>{total > 0 ? `${total} ${total === 1 ? "reaction" : "reactions"}` : ""}</span>
          <span>
            {commentCount > 0 ? `${commentCount} ${commentCount === 1 ? "comment" : "comments"}` : ""}
          </span>
        </div>
      )}

      <Reactions postId={post.id} mine={mine} counts={counts} />
      <Comments postId={post.id} comments={post.comments} userId={userId} isAdmin={isAdmin} />
    </article>
  );
}

import Link from "next/link";
import { Composer } from "@/components/Composer";
import { LiveRefresh } from "@/components/LiveRefresh";
import { Pending } from "@/components/Pending";
import { PostCard } from "@/components/PostCard";
import { TopBar } from "@/components/TopBar";
import { getSession } from "@/lib/session";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const POST_FIELDS = `id, body, link_url, media_path, media_type, pinned, created_at,
  author:profiles!posts_author_id_fkey(id, full_name),
  comments(id, body, created_at, author:profiles!comments_author_id_fkey(id, full_name)),
  reactions(user_id, kind)`;

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ before?: string }>;
}) {
  const { supabase, profile } = await getSession();
  if (!profile.approved) return <Pending profile={profile} />;

  const isAdmin = profile.role === "admin";
  const { before } = await searchParams;
  const cursor = before && !Number.isNaN(Date.parse(before)) ? before : null;

  let recentQuery = supabase
    .from("posts")
    .select(POST_FIELDS)
    .eq("pinned", false)
    .order("created_at", { ascending: false })
    .order("created_at", { referencedTable: "comments", ascending: true })
    .limit(PAGE_SIZE + 1);
  if (cursor) recentQuery = recentQuery.lt("created_at", cursor);

  const [pinnedRes, recentRes, pendingRes] = await Promise.all([
    cursor
      ? Promise.resolve({ data: [] as Post[], error: null })
      : supabase
          .from("posts")
          .select(POST_FIELDS)
          .eq("pinned", true)
          .order("created_at", { ascending: false })
          .order("created_at", { referencedTable: "comments", ascending: true })
          .returns<Post[]>(),
    recentQuery.returns<Post[]>(),
    isAdmin
      ? supabase.from("profiles").select("id", { count: "exact", head: true }).eq("approved", false)
      : Promise.resolve({ count: 0 }),
  ]);

  const error = pinnedRes.error ?? recentRes.error;
  const recent = recentRes.data ?? [];
  const hasMore = recent.length > PAGE_SIZE;
  const page = recent.slice(0, PAGE_SIZE);
  const posts = [...(pinnedRes.data ?? []), ...page];
  const nextCursor = hasMore ? page[page.length - 1]?.created_at : null;

  return (
    <>
      <a href="#feed" className="skip-link">
        Skip to posts
      </a>
      <TopBar profile={profile} current="feed" pendingCount={pendingRes.count ?? 0} />
      <LiveRefresh />
      <main className="feed" id="feed">
        <div className="feed-head">
          <h1>{cursor ? "Older news" : "Latest news"}</h1>
        </div>

        {isAdmin && !cursor && <Composer userId={profile.id} name={profile.full_name} />}

        {error && (
          <p className="error" role="alert">
            Couldn&apos;t load posts: {error.message}. Refresh the page to try again.
          </p>
        )}

        {!error && posts.length === 0 && (
          <div className="card empty">
            <h2>No news yet</h2>
            <p>
              {isAdmin
                ? "Write the first post above. Everyone in your organization will see it here."
                : "When an admin shares an update, it will show up here."}
            </p>
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} userId={profile.id} isAdmin={isAdmin} />
        ))}

        {(nextCursor || cursor) && (
          <nav className="pager" aria-label="More posts">
            {cursor && (
              <Link href="/newsroom" className="btn btn-outline">
                Back to latest
              </Link>
            )}
            {nextCursor && (
              <Link href={`/newsroom?before=${encodeURIComponent(nextCursor)}`} className="btn btn-outline">
                Older posts
              </Link>
            )}
          </nav>
        )}
      </main>
    </>
  );
}

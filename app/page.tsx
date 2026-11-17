import { redirect } from "next/navigation";
import { Composer } from "@/components/Composer";
import { PostCard } from "@/components/PostCard";
import { TopBar } from "@/components/TopBar";
import { createClient } from "@/lib/supabase/server";
import type { Post, Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: posts, error }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role").eq("id", user.id).single<Profile>(),
    supabase
      .from("posts")
      .select(
        `id, body, link_url, media_path, media_type, created_at,
         author:profiles!posts_author_id_fkey(id, full_name),
         comments(id, body, created_at, author:profiles!comments_author_id_fkey(id, full_name)),
         reactions(user_id, kind)`,
      )
      .order("created_at", { ascending: false })
      .order("created_at", { referencedTable: "comments", ascending: true })
      .limit(50)
      .returns<Post[]>(),
  ]);

  const me: Profile = profile ?? { id: user.id, full_name: user.email ?? "You", role: "member" };
  const isAdmin = me.role === "admin";

  return (
    <>
      <a href="#feed" className="skip-link">
        Skip to posts
      </a>
      <TopBar profile={me} />
      <main className="feed" id="feed">
        <div className="feed-head">
          <h1>Latest news</h1>
          {!isAdmin && <p>Only admins can post. You can react and comment.</p>}
        </div>

        {isAdmin && <Composer userId={me.id} name={me.full_name} />}

        {error && (
          <p className="error" role="alert">
            Couldn&apos;t load posts: {error.message}. Refresh the page to try again.
          </p>
        )}

        {!error && posts?.length === 0 && (
          <div className="card empty">
            <h2>No news yet</h2>
            <p>
              {isAdmin
                ? "Write the first post above. Everyone in your organization will see it here."
                : "When an admin shares an update, it will show up here."}
            </p>
          </div>
        )}

        {posts?.map((post) => (
          <PostCard key={post.id} post={post} userId={me.id} isAdmin={isAdmin} />
        ))}
      </main>
    </>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ReactionKind } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createPost(input: {
  body: string;
  linkUrl: string | null;
  mediaPath: string | null;
  mediaType: "image" | "video" | null;
}) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body: input.body.trim(),
    link_url: input.linkUrl,
    media_path: input.mediaPath,
    media_type: input.mediaType,
  });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function deletePost(postId: string, mediaPath: string | null) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  if (mediaPath) await supabase.storage.from("post-media").remove([mediaPath]);
  revalidatePath("/");
  return { error: null };
}

export async function addComment(postId: string, body: string) {
  const { supabase, user } = await requireUser();
  const text = body.trim();
  if (!text) return { error: "Write something first." };
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, body: text });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function deleteComment(commentId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function setReaction(postId: string, kind: ReactionKind | null) {
  const { supabase, user } = await requireUser();
  const { error } = kind
    ? await supabase
        .from("reactions")
        .upsert({ post_id: postId, user_id: user.id, kind }, { onConflict: "post_id,user_id" })
    : await supabase.from("reactions").delete().match({ post_id: postId, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/");
  return { error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

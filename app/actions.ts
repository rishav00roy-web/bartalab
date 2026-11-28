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
  revalidatePath("/newsroom");
  return { error: null };
}

export async function deletePost(postId: string, mediaPath: string | null) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return { error: error.message };
  if (mediaPath) await supabase.storage.from("post-media").remove([mediaPath]);
  revalidatePath("/newsroom");
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
  revalidatePath("/newsroom");
  return { error: null };
}

export async function deleteComment(commentId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { error: error.message };
  revalidatePath("/newsroom");
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
  revalidatePath("/newsroom");
  return { error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updatePost(postId: string, body: string, linkUrl: string | null) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("posts")
    .update({ body: body.trim(), link_url: linkUrl })
    .eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/newsroom");
  return { error: null };
}

export async function setPinned(postId: string, pinned: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("posts").update({ pinned }).eq("id", postId);
  if (error) return { error: error.message };
  revalidatePath("/newsroom");
  return { error: null };
}

export async function setMember(target: string, role: "admin" | "member", approved: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("admin_set_member", {
    target,
    new_role: role,
    new_approved: approved,
  });
  if (error) return { error: error.message };
  revalidatePath("/members");
  revalidatePath("/newsroom");
  return { error: null };
}

export async function updateName(fullName: string) {
  const { supabase, user } = await requireUser();
  const name = fullName.trim();
  if (name.length < 2) return { error: "Enter your full name." };
  const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { error: null };
}

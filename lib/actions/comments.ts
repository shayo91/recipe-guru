"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(recipeId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to comment" };
  }

  if (!content.trim()) {
    return { error: "Comment cannot be empty" };
  }

  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) {
    return { error: "Failed to add comment" };
  }

  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in" };
  }

  // Verify ownership
  const { data: comment } = await supabase
    .from("recipe_comments")
    .select("recipe_id")
    .eq("id", commentId)
    .eq("user_id", user.id)
    .single();

  if (!comment) {
    return { error: "Comment not found or you don't have permission" };
  }

  const { error } = await supabase
    .from("recipe_comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to delete comment" };
  }

  revalidatePath(`/recipes/${comment.recipe_id}`);
  return { success: true };
}


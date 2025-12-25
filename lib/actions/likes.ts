"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to like recipes" };
  }

  // Check if user already liked this recipe
  const { data: existingLike } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id);

    if (error) {
      return { error: "Failed to unlike recipe" };
    }

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/recipes/saved");
    return { success: true, liked: false };
  } else {
    // Like
    const { error } = await supabase
      .from("recipe_likes")
      .insert({
        recipe_id: recipeId,
        user_id: user.id,
      });

    if (error) {
      return { error: "Failed to like recipe" };
    }

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/recipes/saved");
    return { success: true, liked: true };
  }
}


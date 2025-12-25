"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRecipe(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const ingredients = formData.get("ingredients") as string;
  const instructions = formData.get("instructions") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const cookingTime = formData.get("cookingTime") as string;
  const difficulty = formData.get("difficulty") as string;
  const category = formData.get("category") as string;

  // Validation
  if (!title || !ingredients || !instructions) {
    return { error: "Title, ingredients, and instructions are required" };
  }

  // Get user's profile to get user_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { error: "Profile not found" };
  }

  const { data: recipe, error } = await supabase
    .from("recipes")
    .insert({
      user_id: profile.id,
      title,
      ingredients,
      instructions,
      image_url: imageUrl || null,
      cooking_time: cookingTime ? parseInt(cookingTime) : null,
      difficulty: difficulty || null,
      category: category || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  redirect(`/recipes/${recipe.id}`);
}

export async function updateRecipe(recipeId: string, formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Verify recipe ownership
  const { data: recipe } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .single();

  if (!recipe || recipe.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const ingredients = formData.get("ingredients") as string;
  const instructions = formData.get("instructions") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const cookingTime = formData.get("cookingTime") as string;
  const difficulty = formData.get("difficulty") as string;
  const category = formData.get("category") as string;

  // Validation
  if (!title || !ingredients || !instructions) {
    return { error: "Title, ingredients, and instructions are required" };
  }

  const { error } = await supabase
    .from("recipes")
    .update({
      title,
      ingredients,
      instructions,
      image_url: imageUrl || null,
      cooking_time: cookingTime ? parseInt(cookingTime) : null,
      difficulty: difficulty || null,
      category: category || null,
    })
    .eq("id", recipeId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}`);
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Verify recipe ownership
  const { data: recipe } = await supabase
    .from("recipes")
    .select("user_id")
    .eq("id", recipeId)
    .single();

  if (!recipe || recipe.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("recipes").delete().eq("id", recipeId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}


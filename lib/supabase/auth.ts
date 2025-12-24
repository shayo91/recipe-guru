import { createClient } from "./server";
import { createClient as createBrowserClient } from "./client";

/**
 * Get the current authenticated user (Server Component)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current user's profile (Server Component)
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile;
}

/**
 * Check if user is authenticated (Client Component)
 */
export async function isAuthenticated() {
  const supabase = createBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return !!user;
}


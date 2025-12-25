// Database types matching Supabase schema
// These types correspond to the tables defined in db/schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string | null;
          full_name: string | null;
          bio: string | null;
          last_signed_in: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email?: string | null;
          full_name?: string | null;
          bio?: string | null;
          last_signed_in?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string | null;
          full_name?: string | null;
          bio?: string | null;
          last_signed_in?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          ingredients: string;
          instructions: string;
          image_url: string | null;
          cooking_time: number | null;
          difficulty: Difficulty | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          ingredients: string;
          instructions: string;
          image_url?: string | null;
          cooking_time?: number | null;
          difficulty?: Difficulty | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          ingredients?: string;
          instructions?: string;
          image_url?: string | null;
          cooking_time?: number | null;
          difficulty?: Difficulty | null;
          category?: string | null;
          created_at?: string;
        };
      };
      recipe_likes: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      recipe_comments: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for common queries
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeLike = Database["public"]["Tables"]["recipe_likes"]["Row"];
export type RecipeComment = Database["public"]["Tables"]["recipe_comments"]["Row"];

// Extended types with relations
export type RecipeWithProfile = Recipe & {
  profile: Profile;
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
};

export type CommentWithProfile = RecipeComment & {
  profile: Profile;
};

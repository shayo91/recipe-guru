"use client";

import { toggleLike } from "@/lib/actions/likes";
import { useState } from "react";

interface LikeButtonProps {
  recipeId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({
  recipeId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLike() {
    setIsLoading(true);
    const result = await toggleLike(recipeId);
    if (result?.success) {
      setLiked(result.liked);
      setCount((prev) => (result.liked ? prev + 1 : prev - 1));
    }
    setIsLoading(false);
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
        liked
          ? "border-red-300 bg-red-50 text-red-800 hover:bg-red-100"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <svg
        className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}


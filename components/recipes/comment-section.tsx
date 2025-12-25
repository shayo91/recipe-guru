"use client";

import { addComment, deleteComment } from "@/lib/actions/comments";
import { CommentWithProfile } from "@/types/database";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CommentSectionProps {
  recipeId: string;
  initialComments: CommentWithProfile[];
  currentUserId?: string;
  currentUserProfile?: {
    id: string;
    username: string;
    full_name: string | null;
  };
}

export function CommentSection({
  recipeId,
  initialComments,
  currentUserId,
  currentUserProfile,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sync comments when initialComments changes (after router.refresh())
  useEffect(() => {
    setComments((prev) => {
      // Find any optimistic comments (temp IDs)
      const optimisticComments = prev.filter((c) => c.id.startsWith("temp-"));
      
      // If we have optimistic comments, check if they've been confirmed
      if (optimisticComments.length > 0) {
        // Check if any server comment matches our optimistic comment
        const hasConfirmed = optimisticComments.some((opt) =>
          initialComments.some(
            (server) =>
              server.content === opt.content &&
              server.user_id === opt.user_id &&
              Math.abs(
                new Date(server.created_at).getTime() -
                  new Date(opt.created_at).getTime()
              ) < 10000 // Within 10 seconds
          )
        );
        
        // If confirmed, use server data (which includes the real comment)
        if (hasConfirmed) {
          return initialComments;
        }
        
        // Otherwise, merge: server comments + unconfirmed optimistic comments
        const serverCommentIds = new Set(initialComments.map((c) => c.id));
        const unconfirmedOptimistic = optimisticComments.filter(
          (opt) =>
            !initialComments.some(
              (server) =>
                server.content === opt.content &&
                server.user_id === opt.user_id
            )
        );
        return [...initialComments, ...unconfirmedOptimistic];
      }
      
      // No optimistic comments, just use server data
      return initialComments;
    });
  }, [initialComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || isLoading || !currentUserProfile) return;

    const commentText = newComment.trim();
    setNewComment("");
    setIsLoading(true);

    // Create optimistic comment
    const optimisticComment: CommentWithProfile = {
      id: `temp-${Date.now()}`, // Temporary ID
      recipe_id: recipeId,
      user_id: currentUserProfile.id,
      content: commentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: currentUserProfile.id,
        username: currentUserProfile.username,
        email: null,
        full_name: currentUserProfile.full_name,
      },
    };

    // Optimistically add comment to UI
    setComments((prev) => [...prev, optimisticComment]);

    // Submit to server
    const result = await addComment(recipeId, commentText);
    
    if (result?.success) {
      // Refresh to get the real comment with proper ID and timestamp
      router.refresh();
    } else {
      // Remove optimistic comment on error
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
      alert(result?.error || "Failed to add comment");
    }
    setIsLoading(false);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const result = await deleteComment(commentId);
    if (result?.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      alert(result?.error || "Failed to delete comment");
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Comments</h2>

      {/* Add Comment Form */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      {comment.profile.username}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {currentUserId === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


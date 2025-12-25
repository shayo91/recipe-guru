"use client";

import { addComment, deleteComment } from "@/lib/actions/comments";
import { CommentWithProfile } from "@/types/database";
import { useState } from "react";

interface CommentSectionProps {
  recipeId: string;
  initialComments: CommentWithProfile[];
  currentUserId?: string;
}

export function CommentSection({
  recipeId,
  initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    setIsLoading(true);
    const result = await addComment(recipeId, newComment);
    if (result?.success) {
      setNewComment("");
      // Reload page to get updated comments
      window.location.reload();
    } else {
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


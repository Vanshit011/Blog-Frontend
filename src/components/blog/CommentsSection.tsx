import { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Send, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { addComment, deleteComment, getComments } from '../../services/api';
import type { Comment } from '../../shared/constants/types';

interface CommentsSectionProps {
  blogId: string;
  initialComments?: Comment[];
  currentUserId?: string | null;
  isAuthenticated: boolean;
  onAuthRequired?: () => void;
}

const CommentsSection = ({
  blogId,
  initialComments = [],
  currentUserId = null,
  isAuthenticated,
  onAuthRequired,
}: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    const trimmed = commentText.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      await addComment(blogId, trimmed);

      const fresh = await getComments(blogId);

      const updatedComments = Array.isArray(fresh)
        ? fresh
        : (fresh?.data ?? []);

      setComments(updatedComments);

      setCommentText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('Comment deleted.');
    } catch {
      toast.error('Failed to delete comment.');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="mt-4 border-t border-gray-100 py-3">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
          <MessageCircle className="w-4 h-4" />
          <span>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-5">
          <MessageCircle className="w-5 h-5 text-indigo-500" />
          Discussion
        </h3>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts…"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none transition-all"
              rows={3}
              maxLength={1000}
              disabled={submitting}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {commentText.length}/1000
              </span>

              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-indigo-200 hover:shadow-lg"
              >
                {submitting ? (
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? 'Posting…' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-gray-600 text-sm">
            <LogIn className="w-5 h-5 text-indigo-400 shrink-0" />
            <p>
              <button
                onClick={onAuthRequired}
                className="font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
              >
                Sign in
              </button>{' '}
              to comment on this post.
            </p>
          </div>
        )}
      </div>

      {comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => {
            const isOwner =
              currentUserId != null &&
              (comment?.userId === currentUserId ||
                comment?.id === currentUserId);

            const authorName = comment?.display_name || 'Anonymous';
            const initials = authorName[0]?.toUpperCase() || 'A';

            return (
              <div
                key={comment.id}
                className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 group"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {initials}
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">
                      {authorName}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {formatDate(
                          comment.created_at || new Date().toISOString()
                        )}
                      </span>

                      {isOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
};

export default CommentsSection;

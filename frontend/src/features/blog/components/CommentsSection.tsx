import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useComments } from "../hooks/useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

interface CommentsSectionProps {
  slug: string;
}

export default function CommentsSection({ slug }: CommentsSectionProps) {
  const [page, setPage] = useState(1);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { data, isLoading } = useComments(slug, page);

  if (isLoading) {
    return (
      <div className="mt-16 pt-8 border-t border-border">
        <div className="h-6 w-40 bg-surface animate-pulse rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  const comments = data?.data ?? [];
  const commentCount = data?.commentCount ?? 0;
  const commentsEnabled = data?.commentsEnabled ?? true;
  const pagination = data?.pagination;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare
          size={20}
          strokeWidth={1.5}
          className="text-text-primary"
        />
        <h3 className="text-lg font-semibold text-text-primary">
          Comments {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      {commentsEnabled && (
        <div className="mb-8">
          <CommentForm
            slug={slug}
            parentId={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      )}

      {!commentsEnabled && (
        <p className="text-sm text-text-muted mb-8">
          Comments are disabled for this post.
        </p>
      )}

      {comments.length > 0 ? (
        <div className="space-y-1 divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId) => setReplyTo(parentId)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs border border-border rounded hover:border-text-muted/40 disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-text-muted">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-1.5 text-xs border border-border rounded hover:border-text-muted/40 disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

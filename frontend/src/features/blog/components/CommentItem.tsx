import React from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";

interface Comment {
  id: string;
  name: string;
  website?: string | null;
  body: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  depth?: number;
}

function CommentItemInner({ comment, onReply, depth = 0 }: CommentItemProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${depth > 0 ? "ml-6 pl-4 border-l border-border" : ""}`}
    >
      <div className="py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center">
            <User size={14} strokeWidth={1.5} className="text-text-muted" />
          </div>
          <div className="flex items-center gap-2">
            {comment.website ? (
              <a
                href={comment.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-sm font-medium text-accent hover:underline"
              >
                {comment.name}
              </a>
            ) : (
              <span className="text-sm font-medium text-text-primary">
                {comment.name}
              </span>
            )}
            <span className="text-xs text-text-muted">{timeAgo}</span>
          </div>
        </div>

        <p className="text-sm text-text-muted leading-relaxed ml-9">
          {comment.body}
        </p>

        {depth === 0 && (
          <button
            onClick={() => onReply(comment.id)}
            className="ml-9 mt-2 flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors"
          >
            <MessageSquare size={12} strokeWidth={1.5} />
            Reply
          </button>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

const CommentItem = React.memo(CommentItemInner);
export default CommentItem;

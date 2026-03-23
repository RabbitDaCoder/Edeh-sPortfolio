import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import { motion } from "framer-motion";
function CommentItemInner({ comment, onReply, depth = 0 }) {
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
    });
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: `${depth > 0 ? "ml-6 pl-4 border-l border-border" : ""}`, children: [_jsxs("div", { className: "py-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-surface flex items-center justify-center", children: _jsx(User, { size: 14, strokeWidth: 1.5, className: "text-text-muted" }) }), _jsxs("div", { className: "flex items-center gap-2", children: [comment.website ? (_jsx("a", { href: comment.website, target: "_blank", rel: "noopener noreferrer nofollow", className: "text-sm font-medium text-accent hover:underline", children: comment.name })) : (_jsx("span", { className: "text-sm font-medium text-text-primary", children: comment.name })), _jsx("span", { className: "text-xs text-text-muted", children: timeAgo })] })] }), _jsx("p", { className: "text-sm text-text-muted leading-relaxed ml-9", children: comment.body }), depth === 0 && (_jsxs("button", { onClick: () => onReply(comment.id), className: "ml-9 mt-2 flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors", children: [_jsx(MessageSquare, { size: 12, strokeWidth: 1.5 }), "Reply"] }))] }), comment.replies && comment.replies.length > 0 && (_jsx("div", { className: "space-y-0", children: comment.replies.map((reply) => (_jsx(CommentItem, { comment: reply, onReply: onReply, depth: depth + 1 }, reply.id))) }))] }));
}
const CommentItem = React.memo(CommentItemInner);
export default CommentItem;
//# sourceMappingURL=CommentItem.js.map
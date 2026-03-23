import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useComments } from "../hooks/useComments";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
export default function CommentsSection({ slug }) {
    const [page, setPage] = useState(1);
    const [replyTo, setReplyTo] = useState(null);
    const { data, isLoading } = useComments(slug, page);
    if (isLoading) {
        return (_jsxs("div", { className: "mt-16 pt-8 border-t border-border", children: [_jsx("div", { className: "h-6 w-40 bg-surface animate-pulse rounded mb-6" }), _jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-20 bg-surface animate-pulse rounded" }, i))) })] }));
    }
    const comments = data?.data ?? [];
    const commentCount = data?.commentCount ?? 0;
    const commentsEnabled = data?.commentsEnabled ?? true;
    const pagination = data?.pagination;
    return (_jsxs("div", { className: "mt-16 pt-8 border-t border-border", children: [_jsxs("div", { className: "flex items-center gap-2 mb-8", children: [_jsx(MessageSquare, { size: 20, strokeWidth: 1.5, className: "text-text-primary" }), _jsxs("h3", { className: "text-lg font-semibold text-text-primary", children: ["Comments ", commentCount > 0 && `(${commentCount})`] })] }), commentsEnabled && (_jsx("div", { className: "mb-8", children: _jsx(CommentForm, { slug: slug, parentId: replyTo, onCancelReply: () => setReplyTo(null) }) })), !commentsEnabled && (_jsx("p", { className: "text-sm text-text-muted mb-8", children: "Comments are disabled for this post." })), comments.length > 0 ? (_jsx("div", { className: "space-y-1 divide-y divide-border", children: comments.map((comment) => (_jsx(CommentItem, { comment: comment, onReply: (parentId) => setReplyTo(parentId) }, comment.id))) })) : (_jsx("p", { className: "text-sm text-text-muted", children: "No comments yet. Be the first to share your thoughts!" })), pagination && pagination.pages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2 mt-8", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "px-3 py-1.5 text-xs border border-border rounded hover:border-text-muted/40 disabled:opacity-30 transition-colors", children: "Previous" }), _jsxs("span", { className: "text-xs text-text-muted", children: [page, " / ", pagination.pages] }), _jsx("button", { onClick: () => setPage((p) => Math.min(pagination.pages, p + 1)), disabled: page === pagination.pages, className: "px-3 py-1.5 text-xs border border-border rounded hover:border-text-muted/40 disabled:opacity-30 transition-colors", children: "Next" })] }))] }));
}
//# sourceMappingURL=CommentsSection.js.map
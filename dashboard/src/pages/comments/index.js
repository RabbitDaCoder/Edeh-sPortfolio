import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import { Check, Trash2, AlertTriangle, MessageSquare, ExternalLink, } from "lucide-react";
export function CommentsPage() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState("pending");
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ["admin-comments", status, page],
        queryFn: () => apiClient.get("admin/comments", {
            params: { page, limit: 20, status },
        }),
    });
    const approveMutation = useMutation({
        mutationFn: (id) => apiClient.patch(`admin/comments/${id}/approve`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
    });
    const spamMutation = useMutation({
        mutationFn: (id) => apiClient.patch(`admin/comments/${id}/spam`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`admin/comments/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
    });
    const comments = data?.data?.data?.data ?? [];
    const pagination = data?.data?.data?.pagination;
    const tabs = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Spam", value: "spam" },
        { label: "All", value: "all" },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Comments" }), _jsx("p", { className: "text-sm text-text-muted", children: "Moderate blog post comments" })] }), _jsx("div", { className: "flex items-center gap-1 p-1 bg-surface rounded-lg w-fit", children: tabs.map((tab) => (_jsx("button", { onClick: () => {
                        setStatus(tab.value);
                        setPage(1);
                    }, className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${status === tab.value
                        ? "bg-accent text-background"
                        : "text-text-muted hover:text-text-primary"}`, children: tab.label }, tab.value))) }), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-24 bg-surface animate-pulse rounded-sm" }, i))) })) : comments.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-text-muted", children: [_jsx(MessageSquare, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), "No ", status === "all" ? "" : status, " comments."] })) : (_jsx("div", { className: "space-y-2", children: comments.map((comment) => (_jsxs("div", { className: "border border-border rounded-sm p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-medium text-text-primary", children: comment.name }), _jsxs("span", { className: "text-xs text-text-muted", children: ["<", comment.email, ">"] }), comment.spam && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded", children: "Spam" })), comment.approved && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded", children: "Approved" })), !comment.approved && !comment.spam && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded", children: "Pending" }))] }), comment.blog && (_jsxs("p", { className: "text-xs text-text-muted mt-1 flex items-center gap-1", children: ["On:", " ", _jsxs("a", { href: `/blog/edit/${comment.blogId}`, className: "text-accent hover:underline inline-flex items-center gap-0.5", children: [comment.blog.title, _jsx(ExternalLink, { className: "w-3 h-3" })] })] }))] }), _jsx("span", { className: "text-xs text-text-muted shrink-0", children: new Date(comment.createdAt).toLocaleDateString() })] }), _jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: comment.body }), _jsxs("div", { className: "flex items-center gap-2", children: [!comment.approved && (_jsxs("button", { onClick: () => approveMutation.mutate(comment.id), disabled: approveMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/20 text-green-500 rounded-sm hover:bg-green-500/5 transition-colors", children: [_jsx(Check, { className: "w-3.5 h-3.5" }), " Approve"] })), !comment.spam && (_jsxs("button", { onClick: () => spamMutation.mutate(comment.id), disabled: spamMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-yellow-500/20 text-yellow-500 rounded-sm hover:bg-yellow-500/5 transition-colors", children: [_jsx(AlertTriangle, { className: "w-3.5 h-3.5" }), " Spam"] })), _jsxs("button", { onClick: () => {
                                        if (confirm("Delete this comment permanently?"))
                                            deleteMutation.mutate(comment.id);
                                    }, disabled: deleteMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-500/20 text-red-500 rounded-sm hover:bg-red-500/5 transition-colors", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), " Delete"] })] })] }, comment.id))) })), pagination && pagination.pages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors", children: "Previous" }), _jsxs("span", { className: "text-xs text-text-muted", children: [page, " / ", pagination.pages] }), _jsx("button", { onClick: () => setPage((p) => Math.min(pagination.pages, p + 1)), disabled: page === pagination.pages, className: "px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors", children: "Next" })] }))] }));
}
//# sourceMappingURL=index.js.map
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV2Client } from "../../lib/axios";
import { Check, Trash2, Flag, Pin, PinOff, BookOpen } from "lucide-react";
function filterParams(status) {
    switch (status) {
        case "pending":
            return { approved: "false", flagged: "false" };
        case "approved":
            return { approved: "true" };
        case "flagged":
            return { flagged: "true" };
        default:
            return {};
    }
}
export function GuestbookPage() {
    const queryClient = useQueryClient();
    const [status, setStatus] = useState("pending");
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ["admin-guestbook", status, page],
        queryFn: () => apiV2Client.get("/admin/guestbook", {
            params: { page, limit: 20, ...filterParams(status) },
        }),
    });
    const approveMutation = useMutation({
        mutationFn: (id) => apiV2Client.patch(`/admin/guestbook/${id}/approve`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
    });
    const pinMutation = useMutation({
        mutationFn: ({ id, pinned }) => apiV2Client.patch(`/admin/guestbook/${id}/pin`, { pinned }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
    });
    const flagMutation = useMutation({
        mutationFn: (id) => apiV2Client.patch(`/admin/guestbook/${id}/flag`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiV2Client.delete(`/admin/guestbook/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
    });
    const entries = data?.data?.data?.data ?? [];
    const pagination = data?.data?.data?.pagination;
    const tabs = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Flagged", value: "flagged" },
        { label: "All", value: "all" },
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Guestbook" }), _jsx("p", { className: "text-sm text-text-muted", children: "Moderate guestbook entries" })] }), _jsx("div", { className: "flex items-center gap-1 p-1 bg-surface rounded-lg w-fit", children: tabs.map((tab) => (_jsx("button", { onClick: () => {
                        setStatus(tab.value);
                        setPage(1);
                    }, className: `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${status === tab.value
                        ? "bg-accent text-background"
                        : "text-text-muted hover:text-text-primary"}`, children: tab.label }, tab.value))) }), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-24 bg-surface animate-pulse rounded-sm" }, i))) })) : entries.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-text-muted", children: [_jsx(BookOpen, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }), "No ", status === "all" ? "" : status, " entries."] })) : (_jsx("div", { className: "space-y-2", children: entries.map((entry) => (_jsxs("div", { className: "border border-border rounded-sm p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-medium text-text-primary", children: entry.name }), _jsxs("span", { className: "text-xs text-text-muted", children: ["<", entry.email, ">"] }), entry.handle && (_jsxs("span", { className: "text-xs text-text-muted", children: ["@", entry.handle] })), entry.flagged && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded", children: "Flagged" })), entry.approved && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded", children: "Approved" })), !entry.approved && !entry.flagged && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded", children: "Pending" })), entry.pinned && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded", children: "Pinned" }))] }), entry.country && (_jsx("p", { className: "text-xs text-text-muted mt-0.5", children: entry.country }))] }), _jsx("span", { className: "text-xs text-text-muted shrink-0", children: new Date(entry.createdAt).toLocaleDateString() })] }), _jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: entry.message }), _jsxs("div", { className: "flex items-center gap-2", children: [!entry.approved && (_jsxs("button", { onClick: () => approveMutation.mutate(entry.id), disabled: approveMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/20 text-green-500 rounded-sm hover:bg-green-500/5 transition-colors", children: [_jsx(Check, { className: "w-3.5 h-3.5" }), " Approve"] })), _jsx("button", { onClick: () => pinMutation.mutate({
                                        id: entry.id,
                                        pinned: !entry.pinned,
                                    }), disabled: pinMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-blue-500/20 text-blue-500 rounded-sm hover:bg-blue-500/5 transition-colors", children: entry.pinned ? (_jsxs(_Fragment, { children: [_jsx(PinOff, { className: "w-3.5 h-3.5" }), " Unpin"] })) : (_jsxs(_Fragment, { children: [_jsx(Pin, { className: "w-3.5 h-3.5" }), " Pin"] })) }), !entry.flagged && (_jsxs("button", { onClick: () => flagMutation.mutate(entry.id), disabled: flagMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-yellow-500/20 text-yellow-500 rounded-sm hover:bg-yellow-500/5 transition-colors", children: [_jsx(Flag, { className: "w-3.5 h-3.5" }), " Flag"] })), _jsxs("button", { onClick: () => {
                                        if (confirm("Delete this entry permanently?"))
                                            deleteMutation.mutate(entry.id);
                                    }, disabled: deleteMutation.isPending, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-500/20 text-red-500 rounded-sm hover:bg-red-500/5 transition-colors", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), " Delete"] })] })] }, entry.id))) })), pagination && pagination.pages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1, className: "px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors", children: "Previous" }), _jsxs("span", { className: "text-xs text-text-muted", children: [page, " / ", pagination.pages] }), _jsx("button", { onClick: () => setPage((p) => Math.min(pagination.pages, p + 1)), disabled: page === pagination.pages, className: "px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors", children: "Next" })] }))] }));
}
//# sourceMappingURL=index.js.map
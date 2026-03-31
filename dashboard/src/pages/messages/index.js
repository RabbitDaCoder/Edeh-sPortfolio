import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
export function MessagesPage() {
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["messages"],
        queryFn: () => apiClient.get("contact"),
    });
    const markReadMutation = useMutation({
        mutationFn: (id) => apiClient.patch(`contact/${id}/read`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`contact/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
    });
    const messages = data?.data?.data ?? [];
    const unreadCount = messages.filter((m) => !m.read).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Messages" }), _jsx("p", { className: "text-sm text-text-muted", children: unreadCount > 0
                            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
                            : "All caught up!" })] }), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-20 bg-surface animate-pulse rounded-sm" }, i))) })) : messages.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No messages yet." })) : (_jsx("div", { className: "space-y-2", children: messages.map((msg) => {
                    const isOpen = expanded === msg.id;
                    return (_jsxs("div", { className: `border rounded-sm transition-colors ${msg.read ? "border-border" : "border-accent/30 bg-accent/5"}`, children: [_jsxs("button", { className: "w-full flex items-center gap-3 p-4 text-left", onClick: () => {
                                    setExpanded(isOpen ? null : msg.id);
                                    if (!msg.read)
                                        markReadMutation.mutate(msg.id);
                                }, children: [msg.read ? (_jsx(MailOpen, { className: "w-4 h-4 text-text-muted shrink-0" })) : (_jsx(Mail, { className: "w-4 h-4 text-accent shrink-0" })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm truncate ${msg.read ? "text-text-primary" : "font-semibold text-text-primary"}`, children: msg.name }), _jsxs("span", { className: "text-xs text-text-muted", children: ["<", msg.email, ">"] })] }), _jsx("p", { className: "text-sm text-text-muted truncate", children: msg.subject || msg.message.slice(0, 80) })] }), _jsx("span", { className: "text-xs text-text-muted shrink-0", children: new Date(msg.createdAt).toLocaleDateString() }), isOpen ? (_jsx(ChevronUp, { className: "w-4 h-4 text-text-muted shrink-0" })) : (_jsx(ChevronDown, { className: "w-4 h-4 text-text-muted shrink-0" }))] }), isOpen && (_jsx("div", { className: "px-4 pb-4 border-t border-border", children: _jsxs("div", { className: "pt-3 space-y-3", children: [msg.subject && (_jsxs("div", { children: [_jsx("span", { className: "text-xs font-medium text-text-muted uppercase", children: "Subject" }), _jsx("p", { className: "text-sm text-text-primary", children: msg.subject })] })), _jsxs("div", { children: [_jsx("span", { className: "text-xs font-medium text-text-muted uppercase", children: "Message" }), _jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap mt-1", children: msg.message })] }), _jsxs("div", { className: "flex items-center gap-2 pt-2", children: [_jsx("a", { href: `mailto:${msg.email}?subject=Re: ${msg.subject || ""}`, className: "inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-sm hover:bg-surface transition-colors", children: "Reply" }), _jsxs("button", { onClick: () => {
                                                        if (confirm("Delete this message?"))
                                                            deleteMutation.mutate(msg.id);
                                                    }, className: "inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 border border-red-500/20 rounded-sm hover:bg-red-500/5 transition-colors", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), " Delete"] })] })] }) }))] }, msg.id));
                }) }))] }));
}
//# sourceMappingURL=index.js.map
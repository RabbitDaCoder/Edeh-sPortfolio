import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
export function BlogListPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ["blog", page],
        queryFn: () => apiClient.get(`blog?page=${page}&limit=10`),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`blog/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog"] }),
    });
    const featureMutation = useMutation({
        mutationFn: (id) => apiClient.patch(`blog/${id}/feature`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog"] }),
    });
    const posts = data?.data?.data?.data ?? [];
    const meta = data?.data?.data?.pagination;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Blog Posts" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage your blog content" })] }), _jsxs(Link, { to: "/blog/create", className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Post"] })] }), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : posts.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No blog posts yet. Create your first one!" })) : (_jsx("div", { className: "border border-border rounded-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 font-medium text-text-muted", children: "Title" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Category" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Status" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Created" }), _jsx("th", { className: "text-right p-3 font-medium text-text-muted", children: "Actions" })] }) }), _jsx("tbody", { children: posts.map((post) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-surface/50 transition-colors", children: [_jsx("td", { className: "p-3 text-text-primary font-medium", children: _jsxs("div", { className: "flex items-center gap-2", children: [post.title, post.featured && (_jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-yellow-500" })), post.contentSource === "markdown" && (_jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded", children: "MD" }))] }) }), _jsx("td", { className: "p-3 text-text-muted hidden lg:table-cell", children: post.category || "—" }), _jsx("td", { className: "p-3 hidden md:table-cell", children: _jsx("span", { className: `inline-flex px-2 py-0.5 text-xs rounded-pill ${post.published
                                                ? "bg-green-500/10 text-green-600"
                                                : "bg-yellow-500/10 text-yellow-600"}`, children: post.published ? "Published" : "Draft" }) }), _jsx("td", { className: "p-3 text-text-muted hidden lg:table-cell", children: new Date(post.createdAt).toLocaleDateString() }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => featureMutation.mutate(post.id), className: `p-1.5 rounded-sm hover:bg-surface transition-colors ${post.featured
                                                        ? "text-yellow-500"
                                                        : "text-text-muted hover:text-yellow-500"}`, title: post.featured
                                                        ? "Remove from featured"
                                                        : "Mark as featured", children: _jsx(Star, { className: "w-4 h-4" }) }), _jsx(Link, { to: `/blog/edit/${post.id}`, className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete this post?"))
                                                            deleteMutation.mutate(post.id);
                                                    }, className: "p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, post.id))) })] }) })), meta && meta.pages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage((p) => p - 1), className: "px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors", children: "Previous" }), _jsxs("span", { className: "text-sm text-text-muted", children: ["Page ", page, " of ", meta.pages] }), _jsx("button", { disabled: page >= meta.pages, onClick: () => setPage((p) => p + 1), className: "px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors", children: "Next" })] }))] }));
}
//# sourceMappingURL=index.js.map
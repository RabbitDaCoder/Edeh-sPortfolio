import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    coverImage: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
    published: z.boolean(),
    tags: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
});
export function ArticleListPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(null); // null = closed, 'new' = create, object = edit
    const { data, isLoading } = useQuery({
        queryKey: ["articles", page],
        queryFn: () => apiClient.get(`articles?page=${page}&limit=10`),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`articles/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
    });
    const articles = data?.data?.data?.data ?? [];
    const meta = data?.data?.data?.pagination;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Articles" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage your articles" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Article"] })] }), editing && (_jsx(ArticleFormModal, { article: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["articles"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : articles.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No articles yet." })) : (_jsx("div", { className: "border border-border rounded-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 font-medium text-text-muted", children: "Title" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Status" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Created" }), _jsx("th", { className: "text-right p-3 font-medium text-text-muted", children: "Actions" })] }) }), _jsx("tbody", { children: articles.map((article) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-surface/50 transition-colors", children: [_jsx("td", { className: "p-3 text-text-primary font-medium", children: article.title }), _jsx("td", { className: "p-3 hidden md:table-cell", children: _jsx("span", { className: `inline-flex px-2 py-0.5 text-xs rounded-full ${article.published
                                                ? "bg-green-500/10 text-green-600"
                                                : "bg-yellow-500/10 text-yellow-600"}`, children: article.published ? "Published" : "Draft" }) }), _jsx("td", { className: "p-3 text-text-muted hidden lg:table-cell", children: new Date(article.createdAt).toLocaleDateString() }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => setEditing(article), className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete this article?"))
                                                            deleteMutation.mutate(article.id);
                                                    }, className: "p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, article.id))) })] }) })), meta && meta.pages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage((p) => p - 1), className: "px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors", children: "Previous" }), _jsxs("span", { className: "text-sm text-text-muted", children: ["Page ", page, " of ", meta.pages] }), _jsx("button", { disabled: page >= meta.pages, onClick: () => setPage((p) => p + 1), className: "px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors", children: "Next" })] }))] }));
}
function ArticleFormModal({ article, onClose, onSuccess, }) {
    const isEdit = !!article;
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(articleSchema),
        defaultValues: isEdit
            ? {
                ...article,
                excerpt: article.excerpt ?? "",
                coverImage: article.coverImage ?? "",
                tags: article.tags?.join(", ") ?? "",
                metaTitle: article.metaTitle ?? "",
                metaDesc: article.metaDesc ?? "",
            }
            : { published: false },
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                ...data,
                coverImage: data.coverImage || undefined,
                tags: data.tags
                    ? data.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [],
            };
            return isEdit
                ? apiClient.patch(`articles/${article.id}`, payload)
                : apiClient.post("articles", payload);
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Article" : "New Article" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(Field, { label: "Title", error: errors.title?.message, children: _jsx("input", { ...register("title"), className: "input-field" }) }), _jsx(Field, { label: "Slug", error: errors.slug?.message, children: _jsx("input", { ...register("slug"), className: "input-field" }) }), _jsx(Field, { label: "Content", error: errors.content?.message, children: _jsx("textarea", { ...register("content"), rows: 8, className: "input-field resize-y" }) }), _jsx(Field, { label: "Excerpt", children: _jsx("textarea", { ...register("excerpt"), rows: 2, className: "input-field resize-y" }) }), _jsx(Field, { label: "Cover Image URL", children: _jsx("input", { ...register("coverImage"), className: "input-field" }) }), _jsx(Field, { label: "Tags (comma separated)", children: _jsx("input", { ...register("tags"), className: "input-field" }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Meta Title", children: _jsx("input", { ...register("metaTitle"), className: "input-field" }) }), _jsx(Field, { label: "Meta Description", children: _jsx("input", { ...register("metaDesc"), className: "input-field" }) })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("published"), className: "w-4 h-4 accent-accent" }), _jsx("span", { className: "text-sm font-medium", children: "Published" })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: mutation.error?.response?.data?.error?.message ||
                                "Failed to save. Please try again." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Saving..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create Article"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { ImageUploadField } from "../../components/ImageUploadField";
import { Plus, Pencil, Trash2, X, Save, FolderKanban, Star, ExternalLink, } from "lucide-react";
const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    stack: z.string().optional(),
    tags: z.string().optional(),
    featured: z.boolean(),
    liveUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    coverImage: z.string().optional(),
    typographicMark: z.string().optional(),
    order: z.coerce.number().int().min(0),
    published: z.boolean(),
});
export function ProjectsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: () => apiClient.get("projects"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`projects/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
    });
    const projects = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Projects" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage your portfolio projects" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Project"] })] }), editing && (_jsx(ProjectFormModal, { project: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["projects"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : projects.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No projects yet." })) : (_jsx("div", { className: "border border-border rounded-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 font-medium text-text-muted w-16", children: "#" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted", children: "Name" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Stack" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Status" }), _jsx("th", { className: "text-right p-3 font-medium text-text-muted", children: "Actions" })] }) }), _jsx("tbody", { children: projects.map((p) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-surface/50 transition-colors", children: [_jsx("td", { className: "p-3 text-text-muted", children: p.order }), _jsx("td", { className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FolderKanban, { className: "w-4 h-4 text-text-muted shrink-0" }), _jsx("span", { className: "text-text-primary font-medium", children: p.name }), p.featured && (_jsx(Star, { className: "w-3.5 h-3.5 text-yellow-500 fill-yellow-500" }))] }) }), _jsx("td", { className: "p-3 hidden md:table-cell", children: _jsxs("div", { className: "flex flex-wrap gap-1", children: [(p.stack ?? []).slice(0, 3).map((s) => (_jsx("span", { className: "inline-flex px-1.5 py-0.5 text-xs rounded bg-surface text-text-muted", children: s }, s))), (p.stack ?? []).length > 3 && (_jsxs("span", { className: "text-xs text-text-muted", children: ["+", p.stack.length - 3] }))] }) }), _jsx("td", { className: "p-3 hidden lg:table-cell", children: _jsx("span", { className: `inline-flex px-2 py-0.5 text-xs rounded-full ${p.published
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : "bg-surface text-text-muted"}`, children: p.published ? "Published" : "Draft" }) }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [p.liveUrl && (_jsx("a", { href: p.liveUrl, target: "_blank", rel: "noopener noreferrer", className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm", children: _jsx(ExternalLink, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => setEditing(p), className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete this project?"))
                                                            deleteMutation.mutate(p.id);
                                                    }, className: "p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, p.id))) })] }) }))] }));
}
function ProjectFormModal({ project, onClose, onSuccess, }) {
    const isEdit = !!project;
    const { register, handleSubmit, watch, setValue, formState: { errors }, } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: isEdit
            ? {
                ...project,
                stack: (project.stack ?? []).join(", "),
                tags: (project.tags ?? []).join(", "),
                liveUrl: project.liveUrl ?? "",
                githubUrl: project.githubUrl ?? "",
                coverImage: project.coverImage ?? "",
                typographicMark: project.typographicMark ?? "",
            }
            : { featured: false, published: true, order: 0 },
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                ...data,
                stack: data.stack
                    ? data.stack
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : [],
                tags: data.tags
                    ? data.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [],
            };
            return isEdit
                ? apiClient.patch(`projects/${project.id}`, payload)
                : apiClient.post("projects", payload);
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Project" : "New Project" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Name", error: errors.name?.message, children: _jsx("input", { ...register("name"), className: "input-field" }) }), _jsx(Field, { label: "Slug", error: errors.slug?.message, children: _jsx("input", { ...register("slug"), className: "input-field" }) })] }), _jsx(Field, { label: "Description", error: errors.description?.message, children: _jsx("textarea", { ...register("description"), rows: 3, className: "input-field resize-y" }) }), _jsx(Field, { label: "Stack (comma-separated)", children: _jsx("input", { ...register("stack"), className: "input-field", placeholder: "React, TypeScript, Node.js" }) }), _jsx(Field, { label: "Tags (comma-separated)", children: _jsx("input", { ...register("tags"), className: "input-field", placeholder: "featured, fullstack" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Live URL", children: _jsx("input", { ...register("liveUrl"), className: "input-field" }) }), _jsx(Field, { label: "GitHub URL", children: _jsx("input", { ...register("githubUrl"), className: "input-field" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(ImageUploadField, { label: "Cover Image", value: watch("coverImage") || "", onChange: (url) => setValue("coverImage", url) }), _jsx(Field, { label: "Typographic Mark", children: _jsx("input", { ...register("typographicMark"), className: "input-field", placeholder: "e.g. H2O" }) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsx(Field, { label: "Order", children: _jsx("input", { type: "number", ...register("order"), className: "input-field" }) }), _jsxs("label", { className: "flex items-center gap-2 pt-6 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("featured"), className: "rounded" }), _jsx("span", { className: "text-sm text-text-primary", children: "Featured" })] }), _jsxs("label", { className: "flex items-center gap-2 pt-6 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("published"), className: "rounded" }), _jsx("span", { className: "text-sm text-text-primary", children: "Published" })] })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: mutation.error?.response?.data?.error?.message ||
                                "Failed to save." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Saving..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
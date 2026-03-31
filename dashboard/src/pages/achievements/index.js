import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Trophy } from "lucide-react";
const achievementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    date: z.string().optional(),
});
export function AchievementsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["achievements"],
        queryFn: () => apiClient.get("achievements"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`achievements/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["achievements"] }),
    });
    const achievements = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Achievements" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage your achievements and awards" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Achievement"] })] }), editing && (_jsx(AchievementFormModal, { achievement: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["achievements"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : achievements.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No achievements yet." })) : (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: achievements.map((item) => (_jsx("div", { className: "border border-border rounded-sm p-4 hover:bg-surface/50 transition-colors group", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Trophy, { className: "w-5 h-5 text-accent mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-text-primary", children: item.title }), item.description && (_jsx("p", { className: "text-sm text-text-muted mt-1", children: item.description })), item.date && (_jsx("p", { className: "text-xs text-text-muted mt-2", children: new Date(item.date).toLocaleDateString() }))] })] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => setEditing(item), className: "p-1 text-text-muted hover:text-text-primary rounded-sm", children: _jsx(Pencil, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => {
                                            if (confirm("Delete?"))
                                                deleteMutation.mutate(item.id);
                                        }, className: "p-1 text-text-muted hover:text-red-500 rounded-sm", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] }) }, item.id))) }))] }));
}
function AchievementFormModal({ achievement, onClose, onSuccess, }) {
    const isEdit = !!achievement;
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(achievementSchema),
        defaultValues: isEdit
            ? {
                ...achievement,
                description: achievement.description ?? "",
                date: achievement.date?.slice(0, 10) ?? "",
            }
            : {},
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                ...data,
                date: data.date ? new Date(data.date).toISOString() : undefined,
            };
            return isEdit
                ? apiClient.patch(`achievements/${achievement.id}`, payload)
                : apiClient.post("achievements", payload);
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-md p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Achievement" : "New Achievement" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(Field, { label: "Title", error: errors.title?.message, children: _jsx("input", { ...register("title"), className: "input-field" }) }), _jsx(Field, { label: "Description", children: _jsx("textarea", { ...register("description"), rows: 3, className: "input-field resize-y" }) }), _jsx(Field, { label: "Date", children: _jsx("input", { type: "date", ...register("date"), className: "input-field" }) }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: mutation.error?.response?.data?.error?.message ||
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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Cpu } from "lucide-react";
const CATEGORIES = [
    "FRONTEND",
    "BACKEND",
    "DATABASE",
    "DEVOPS",
    "THREED",
    "TOOLS",
    "STATE",
    "BLOCKCHAIN",
    "OTHER",
    "LANGUAGES",
];
const CATEGORY_LABELS = {
    FRONTEND: "Frontend",
    BACKEND: "Backend",
    DATABASE: "Database",
    DEVOPS: "DevOps",
    THREED: "3D & Creative",
    TOOLS: "Tools",
    STATE: "State Management",
    BLOCKCHAIN: "Blockchain & Web3",
    OTHER: "Other",
    LANGUAGES: "Programming Languages",
};
const skillSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.enum(CATEGORIES),
    order: z.coerce.number().int().min(0),
});
export function SkillsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["skills"],
        queryFn: () => apiClient.get("skills"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`skills/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
    });
    const skills = data?.data?.data ?? [];
    const grouped = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = skills.filter((s) => s.category === cat);
        return acc;
    }, {});
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Skills & Technologies" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage your tech stack displayed on the portfolio" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Skill"] })] }), editing && (_jsx(SkillFormModal, { skill: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["skills"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : skills.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No skills yet." })) : (_jsx("div", { className: "space-y-6", children: CATEGORIES.map((cat) => {
                    const items = grouped[cat];
                    if (!items || items.length === 0)
                        return null;
                    return (_jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-medium text-text-muted mb-3", children: [CATEGORY_LABELS[cat], " (", items.length, ")"] }), _jsx("div", { className: "flex flex-wrap gap-2", children: items.map((skill) => (_jsxs("div", { className: "group inline-flex items-center gap-1.5 border border-border rounded-sm px-3 py-1.5 hover:bg-surface/50 transition-colors", children: [_jsx(Cpu, { className: "w-3.5 h-3.5 text-text-muted" }), _jsx("span", { className: "text-sm text-text-primary", children: skill.name }), _jsxs("div", { className: "flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1", children: [_jsx("button", { onClick: () => setEditing(skill), className: "p-0.5 text-text-muted hover:text-text-primary rounded-sm", children: _jsx(Pencil, { className: "w-3 h-3" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete?"))
                                                            deleteMutation.mutate(skill.id);
                                                    }, className: "p-0.5 text-text-muted hover:text-red-500 rounded-sm", children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }, skill.id))) })] }, cat));
                }) }))] }));
}
function SkillFormModal({ skill, onClose, onSuccess, }) {
    const isEdit = !!skill;
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(skillSchema),
        defaultValues: isEdit ? skill : { category: "FRONTEND", order: 0 },
    });
    const mutation = useMutation({
        mutationFn: (data) => isEdit
            ? apiClient.patch(`skills/${skill.id}`, data)
            : apiClient.post("skills", data),
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-md p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Skill" : "New Skill" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(Field, { label: "Name", error: errors.name?.message, children: _jsx("input", { ...register("name"), className: "input-field" }) }), _jsx(Field, { label: "Category", error: errors.category?.message, children: _jsx("select", { ...register("category"), className: "input-field", children: CATEGORIES.map((c) => (_jsx("option", { value: c, children: CATEGORY_LABELS[c] }, c))) }) }), _jsx(Field, { label: "Order", children: _jsx("input", { type: "number", ...register("order"), className: "input-field" }) }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: "Failed to save." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Saving..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
const TIMELINE_TYPES = [
    "EDUCATION",
    "JOB",
    "FREELANCE",
    "VOLUNTEER",
    "ACHIEVEMENT",
    "PLAN",
];
const careerSchema = z.object({
    type: z.enum(TIMELINE_TYPES),
    title: z.string().min(1, "Title is required"),
    organisation: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    order: z.coerce.number().int().min(0),
});
export function CareerPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["career"],
        queryFn: () => apiClient.get("career"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`career/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["career"] }),
    });
    const entries = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Career Timeline" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage education, jobs, and milestones" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Entry"] })] }), editing && (_jsx(CareerFormModal, { entry: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["career"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : entries.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No career entries yet." })) : (_jsx("div", { className: "border border-border rounded-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 font-medium text-text-muted w-16", children: "#" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted", children: "Title" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Type" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Organisation" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden lg:table-cell", children: "Period" }), _jsx("th", { className: "text-right p-3 font-medium text-text-muted", children: "Actions" })] }) }), _jsx("tbody", { children: entries.map((entry) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-surface/50 transition-colors", children: [_jsx("td", { className: "p-3 text-text-muted", children: entry.order }), _jsx("td", { className: "p-3 text-text-primary font-medium", children: entry.title }), _jsx("td", { className: "p-3 hidden md:table-cell", children: _jsx("span", { className: "inline-flex px-2 py-0.5 text-xs rounded-full bg-surface text-text-muted", children: entry.type }) }), _jsx("td", { className: "p-3 text-text-muted hidden lg:table-cell", children: entry.organisation || "—" }), _jsxs("td", { className: "p-3 text-text-muted hidden lg:table-cell", children: [new Date(entry.startDate).toLocaleDateString(), " \u2013", " ", entry.current
                                                ? "Present"
                                                : entry.endDate
                                                    ? new Date(entry.endDate).toLocaleDateString()
                                                    : "—"] }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => setEditing(entry), className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete this entry?"))
                                                            deleteMutation.mutate(entry.id);
                                                    }, className: "p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, entry.id))) })] }) }))] }));
}
function CareerFormModal({ entry, onClose, onSuccess, }) {
    const isEdit = !!entry;
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(careerSchema),
        defaultValues: isEdit
            ? {
                ...entry,
                organisation: entry.organisation ?? "",
                description: entry.description ?? "",
                startDate: entry.startDate?.slice(0, 10),
                endDate: entry.endDate?.slice(0, 10) ?? "",
            }
            : { type: "JOB", current: false, order: 0 },
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = {
                ...data,
                startDate: new Date(data.startDate).toISOString(),
                endDate: data.endDate
                    ? new Date(data.endDate).toISOString()
                    : undefined,
            };
            return isEdit
                ? apiClient.patch(`career/${entry.id}`, payload)
                : apiClient.post("career", payload);
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Entry" : "New Entry" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(Field, { label: "Type", error: errors.type?.message, children: _jsx("select", { ...register("type"), className: "input-field", children: TIMELINE_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) }) }), _jsx(Field, { label: "Title", error: errors.title?.message, children: _jsx("input", { ...register("title"), className: "input-field" }) }), _jsx(Field, { label: "Organisation", children: _jsx("input", { ...register("organisation"), className: "input-field" }) }), _jsx(Field, { label: "Description", children: _jsx("textarea", { ...register("description"), rows: 3, className: "input-field resize-y" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Start Date", error: errors.startDate?.message, children: _jsx("input", { type: "date", ...register("startDate"), className: "input-field" }) }), _jsx(Field, { label: "End Date", children: _jsx("input", { type: "date", ...register("endDate"), className: "input-field" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Order", error: errors.order?.message, children: _jsx("input", { type: "number", ...register("order"), className: "input-field" }) }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer pt-7", children: [_jsx("input", { type: "checkbox", ...register("current"), className: "w-4 h-4 accent-accent" }), _jsx("span", { className: "text-sm font-medium", children: "Currently here" })] })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: mutation.error?.response?.data?.error?.message ||
                                "Failed to save." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Saving..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create Entry"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
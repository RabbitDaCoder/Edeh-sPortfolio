import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Quote } from "lucide-react";
const testimonialSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    quote: z.string().min(1, "Quote is required"),
    order: z.coerce.number().int().min(0),
    published: z.boolean(),
});
export function TestimonialsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["testimonials"],
        queryFn: () => apiClient.get("testimonials"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`testimonials/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
    });
    const testimonials = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Testimonials" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage client and colleague testimonials" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Testimonial"] })] }), editing && (_jsx(TestimonialFormModal, { testimonial: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["testimonials"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-24 bg-surface animate-pulse rounded-sm" }, i))) })) : testimonials.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No testimonials yet." })) : (_jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: testimonials.map((t) => (_jsxs("div", { className: "border border-border rounded-sm p-5 hover:bg-surface/50 transition-colors group", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx(Quote, { className: "w-5 h-5 text-text-muted/40" }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => setEditing(t), className: "p-1 text-text-muted hover:text-text-primary rounded-sm", children: _jsx(Pencil, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => {
                                                if (confirm("Delete?"))
                                                    deleteMutation.mutate(t.id);
                                            }, className: "p-1 text-text-muted hover:text-red-500 rounded-sm", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] })] }), _jsxs("p", { className: "text-sm text-text-primary leading-relaxed mb-4 line-clamp-4", children: ["\"", t.quote, "\""] }), _jsxs("div", { className: "border-t border-border pt-3", children: [_jsx("p", { className: "text-sm font-medium text-text-primary", children: t.name }), _jsxs("p", { className: "text-xs text-text-muted", children: [t.role, " at ", t.company] })] }), !t.published && (_jsx("span", { className: "inline-flex mt-2 px-2 py-0.5 text-xs rounded-full bg-surface text-text-muted", children: "Draft" }))] }, t.id))) }))] }));
}
function TestimonialFormModal({ testimonial, onClose, onSuccess, }) {
    const isEdit = !!testimonial;
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(testimonialSchema),
        defaultValues: isEdit ? testimonial : { published: true, order: 0 },
    });
    const mutation = useMutation({
        mutationFn: (data) => isEdit
            ? apiClient.patch(`testimonials/${testimonial.id}`, data)
            : apiClient.post("testimonials", data),
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Testimonial" : "New Testimonial" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Name", error: errors.name?.message, children: _jsx("input", { ...register("name"), className: "input-field" }) }), _jsx(Field, { label: "Company", error: errors.company?.message, children: _jsx("input", { ...register("company"), className: "input-field" }) })] }), _jsx(Field, { label: "Role", error: errors.role?.message, children: _jsx("input", { ...register("role"), className: "input-field" }) }), _jsx(Field, { label: "Quote", error: errors.quote?.message, children: _jsx("textarea", { ...register("quote"), rows: 4, className: "input-field resize-y" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Order", children: _jsx("input", { type: "number", ...register("order"), className: "input-field" }) }), _jsxs("label", { className: "flex items-center gap-2 pt-6 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("published"), className: "rounded" }), _jsx("span", { className: "text-sm text-text-primary", children: "Published" })] })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: "Failed to save." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Saving..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
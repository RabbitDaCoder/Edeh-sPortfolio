import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { ImageUploadField } from "../../components/ImageUploadField";
import { Plus, Pencil, Trash2, X, Save, Image } from "lucide-react";
const polaroidSchema = z.object({
    src: z.string().optional(),
    alt: z.string().min(1, "Alt text is required"),
    caption: z.string().min(1, "Caption is required"),
    rotation: z.coerce.number().min(-90).max(90),
    order: z.coerce.number().int().min(0),
    published: z.boolean(),
});
export function PolaroidsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["polaroids"],
        queryFn: () => apiClient.get("polaroids"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`polaroids/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["polaroids"] }),
    });
    const polaroids = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Polaroid Photos" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage hero section polaroid carousel photos" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Polaroid"] })] }), editing && (_jsx(PolaroidFormModal, { polaroid: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["polaroids"] });
                } })), isLoading ? (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", children: [1, 2, 3, 4, 5].map((i) => (_jsx("div", { className: "aspect-square bg-surface animate-pulse rounded-sm" }, i))) })) : polaroids.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No polaroids yet. Add your first hero photo." })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", children: polaroids.map((p) => (_jsxs("div", { className: "group relative border border-border rounded-sm overflow-hidden bg-surface", children: [_jsxs("div", { className: "aspect-square bg-[#1A1A1A] relative", children: [p.src ? (_jsx("img", { src: p.src, alt: p.alt, className: "w-full h-full object-cover", style: { filter: "grayscale(100%) contrast(1.05)" } })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx(Image, { className: "w-8 h-8 text-neutral-600" }) })), _jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [_jsx("button", { onClick: () => setEditing(p), className: "p-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors", children: _jsx(Pencil, { className: "w-4 h-4 text-white" }) }), _jsx("button", { onClick: () => {
                                                if (confirm("Delete this polaroid?"))
                                                    deleteMutation.mutate(p.id);
                                            }, className: "p-2 bg-white/10 hover:bg-red-500/60 rounded-sm transition-colors", children: _jsx(Trash2, { className: "w-4 h-4 text-white" }) })] })] }), _jsxs("div", { className: "p-3 space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-text-primary truncate", style: { fontFamily: '"Caveat", cursive' }, children: p.caption }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-xs text-text-muted", children: ["#", p.order, " \u00B7 ", p.rotation > 0 ? "+" : "", p.rotation, "\u00B0"] }), _jsx("span", { className: `inline-flex px-1.5 py-0.5 text-[10px] rounded-full ${p.published
                                                ? "bg-emerald-500/10 text-emerald-600"
                                                : "bg-surface text-text-muted"}`, children: p.published ? "Live" : "Draft" })] })] })] }, p.id))) }))] }));
}
function PolaroidFormModal({ polaroid, onClose, onSuccess, }) {
    const isEdit = !!polaroid;
    const { register, handleSubmit, watch, setValue, formState: { errors }, } = useForm({
        resolver: zodResolver(polaroidSchema),
        defaultValues: isEdit
            ? {
                ...polaroid,
                src: polaroid.src ?? "",
            }
            : {
                src: "",
                alt: "",
                caption: "",
                rotation: 0,
                order: 0,
                published: true,
            },
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const payload = { ...data, src: data.src || "" };
            return isEdit
                ? apiClient.patch(`polaroids/${polaroid.id}`, payload)
                : apiClient.post("polaroids", payload);
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Polaroid" : "New Polaroid" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(ImageUploadField, { label: "Photo", value: watch("src") || "", onChange: (url) => setValue("src", url) }), _jsx(Field, { label: "Alt Text", error: errors.alt?.message, children: _jsx("input", { ...register("alt"), className: "input-field", placeholder: "Descriptive text for accessibility" }) }), _jsx(Field, { label: "Caption", error: errors.caption?.message, children: _jsx("input", { ...register("caption"), className: "input-field", placeholder: "Short handwritten-style label" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Field, { label: "Rotation (degrees)", error: errors.rotation?.message, children: _jsx("input", { type: "number", step: "0.1", ...register("rotation"), className: "input-field", placeholder: "-4.2" }) }), _jsx(Field, { label: "Order", error: errors.order?.message, children: _jsx("input", { type: "number", ...register("order"), className: "input-field" }) })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("published"), className: "rounded" }), _jsx("span", { className: "text-sm text-text-primary", children: "Published" })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: mutation.error?.response?.data?.error?.message ||
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
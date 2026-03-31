import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Download, Upload } from "lucide-react";
const downloadSchema = z.object({
    label: z.string().min(1, "Label is required"),
    version: z.string().optional(),
    active: z.boolean(),
});
export function DownloadsPage() {
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["downloads"],
        queryFn: () => apiClient.get("downloads"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiClient.delete(`downloads/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["downloads"] }),
    });
    const downloads = data?.data?.data ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Downloads" }), _jsx("p", { className: "text-sm text-text-muted", children: "Manage downloadable files" })] }), _jsxs("button", { onClick: () => setEditing("new"), className: "inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity", children: [_jsx(Plus, { className: "w-4 h-4" }), " New Download"] })] }), editing && (_jsx(DownloadFormModal, { download: editing === "new" ? null : editing, onClose: () => setEditing(null), onSuccess: () => {
                    setEditing(null);
                    queryClient.invalidateQueries({ queryKey: ["downloads"] });
                } })), isLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 bg-surface animate-pulse rounded-sm" }, i))) })) : downloads.length === 0 ? (_jsx("div", { className: "text-center py-12 text-text-muted", children: "No downloads yet." })) : (_jsx("div", { className: "border border-border rounded-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-3 font-medium text-text-muted", children: "Label" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Version" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Downloads" }), _jsx("th", { className: "text-left p-3 font-medium text-text-muted hidden md:table-cell", children: "Status" }), _jsx("th", { className: "text-right p-3 font-medium text-text-muted", children: "Actions" })] }) }), _jsx("tbody", { children: downloads.map((dl) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-surface/50 transition-colors", children: [_jsx("td", { className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4 text-accent shrink-0" }), _jsx("span", { className: "text-text-primary font-medium", children: dl.label })] }) }), _jsx("td", { className: "p-3 text-text-muted hidden md:table-cell", children: dl.version || "—" }), _jsx("td", { className: "p-3 text-text-muted hidden md:table-cell", children: dl.downloads }), _jsx("td", { className: "p-3 hidden md:table-cell", children: _jsx("span", { className: `inline-flex px-2 py-0.5 text-xs rounded-full ${dl.active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`, children: dl.active ? "Active" : "Inactive" }) }), _jsx("td", { className: "p-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx("button", { onClick: () => setEditing(dl), className: "p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors", children: _jsx(Pencil, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => {
                                                        if (confirm("Delete?"))
                                                            deleteMutation.mutate(dl.id);
                                                    }, className: "p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, dl.id))) })] }) }))] }));
}
function DownloadFormModal({ download, onClose, onSuccess, }) {
    const isEdit = !!download;
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(downloadSchema),
        defaultValues: isEdit
            ? {
                label: download.label,
                version: download.version || "",
                active: download.active,
            }
            : { active: true },
    });
    const mutation = useMutation({
        mutationFn: (data) => {
            const formData = new FormData();
            formData.append("label", data.label);
            formData.append("active", String(data.active));
            if (data.version)
                formData.append("version", data.version);
            if (selectedFile)
                formData.append("file", selectedFile);
            return isEdit
                ? apiClient.patch(`downloads/${download.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                : apiClient.post("downloads", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
        },
        onSuccess,
    });
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-background border border-border rounded-sm shadow-xl w-full max-w-md p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-lg font-display font-semibold", children: isEdit ? "Edit Download" : "New Download" }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-surface rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-4", children: [_jsx(Field, { label: "Label", error: errors.label?.message, children: _jsx("input", { ...register("label"), className: "input-field", placeholder: "Resume PDF" }) }), _jsxs(Field, { label: "File", children: [_jsxs("div", { onClick: () => fileInputRef.current?.click(), className: "border-2 border-dashed border-border rounded-sm p-4 text-center cursor-pointer hover:border-accent/50 hover:bg-surface/30 transition-colors", children: [_jsx("input", { ref: fileInputRef, type: "file", className: "hidden", accept: ".pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx", onChange: (e) => {
                                                const file = e.target.files?.[0];
                                                if (file)
                                                    setSelectedFile(file);
                                            } }), selectedFile ? (_jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-accent", children: [_jsx(Upload, { className: "w-4 h-4" }), _jsx("span", { className: "font-medium", children: selectedFile.name }), _jsxs("span", { className: "text-text-muted", children: ["(", (selectedFile.size / 1024 / 1024).toFixed(2), " MB)"] })] })) : isEdit ? (_jsx("p", { className: "text-sm text-text-muted", children: "Click to upload a new file (optional)" })) : (_jsxs("div", { className: "space-y-1", children: [_jsx(Upload, { className: "w-6 h-6 mx-auto text-text-muted" }), _jsx("p", { className: "text-sm text-text-muted", children: "Click to select a file" }), _jsx("p", { className: "text-xs text-text-muted/60", children: "PDF, DOC, ZIP up to 20MB" })] }))] }), !isEdit && !selectedFile && (_jsx("p", { className: "text-xs text-text-muted mt-1", children: "File is required for new downloads" }))] }), _jsx(Field, { label: "Version", children: _jsx("input", { ...register("version"), className: "input-field", placeholder: "v1.0" }) }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("active"), className: "w-4 h-4 accent-accent" }), _jsx("span", { className: "text-sm font-medium", children: "Active" })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: "Failed to save." })), _jsxs("button", { type: "submit", disabled: mutation.isPending || (!isEdit && !selectedFile), className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), " ", mutation.isPending
                                    ? "Uploading..."
                                    : isEdit
                                        ? "Save Changes"
                                        : "Create Download"] })] })] }) }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
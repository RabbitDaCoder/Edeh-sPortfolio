import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { apiClient } from "../lib/axios";
export function ImageUploadField({ value, onChange, label = "Cover Image", error, }) {
    const [mode, setMode] = useState(value ? "url" : "upload");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);
    const handleFileSelect = async (file) => {
        if (!file.type.startsWith("image/")) {
            setUploadError("Please select an image file");
            return;
        }
        setUploadError("");
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await apiClient.post("upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const url = res.data?.data?.url;
            if (url)
                onChange(url);
        }
        catch {
            setUploadError("Upload failed. Try again or use a URL instead.");
        }
        finally {
            setUploading(false);
        }
    };
    return (_jsxs("div", { children: [label && (_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label })), _jsxs("div", { className: "flex gap-1 mb-2", children: [_jsxs("button", { type: "button", onClick: () => setMode("upload"), className: `flex items-center gap-1.5 px-3 py-1 text-xs rounded-sm transition-colors ${mode === "upload"
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-text-muted hover:text-text-primary"}`, children: [_jsx(Upload, { className: "w-3 h-3" }), " Upload"] }), _jsxs("button", { type: "button", onClick: () => setMode("url"), className: `flex items-center gap-1.5 px-3 py-1 text-xs rounded-sm transition-colors ${mode === "url"
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-text-muted hover:text-text-primary"}`, children: [_jsx(LinkIcon, { className: "w-3 h-3" }), " URL"] })] }), mode === "url" ? (_jsx("input", { type: "text", value: value, onChange: (e) => onChange(e.target.value), className: "input-field", placeholder: "https://..." })) : (_jsxs("div", { onClick: () => !uploading && fileInputRef.current?.click(), className: `border-2 border-dashed rounded-sm p-3 text-center transition-colors ${uploading
                    ? "border-accent/40 bg-accent/5 cursor-wait"
                    : "border-border hover:border-accent/50 hover:bg-surface/30 cursor-pointer"}`, children: [_jsx("input", { ref: fileInputRef, type: "file", className: "hidden", accept: "image/*", onChange: (e) => {
                            const file = e.target.files?.[0];
                            if (file)
                                handleFileSelect(file);
                            e.target.value = "";
                        } }), uploading ? (_jsx("p", { className: "text-sm text-accent animate-pulse", children: "Uploading..." })) : (_jsxs("div", { className: "space-y-1", children: [_jsx(Upload, { className: "w-5 h-5 mx-auto text-text-muted" }), _jsx("p", { className: "text-xs text-text-muted", children: "Click to upload an image" })] }))] })), value && (_jsxs("div", { className: "mt-2 relative inline-block", children: [_jsx("img", { src: value, alt: "Preview", className: "h-16 w-auto rounded-sm border border-border object-cover", onError: (e) => {
                            e.target.style.display = "none";
                        } }), _jsx("button", { type: "button", onClick: () => onChange(""), className: "absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors", children: _jsx(X, { className: "w-3 h-3" }) })] })), (error || uploadError) && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: error || uploadError }))] }));
}
//# sourceMappingURL=ImageUploadField.js.map
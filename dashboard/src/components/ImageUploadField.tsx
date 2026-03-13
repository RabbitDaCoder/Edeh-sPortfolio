import { useState, useRef } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { apiClient } from "../lib/axios";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Cover Image",
  error,
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<"url" | "upload">(value ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
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
      if (url) onChange(url);
    } catch {
      setUploadError("Upload failed. Try again or use a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}

      {/* Toggle tabs */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-sm transition-colors ${
            mode === "upload"
              ? "bg-accent/10 text-accent font-medium"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-sm transition-colors ${
            mode === "url"
              ? "bg-accent/10 text-accent font-medium"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          <LinkIcon className="w-3 h-3" /> URL
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
          placeholder="https://..."
        />
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-3 text-center transition-colors ${
            uploading
              ? "border-accent/40 bg-accent/5 cursor-wait"
              : "border-border hover:border-accent/50 hover:bg-surface/30 cursor-pointer"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />
          {uploading ? (
            <p className="text-sm text-accent animate-pulse">Uploading...</p>
          ) : (
            <div className="space-y-1">
              <Upload className="w-5 h-5 mx-auto text-text-muted" />
              <p className="text-xs text-text-muted">
                Click to upload an image
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-16 w-auto rounded-sm border border-border object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-xs text-red-500 mt-1">{error || uploadError}</p>
      )}
    </div>
  );
}

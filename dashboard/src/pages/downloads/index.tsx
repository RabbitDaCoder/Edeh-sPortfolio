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

type DownloadForm = z.infer<typeof downloadSchema>;

export function DownloadsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["downloads"],
    queryFn: () => apiClient.get("downloads"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`downloads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["downloads"] }),
  });

  const downloads = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Downloads
          </h1>
          <p className="text-sm text-text-muted">Manage downloadable files</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Download
        </button>
      </div>

      {editing && (
        <DownloadFormModal
          download={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["downloads"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No downloads yet.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted">
                  Label
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Version
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Downloads
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Status
                </th>
                <th className="text-right p-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((dl: any) => (
                <tr
                  key={dl.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-text-primary font-medium">
                        {dl.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-text-muted hidden md:table-cell">
                    {dl.version || "—"}
                  </td>
                  <td className="p-3 text-text-muted hidden md:table-cell">
                    {dl.downloads}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${dl.active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                    >
                      {dl.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(dl)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete?")) deleteMutation.mutate(dl.id);
                        }}
                        className="p-1.5 text-text-muted hover:text-red-500 rounded-sm hover:bg-surface transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DownloadFormModal({
  download,
  onClose,
  onSuccess,
}: {
  download: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!download;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DownloadForm>({
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
    mutationFn: (data: DownloadForm) => {
      const formData = new FormData();
      formData.append("label", data.label);
      formData.append("active", String(data.active));
      if (data.version) formData.append("version", data.version);
      if (selectedFile) formData.append("file", selectedFile);

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            {isEdit ? "Edit Download" : "New Download"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <Field label="Label" error={errors.label?.message}>
            <input
              {...register("label")}
              className="input-field"
              placeholder="Resume PDF"
            />
          </Field>
          <Field label="File">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-sm p-4 text-center cursor-pointer hover:border-accent/50 hover:bg-surface/30 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.rar,.txt,.xlsx,.pptx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2 text-sm text-accent">
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="text-text-muted">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : isEdit ? (
                <p className="text-sm text-text-muted">
                  Click to upload a new file (optional)
                </p>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-text-muted" />
                  <p className="text-sm text-text-muted">
                    Click to select a file
                  </p>
                  <p className="text-xs text-text-muted/60">
                    PDF, DOC, ZIP up to 20MB
                  </p>
                </div>
              )}
            </div>
            {!isEdit && !selectedFile && (
              <p className="text-xs text-text-muted mt-1">
                File is required for new downloads
              </p>
            )}
          </Field>
          <Field label="Version">
            <input
              {...register("version")}
              className="input-field"
              placeholder="v1.0"
            />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("active")}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
          {mutation.isError && (
            <p className="text-sm text-red-500">Failed to save.</p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending || (!isEdit && !selectedFile)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {mutation.isPending
              ? "Uploading..."
              : isEdit
                ? "Save Changes"
                : "Create Download"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

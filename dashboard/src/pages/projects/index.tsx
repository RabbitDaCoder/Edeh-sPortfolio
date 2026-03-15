import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { ImageUploadField } from "../../components/ImageUploadField";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  FolderKanban,
  Star,
  ExternalLink,
} from "lucide-react";

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

type ProjectForm = z.infer<typeof projectSchema>;

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.get("projects"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const projects = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Projects
          </h1>
          <p className="text-sm text-text-muted">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {editing && (
        <ProjectFormModal
          project={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["projects"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No projects yet.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted w-16">
                  #
                </th>
                <th className="text-left p-3 font-medium text-text-muted">
                  Name
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Stack
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden lg:table-cell">
                  Status
                </th>
                <th className="text-right p-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 text-text-muted">{p.order}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-text-muted shrink-0" />
                      <span className="text-text-primary font-medium">
                        {p.name}
                      </span>
                      {p.featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(p.stack ?? []).slice(0, 3).map((s: string) => (
                        <span
                          key={s}
                          className="inline-flex px-1.5 py-0.5 text-xs rounded bg-surface text-text-muted"
                        >
                          {s}
                        </span>
                      ))}
                      {(p.stack ?? []).length > 3 && (
                        <span className="text-xs text-text-muted">
                          +{p.stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                        p.published
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-surface text-text-muted"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-text-muted hover:text-text-primary rounded-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setEditing(p)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this project?"))
                            deleteMutation.mutate(p.id);
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

function ProjectFormModal({
  project,
  onClose,
  onSuccess,
}: {
  project: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!project;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectForm>({
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
    mutationFn: (data: ProjectForm) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            {isEdit ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" error={errors.name?.message}>
              <input {...register("name")} className="input-field" />
            </Field>
            <Field label="Slug" error={errors.slug?.message}>
              <input {...register("slug")} className="input-field" />
            </Field>
          </div>
          <Field label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={3}
              className="input-field resize-y"
            />
          </Field>
          <Field label="Stack (comma-separated)">
            <input
              {...register("stack")}
              className="input-field"
              placeholder="React, TypeScript, Node.js"
            />
          </Field>
          <Field label="Tags (comma-separated)">
            <input
              {...register("tags")}
              className="input-field"
              placeholder="featured, fullstack"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL">
              <input {...register("liveUrl")} className="input-field" />
            </Field>
            <Field label="GitHub URL">
              <input {...register("githubUrl")} className="input-field" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              label="Cover Image"
              value={watch("coverImage") || ""}
              onChange={(url) => setValue("coverImage", url)}
            />
            <Field label="Typographic Mark">
              <input
                {...register("typographicMark")}
                className="input-field"
                placeholder="e.g. H2O"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Order">
              <input
                type="number"
                {...register("order")}
                className="input-field"
              />
            </Field>
            <label className="flex items-center gap-2 pt-6 cursor-pointer">
              <input
                type="checkbox"
                {...register("featured")}
                className="rounded"
              />
              <span className="text-sm text-text-primary">Featured</span>
            </label>
            <label className="flex items-center gap-2 pt-6 cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="rounded"
              />
              <span className="text-sm text-text-primary">Published</span>
            </label>
          </div>
          {mutation.isError && (
            <p className="text-sm text-red-500">
              {(mutation.error as any)?.response?.data?.error?.message ||
                "Failed to save."}
            </p>
          )}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{" "}
            {mutation.isPending
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create"}
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

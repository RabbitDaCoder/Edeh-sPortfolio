import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  published: z.boolean(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type ArticleForm = z.infer<typeof articleSchema>;

export function ArticleListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<any>(null); // null = closed, 'new' = create, object = edit

  const { data, isLoading } = useQuery({
    queryKey: ["articles", page],
    queryFn: () => apiClient.get(`articles?page=${page}&limit=10`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`articles/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  const articles = data?.data?.data?.data ?? [];
  const meta = data?.data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Articles
          </h1>
          <p className="text-sm text-text-muted">Manage your articles</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {editing && (
        <ArticleFormModal
          article={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["articles"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No articles yet.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted">
                  Title
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden lg:table-cell">
                  Created
                </th>
                <th className="text-right p-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any) => (
                <tr
                  key={article.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 text-text-primary font-medium">
                    {article.title}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                        article.published
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-text-muted hidden lg:table-cell">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(article)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this article?"))
                            deleteMutation.mutate(article.id);
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

      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ArticleFormModal({
  article,
  onClose,
  onSuccess,
}: {
  article: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!article;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: isEdit
      ? {
          ...article,
          excerpt: article.excerpt ?? "",
          coverImage: article.coverImage ?? "",
          tags: article.tags?.join(", ") ?? "",
          metaTitle: article.metaTitle ?? "",
          metaDesc: article.metaDesc ?? "",
        }
      : { published: false },
  });

  const mutation = useMutation({
    mutationFn: (data: ArticleForm) => {
      const payload = {
        ...data,
        coverImage: data.coverImage || undefined,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      return isEdit
        ? apiClient.patch(`articles/${article.id}`, payload)
        : apiClient.post("articles", payload);
    },
    onSuccess,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            {isEdit ? "Edit Article" : "New Article"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <Field label="Title" error={errors.title?.message}>
            <input {...register("title")} className="input-field" />
          </Field>
          <Field label="Slug" error={errors.slug?.message}>
            <input {...register("slug")} className="input-field" />
          </Field>
          <Field label="Content" error={errors.content?.message}>
            <textarea
              {...register("content")}
              rows={8}
              className="input-field resize-y"
            />
          </Field>
          <Field label="Excerpt">
            <textarea
              {...register("excerpt")}
              rows={2}
              className="input-field resize-y"
            />
          </Field>
          <Field label="Cover Image URL">
            <input {...register("coverImage")} className="input-field" />
          </Field>
          <Field label="Tags (comma separated)">
            <input {...register("tags")} className="input-field" />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Meta Title">
              <input {...register("metaTitle")} className="input-field" />
            </Field>
            <Field label="Meta Description">
              <input {...register("metaDesc")} className="input-field" />
            </Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
          {mutation.isError && (
            <p className="text-sm text-red-500">
              {(mutation.error as any)?.response?.data?.error?.message ||
                "Failed to save. Please try again."}
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
                : "Create Article"}
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

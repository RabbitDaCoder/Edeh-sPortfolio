import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { ImageUploadField } from "../../components/ImageUploadField";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  coverImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be positive"),
  fileUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
});

type BookForm = z.infer<typeof bookSchema>;

export function BooksPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["books", page],
    queryFn: () => apiClient.get(`books?page=${page}&limit=10`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`books/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });

  const books = data?.data?.data?.data ?? [];
  const meta = data?.data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Books
          </h1>
          <p className="text-sm text-text-muted">Manage your book listings</p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Book
        </button>
      </div>

      {editing && (
        <BookFormModal
          book={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["books"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12 text-text-muted">No books yet.</div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted">
                  Title
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Price
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
              {books.map((book: any) => (
                <tr
                  key={book.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 text-text-primary font-medium">
                    {book.title}
                  </td>
                  <td className="p-3 text-text-muted hidden md:table-cell">
                    ${Number(book.price).toFixed(2)}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-full ${book.published ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}
                    >
                      {book.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(book)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this book?"))
                            deleteMutation.mutate(book.id);
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

function BookFormModal({
  book,
  onClose,
  onSuccess,
}: {
  book: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!book;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
    defaultValues: isEdit
      ? {
          ...book,
          price: Number(book.price),
          coverImage: book.coverImage ?? "",
          fileUrl: book.fileUrl ?? "",
        }
      : { published: false, price: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: BookForm) => {
      const payload = {
        ...data,
        coverImage: data.coverImage || undefined,
        fileUrl: data.fileUrl || undefined,
      };
      return isEdit
        ? apiClient.patch(`books/${book.id}`, payload)
        : apiClient.post("books", payload);
    },
    onSuccess,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            {isEdit ? "Edit Book" : "New Book"}
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
          <Field label="Description" error={errors.description?.message}>
            <textarea
              {...register("description")}
              rows={4}
              className="input-field resize-y"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price ($)" error={errors.price?.message}>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className="input-field"
              />
            </Field>
            <Field label="File URL" error={errors.fileUrl?.message}>
              <input
                {...register("fileUrl")}
                className="input-field"
                placeholder="https://..."
              />
            </Field>
          </div>
          <ImageUploadField
            label="Cover Image"
            value={watch("coverImage") || ""}
            onChange={(url) => setValue("coverImage", url)}
            error={errors.coverImage?.message}
          />
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
          {mutation.isError && (
            <p className="text-sm text-red-500">Failed to save.</p>
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
                : "Create Book"}
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

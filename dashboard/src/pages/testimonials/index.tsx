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

type TestimonialForm = z.infer<typeof testimonialSchema>;

export function TestimonialsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => apiClient.get("testimonials"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`testimonials/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testimonials"] }),
  });

  const testimonials = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Testimonials
          </h1>
          <p className="text-sm text-text-muted">
            Manage client and colleague testimonials
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Testimonial
        </button>
      </div>

      {editing && (
        <TestimonialFormModal
          testimonial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No testimonials yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <div
              key={t.id}
              className="border border-border rounded-sm p-5 hover:bg-surface/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <Quote className="w-5 h-5 text-text-muted/40" />
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(t)}
                    className="p-1 text-text-muted hover:text-text-primary rounded-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete?")) deleteMutation.mutate(t.id);
                    }}
                    className="p-1 text-text-muted hover:text-red-500 rounded-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-primary leading-relaxed mb-4 line-clamp-4">
                "{t.quote}"
              </p>
              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium text-text-primary">
                  {t.name}
                </p>
                <p className="text-xs text-text-muted">
                  {t.role} at {t.company}
                </p>
              </div>
              {!t.published && (
                <span className="inline-flex mt-2 px-2 py-0.5 text-xs rounded-full bg-surface text-text-muted">
                  Draft
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialFormModal({
  testimonial,
  onClose,
  onSuccess,
}: {
  testimonial: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!testimonial;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: isEdit ? testimonial : { published: true, order: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: TestimonialForm) =>
      isEdit
        ? apiClient.patch(`testimonials/${testimonial.id}`, data)
        : apiClient.post("testimonials", data),
    onSuccess,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-display font-semibold">
            {isEdit ? "Edit Testimonial" : "New Testimonial"}
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
            <Field label="Company" error={errors.company?.message}>
              <input {...register("company")} className="input-field" />
            </Field>
          </div>
          <Field label="Role" error={errors.role?.message}>
            <input {...register("role")} className="input-field" />
          </Field>
          <Field label="Quote" error={errors.quote?.message}>
            <textarea
              {...register("quote")}
              rows={4}
              className="input-field resize-y"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
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
                {...register("published")}
                className="rounded"
              />
              <span className="text-sm text-text-primary">Published</span>
            </label>
          </div>
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

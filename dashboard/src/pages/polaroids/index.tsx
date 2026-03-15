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

type PolaroidForm = z.infer<typeof polaroidSchema>;

export function PolaroidsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["polaroids"],
    queryFn: () => apiClient.get("polaroids"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`polaroids/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["polaroids"] }),
  });

  const polaroids = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Polaroid Photos
          </h1>
          <p className="text-sm text-text-muted">
            Manage hero section polaroid carousel photos
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Polaroid
        </button>
      </div>

      {editing && (
        <PolaroidFormModal
          polaroid={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["polaroids"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-square bg-surface animate-pulse rounded-sm"
            />
          ))}
        </div>
      ) : polaroids.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No polaroids yet. Add your first hero photo.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {polaroids.map((p: any) => (
            <div
              key={p.id}
              className="group relative border border-border rounded-sm overflow-hidden bg-surface"
            >
              {/* Photo preview */}
              <div className="aspect-square bg-[#1A1A1A] relative">
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-neutral-600" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-sm transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this polaroid?"))
                        deleteMutation.mutate(p.id);
                    }}
                    className="p-2 bg-white/10 hover:bg-red-500/60 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3 space-y-1">
                <p
                  className="text-sm font-medium text-text-primary truncate"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  {p.caption}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    #{p.order} · {p.rotation > 0 ? "+" : ""}
                    {p.rotation}°
                  </span>
                  <span
                    className={`inline-flex px-1.5 py-0.5 text-[10px] rounded-full ${
                      p.published
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-surface text-text-muted"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PolaroidFormModal({
  polaroid,
  onClose,
  onSuccess,
}: {
  polaroid: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!polaroid;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PolaroidForm>({
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
    mutationFn: (data: PolaroidForm) => {
      const payload = { ...data, src: data.src || "" };
      return isEdit
        ? apiClient.patch(`polaroids/${polaroid.id}`, payload)
        : apiClient.post("polaroids", payload);
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
            {isEdit ? "Edit Polaroid" : "New Polaroid"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <ImageUploadField
            label="Photo"
            value={watch("src") || ""}
            onChange={(url) => setValue("src", url)}
          />
          <Field label="Alt Text" error={errors.alt?.message}>
            <input
              {...register("alt")}
              className="input-field"
              placeholder="Descriptive text for accessibility"
            />
          </Field>
          <Field label="Caption" error={errors.caption?.message}>
            <input
              {...register("caption")}
              className="input-field"
              placeholder="Short handwritten-style label"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rotation (degrees)" error={errors.rotation?.message}>
              <input
                type="number"
                step="0.1"
                {...register("rotation")}
                className="input-field"
                placeholder="-4.2"
              />
            </Field>
            <Field label="Order" error={errors.order?.message}>
              <input
                type="number"
                {...register("order")}
                className="input-field"
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="rounded"
            />
            <span className="text-sm text-text-primary">Published</span>
          </label>

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

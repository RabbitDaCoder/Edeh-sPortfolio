import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Trophy } from "lucide-react";

const achievementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().optional(),
});

type AchievementForm = z.infer<typeof achievementSchema>;

export function AchievementsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => apiClient.get("achievements"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`achievements/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["achievements"] }),
  });

  const achievements = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Achievements
          </h1>
          <p className="text-sm text-text-muted">
            Manage your achievements and awards
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Achievement
        </button>
      </div>

      {editing && (
        <AchievementFormModal
          achievement={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["achievements"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No achievements yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item: any) => (
            <div
              key={item.id}
              className="border border-border rounded-sm p-4 hover:bg-surface/50 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-text-muted mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.date && (
                      <p className="text-xs text-text-muted mt-2">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditing(item)}
                    className="p-1 text-text-muted hover:text-text-primary rounded-sm"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete?")) deleteMutation.mutate(item.id);
                    }}
                    className="p-1 text-text-muted hover:text-red-500 rounded-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AchievementFormModal({
  achievement,
  onClose,
  onSuccess,
}: {
  achievement: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!achievement;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementForm>({
    resolver: zodResolver(achievementSchema),
    defaultValues: isEdit
      ? { ...achievement, date: achievement.date?.slice(0, 10) ?? "" }
      : {},
  });

  const mutation = useMutation({
    mutationFn: (data: AchievementForm) => {
      const payload = {
        ...data,
        date: data.date ? new Date(data.date).toISOString() : undefined,
      };
      return isEdit
        ? apiClient.patch(`achievements/${achievement.id}`, payload)
        : apiClient.post("achievements", payload);
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
            {isEdit ? "Edit Achievement" : "New Achievement"}
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
          <Field label="Description">
            <textarea
              {...register("description")}
              rows={3}
              className="input-field resize-y"
            />
          </Field>
          <Field label="Date">
            <input type="date" {...register("date")} className="input-field" />
          </Field>
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

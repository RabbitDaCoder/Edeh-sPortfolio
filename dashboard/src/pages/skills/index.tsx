import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save, Cpu } from "lucide-react";

const CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "THREED",
  "TOOLS",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  DEVOPS: "DevOps",
  THREED: "3D & Creative",
  TOOLS: "Tools",
};

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(CATEGORIES),
  order: z.coerce.number().int().min(0),
});

type SkillForm = z.infer<typeof skillSchema>;

export function SkillsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: () => apiClient.get("skills"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`skills/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills"] }),
  });

  const skills = data?.data?.data ?? [];

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = skills.filter((s: any) => s.category === cat);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Skills & Technologies
          </h1>
          <p className="text-sm text-text-muted">
            Manage your tech stack displayed on the portfolio
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Skill
        </button>
      </div>

      {editing && (
        <SkillFormModal
          skill={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["skills"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 text-text-muted">No skills yet.</div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            return (
              <div key={cat}>
                <h3 className="text-sm font-medium text-text-muted mb-3">
                  {CATEGORY_LABELS[cat]} ({items.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="group inline-flex items-center gap-1.5 border border-border rounded-sm px-3 py-1.5 hover:bg-surface/50 transition-colors"
                    >
                      <Cpu className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-sm text-text-primary">
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                        <button
                          onClick={() => setEditing(skill)}
                          className="p-0.5 text-text-muted hover:text-text-primary rounded-sm"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete?"))
                              deleteMutation.mutate(skill.id);
                          }}
                          className="p-0.5 text-text-muted hover:text-red-500 rounded-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SkillFormModal({
  skill,
  onClose,
  onSuccess,
}: {
  skill: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!skill;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: isEdit ? skill : { category: "FRONTEND", order: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: SkillForm) =>
      isEdit
        ? apiClient.patch(`skills/${skill.id}`, data)
        : apiClient.post("skills", data),
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
            {isEdit ? "Edit Skill" : "New Skill"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <Field label="Name" error={errors.name?.message}>
            <input {...register("name")} className="input-field" />
          </Field>
          <Field label="Category" error={errors.category?.message}>
            <select {...register("category")} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Order">
            <input
              type="number"
              {...register("order")}
              className="input-field"
            />
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

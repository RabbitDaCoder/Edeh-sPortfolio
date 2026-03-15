import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";

const TIMELINE_TYPES = [
  "EDUCATION",
  "JOB",
  "FREELANCE",
  "VOLUNTEER",
  "ACHIEVEMENT",
  "PLAN",
] as const;

const careerSchema = z.object({
  type: z.enum(TIMELINE_TYPES),
  title: z.string().min(1, "Title is required"),
  organisation: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean(),
  order: z.coerce.number().int().min(0),
});

type CareerForm = z.infer<typeof careerSchema>;

export function CareerPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["career"],
    queryFn: () => apiClient.get("career"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`career/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["career"] }),
  });

  const entries = data?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Career Timeline
          </h1>
          <p className="text-sm text-text-muted">
            Manage education, jobs, and milestones
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {editing && (
        <CareerFormModal
          entry={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["career"] });
          }}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No career entries yet.
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
                  Title
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Type
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden lg:table-cell">
                  Organisation
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden lg:table-cell">
                  Period
                </th>
                <th className="text-right p-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any) => (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 text-text-muted">{entry.order}</td>
                  <td className="p-3 text-text-primary font-medium">
                    {entry.title}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-surface text-text-muted">
                      {entry.type}
                    </span>
                  </td>
                  <td className="p-3 text-text-muted hidden lg:table-cell">
                    {entry.organisation || "—"}
                  </td>
                  <td className="p-3 text-text-muted hidden lg:table-cell">
                    {new Date(entry.startDate).toLocaleDateString()} –{" "}
                    {entry.current
                      ? "Present"
                      : entry.endDate
                        ? new Date(entry.endDate).toLocaleDateString()
                        : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(entry)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this entry?"))
                            deleteMutation.mutate(entry.id);
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

function CareerFormModal({
  entry,
  onClose,
  onSuccess,
}: {
  entry: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!entry;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerForm>({
    resolver: zodResolver(careerSchema),
    defaultValues: isEdit
      ? {
          ...entry,
          organisation: entry.organisation ?? "",
          description: entry.description ?? "",
          startDate: entry.startDate?.slice(0, 10),
          endDate: entry.endDate?.slice(0, 10) ?? "",
        }
      : { type: "JOB", current: false, order: 0 },
  });

  const mutation = useMutation({
    mutationFn: (data: CareerForm) => {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
      };
      return isEdit
        ? apiClient.patch(`career/${entry.id}`, payload)
        : apiClient.post("career", payload);
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
            {isEdit ? "Edit Entry" : "New Entry"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="space-y-4"
        >
          <Field label="Type" error={errors.type?.message}>
            <select {...register("type")} className="input-field">
              {TIMELINE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title" error={errors.title?.message}>
            <input {...register("title")} className="input-field" />
          </Field>
          <Field label="Organisation">
            <input {...register("organisation")} className="input-field" />
          </Field>
          <Field label="Description">
            <textarea
              {...register("description")}
              rows={3}
              className="input-field resize-y"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" error={errors.startDate?.message}>
              <input
                type="date"
                {...register("startDate")}
                className="input-field"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                {...register("endDate")}
                className="input-field"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Order" error={errors.order?.message}>
              <input
                type="number"
                {...register("order")}
                className="input-field"
              />
            </Field>
            <label className="flex items-center gap-3 cursor-pointer pt-7">
              <input
                type="checkbox"
                {...register("current")}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm font-medium">Currently here</span>
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
                : "Create Entry"}
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

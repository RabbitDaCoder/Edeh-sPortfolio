import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { Save, Loader2 } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required").max(100),
  middleName: z.string().max(100).optional().default(""),
  lastName: z.string().min(1, "Required").max(100),
  tagline: z.string().max(500).optional().default(""),
  bio1: z.string().optional().default(""),
  bio2: z.string().optional().default(""),
  pullQuote: z.string().max(500).optional().default(""),
  availability: z.string().max(100).optional().default(""),
  email: z.string().email("Invalid email").or(z.literal("")),
  location: z.string().max(100).optional().default(""),
  timezone: z.string().max(50).optional().default(""),
  github: z.string().url("Invalid URL").or(z.literal("")),
  linkedin: z.string().url("Invalid URL").or(z.literal("")),
  youtube: z.string().url("Invalid URL").or(z.literal("")),
  twitter: z.string().url("Invalid URL").or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function SettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.get("profile"),
  });

  const profile = data?.data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Site Settings
        </h1>
        <p className="text-sm text-text-muted">
          Update your personal info, bio, and social links
        </p>
      </div>

      <ProfileFormSection
        profile={profile}
        onSuccess={() =>
          queryClient.invalidateQueries({ queryKey: ["profile"] })
        }
      />
    </div>
  );
}

function ProfileFormSection({
  profile,
  onSuccess,
}: {
  profile: any;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName ?? "",
      middleName: profile?.middleName ?? "",
      lastName: profile?.lastName ?? "",
      tagline: profile?.tagline ?? "",
      bio1: profile?.bio1 ?? "",
      bio2: profile?.bio2 ?? "",
      pullQuote: profile?.pullQuote ?? "",
      availability: profile?.availability ?? "",
      email: profile?.email ?? "",
      location: profile?.location ?? "",
      timezone: profile?.timezone ?? "",
      github: profile?.github ?? "",
      linkedin: profile?.linkedin ?? "",
      youtube: profile?.youtube ?? "",
      twitter: profile?.twitter ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) => apiClient.patch("profile", data),
    onSuccess,
  });

  return (
    <form
      onSubmit={handleSubmit((d) => mutation.mutate(d))}
      className="space-y-8"
    >
      {/* Identity */}
      <fieldset className="border border-border rounded-sm p-5 space-y-4">
        <legend className="px-2 text-sm font-medium text-text-muted">
          Identity
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="First Name" error={errors.firstName?.message}>
            <input {...register("firstName")} className="input-field" />
          </Field>
          <Field label="Middle Name" error={errors.middleName?.message}>
            <input {...register("middleName")} className="input-field" />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <input {...register("lastName")} className="input-field" />
          </Field>
        </div>
        <Field label="Tagline" error={errors.tagline?.message}>
          <input
            {...register("tagline")}
            className="input-field"
            placeholder="e.g. Full-Stack Developer & 3D Enthusiast"
          />
        </Field>
        <Field label="Availability" error={errors.availability?.message}>
          <input
            {...register("availability")}
            className="input-field"
            placeholder="e.g. Available for freelance"
          />
        </Field>
      </fieldset>

      {/* Bio */}
      <fieldset className="border border-border rounded-sm p-5 space-y-4">
        <legend className="px-2 text-sm font-medium text-text-muted">
          Bio
        </legend>
        <Field label="Bio (paragraph 1)" error={errors.bio1?.message}>
          <textarea
            {...register("bio1")}
            rows={4}
            className="input-field resize-y"
          />
        </Field>
        <Field label="Bio (paragraph 2)" error={errors.bio2?.message}>
          <textarea
            {...register("bio2")}
            rows={4}
            className="input-field resize-y"
          />
        </Field>
        <Field label="Pull Quote" error={errors.pullQuote?.message}>
          <input
            {...register("pullQuote")}
            className="input-field"
            placeholder="Short impactful statement"
          />
        </Field>
      </fieldset>

      {/* Contact & Location */}
      <fieldset className="border border-border rounded-sm p-5 space-y-4">
        <legend className="px-2 text-sm font-medium text-text-muted">
          Contact & Location
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className="input-field"
            />
          </Field>
          <Field label="Location" error={errors.location?.message}>
            <input {...register("location")} className="input-field" />
          </Field>
        </div>
        <Field label="Timezone" error={errors.timezone?.message}>
          <input
            {...register("timezone")}
            className="input-field"
            placeholder="e.g. WAT (UTC+1)"
          />
        </Field>
      </fieldset>

      {/* Social Links */}
      <fieldset className="border border-border rounded-sm p-5 space-y-4">
        <legend className="px-2 text-sm font-medium text-text-muted">
          Social Links
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GitHub" error={errors.github?.message}>
            <input
              {...register("github")}
              className="input-field"
              placeholder="https://github.com/username"
            />
          </Field>
          <Field label="LinkedIn" error={errors.linkedin?.message}>
            <input
              {...register("linkedin")}
              className="input-field"
              placeholder="https://linkedin.com/in/username"
            />
          </Field>
          <Field label="YouTube" error={errors.youtube?.message}>
            <input
              {...register("youtube")}
              className="input-field"
              placeholder="https://youtube.com/@channel"
            />
          </Field>
          <Field label="Twitter / X" error={errors.twitter?.message}>
            <input
              {...register("twitter")}
              className="input-field"
              placeholder="https://x.com/username"
            />
          </Field>
        </div>
      </fieldset>

      {mutation.isError && (
        <p className="text-sm text-red-500">Failed to save profile.</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-emerald-500">Profile saved successfully!</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending || !isDirty}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {mutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {mutation.isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
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

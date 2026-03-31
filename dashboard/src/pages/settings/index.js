import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function SettingsPage() {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: () => apiClient.get("profile"),
    });
    const profile = data?.data?.data;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx(Loader2, { className: "w-6 h-6 animate-spin text-text-muted" }) }));
    }
    return (_jsxs("div", { className: "max-w-3xl space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Site Settings" }), _jsx("p", { className: "text-sm text-text-muted", children: "Update your personal info, bio, and social links" })] }), _jsx(ProfileFormSection, { profile: profile, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }) })] }));
}
function ProfileFormSection({ profile, onSuccess, }) {
    const { register, handleSubmit, formState: { errors, isDirty }, } = useForm({
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
        mutationFn: (data) => apiClient.patch("profile", data),
        onSuccess,
    });
    return (_jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-8", children: [_jsxs("fieldset", { className: "border border-border rounded-sm p-5 space-y-4", children: [_jsx("legend", { className: "px-2 text-sm font-medium text-text-muted", children: "Identity" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsx(Field, { label: "First Name", error: errors.firstName?.message, children: _jsx("input", { ...register("firstName"), className: "input-field" }) }), _jsx(Field, { label: "Middle Name", error: errors.middleName?.message, children: _jsx("input", { ...register("middleName"), className: "input-field" }) }), _jsx(Field, { label: "Last Name", error: errors.lastName?.message, children: _jsx("input", { ...register("lastName"), className: "input-field" }) })] }), _jsx(Field, { label: "Tagline", error: errors.tagline?.message, children: _jsx("input", { ...register("tagline"), className: "input-field", placeholder: "e.g. Full-Stack Developer & 3D Enthusiast" }) }), _jsx(Field, { label: "Availability", error: errors.availability?.message, children: _jsx("input", { ...register("availability"), className: "input-field", placeholder: "e.g. Available for freelance" }) })] }), _jsxs("fieldset", { className: "border border-border rounded-sm p-5 space-y-4", children: [_jsx("legend", { className: "px-2 text-sm font-medium text-text-muted", children: "Bio" }), _jsx(Field, { label: "Bio (paragraph 1)", error: errors.bio1?.message, children: _jsx("textarea", { ...register("bio1"), rows: 4, className: "input-field resize-y" }) }), _jsx(Field, { label: "Bio (paragraph 2)", error: errors.bio2?.message, children: _jsx("textarea", { ...register("bio2"), rows: 4, className: "input-field resize-y" }) }), _jsx(Field, { label: "Pull Quote", error: errors.pullQuote?.message, children: _jsx("input", { ...register("pullQuote"), className: "input-field", placeholder: "Short impactful statement" }) })] }), _jsxs("fieldset", { className: "border border-border rounded-sm p-5 space-y-4", children: [_jsx("legend", { className: "px-2 text-sm font-medium text-text-muted", children: "Contact & Location" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Field, { label: "Email", error: errors.email?.message, children: _jsx("input", { type: "email", ...register("email"), className: "input-field" }) }), _jsx(Field, { label: "Location", error: errors.location?.message, children: _jsx("input", { ...register("location"), className: "input-field" }) })] }), _jsx(Field, { label: "Timezone", error: errors.timezone?.message, children: _jsx("input", { ...register("timezone"), className: "input-field", placeholder: "e.g. WAT (UTC+1)" }) })] }), _jsxs("fieldset", { className: "border border-border rounded-sm p-5 space-y-4", children: [_jsx("legend", { className: "px-2 text-sm font-medium text-text-muted", children: "Social Links" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsx(Field, { label: "GitHub", error: errors.github?.message, children: _jsx("input", { ...register("github"), className: "input-field", placeholder: "https://github.com/username" }) }), _jsx(Field, { label: "LinkedIn", error: errors.linkedin?.message, children: _jsx("input", { ...register("linkedin"), className: "input-field", placeholder: "https://linkedin.com/in/username" }) }), _jsx(Field, { label: "YouTube", error: errors.youtube?.message, children: _jsx("input", { ...register("youtube"), className: "input-field", placeholder: "https://youtube.com/@channel" }) }), _jsx(Field, { label: "Twitter / X", error: errors.twitter?.message, children: _jsx("input", { ...register("twitter"), className: "input-field", placeholder: "https://x.com/username" }) })] })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: "Failed to save profile." })), mutation.isSuccess && (_jsx("p", { className: "text-sm text-emerald-500", children: "Profile saved successfully!" })), _jsxs("button", { type: "submit", disabled: mutation.isPending || !isDirty, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity", children: [mutation.isPending ? (_jsx(Loader2, { className: "w-4 h-4 animate-spin" })) : (_jsx(Save, { className: "w-4 h-4" })), mutation.isPending ? "Saving..." : "Save Changes"] })] }));
}
function Field({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
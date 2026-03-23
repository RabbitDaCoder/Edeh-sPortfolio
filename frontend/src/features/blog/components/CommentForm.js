import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, X } from "lucide-react";
import { useCreateComment } from "../hooks/useComments";
const commentFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email"),
    website: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
    body: z
        .string()
        .min(3, "Comment is too short")
        .max(2000, "Comment is too long (max 2000 characters)"),
});
export default function CommentForm({ slug, parentId, onCancelReply, }) {
    const [submitted, setSubmitted] = useState(false);
    const createComment = useCreateComment(slug);
    const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        resolver: zodResolver(commentFormSchema),
    });
    const onSubmit = async (values) => {
        await createComment.mutateAsync({
            ...values,
            website: values.website || undefined,
            parentId: parentId || undefined,
        });
        reset();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };
    if (submitted) {
        return (_jsx("div", { className: "p-4 rounded-lg bg-surface border border-border text-sm text-text-muted", children: "Thanks for your comment! It will appear after moderation." }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [parentId && (_jsxs("div", { className: "flex items-center justify-between text-xs text-text-muted", children: [_jsx("span", { children: "Replying to comment" }), _jsxs("button", { type: "button", onClick: onCancelReply, className: "flex items-center gap-1 hover:text-accent transition-colors", children: [_jsx(X, { size: 12 }), " Cancel"] })] })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("input", { ...register("name"), placeholder: "Name *", className: "w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors" }), errors.name && (_jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.name.message }))] }), _jsxs("div", { children: [_jsx("input", { ...register("email"), type: "email", placeholder: "Email *", className: "w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors" }), errors.email && (_jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.email.message }))] })] }), _jsxs("div", { children: [_jsx("input", { ...register("website"), placeholder: "Website (optional)", className: "w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors" }), errors.website && (_jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.website.message }))] }), _jsxs("div", { children: [_jsx("textarea", { ...register("body"), rows: 4, placeholder: parentId ? "Write a reply..." : "Leave a comment...", className: "w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none" }), errors.body && (_jsx("p", { className: "mt-1 text-xs text-red-400", children: errors.body.message }))] }), _jsxs("button", { type: "submit", disabled: createComment.isPending, className: "flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-background rounded-lg hover:opacity-80 disabled:opacity-50 transition-opacity", children: [createComment.isPending ? (_jsx(Loader2, { size: 14, className: "animate-spin" })) : (_jsx(Send, { size: 14, strokeWidth: 1.5 })), parentId ? "Reply" : "Post Comment"] })] }));
}
//# sourceMappingURL=CommentForm.js.map
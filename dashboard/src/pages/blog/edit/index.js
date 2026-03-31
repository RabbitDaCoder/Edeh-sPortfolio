import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Star } from "lucide-react";
import { ImageUploadField } from "../../../components/ImageUploadField";
import { MarkdownEditor } from "../../../components/blog/MarkdownEditor";
import { markdownToHtml } from "../../../utils/markdownToHtml";
import { BLOG_CATEGORY_GROUPS } from "../../../constants/blog";
const blogSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    coverImage: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
    category: z.string().optional(),
    published: z.boolean(),
    featured: z.boolean(),
    readTime: z.coerce.number().optional(),
    tags: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
});
export function EditBlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [editorMode, setEditorMode] = useState("richtext");
    const [markdownSrc, setMarkdownSrc] = useState("");
    const { data, isLoading } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => apiClient.get(`blog/${id}`),
        enabled: !!id,
    });
    const post = data?.data?.data;
    const { register, handleSubmit, reset, watch, setValue, getValues, formState: { errors }, } = useForm({
        resolver: zodResolver(blogSchema),
    });
    useEffect(() => {
        if (post) {
            const mode = post.contentSource || "richtext";
            setEditorMode(mode);
            reset({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt ?? "",
                coverImage: post.coverImage ?? "",
                category: post.category ?? "",
                published: post.published,
                featured: post.featured ?? false,
                readTime: post.readTime ?? undefined,
                tags: post.tags?.join(", ") ?? "",
                metaTitle: post.metaTitle ?? "",
                metaDesc: post.metaDesc ?? "",
            });
            if (mode === "markdown") {
                // If saved as markdown, content is the HTML but we stored markdown source
                // For now, set content as markdownSrc fallback
                setMarkdownSrc(post.content ?? "");
            }
        }
    }, [post, reset]);
    const handleEditorModeChange = useCallback((mode) => {
        if (mode === "markdown" && editorMode === "richtext") {
            setMarkdownSrc(getValues("content") || "");
        }
        if (mode === "richtext" && editorMode === "markdown") {
            setValue("content", markdownSrc);
        }
        setEditorMode(mode);
    }, [editorMode, markdownSrc, getValues, setValue]);
    const mutation = useMutation({
        mutationFn: async (data) => {
            let finalContent = data.content;
            if (editorMode === "markdown") {
                finalContent = await markdownToHtml(markdownSrc);
            }
            const payload = {
                ...data,
                content: finalContent,
                contentSource: editorMode,
                coverImage: data.coverImage || undefined,
                tags: data.tags
                    ? data.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [],
            };
            return apiClient.patch(`blog/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog"] });
            navigate("/blog");
        },
    });
    if (isLoading) {
        return (_jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-10 bg-surface animate-pulse rounded-sm" }, i))) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { to: "/blog", className: "p-2 hover:bg-surface rounded-sm transition-colors", children: _jsx(ArrowLeft, { className: "w-5 h-5" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-display font-semibold text-text-primary", children: "Edit Blog Post" }), _jsxs("p", { className: "text-sm text-text-muted", children: ["Update \u201C", post?.title, "\u201D"] })] })] }), _jsxs("form", { onSubmit: handleSubmit((d) => mutation.mutate(d)), className: "space-y-6 max-w-3xl", children: [_jsxs("div", { className: "grid gap-4", children: [_jsx(FieldGroup, { label: "Title", error: errors.title?.message, children: _jsx("input", { ...register("title"), className: "input-field" }) }), _jsx(FieldGroup, { label: "Slug", error: errors.slug?.message, children: _jsx("input", { ...register("slug"), className: "input-field" }) }), _jsx(FieldGroup, { label: "Category", children: _jsxs("select", { ...register("category"), className: "input-field", children: [_jsx("option", { value: "", children: "No category" }), BLOG_CATEGORY_GROUPS.map((group) => (_jsx("optgroup", { label: group.label, children: group.categories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat))) }, group.label)))] }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: "Content" }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("button", { type: "button", onClick: () => handleEditorModeChange("richtext"), className: `px-3 py-1 text-xs rounded-sm border transition-colors ${editorMode === "richtext"
                                                    ? "bg-accent text-background border-accent"
                                                    : "border-border text-text-muted hover:text-text-primary"}`, children: "Rich Text" }), _jsx("button", { type: "button", onClick: () => handleEditorModeChange("markdown"), className: `px-3 py-1 text-xs rounded-sm border transition-colors ${editorMode === "markdown"
                                                    ? "bg-accent text-background border-accent"
                                                    : "border-border text-text-muted hover:text-text-primary"}`, children: "Markdown" })] }), editorMode === "markdown" ? (_jsx(MarkdownEditor, { value: markdownSrc, onChange: setMarkdownSrc, height: 400 })) : (_jsx("textarea", { ...register("content"), rows: 12, className: "input-field resize-y" })), errors.content?.message && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.content.message }))] }), _jsx(FieldGroup, { label: "Excerpt", children: _jsx("textarea", { ...register("excerpt"), rows: 3, className: "input-field resize-y" }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(ImageUploadField, { label: "Cover Image", value: watch("coverImage") || "", onChange: (url) => setValue("coverImage", url), error: errors.coverImage?.message }), _jsx(FieldGroup, { label: "Read Time (min)", children: _jsx("input", { type: "number", ...register("readTime"), className: "input-field" }) })] }), _jsx(FieldGroup, { label: "Tags (comma separated)", children: _jsx("input", { ...register("tags"), className: "input-field" }) }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldGroup, { label: "Meta Title", children: _jsx("input", { ...register("metaTitle"), className: "input-field" }) }), _jsx(FieldGroup, { label: "Meta Description", children: _jsx("input", { ...register("metaDesc"), className: "input-field" }) })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("published"), className: "w-4 h-4 accent-accent" }), _jsx("span", { className: "text-sm font-medium text-text-primary", children: "Published" })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", ...register("featured"), className: "w-4 h-4 accent-accent" }), _jsxs("span", { className: "text-sm font-medium text-text-primary inline-flex items-center gap-1", children: [_jsx(Star, { className: "w-3.5 h-3.5" }), " Featured"] })] })] })] }), mutation.isError && (_jsx("p", { className: "text-sm text-red-500", children: "Failed to update post. Please try again." })), _jsxs("button", { type: "submit", disabled: mutation.isPending, className: "inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50", children: [_jsx(Save, { className: "w-4 h-4" }), mutation.isPending ? "Saving..." : "Save Changes"] })] })] }));
}
function FieldGroup({ label, error, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: label }), children, error && _jsx("p", { className: "text-xs text-red-500 mt-1", children: error })] }));
}
//# sourceMappingURL=index.js.map
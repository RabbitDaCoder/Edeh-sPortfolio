import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Star } from "lucide-react";
import { ImageUploadField } from "../../../components/ImageUploadField";
import { MarkdownEditor } from "../../../components/blog/MarkdownEditor";
import { markdownToHtml } from "../../../utils/markdownToHtml";
import { BLOG_CATEGORY_GROUPS } from "../../../constants/blog";

const AUTOSAVE_KEY = "draft:blog:create";

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

type BlogForm = z.infer<typeof blogSchema>;

type EditorMode = "richtext" | "markdown";

export function CreateBlogPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editorMode, setEditorMode] = useState<EditorMode>("richtext");
  const [markdownSrc, setMarkdownSrc] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: { published: false, featured: false },
  });

  // Load auto-saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.editorMode) setEditorMode(draft.editorMode);
        if (draft.markdownSrc) setMarkdownSrc(draft.markdownSrc);
        if (draft.form) {
          Object.entries(draft.form).forEach(([key, val]) => {
            setValue(key as keyof BlogForm, val as any);
          });
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [setValue]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const form = getValues();
      localStorage.setItem(
        AUTOSAVE_KEY,
        JSON.stringify({ form, editorMode, markdownSrc }),
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [getValues, editorMode, markdownSrc]);

  const mutation = useMutation({
    mutationFn: async (data: BlogForm) => {
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
      return apiClient.post("blog", payload);
    },
    onSuccess: () => {
      localStorage.removeItem(AUTOSAVE_KEY);
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      navigate("/blog");
    },
  });

  const title = watch("title");

  const generateSlug = () => {
    if (title) {
      setValue(
        "slug",
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      );
    }
  };

  const handleEditorModeChange = useCallback(
    (mode: EditorMode) => {
      if (mode === "markdown" && editorMode === "richtext") {
        setMarkdownSrc(getValues("content") || "");
      }
      if (mode === "richtext" && editorMode === "markdown") {
        setValue("content", markdownSrc);
      }
      setEditorMode(mode);
    },
    [editorMode, markdownSrc, getValues, setValue],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/blog"
          className="p-2 hover:bg-surface rounded-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Create Blog Post
          </h1>
          <p className="text-sm text-text-muted">Write a new blog post</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="space-y-6 max-w-3xl"
      >
        <div className="grid gap-4">
          <FieldGroup label="Title" error={errors.title?.message}>
            <input
              {...register("title")}
              onBlur={generateSlug}
              className="input-field"
              placeholder="Post title"
            />
          </FieldGroup>

          <FieldGroup label="Slug" error={errors.slug?.message}>
            <input
              {...register("slug")}
              className="input-field"
              placeholder="post-slug"
            />
          </FieldGroup>

          <FieldGroup label="Category">
            <select {...register("category")} className="input-field">
              <option value="">No category</option>
              {BLOG_CATEGORY_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FieldGroup>

          {/* Editor mode switcher */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Content
            </label>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => handleEditorModeChange("richtext")}
                className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
                  editorMode === "richtext"
                    ? "bg-accent text-background border-accent"
                    : "border-border text-text-muted hover:text-text-primary"
                }`}
              >
                Rich Text
              </button>
              <button
                type="button"
                onClick={() => handleEditorModeChange("markdown")}
                className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
                  editorMode === "markdown"
                    ? "bg-accent text-background border-accent"
                    : "border-border text-text-muted hover:text-text-primary"
                }`}
              >
                Markdown
              </button>
            </div>
            {editorMode === "markdown" ? (
              <MarkdownEditor
                value={markdownSrc}
                onChange={setMarkdownSrc}
                height={400}
              />
            ) : (
              <textarea
                {...register("content")}
                rows={12}
                className="input-field resize-y"
                placeholder="Write your content..."
              />
            )}
            {errors.content?.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <FieldGroup label="Excerpt">
            <textarea
              {...register("excerpt")}
              rows={3}
              className="input-field resize-y"
              placeholder="Short description"
            />
          </FieldGroup>

          <div className="grid md:grid-cols-2 gap-4">
            <ImageUploadField
              label="Cover Image"
              value={watch("coverImage") || ""}
              onChange={(url) => setValue("coverImage", url)}
              error={errors.coverImage?.message}
            />
            <FieldGroup label="Read Time (min)">
              <input
                type="number"
                {...register("readTime")}
                className="input-field"
                placeholder="5"
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Tags (comma separated)">
            <input
              {...register("tags")}
              className="input-field"
              placeholder="react, typescript, web"
            />
          </FieldGroup>

          <div className="grid md:grid-cols-2 gap-4">
            <FieldGroup label="Meta Title">
              <input {...register("metaTitle")} className="input-field" />
            </FieldGroup>
            <FieldGroup label="Meta Description">
              <input {...register("metaDesc")} className="input-field" />
            </FieldGroup>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("published")}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm font-medium text-text-primary">
                Publish immediately
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("featured")}
                className="w-4 h-4 accent-accent"
              />
              <span className="text-sm font-medium text-text-primary inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> Featured
              </span>
            </label>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">
            Failed to create post. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

function FieldGroup({
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

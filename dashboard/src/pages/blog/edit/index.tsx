import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ImageUploadField } from "../../../components/ImageUploadField";

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
  published: z.boolean(),
  readTime: z.coerce.number().optional(),
  tags: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

type BlogForm = z.infer<typeof blogSchema>;

export function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => apiClient.get(`blog/${id}`),
    enabled: !!id,
  });

  const post = data?.data?.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt ?? "",
        coverImage: post.coverImage ?? "",
        published: post.published,
        readTime: post.readTime ?? undefined,
        tags: post.tags?.join(", ") ?? "",
        metaTitle: post.metaTitle ?? "",
        metaDesc: post.metaDesc ?? "",
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: BlogForm) => {
      const payload = {
        ...data,
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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-surface animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

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
            Edit Blog Post
          </h1>
          <p className="text-sm text-text-muted">
            Update &ldquo;{post?.title}&rdquo;
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="space-y-6 max-w-3xl"
      >
        <div className="grid gap-4">
          <FieldGroup label="Title" error={errors.title?.message}>
            <input {...register("title")} className="input-field" />
          </FieldGroup>

          <FieldGroup label="Slug" error={errors.slug?.message}>
            <input {...register("slug")} className="input-field" />
          </FieldGroup>

          <FieldGroup label="Content" error={errors.content?.message}>
            <textarea
              {...register("content")}
              rows={12}
              className="input-field resize-y"
            />
          </FieldGroup>

          <FieldGroup label="Excerpt">
            <textarea
              {...register("excerpt")}
              rows={3}
              className="input-field resize-y"
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
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Tags (comma separated)">
            <input {...register("tags")} className="input-field" />
          </FieldGroup>

          <div className="grid md:grid-cols-2 gap-4">
            <FieldGroup label="Meta Title">
              <input {...register("metaTitle")} className="input-field" />
            </FieldGroup>
            <FieldGroup label="Meta Description">
              <input {...register("metaDesc")} className="input-field" />
            </FieldGroup>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("published")}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm font-medium text-text-primary">
              Published
            </span>
          </label>
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">
            Failed to update post. Please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Saving..." : "Save Changes"}
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

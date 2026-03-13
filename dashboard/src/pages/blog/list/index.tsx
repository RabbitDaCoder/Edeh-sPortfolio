import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../lib/axios";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function BlogListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["blog", page],
    queryFn: () => apiClient.get(`blog?page=${page}&limit=10`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`blog/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blog"] }),
  });

  const posts = data?.data?.data?.data ?? [];
  const meta = data?.data?.data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-text-primary">
            Blog Posts
          </h1>
          <p className="text-sm text-text-muted">Manage your blog content</p>
        </div>
        <Link
          to="/blog/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No blog posts yet. Create your first one!
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-text-muted">
                  Title
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden md:table-cell">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-text-muted hidden lg:table-cell">
                  Created
                </th>
                <th className="text-right p-3 font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr
                  key={post.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 text-text-primary font-medium">
                    {post.title}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs rounded-pill ${
                        post.published
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-text-muted hidden lg:table-cell">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/blog/edit/${post.id}`}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded-sm hover:bg-surface transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm("Delete this post?"))
                            deleteMutation.mutate(post.id);
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

      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {meta.pages}
          </span>
          <button
            disabled={page >= meta.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border border-border rounded-sm disabled:opacity-40 hover:bg-surface transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

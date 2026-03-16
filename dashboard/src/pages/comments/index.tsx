import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import {
  Check,
  Trash2,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

type StatusFilter = "pending" | "approved" | "spam" | "all";

interface AdminComment {
  id: string;
  name: string;
  email: string;
  body: string;
  blogId: string;
  approved: boolean;
  spam: boolean;
  createdAt: string;
  blog?: { title: string; slug: string };
}

export function CommentsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-comments", status, page],
    queryFn: () =>
      apiClient.get("admin/comments", {
        params: { page, limit: 20, status },
      }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`admin/comments/${id}/approve`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
  });

  const spamMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`admin/comments/${id}/spam`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`admin/comments/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] }),
  });

  const comments = data?.data?.data?.data ?? [];
  const pagination = data?.data?.data?.pagination;

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Spam", value: "spam" },
    { label: "All", value: "all" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Comments
        </h1>
        <p className="text-sm text-text-muted">Moderate blog post comments</p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              status === tab.value
                ? "bg-accent text-background"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No {status === "all" ? "" : status} comments.
        </div>
      ) : (
        <div className="space-y-2">
          {comments.map((comment: AdminComment) => (
            <div
              key={comment.id}
              className="border border-border rounded-sm p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-primary">
                      {comment.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      &lt;{comment.email}&gt;
                    </span>
                    {comment.spam && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded">
                        Spam
                      </span>
                    )}
                    {comment.approved && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded">
                        Approved
                      </span>
                    )}
                    {!comment.approved && !comment.spam && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">
                        Pending
                      </span>
                    )}
                  </div>

                  {comment.blog && (
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      On:{" "}
                      <a
                        href={`/blog/edit/${comment.blogId}`}
                        className="text-accent hover:underline inline-flex items-center gap-0.5"
                      >
                        {comment.blog.title}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  )}
                </div>

                <span className="text-xs text-text-muted shrink-0">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-text-primary whitespace-pre-wrap">
                {comment.body}
              </p>

              <div className="flex items-center gap-2">
                {!comment.approved && (
                  <button
                    onClick={() => approveMutation.mutate(comment.id)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/20 text-green-500 rounded-sm hover:bg-green-500/5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {!comment.spam && (
                  <button
                    onClick={() => spamMutation.mutate(comment.id)}
                    disabled={spamMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-yellow-500/20 text-yellow-500 rounded-sm hover:bg-yellow-500/5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Spam
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Delete this comment permanently?"))
                      deleteMutation.mutate(comment.id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-500/20 text-red-500 rounded-sm hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-text-muted">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-3 py-1.5 text-xs border border-border rounded-sm hover:bg-surface disabled:opacity-30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

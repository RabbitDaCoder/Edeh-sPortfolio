import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiV2Client } from "../../lib/axios";
import { Check, Trash2, Flag, Pin, PinOff, BookOpen } from "lucide-react";

type StatusFilter = "pending" | "approved" | "flagged" | "all";

interface AdminGuestbookEntry {
  id: string;
  name: string;
  email: string;
  message: string;
  handle?: string | null;
  approved: boolean;
  pinned: boolean;
  flagged: boolean;
  ipAddress?: string | null;
  country?: string | null;
  createdAt: string;
}

function filterParams(status: StatusFilter) {
  switch (status) {
    case "pending":
      return { approved: "false", flagged: "false" };
    case "approved":
      return { approved: "true" };
    case "flagged":
      return { flagged: "true" };
    default:
      return {};
  }
}

export function GuestbookPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-guestbook", status, page],
    queryFn: () =>
      apiV2Client.get("/admin/guestbook", {
        params: { page, limit: 20, ...filterParams(status) },
      }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      apiV2Client.patch(`/admin/guestbook/${id}/approve`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
  });

  const pinMutation = useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
      apiV2Client.patch(`/admin/guestbook/${id}/pin`, { pinned }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
  });

  const flagMutation = useMutation({
    mutationFn: (id: string) =>
      apiV2Client.patch(`/admin/guestbook/${id}/flag`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiV2Client.delete(`/admin/guestbook/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-guestbook"] }),
  });

  const entries: AdminGuestbookEntry[] = data?.data?.data?.data ?? [];
  const pagination = data?.data?.data?.pagination;

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Flagged", value: "flagged" },
    { label: "All", value: "all" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Guestbook
        </h1>
        <p className="text-sm text-text-muted">Moderate guestbook entries</p>
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
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No {status === "all" ? "" : status} entries.
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-border rounded-sm p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-text-primary">
                      {entry.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      &lt;{entry.email}&gt;
                    </span>
                    {entry.handle && (
                      <span className="text-xs text-text-muted">
                        @{entry.handle}
                      </span>
                    )}
                    {entry.flagged && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded">
                        Flagged
                      </span>
                    )}
                    {entry.approved && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded">
                        Approved
                      </span>
                    )}
                    {!entry.approved && !entry.flagged && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">
                        Pending
                      </span>
                    )}
                    {entry.pinned && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded">
                        Pinned
                      </span>
                    )}
                  </div>
                  {entry.country && (
                    <p className="text-xs text-text-muted mt-0.5">
                      {entry.country}
                    </p>
                  )}
                </div>

                <span className="text-xs text-text-muted shrink-0">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-text-primary whitespace-pre-wrap">
                {entry.message}
              </p>

              <div className="flex items-center gap-2">
                {!entry.approved && (
                  <button
                    onClick={() => approveMutation.mutate(entry.id)}
                    disabled={approveMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/20 text-green-500 rounded-sm hover:bg-green-500/5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                <button
                  onClick={() =>
                    pinMutation.mutate({
                      id: entry.id,
                      pinned: !entry.pinned,
                    })
                  }
                  disabled={pinMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-blue-500/20 text-blue-500 rounded-sm hover:bg-blue-500/5 transition-colors"
                >
                  {entry.pinned ? (
                    <>
                      <PinOff className="w-3.5 h-3.5" /> Unpin
                    </>
                  ) : (
                    <>
                      <Pin className="w-3.5 h-3.5" /> Pin
                    </>
                  )}
                </button>
                {!entry.flagged && (
                  <button
                    onClick={() => flagMutation.mutate(entry.id)}
                    disabled={flagMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-yellow-500/20 text-yellow-500 rounded-sm hover:bg-yellow-500/5 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" /> Flag
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Delete this entry permanently?"))
                      deleteMutation.mutate(entry.id);
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

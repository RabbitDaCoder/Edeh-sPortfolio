import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";

export function MessagesPage() {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => apiClient.get("contact"),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`contact/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`contact/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
  });

  const messages = data?.data?.data ?? [];
  const unreadCount = messages.filter((m: any) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Messages
        </h1>
        <p className="text-sm text-text-muted">
          {unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
            : "All caught up!"}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface animate-pulse rounded-sm" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg: any) => {
            const isOpen = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className={`border rounded-sm transition-colors ${msg.read ? "border-border" : "border-accent/30 bg-accent/5"}`}
              >
                <button
                  className="w-full flex items-center gap-3 p-4 text-left"
                  onClick={() => {
                    setExpanded(isOpen ? null : msg.id);
                    if (!msg.read) markReadMutation.mutate(msg.id);
                  }}
                >
                  {msg.read ? (
                    <MailOpen className="w-4 h-4 text-text-muted shrink-0" />
                  ) : (
                    <Mail className="w-4 h-4 text-accent shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm truncate ${msg.read ? "text-text-primary" : "font-semibold text-text-primary"}`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>
                    <p className="text-sm text-text-muted truncate">
                      {msg.subject || msg.message.slice(0, 80)}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border">
                    <div className="pt-3 space-y-3">
                      {msg.subject && (
                        <div>
                          <span className="text-xs font-medium text-text-muted uppercase">
                            Subject
                          </span>
                          <p className="text-sm text-text-primary">
                            {msg.subject}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium text-text-muted uppercase">
                          Message
                        </span>
                        <p className="text-sm text-text-primary whitespace-pre-wrap mt-1">
                          {msg.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject || ""}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-sm hover:bg-surface transition-colors"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => {
                            if (confirm("Delete this message?"))
                              deleteMutation.mutate(msg.id);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 border border-red-500/20 rounded-sm hover:bg-red-500/5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import {
  FileText,
  BookOpen,
  Briefcase,
  Trophy,
  Download,
  Mail,
  Users,
  FolderKanban,
  Cpu,
  MessageSquare,
} from "lucide-react";

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
}

export function OverviewPage() {
  const blog = useQuery({
    queryKey: ["blog"],
    queryFn: () => apiClient.get("blog?limit=1"),
  });
  const books = useQuery({
    queryKey: ["books"],
    queryFn: () => apiClient.get("books?limit=1"),
  });
  const career = useQuery({
    queryKey: ["career"],
    queryFn: () => apiClient.get("career"),
  });
  const achievements = useQuery({
    queryKey: ["achievements"],
    queryFn: () => apiClient.get("achievements"),
  });
  const downloads = useQuery({
    queryKey: ["downloads"],
    queryFn: () => apiClient.get("downloads?limit=1"),
  });
  const messages = useQuery({
    queryKey: ["messages"],
    queryFn: () => apiClient.get("contact"),
  });
  const subscribers = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => apiClient.get("newsletter/subscribers"),
  });
  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.get("projects"),
  });
  const skills = useQuery({
    queryKey: ["skills"],
    queryFn: () => apiClient.get("skills"),
  });
  const testimonials = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => apiClient.get("testimonials"),
  });

  const stats: StatCard[] = [
    {
      label: "Blog Posts",
      value: blog.data?.data?.data?.pagination?.total ?? "—",
      icon: FileText,
      href: "/blog",
    },
    {
      label: "Books",
      value: books.data?.data?.data?.pagination?.total ?? "—",
      icon: BookOpen,
      href: "/books",
    },
    {
      label: "Career Entries",
      value: career.data?.data?.data?.length ?? "—",
      icon: Briefcase,
      href: "/career",
    },
    {
      label: "Achievements",
      value: achievements.data?.data?.data?.length ?? "—",
      icon: Trophy,
      href: "/achievements",
    },
    {
      label: "Downloads",
      value: downloads.data?.data?.data?.length ?? "—",
      icon: Download,
      href: "/downloads",
    },
    {
      label: "Messages",
      value: messages.data?.data?.data?.length ?? "—",
      icon: Mail,
      href: "/messages",
    },
    {
      label: "Subscribers",
      value: subscribers.data?.data?.data?.length ?? "—",
      icon: Users,
      href: "#",
    },
    {
      label: "Projects",
      value: projects.data?.data?.data?.length ?? "—",
      icon: FolderKanban,
      href: "/projects",
    },
    {
      label: "Skills",
      value: skills.data?.data?.data?.length ?? "—",
      icon: Cpu,
      href: "/skills",
    },
    {
      label: "Testimonials",
      value: testimonials.data?.data?.data?.length ?? "—",
      icon: MessageSquare,
      href: "/testimonials",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold text-text-primary">
          Dashboard
        </h1>
        <p className="text-text-muted mt-1">
          Welcome back. Here's an overview of your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="border border-border rounded-sm p-5 bg-background hover:bg-surface transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" />
              </div>
              <p className="text-2xl font-semibold text-text-primary">
                {stat.value}
              </p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import { FileText, BookOpen, Briefcase, Trophy, Download, Mail, Users, FolderKanban, Cpu, MessageSquare, Star, X, } from "lucide-react";
export function OverviewPage() {
    const queryClient = useQueryClient();
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
    const featuredBlogs = useQuery({
        queryKey: ["blog", "featured"],
        queryFn: () => apiClient.get("blog/featured?limit=10"),
    });
    const featuredBooks = useQuery({
        queryKey: ["books", "featured"],
        queryFn: () => apiClient.get("books/featured?limit=10"),
    });
    const unfeatureBlog = useMutation({
        mutationFn: (id) => apiClient.patch(`blog/${id}/feature`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blog"] });
        },
    });
    const unfeatureBook = useMutation({
        mutationFn: (id) => apiClient.patch(`books/${id}/feature`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
    });
    const featuredBlogList = featuredBlogs.data?.data?.data ?? [];
    const featuredBookList = featuredBooks.data?.data?.data ?? [];
    const stats = [
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
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-display font-semibold text-text-primary", children: "Dashboard" }), _jsx("p", { className: "text-text-muted mt-1", children: "Welcome back. Here's an overview of your portfolio." })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsxs("a", { href: stat.href, className: "border border-border rounded-sm p-5 bg-background hover:bg-surface transition-colors group", children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx(Icon, { className: "w-5 h-5 text-text-muted group-hover:text-text-primary transition-colors" }) }), _jsx("p", { className: "text-2xl font-semibold text-text-primary", children: stat.value }), _jsx("p", { className: "text-sm text-text-muted", children: stat.label })] }, stat.label));
                }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "border border-border rounded-sm p-5 bg-background", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Star, { className: "w-5 h-5 text-amber-500" }), _jsx("h2", { className: "text-lg font-semibold text-text-primary", children: "Featured Blog Posts" })] }), featuredBlogList.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted", children: "No featured blog posts yet." })) : (_jsx("ul", { className: "space-y-2", children: featuredBlogList.map((post) => (_jsxs("li", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-primary truncate mr-2", children: post.title }), _jsx("button", { onClick: () => unfeatureBlog.mutate(post.id), className: "text-text-muted hover:text-red-500 transition-colors shrink-0", title: "Remove from featured", children: _jsx(X, { className: "w-4 h-4" }) })] }, post.id))) }))] }), _jsxs("div", { className: "border border-border rounded-sm p-5 bg-background", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Star, { className: "w-5 h-5 text-amber-500" }), _jsx("h2", { className: "text-lg font-semibold text-text-primary", children: "Featured Books" })] }), featuredBookList.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted", children: "No featured books yet." })) : (_jsx("ul", { className: "space-y-2", children: featuredBookList.map((book) => (_jsxs("li", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-text-primary truncate mr-2", children: book.title }), _jsx("button", { onClick: () => unfeatureBook.mutate(book.id), className: "text-text-muted hover:text-red-500 transition-colors shrink-0", title: "Remove from featured", children: _jsx(X, { className: "w-4 h-4" }) })] }, book.id))) }))] })] })] }));
}
//# sourceMappingURL=index.js.map
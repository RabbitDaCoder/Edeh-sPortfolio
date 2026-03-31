import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
const LoginPage = React.lazy(() => import("../pages/login").then((m) => ({ default: m.LoginPage })));
const OverviewPage = React.lazy(() => import("../pages/overview").then((m) => ({ default: m.OverviewPage })));
const BlogListPage = React.lazy(() => import("../pages/blog/list").then((m) => ({ default: m.BlogListPage })));
const CreateBlogPage = React.lazy(() => import("../pages/blog/create").then((m) => ({ default: m.CreateBlogPage })));
const EditBlogPage = React.lazy(() => import("../pages/blog/edit").then((m) => ({ default: m.EditBlogPage })));
const BooksPage = React.lazy(() => import("../pages/books").then((m) => ({ default: m.BooksPage })));
const CareerPage = React.lazy(() => import("../pages/career").then((m) => ({ default: m.CareerPage })));
const AchievementsPage = React.lazy(() => import("../pages/achievements").then((m) => ({
    default: m.AchievementsPage,
})));
const DownloadsPage = React.lazy(() => import("../pages/downloads").then((m) => ({ default: m.DownloadsPage })));
const MessagesPage = React.lazy(() => import("../pages/messages").then((m) => ({ default: m.MessagesPage })));
const ProjectsPage = React.lazy(() => import("../pages/projects").then((m) => ({ default: m.ProjectsPage })));
const SkillsPage = React.lazy(() => import("../pages/skills").then((m) => ({ default: m.SkillsPage })));
const TestimonialsPage = React.lazy(() => import("../pages/testimonials").then((m) => ({
    default: m.TestimonialsPage,
})));
const PolaroidsPage = React.lazy(() => import("../pages/polaroids").then((m) => ({
    default: m.PolaroidsPage,
})));
const CommentsPage = React.lazy(() => import("../pages/comments").then((m) => ({ default: m.CommentsPage })));
const GuestbookPage = React.lazy(() => import("../pages/guestbook").then((m) => ({ default: m.GuestbookPage })));
const SettingsPage = React.lazy(() => import("../pages/settings").then((m) => ({ default: m.SettingsPage })));
export const router = createBrowserRouter([
    {
        path: "/login",
        element: _jsx(LoginPage, {}),
    },
    {
        path: "/",
        element: (_jsx(ProtectedRoute, { children: _jsx(DashboardLayout, {}) })),
        children: [
            { index: true, element: _jsx(OverviewPage, {}) },
            { path: "blog", element: _jsx(BlogListPage, {}) },
            { path: "blog/create", element: _jsx(CreateBlogPage, {}) },
            { path: "blog/edit/:id", element: _jsx(EditBlogPage, {}) },
            { path: "books", element: _jsx(BooksPage, {}) },
            { path: "career", element: _jsx(CareerPage, {}) },
            { path: "achievements", element: _jsx(AchievementsPage, {}) },
            { path: "downloads", element: _jsx(DownloadsPage, {}) },
            { path: "messages", element: _jsx(MessagesPage, {}) },
            { path: "projects", element: _jsx(ProjectsPage, {}) },
            { path: "skills", element: _jsx(SkillsPage, {}) },
            { path: "testimonials", element: _jsx(TestimonialsPage, {}) },
            { path: "comments", element: _jsx(CommentsPage, {}) },
            { path: "guestbook", element: _jsx(GuestbookPage, {}) },
            { path: "polaroids", element: _jsx(PolaroidsPage, {}) },
            { path: "settings", element: _jsx(SettingsPage, {}) },
        ],
    },
]);
export function Routes() {
    return _jsx(RouterProvider, { router: router });
}
//# sourceMappingURL=index.js.map
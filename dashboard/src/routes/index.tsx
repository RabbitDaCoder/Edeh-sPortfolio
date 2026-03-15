import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

const LoginPage = React.lazy(() =>
  import("../pages/login").then((m) => ({ default: m.LoginPage })),
);
const OverviewPage = React.lazy(() =>
  import("../pages/overview").then((m) => ({ default: m.OverviewPage })),
);
const BlogListPage = React.lazy(() =>
  import("../pages/blog/list").then((m) => ({ default: m.BlogListPage })),
);
const CreateBlogPage = React.lazy(() =>
  import("../pages/blog/create").then((m) => ({ default: m.CreateBlogPage })),
);
const EditBlogPage = React.lazy(() =>
  import("../pages/blog/edit").then((m) => ({ default: m.EditBlogPage })),
);
const BooksPage = React.lazy(() =>
  import("../pages/books").then((m) => ({ default: m.BooksPage })),
);
const CareerPage = React.lazy(() =>
  import("../pages/career").then((m) => ({ default: m.CareerPage })),
);
const AchievementsPage = React.lazy(() =>
  import("../pages/achievements").then((m) => ({
    default: m.AchievementsPage,
  })),
);
const DownloadsPage = React.lazy(() =>
  import("../pages/downloads").then((m) => ({ default: m.DownloadsPage })),
);
const MessagesPage = React.lazy(() =>
  import("../pages/messages").then((m) => ({ default: m.MessagesPage })),
);
const ProjectsPage = React.lazy(() =>
  import("../pages/projects").then((m) => ({ default: m.ProjectsPage })),
);
const SkillsPage = React.lazy(() =>
  import("../pages/skills").then((m) => ({ default: m.SkillsPage })),
);
const TestimonialsPage = React.lazy(() =>
  import("../pages/testimonials").then((m) => ({
    default: m.TestimonialsPage,
  })),
);
const PolaroidsPage = React.lazy(() =>
  import("../pages/polaroids").then((m) => ({
    default: m.PolaroidsPage,
  })),
);
const SettingsPage = React.lazy(() =>
  import("../pages/settings").then((m) => ({ default: m.SettingsPage })),
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "blog", element: <BlogListPage /> },
      { path: "blog/create", element: <CreateBlogPage /> },
      { path: "blog/edit/:id", element: <EditBlogPage /> },
      { path: "books", element: <BooksPage /> },
      { path: "career", element: <CareerPage /> },
      { path: "achievements", element: <AchievementsPage /> },
      { path: "downloads", element: <DownloadsPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "testimonials", element: <TestimonialsPage /> },
      { path: "polaroids", element: <PolaroidsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}

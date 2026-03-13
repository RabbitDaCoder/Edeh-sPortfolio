import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const BlogPage = React.lazy(() =>
  import("../pages/Blog").then((m) => ({ default: m.BlogPage })),
);
const BlogDetailPage = React.lazy(() =>
  import("../pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })),
);
const BooksPage = React.lazy(() =>
  import("../pages/Books").then((m) => ({ default: m.BooksPage })),
);
const BooksDetailPage = React.lazy(() =>
  import("../pages/BooksDetail").then((m) => ({ default: m.BooksDetailPage })),
);
const ContactPage = React.lazy(() =>
  import("../pages/Contact").then((m) => ({ default: m.ContactPage })),
);

export const router = createBrowserRouter([
  { path: "/blog", element: <BlogPage /> },
  { path: "/blog/:slug", element: <BlogDetailPage /> },
  { path: "/books", element: <BooksPage /> },
  { path: "/books/:slug", element: <BooksDetailPage /> },
  { path: "/contact", element: <ContactPage /> },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}

import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const BlogPage = React.lazy(() => import("../pages/Blog").then((m) => ({ default: m.BlogPage })));
const BlogDetailPage = React.lazy(() => import("../pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })));
const BooksPage = React.lazy(() => import("../pages/Books").then((m) => ({ default: m.BooksPage })));
const BooksDetailPage = React.lazy(() => import("../pages/BooksDetail").then((m) => ({ default: m.BooksDetailPage })));
const ContactPage = React.lazy(() => import("../pages/Contact").then((m) => ({ default: m.ContactPage })));
export const router = createBrowserRouter([
    { path: "/blog", element: _jsx(BlogPage, {}) },
    { path: "/blog/:slug", element: _jsx(BlogDetailPage, {}) },
    { path: "/books", element: _jsx(BooksPage, {}) },
    { path: "/books/:slug", element: _jsx(BooksDetailPage, {}) },
    { path: "/contact", element: _jsx(ContactPage, {}) },
]);
export function Routes() {
    return _jsx(RouterProvider, { router: router });
}
//# sourceMappingURL=index.js.map
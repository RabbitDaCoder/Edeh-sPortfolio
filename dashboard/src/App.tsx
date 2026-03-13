import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Routes } from "./routes";
import "./index.css";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            Loading...
          </div>
        }
      >
        <Routes />
      </Suspense>
    </QueryClientProvider>
  );
}

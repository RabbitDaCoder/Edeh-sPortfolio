import vite from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vite()],
  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});

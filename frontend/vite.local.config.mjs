import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(root, "./src"),
      Campus: path.resolve(root, "./src/components/Campus"),
      lodash: "lodash-es",
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react-router-dom", "react-redux", "redux-persist/integration/react", "axios", "react-helmet-async", "lottie-react", "lottie-web", "lodash-es"],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": { target: "http://localhost:8000", changeOrigin: true },
      "/socket.io": { target: "http://localhost:8000", ws: true, changeOrigin: true },
    },
  },
});

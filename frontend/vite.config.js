import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // base: "/", // ✅ ADD THIS
  assetsInclude: ["**/*.lottie"],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Your backend server
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {  // Add this for WebSocket proxying
        target: "http://localhost:8000", // Same as API target
        ws: true,  // Enable WebSocket proxying
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "Campus": path.resolve(__dirname, "./Campus"),
    },
  },
  build: {
    rollupOptions: {
      external: ["mongoose"],
      output: {
        manualChunks(id) {
          // Core React — smallest possible initial chunk
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/scheduler/")) {
            return "react-vendor";
          }
          // Redux
          if (id.includes("node_modules/@reduxjs/") ||
              id.includes("node_modules/react-redux/") ||
              id.includes("node_modules/redux-persist/") ||
              id.includes("node_modules/redux/")) {
            return "redux-vendor";
          }
          // PDF — very heavy, only used on specific pages
          if (id.includes("node_modules/pdfjs-dist/") ||
              id.includes("node_modules/@react-pdf-viewer/") ||
              id.includes("node_modules/react-pdf/")) {
            return "pdf-vendor";
          }
          // Lottie animations
          if (id.includes("node_modules/lottie-react/") ||
              id.includes("node_modules/@lottiefiles/")) {
            return "lottie-vendor";
          }
          // Charts
          if (id.includes("node_modules/chart.js/") ||
              id.includes("node_modules/react-chartjs-2/") ||
              id.includes("node_modules/recharts/")) {
            return "chart-vendor";
          }
          // MUI — heavy, split separately
          if (id.includes("node_modules/@mui/") ||
              id.includes("node_modules/@emotion/")) {
            return "mui-vendor";
          }
          // Three.js — very heavy 3D library
          if (id.includes("node_modules/three/") ||
              id.includes("node_modules/@react-three/")) {
            return "three-vendor";
          }
          // Framer Motion
          if (id.includes("node_modules/framer-motion/")) {
            return "motion-vendor";
          }
          // Radix UI
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix-vendor";
          }
          // Forms
          if (id.includes("node_modules/formik/") ||
              id.includes("node_modules/yup/")) {
            return "form-vendor";
          }
          // Socket.io
          if (id.includes("node_modules/socket.io-client/") ||
              id.includes("node_modules/engine.io-client/")) {
            return "socket-vendor";
          }
          // Swiper
          if (id.includes("node_modules/swiper/")) {
            return "swiper-vendor";
          }
          // Mammoth (docx parser) — heavy
          if (id.includes("node_modules/mammoth/")) {
            return "mammoth-vendor";
          }
          // jsPDF
          if (id.includes("node_modules/jspdf/")) {
            return "jspdf-vendor";
          }
          // react-icons — large icon library
          if (id.includes("node_modules/react-icons/")) {
            return "icons-vendor";
          }
          // lucide-react
          if (id.includes("node_modules/lucide-react/")) {
            return "lucide-vendor";
          }
          // country-state-city — large data library
          if (id.includes("node_modules/country-state-city/")) {
            return "geo-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    // esbuild is built into Vite — no extra install needed
    // drop console/debugger via esbuild options
    esbuildOptions: {
      drop: ["console", "debugger"],
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
      "/socket.io": {
        target: "http://localhost:8000",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

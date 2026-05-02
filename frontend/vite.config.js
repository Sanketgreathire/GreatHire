import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";

export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  plugins: [
    react(),
    compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
    compression({ algorithm: "brotliCompress", ext: ".br", threshold: 1024 }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "Campus": path.resolve(__dirname, "./Campus"),
      "lodash": "lodash-es",
    },
  },
  optimizeDeps: {
    include: [
      "react", "react-dom", "react-router-dom",
      "react-redux", "redux-persist/integration/react",
      "axios", "react-helmet-async",
      "lottie-react", "lottie-web",
      "lodash-es",
      "recharts",
      "recharts/node_modules/react-is",
    ],
    exclude: [
      "pdfjs-dist", "mammoth", "jspdf",
      "country-state-city", "html2canvas",
      "chart.js",
    ],
  },
  build: {
    target: "es2015",
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    rollupOptions: {
      external: ["mongoose"],
      output: {
        manualChunks(id) {
          // Core React — keep small
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/react-router/") ||
              id.includes("node_modules/@remix-run/") ||
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
          // PDF
          if (id.includes("node_modules/pdfjs-dist/") ||
              id.includes("node_modules/@react-pdf-viewer/") ||
              id.includes("node_modules/react-pdf/")) {
            return "pdf-vendor";
          }
          // Lottie — group lottie-web + lottie-react together
          if (id.includes("node_modules/lottie-react/") ||
              id.includes("node_modules/lottie-web/") ||
              id.includes("node_modules/@lottiefiles/")) {
            return "lottie-vendor";
          }
          // Charts
          if (id.includes("node_modules/chart.js/") ||
              id.includes("node_modules/react-chartjs-2/") ||
              id.includes("node_modules/recharts/") ||
              id.includes("node_modules/victory-vendor/") ||
              id.includes("node_modules/d3-")) {
            return "chart-vendor";
          }
          // MUI
          if (id.includes("node_modules/@mui/") ||
              id.includes("node_modules/@emotion/")) {
            return "mui-vendor";
          }
          // Three.js
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
          // Mammoth
          if (id.includes("node_modules/mammoth/")) {
            return "mammoth-vendor";
          }
          // jsPDF
          if (id.includes("node_modules/jspdf/")) {
            return "jspdf-vendor";
          }
          // html2canvas — separate chunk
          if (id.includes("node_modules/html2canvas")) {
            return "html2canvas-vendor";
          }
          // react-icons
          if (id.includes("node_modules/react-icons/")) {
            return "icons-vendor";
          }
          // lucide-react
          if (id.includes("node_modules/lucide-react/")) {
            return "lucide-vendor";
          }
          // country-state-city
          if (id.includes("node_modules/country-state-city/")) {
            return "geo-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",
    modulePreload: {
      // Only preload critical chunks, not heavy vendor chunks
      resolveDependencies: (filename, deps) => {
        return deps.filter(dep =>
          !dep.includes('chart-vendor') &&
          !dep.includes('jspdf-vendor') &&
          !dep.includes('socket-vendor') &&
          !dep.includes('pdf-vendor') &&
          !dep.includes('mammoth-vendor') &&
          !dep.includes('lottie-vendor') &&
          !dep.includes('geo-vendor') &&
          !dep.includes('three-vendor') &&
          !dep.includes('motion-vendor') &&
          !dep.includes('mui-vendor') &&
          !dep.includes('html2canvas-vendor') &&
          !dep.includes('CourseEnrollModal') &&
          !dep.includes('TalkToCounsellorModal')
        );
      },
    },
    esbuildOptions: {
      drop: ["console", "debugger"],
      legalComments: "none",
    },
  },
  server: {
    port: 5173,
    host: true,
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
  preview: {
    port: 4173,
    host: true,
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

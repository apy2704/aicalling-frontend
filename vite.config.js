import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "recoil"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "recoil-vendor": ["recoil"],
          "ui-vendor": ["lottie-react", "framer-motion", "react-icons"],
          "http-vendor": ["axios"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['laptop.adeshgo.in'],
    proxy: {
      '/api': {
        target: 'http://localhost:1601',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

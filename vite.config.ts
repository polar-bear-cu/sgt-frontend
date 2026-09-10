import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), Pages({ dirs: "src/pages" })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

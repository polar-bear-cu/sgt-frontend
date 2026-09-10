import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import Pages from "vite-plugin-pages";

// Dev-only service host ports (see the port scheme in the repo docs).
// The deployed SPA is served from the gateway origin, where these paths are
// routed by nginx instead.
const SERVICE_PORTS = {
  auth: 8084,
  users: 8082,
  subscriptions: 8080,
  reports: 8086,
} as const;

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const gateway = env.VITE_API_PROXY_TARGET || "http://localhost:8000";

  const healthProxy = Object.fromEntries(
    Object.entries(SERVICE_PORTS).map(([name, port]) => [
      `/health/${name}`,
      { target: `http://localhost:${port}`, changeOrigin: true, rewrite: () => "/health" },
    ]),
  );

  return {
    plugins: [react(), tailwindcss(), Pages({ dirs: "src/pages" })],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        ...healthProxy,
        "/api": { target: gateway, changeOrigin: true },
      },
    },
  };
});

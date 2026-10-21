import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const appBase = "/lucky-moment";

export default defineConfig({
  base: `${appBase}/`,
  plugins: [
    react(),
    {
      name: "lucky-moment-route",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const pathname = request.url?.split("?", 1)[0];
          if (pathname === appBase) {
            request.url = `${appBase}/`;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 9087,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:9090",
    },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          react: ["react", "react-dom"],
        },
      },
    },
  },
});

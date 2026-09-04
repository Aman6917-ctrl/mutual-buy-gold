import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ command }) => ({
  server: {
    port: 8080,
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
    tailwindcss(),
  ],
}));

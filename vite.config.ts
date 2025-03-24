import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "components",
        replacement: path.resolve(__dirname, "src/shared/components"),
      },
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "src/shared/components"),
      },
      {
        find: "@/lib",
        replacement: path.resolve(__dirname, "src/shared/lib"),
      },
      {
        find: "shared",
        replacement: path.resolve(__dirname, "src/shared"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});

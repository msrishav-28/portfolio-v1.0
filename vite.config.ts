import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  appType: "mpa",
  build: { cssMinify: false },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "portfolio-markup",
      transformIndexHtml: {
        order: "post",
        handler(html) {
          const markup = readFileSync(
            new URL("./src/portfolio-body.html", import.meta.url),
            "utf8",
          );
          return html.replace(
            '<div id="root"></div>',
            `<div id="root">${markup}</div>`,
          );
        },
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});

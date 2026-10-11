import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Unit and component tests, as in Next.js's Vitest guide; Vite reads the
// `@/` paths from tsconfig itself
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // The server's own build of the marker package, as Next resolves it on
      // the server; the default one throws outside a server bundle
      "server-only": fileURLToPath(
        new URL("node_modules/server-only/empty.js", import.meta.url)
      ),
    },
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test/setup.ts"],
  },
});

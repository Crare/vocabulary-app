/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/vocabulary-app/",
    build: {
        outDir: "build",
    },
    server: {
        port: 3000,
        open: true,
    },
    test: {
        globals: true,
        environment: "node",
        setupFiles: "./src/setupTests.ts",
    },
});

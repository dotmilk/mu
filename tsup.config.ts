import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"], 
  format: ["esm", "cjs", "iife"],
  dts: false,
  clean: true,
  minify: true,
  globalName: "mu",
  outDir: "dist",
  // Add esbuildOptions to handle CSS as text
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.css': 'text', // This treats all CSS imports as strings
    };
  },
});
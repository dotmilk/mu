import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"], // Adjust this to your main entry file
  format: ["esm", "cjs", "iife"], 
  dts: false, // Set to true if you're using TypeScript
  clean: true,
  minify: true,
  globalName: "mu", // Global variable name for IIFE/UMD format
  outDir: "dist"
});
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'mu',
      fileName: 'mu-module',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: false
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: 'src/entry-client.tsx',
      output: {
        entryFileNames: 'entry-client.js',
      },
    },
  },
});

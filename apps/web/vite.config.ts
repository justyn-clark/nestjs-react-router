import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist/client',
    manifest: true,
    rollupOptions: {
      input: 'src/entry-client.tsx',
      output: {
        entryFileNames: 'entry-client.js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});

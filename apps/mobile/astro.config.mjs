import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  build: { assets: '_assets' },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react')) return 'react-vendor';
            if (id.includes('node_modules/dexie')) return 'storage-vendor';
          }
        }
      }
    }
  }
});
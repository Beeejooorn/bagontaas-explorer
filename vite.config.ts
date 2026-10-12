import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative base for flexible GitHub Pages hosting
  base: './',
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});

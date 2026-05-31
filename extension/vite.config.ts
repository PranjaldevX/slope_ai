import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ],
  server: {
    hmr: {
      host: 'localhost',
      port: 5173,
    }
  },
  resolve: {
    alias: {
      'node:module': 'node:module',
      'node:fs': 'node:fs',
      'node:path': 'node:path',
      'node:url': 'node:url'
    }
  },
  build: {
    rollupOptions: {
      external: ['node:module', 'node:fs', 'node:path', 'node:url']
    }
  },
  optimizeDeps: {
    exclude: ['node:module', 'node:fs', 'node:path', 'node:url']
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages-এর জন্য এই লাইনটি অত্যন্ত জরুরি
  base: '/Ai-web/',
  cacheDir: 'C:/savora-src/.vite',
  resolve: {
    alias: {
      react: 'C:/savora-deps/node_modules/react',
      'react-dom': 'C:/savora-deps/node_modules/react-dom',
    },
    preserveSymlinks: true
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      clientPort: 5173
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },
    fs: {
      allow: [
        '.',
        'D:/savora-admin',
        'C:/savora-deps',
        'C:/savora-src'
      ]
    }
  },
  // Build করার সময় কোনো সমস্যা এড়াতে এটি যোগ করা হয়েছে
  build: {
    outDir: 'dist',
  }
})
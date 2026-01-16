import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: {
      '/infosimples': {
        target: 'https://api.infosimples.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/infosimples/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
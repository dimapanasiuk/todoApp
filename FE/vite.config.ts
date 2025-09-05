import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/pages': '/src/pages',
      '@/store': '/src/store',
      '@/api': '/src/api',
      '@/types': '/src/types',
      '@/router': '/src/router',
      '@/utils': '/src/utils'
    }
  }
})

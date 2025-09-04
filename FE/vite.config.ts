import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/router': path.resolve(__dirname, './src/router'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  }
})

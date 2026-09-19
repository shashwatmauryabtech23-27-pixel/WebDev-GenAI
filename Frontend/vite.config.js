import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Import path (Node built-in)
import { fileURLToPath } from 'url'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Tell Vite that '@/' maps directly to your 'src/' directory
      '@': path.resolve(currentDir, './src'),
    },
  },
})

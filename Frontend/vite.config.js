import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: false // Disable CSS minification to bypass lightningcss and missing esbuild dependency crashes on Vercel
  }
})

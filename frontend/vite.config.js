import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Qo'shimcha aliaslar (kerak bo'lsa)
      '@components': path.resolve(__dirname, './src/components'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@api': path.resolve(__dirname, './src/api'),
      '@views': path.resolve(__dirname, './src/views'),
    }
  },

  // Server sozlamalari (ixtiyoriy)
  server: {
    port: 5173,
    open: true
  }
})
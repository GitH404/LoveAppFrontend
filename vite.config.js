import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  publicDir: 'images',
  server: {
    host: '127.0.0.1',
    port: 3000,
    strictPort: true,
  },
})

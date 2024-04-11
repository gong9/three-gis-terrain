import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: '/example/index.html',
  },
  build: {
    rollupOptions: {
      input: './example/index.html',
    },
  },
})

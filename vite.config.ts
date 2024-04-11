import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Three-Terrain',
      fileName: 'index',
      formats: ['es'],
    },
    sourcemap: true,
  },

  plugins: [],
})

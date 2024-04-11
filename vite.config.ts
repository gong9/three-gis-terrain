import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

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

  plugins: [dts({ rollupTypes: true, entryRoot: 'src', outputDir: 'dist/types', include: ['src'], exclude: ['src/Providers/MapProvider/MapWorker.ts', 'src/Providers/MartiniTerrainProvider/MartiniWorker.ts'] })],
})

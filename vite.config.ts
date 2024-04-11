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
    rollupOptions: {
      input: {
        index: 'src/index.ts',
        mapWorker: 'src/Providers/MapProvider/MapWorker.ts',
        martiniWorker: 'src/Providers/MartiniTerrainProvider/MartiniWorker.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('Worker'))
            return 'workers/[name].js'

          return '[name].js'
        },
      },
    },
  },

  plugins: [dts({ rollupTypes: true, entryRoot: 'src', outputDir: 'dist/types', include: ['src'] })],
})

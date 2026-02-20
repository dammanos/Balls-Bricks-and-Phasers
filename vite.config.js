import { defineConfig } from 'vite'

const buildId = new Date().toISOString().replace('T', ' ').slice(0, 19)

export default defineConfig({
  base: './',
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    target: 'es2019',
  },
})

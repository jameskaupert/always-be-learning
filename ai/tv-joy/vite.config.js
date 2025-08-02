import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  define: {
    // Expose environment variables to the frontend
    __TMDB_API_KEY__: JSON.stringify(process.env.VITE_TMDB_API_KEY),
    __USE_MOCK_DATA__: JSON.stringify(process.env.VITE_USE_MOCK_DATA)
  }
})
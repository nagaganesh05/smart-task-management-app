import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Your frontend will run on this port
    proxy: {
      '/api': { // Any request starting with /api
        target: 'http://localhost:5001', // Will be redirected to your backend server
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // Set to true if your backend uses HTTPS, false for HTTP
      },
    },
  },
})
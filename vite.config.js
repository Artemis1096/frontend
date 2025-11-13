// In frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with '/api' will be proxied
      '/api': {
        target: 'https://backend-auction-70m8.onrender.com', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
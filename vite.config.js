import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@fortawesome')) {
              return 'vendor-icons';
            }
            if (id.includes('leaflet')) {
              return 'vendor-leaflet';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

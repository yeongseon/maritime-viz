import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/maritime-viz/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three'
            if (id.includes('@react-three')) return 'r3f'
            if (id.includes('react')) return 'react'
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})

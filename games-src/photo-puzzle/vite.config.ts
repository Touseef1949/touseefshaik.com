import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/games/photo-puzzle/',
  build: {
    outDir: '../../games/photo-puzzle',
    emptyOutDir: true,
  },
})

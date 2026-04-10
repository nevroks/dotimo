import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/dotimo/',
  plugins: [react()],
  resolve: {
    alias: {
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@components': '/src/components/index.ts',
      '@ui': '/src/components/ui/index.ts',
      // '@assets': '/src/assets',
    },
  },
})

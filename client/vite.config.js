import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // C3 - Proxy de desarrollo.
  // Con VITE_API_URL vacío el front pide a /api/productos en su propio
  // origen (localhost:5173) y el dev server de Vite reenvía esa petición
  // al backend. Así no hace falta CORS: el navegador nunca ve que hay dos
  // servidores distintos. Solo aplica en desarrollo (npm run dev).
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})

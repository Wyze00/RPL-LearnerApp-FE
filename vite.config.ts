import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import 'dotenv/config';

const HOST = process.env['HOST'] || 'localhost';
const PORT = process.env['PORT'] || '3000';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target:`http://${HOST}:${PORT}`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
  ,tailwindcss()
  ],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '8c20246917b1.ngrok-free.app'   // 👈 apna ngrok URL yahan likho
    ]
  }
})

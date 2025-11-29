// VoiceGuard AI - Vite Configuration
// Configure Vite: Setup React plugin, define path aliases (@/ for src/), set server port to 5173
// Enable CORS for backend API calls during development (proxy /api to http://localhost:8000)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

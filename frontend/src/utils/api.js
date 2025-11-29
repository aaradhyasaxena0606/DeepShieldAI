// VoiceGuard AI - API Client Module
// Create axios instance with baseURL from import.meta.env.VITE_API_URL
// Export analyzeAudio(audioFile) function: creates FormData, POSTs to /analyze, returns response.data
// Include error handling: catch network errors, timeout after 30s, throw user-friendly error messages

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

export default api

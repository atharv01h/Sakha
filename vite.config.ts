import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/v1/chat/completions': {
        target: 'https://api.openrouter.ai',
        changeOrigin: true,
        secure: true,
        headers: {
          'Authorization': `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Sakha Chatbot'
        }
      }
    }
  }
});
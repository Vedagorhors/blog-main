import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],

  // Настройки сервера разработки, который запускается командой npm run dev.
  server: {
    proxy: {
      // Браузер обращается к Vite, например localhost:5173/api/posts.
      // Vite пересылает этот запрос бэкенду: localhost:3001/api/posts.
      '/api': {
        target: 'http://localhost:3001',
        // В пересылаемом запросе заголовок Host будет указывать на бэкенд.
        changeOrigin: true,
        // rewrite не нужен: Express уже ожидает префикс /api.
      },
    },
  },
})

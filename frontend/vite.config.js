import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // --- ДОБАВЬТЕ ЭТУ СЕКЦИЮ ---
  server: {
    proxy: {
      // Перенаправляем запросы /api на наш бэкенд
      '/api': {
        target: 'http://localhost:3001', // Адрес вашего сервера
        changeOrigin: true, // Необходимо для корректной работы прокси
      },
    },
  },
  // --- КОНЕЦ НОВОЙ СЕКЦИИ ---
});
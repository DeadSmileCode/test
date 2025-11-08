// ./frontend/src/composables/useUser.js

import { ref } from 'vue';

// Глобальная переменная для хранения данных пользователя
const user = ref(null);

// Глобальная переменная для состояния загрузки
const isLoading = ref(false);

export function useUser() {
  // Функция для загрузки или обновления данных пользователя
  const fetchUser = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      user.value = null;
      return;
    }

    isLoading.value = true;
    try {
      const response = await fetch('/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      user.value = await response.json();
      console.log("User state updated:", user.value);
    } catch (error) {
      console.error(error);
      user.value = null; // Сбрасываем пользователя при ошибке
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    fetchUser
  };
}
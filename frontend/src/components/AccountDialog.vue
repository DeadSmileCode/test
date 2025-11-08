// ./components/AccountDialog.vue

<template>
  <div class="dialog-wrapper" v-if="isOpen">
    <div class="overlay" @click="closeDialog"></div>
    <div class="dialog-box">
      <ul>
        <li>
          <a href="/profile">
            <!-- Иконка Профиля -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>My Profile</span>
          </a>
        </li>
        <li>
          <router-link to="/settings">
            <!-- Иконка Настроек -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Settings</span>
          </router-link>
        </li>
        <li>
          <!-- --- НОВОЕ: Добавлен класс 'logout-link' --- -->
          <a href="/logout" class="logout-link">
            <!-- Иконка Выхода -->
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean
});
const emit = defineEmits(['close']);

const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
.dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1010;
  display: flex;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.dialog-box {
  position: absolute;
  top: 80px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  padding: 10px 0;
  min-width: 180px;
  transform: scale(1.1);
  transform-origin: top right;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li a {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

li a:hover {
  background-color: #f0f0f0;
  color: #000;
}

li a svg {
  stroke: #555;
  transition: stroke 0.2s ease;
}

li a:hover svg {
  stroke: #000;
}


/* --- НОВОЕ: Стили для красной ссылки выхода --- */
li a.logout-link {
  color: #e53e3e; /* Красный цвет текста */
}
li a.logout-link svg {
  stroke: #e53e3e; /* Красный цвет иконки */
}

/* --- НОВОЕ: Стили для красной ссылки при наведении --- */
li a.logout-link:hover {
  background-color: #fed7d7; /* Светло-красный фон */
  color: #c53030; /* Темно-красный текст */
}
li a.logout-link:hover svg {
  stroke: #c53030; /* Темно-красный цвет иконки */
}


/* Медиа-запрос для мобильных устройств */
@media (max-width: 768px) {
  .dialog-wrapper {
    align-items: center;
    justify-content: center;
  }
  .overlay {
     background-color: rgba(0, 0, 0, 0.4);
  }
  .dialog-box {
    position: relative;
    top: auto;
    right: auto;
    transform-origin: center;
  }
}
</style>
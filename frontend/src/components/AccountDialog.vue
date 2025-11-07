<template>
  <div class="dialog-wrapper" v-if="isOpen">
    <div class="overlay" @click="closeDialog"></div>
    <div class="dialog-box">
      <ul>
        <!-- Тоже переведем для единообразия -->
        <li><a href="/profile">My Profile</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/logout">Logout</a></li>
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

/* Стили для десктопа */
.dialog-box {
  position: absolute;
  top: 80px; /* Отступ от кружка */
  right: 20px; /* --- ИЗМЕНЕНО: было left: 40px --- */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  padding: 10px 0;
  min-width: 180px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li a {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

li a:hover {
  background-color: #f0f0f0;
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
    right: auto; /* --- ИЗМЕНЕНО: сброс right --- */
  }
}
</style>
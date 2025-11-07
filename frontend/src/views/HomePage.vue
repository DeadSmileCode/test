<template>
  <div class="home-page">
    <!-- Управление вынесено в отдельные блоки для позиционирования -->
    
    <!-- Гамбургер (только на мобильных, слева) -->
    <button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
      <svg viewBox="0 0 100 80" width="24" height="24">
        <rect width="100" height="15" rx="8"></rect>
        <rect y="30" width="100" height="15" rx="8"></rect>
        <rect y="60" width="100" height="15" rx="8"></rect>
      </svg>
    </button>

    <!-- Кружок аккаунта (теперь всегда справа) -->
    <div class="account-control" @click="toggleAccountDialog">
      <div class="account-circle">
        <img src="https://i.pravatar.cc/100" alt="Account">
      </div>
    </div>
    
    <!-- Боковое меню -->
    <SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    
    <!-- Диалог аккаунта -->
    <AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />

    <!-- Центральная часть с островом и мишкой -->
    <main class="main-content">
      <div class="island-container">
        <IslandCanvas class="island-canvas" />
        <div class="bear-wrapper">
          <BearCharacter />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import IslandCanvas from '@/components/IslandCanvas.vue';
import BearCharacter from '@/components/BearCharacter.vue';
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';

const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value <= 768);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => window.addEventListener('resize', updateScreenWidth));
onUnmounted(() => window.removeEventListener('resize', updateScreenWidth));

const isMobileMenuOpen = ref(false);
const isAccountDialogOpen = ref(false);

const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
const toggleAccountDialog = () => isAccountDialogOpen.value = !isAccountDialogOpen.value;
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  background-color: #4A7FA7;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* --- ИЗМЕНЕННЫЕ СТИЛИ ДЛЯ УПРАВЛЕНИЯ --- */
.account-control {
  position: fixed;
  top: 20px;
  right: 20px; /* Изменено с left на right */
  z-index: 1020;
}

.hamburger-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1020;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: white;
}
/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */

.hamburger-btn svg {
  fill: white;
}

.account-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.account-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.island-container {
  width: 60vw;
  height: 40vw;
  max-width: 800px;
  max-height: 500px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bear-wrapper {
  position: absolute;
  transform: translate(-50%, -60%);
  left: 50%;
  top: 50%;
}

@media (max-width: 768px) {
  .island-container {
    width: 90vw;
    height: 60vw;
  }
}
</style>
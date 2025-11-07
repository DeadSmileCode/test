<template>
  <div class="home-page">
    <!-- Гамбургер (только на мобильных) -->
    <button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
      <svg viewBox="0 0 100 80" width="24" height="24">
        <rect width="100" height="15" rx="8"></rect>
        <rect y="30" width="100" height="15" rx="8"></rect>
        <rect y="60" width="100" height="15" rx="8"></rect>
      </svg>
    </button>

    <!-- Кружок аккаунта (справа) -->
    <div class="account-control" @click="toggleAccountDialog">
      <div class="account-circle">
        <img src="https://i.pravatar.cc/100" alt="Account">
      </div>
    </div>
    
    <!-- Компоненты меню и диалогов -->
    <SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    <AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />
    <ExpandIslandDialog :is-open="isExpandDialogOpen" @close="isExpandDialogOpen = false" />

    <!-- Центральная часть -->
    <div class="center-stage">
      <div class="island-rating">
        {{ islandRating.toLocaleString('ru-RU') }} CO<sub>2</sub> kg
      </div>

      <main class="main-content">
        <div class="island-container">
          <IslandCanvas 
            class="island-canvas"
            :points="islandShapePoints"
            :view-box="islandViewBox"
            :corner-radius="30"
          />
          <div class="bear-wrapper">
            <BearCharacter />
          </div>
        </div>
      </main>

      <div class="expand-button-container">
        <button class="expand-button" @click="isExpandDialogOpen = true">
          Expand Island
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Импорты всех компонентов
import BearCharacter from '@/components/BearCharacter.vue';
import IslandCanvas from '@/components/IslandCanvas.vue';
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';
import ExpandIslandDialog from '@/components/ExpandIslandDialog.vue';


// --- ВОССТАНОВЛЕННАЯ ЛОГИКА ДЛЯ АДАПТИВНОСТИ ---
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value <= 768);
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};
onMounted(() => window.addEventListener('resize', updateScreenWidth));
onUnmounted(() => window.removeEventListener('resize', updateScreenWidth));


// --- ВОССТАНОВЛЕННАЯ ЛОГИКА МЕНЮ И ДИАЛОГОВ ---
// Переменные состояния для всех интерактивных окон
const isMobileMenuOpen = ref(false);    // Для гамбургер-меню
const isAccountDialogOpen = ref(false); // для диалога аккаунта
const isExpandDialogOpen = ref(false);    // для диалога расширения острова

// Функции для переключения их состояния
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const toggleAccountDialog = () => {
  isAccountDialogOpen.value = !isAccountDialogOpen.value;
};
// ----------------------------------------------------


// --- Остальные данные страницы ---
const islandRating = ref(15780);

const islandShapePoints = ref([
  { x: -20, y: -80 }, { x: 20, y: -80 }, { x: 20, y: -20 }, { x: 80, y: -20 },
  { x: 80, y: 20 }, { x: 20, y: 20 }, { x: 20, y: 80 }, { x: -20, y: 80 },
  { x: -20, y: 20 }, { x: -80, y: 20 }, { x: -80, y: -20 }, { x: -20, y: -20 },
]);
const islandViewBox = ref({ x: -100, y: -100, width: 200, height: 200 });
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

/* Позиционирование элементов управления */
.account-control {
  position: fixed;
  top: 20px;
  right: 20px;
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

/* Центральная часть с островом и UI */
.center-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.island-rating {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0,0,0,0.25);
}

.island-rating sub {
  font-size: 1rem;
  font-weight: normal;
}

.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.island-container {
  width: 50vw;
  height: 35vw;
  max-width: 700px;
  max-height: 450px;
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

/* Стили для кнопки */
.expand-button {
  background-color: #B3CFE5;
  color: #2c3e50;
  border: none;
  border-radius: 20px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 0 0 #8FA8C0;
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
}

.expand-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 11px 0 0 #8FA8C0;
}

.expand-button:active {
  transform: translateY(2px);
  box-shadow: 0 6px 0 0 #8FA8C0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .center-stage {
    gap: 15px;
  }
  .island-rating {
    font-size: 1.5rem;
  }
  .island-container {
    width: 90vw;
    height: 60vw;
  }
}
</style>
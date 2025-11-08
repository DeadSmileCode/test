<template>
  <div class="stats-page">
    <!-- UI элементы (меню, аккаунт) -->
    <SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    <AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />
    <button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
      <svg viewBox="0 0 100 80" width="24" height="24"><rect width="100" height="15" rx="8"></rect><rect y="30" width="100" height="15" rx="8"></rect><rect y="60" width="100" height="15" rx="8"></rect></svg>
    </button>
    <div class="account-control" @click="toggleAccountDialog">
      <div class="account-circle"><img src="https://i.pravatar.cc/100" alt="Account"></div>
    </div>

    <!-- Контент страницы -->
    <header class="stats-header">
      <h1>Island History</h1>
      <div class="time-selector">
        <button class="stats-button" @click="setView('daily')" :class="{ active: currentView === 'daily' }">Daily</button>
        <button class="stats-button" @click="setView('monthly')" :class="{ active: currentView === 'monthly' }">Monthly</button>
        <button class="stats-button" @click="setView('yearly')" :class="{ active: currentView === 'yearly' }">Yearly</button>
      </div>
    </header>
    <main class="chart-container">
      <TransitionGroup name="bar-list" tag="div" class="chart-bars">
        <div class="bar-wrapper" v-for="item in processedChartData" :key="item.label">
          <div class="bar-value">{{ item.value.toLocaleString() }}</div>
          <div class="iceberg-bar" :style="{ '--bar-scale': item.scaledValue }"></div>
          <div class="bar-label">{{ item.label }}</div>
        </div>
      </TransitionGroup>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value <= 768);
const isMobileMenuOpen = ref(false);
const isAccountDialogOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const toggleAccountDialog = () => { isAccountDialogOpen.value = !isAccountDialogOpen.value; };
onMounted(() => { window.addEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });
onUnmounted(() => { window.removeEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });
const currentView = ref('daily');

const dailyData = [
  { label: 'Day 1', value: 15566 }, { label: 'Day 2', value: 9117 },
  { label: 'Day 3', value: 19375 }, { label: 'Day 4', value: 17931 },
  { label: 'Day 5', value: 7561 }, { label: 'Day 6', value: 5488 },
  { label: 'Day 7', value: 11275 }, { label: 'Day 8', value: 18105 },
  { label: 'Day 9', value: 9658 }, { label: 'Day 10', value: 9811 },
  { label: 'Day 11', value: 8933 }, { label: 'Day 12', value: 18578 }
];
const monthlyData = [ { label: 'Jan', value: 18500 }, { label: 'Feb', value: 22300 }, { label: 'Mar', value: 25000 }, { label: 'Apr', value: 23100 }, { label: 'May', value: 28900 }, { label: 'Jun', value: 31000 }, { label: 'Jul', value: 29500 }, { label: 'Aug', value: 33000 }, ];
const yearlyData = [ { label: '2021', value: 150000 }, { label: '2022', value: 210000 }, { label: '2023', value: 280000 }, ];

const chartData = computed(() => {
  switch (currentView.value) { case 'monthly': return monthlyData; case 'yearly': return yearlyData; default: return dailyData; }
});

const processedChartData = computed(() => {
  const data = chartData.value;
  if (data.length === 0) return [];
  
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  if (range === 0) {
    return data.map(item => ({ ...item, scaledValue: 0.6 }));
  }
  
  return data.map(item => {
    const relativeValue = (item.value - minValue) / range;
    // --- ИЗМЕНЕНИЕ: Уменьшаем базовый размер для большей выразительности ---
    const baseScale = 0.1; // (было 0.3)
    const scaledValue = baseScale + relativeValue * (1 - baseScale);
    return { ...item, scaledValue };
  });
});

const setView = (view) => { currentView.value = view; };
</script>

<style scoped>
/* --- ОБЩИЕ СТИЛИ --- */
.stats-page {
  width: 100vw;
  height: 100vh;
  padding: 20px 40px;
  box-sizing: border-box;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
}

.stats-header {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  padding-top: 20px;
  transition: all 0.3s ease;
}

.chart-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  flex-grow: 1;
  display: flex;
  padding-bottom: 40px;
  box-sizing: border-box;
  padding-top: 30px; 
}

.chart-bars {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
}

/* --- СТИЛИ ДЛЯ DESKTOP (ВЕРТИКАЛЬНЫЕ СТОЛБЦЫ) --- */
.chart-bars {
  justify-content: space-around;
  align-items: flex-end;
}

.bar-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  transition: opacity 0.3s ease-in-out;
}

.bar-value {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1rem;
  font-weight: bold;
}

.iceberg-bar {
  width: 100%;
  max-width: 60px;
  height: calc(var(--bar-scale) * 100%);
  clip-path: polygon(0% 100%, 0% 45%, 20% 50%, 40% 40%, 60% 48%, 80% 42%, 100% 46%, 100% 100%);
}

.bar-label {
  margin-top: 12px;
}

/* --- ЭФФЕКТЫ ПРИ НАВЕДЕНИИ (ТОЛЬКО ДЛЯ DESKTOP) --- */
@media (min-width: 769px) {
  .bar-wrapper {
    cursor: pointer;
  }
  .chart-bars:hover .bar-wrapper {
    opacity: 0.4;
  }
  .chart-bars:hover .bar-wrapper:hover {
    opacity: 1;
  }
}

/* --- СТИЛИ ДЛЯ MOBILE (ГОРИЗОНТАЛЬНЫЕ СТОЛБЦЫ) --- */
@media (max-width: 768px) {
  .stats-page {
    padding: 0;
    overflow-y: auto;
  }
  .stats-header {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding-top: 80px; 
    padding-bottom: 20px;
  }
  .chart-container {
    padding: 0 20px 40px 20px;
    flex-grow: 0; /* --- ИЗМЕНЕНИЕ: Убираем лишнее пространство --- */
  }
  .chart-bars {
    flex-direction: column;
    align-items: stretch;
    gap: 25px;
  }
  .bar-wrapper {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    height: auto;
    gap: 15px;
  }
  .bar-label {
    flex: 0 0 50px;
    order: 1;
    margin-top: 0;
    text-align: left;
    font-size: 0.9rem;
  }
  .iceberg-bar {
    order: 2;
    flex: 1 1 auto;
    height: 35px;
    width: calc(var(--bar-scale) * 100%);
    /* --- ИЗМЕНЕНИЕ: Новая форма стрелки --- */
    clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
  }
  .bar-value {
    order: 3;
    position: static;
    transform: none;
    flex: 0 0 60px;
    text-align: right;
    font-size: 0.9rem;
  }
}

/* --- ОБЩИЕ СТИЛИ ДЛЯ ЭЛЕМЕНТОВ --- */
.account-control { position: fixed; top: 20px; right: 20px; z-index: 1020; }
.hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1020; background: none; border: none; cursor: pointer; padding: 10px; color: white; }
.hamburger-btn svg { fill: white; }
.account-circle { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
.account-circle img { width: 100%; height: 100%; object-fit: cover; }

.stats-header h1 { margin: 0; font-size: 2.5rem; text-shadow: 0 3px 6px rgba(0,0,0,0.25); }
.time-selector { display: flex; gap: 15px; }
.stats-button { background-color: #B3CFE5; color: #2c3e50; border: none; border-radius: 15px; padding: 12px 24px; font-size: 1rem; font-weight: bold; cursor: pointer; box-shadow: 0 6px 0 0 #8FA8C0; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, filter 0.15s; }
.stats-button:hover { transform: translateY(-2px); box-shadow: 0 8px 0 0 #8FA8C0; }
.stats-button:active { transform: translateY(1px); box-shadow: 0 5px 0 0 #8FA8C0; }
.stats-button.active { transform: translateY(2px); box-shadow: 0 4px 0 0 #829cb1; background-color: #a7c4dd; filter: brightness(0.95); }

.iceberg-bar {
  min-width: 20px;
  background: linear-gradient(to right, #ffffff, #B3CFE5);
  border-radius: 5px;
  transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1), height 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.bar-label, .bar-value {
  font-weight: bold;
}

.bar-list-enter-active, .bar-list-leave-active { transition: all 0.5s ease; }
.bar-list-enter-from, .bar-list-leave-to { opacity: 0; transform: translateY(30px); }
</style>
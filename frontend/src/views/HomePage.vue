<template>
  <div class="home-page">
    <!-- UI элементы -->
    <SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    <AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />
    <button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
      <svg viewBox="0 0 100 80" width="24" height="24"><rect width="100" height="15" rx="8"></rect><rect y="30" width="100" height="15" rx="8"></rect><rect y="60" width="100" height="15" rx="8"></rect></svg>
    </button>
    <div class="account-control" @click="toggleAccountDialog">
      <div class="account-circle"><img src="https://i.pravatar.cc/100" alt="Account"></div>
    </div>
    <ExpandIslandDialog :is-open="isExpandDialogOpen" @close="isExpandDialogOpen = false" />

    <!-- Контент страницы -->
    <div v-if="!isMobileTeamView" class="islands-stage">
      <TransitionGroup name="island-fade">
        <IslandDisplay
          v-for="island in desktopIslands"
          :key="island.id"
          :island="island"
          :on-team-page="isTeamPage"
          layout="absolute"
        />
      </TransitionGroup>
    </div>
    <div v-else class="mobile-team-list">
      <IslandDisplay
        v-for="island in mobileIslands"
        :key="island.id"
        :island="island"
        :on-team-page="isTeamPage"
        layout="list"
      />
    </div>

    <!-- Кнопка -->
    <Transition name="fade">
      <div v-if="!isTeamPage" class="expand-button-container">
        <button class="expand-button" @click="isExpandDialogOpen = true">Expand Island</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// Импорты
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';
import ExpandIslandDialog from '@/components/ExpandIslandDialog.vue';
import IslandDisplay from '@/components/IslandDisplay.vue';

// --- ЛОГИКА UI ---
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value <= 768);
const isMobileMenuOpen = ref(false);
const isAccountDialogOpen = ref(false);
const isExpandDialogOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const toggleAccountDialog = () => { isAccountDialogOpen.value = !isAccountDialogOpen.value; };
onMounted(() => { window.addEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });
onUnmounted(() => { window.removeEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });

// --- ЛОГИКА РОУТИНГА И ОТОБРАЖЕНИЯ ---
const route = useRoute();
const isTeamPage = computed(() => route.path === '/team');
const isMobileTeamView = computed(() => isMobile.value && isTeamPage.value);

// --- ДАННЫЕ ОСТРОВОВ (ПОЛНЫЕ) ---
const genericShape = [ { x: -50, y: 0 }, { x: 0, y: -30 }, { x: 50, y: 0 }, { x: 0, y: 30 } ];
const genericViewBox = { x: -55, y: -35, width: 110, height: 70 };
const mainIslandData = { id: 'main', isMain: true, rating: 15780, shape: genericShape, viewBox: genericViewBox };
const teamIslandsData = [
  { id: 'team1', rating: 8450, shape: genericShape, viewBox: genericViewBox, size: 250 },
  { id: 'team2', rating: 11200, shape: genericShape, viewBox: genericViewBox, size: 280 },
  { id: 'team3', rating: 5600, shape: genericShape, viewBox: genericViewBox, size: 220 },
  { id: 'team4', rating: 9100, shape: genericShape, viewBox: genericViewBox, size: 260 },
  { id: 'team5', rating: 7300, shape: genericShape, viewBox: genericViewBox, size: 240 },
];

// --- COMPUTED-СВОЙСТВА ДЛЯ ОСТРОВОВ (ПОЛНЫЕ) ---
const desktopIslands = computed(() => {
  if (isTeamPage.value) {
    const smallMainIsland = { ...mainIslandData, size: 400, x: 0, y: 0 };
    const positionedTeamIslands = teamIslandsData.map((island, index) => {
      const count = teamIslandsData.length;
      const angle = (index / count) * 2 * Math.PI;
      const radius = isMobile.value ? 25 : 35;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle) * 0.7;
      return { ...island, x, y };
    });
    return [smallMainIsland, ...positionedTeamIslands];
  } else {
    const mainSize = isMobile.value ? screenWidth.value * 0.85 : 700;
    return [{ ...mainIslandData, size: mainSize, x: 0, y: 0 }];
  }
});

const mobileIslands = computed(() => {
  const listMainIsland = { ...mainIslandData, size: screenWidth.value * 0.8 };
  const listTeamIslands = teamIslandsData.map(island => ({
    ...island,
    size: screenWidth.value * 0.7
  }));
  return [listMainIsland, ...listTeamIslands];
});
</script>

<style scoped>
.home-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Стили для UI (меню, аккаунт) */
.account-control { position: fixed; top: 20px; right: 20px; z-index: 1020; }
.hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1020; background: none; border: none; cursor: pointer; padding: 10px; color: white; }
.hamburger-btn svg { fill: white; }
.account-circle { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
.account-circle img { width: 100%; height: 100%; object-fit: cover; }

/* Стили для контента (острова) */
.islands-stage { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.mobile-team-list { width: 100%; height: 100%; padding: 80px 0; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 40px; overflow-y: auto; }

/* Стили для кнопки "Expand Island" */
.expand-button-container { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 100; }
.expand-button { background-color: #B3CFE5; color: #2c3e50; border: none; border-radius: 20px; padding: 14px 28px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 8px 0 0 #8FA8C0; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out; }
.expand-button:hover { transform: translateY(-3px); box-shadow: 0 11px 0 0 #8FA8C0; }
.expand-button:active { transform: translateY(2px); box-shadow: 0 6px 0 0 #8FA8C0; }

/* Стили для анимаций */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
.island-fade-enter-active, .island-fade-leave-active { transition: all 0.5s ease-in-out; }
.island-fade-enter-from, .island-fade-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
</style>
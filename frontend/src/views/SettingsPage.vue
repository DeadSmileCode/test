// ./views/SettingsPage.vue

<template>
  <div class="settings-page">
    <!-- UI элементы -->
    <SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
    <AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />
    <button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
      <svg viewBox="0 0 100 80" width="24" height="24"><rect width="100" height="15" rx="8"></rect><rect y="30" width="100" height="15" rx="8"></rect><rect y="60" width="100" height="15" rx="8"></rect></svg>
    </button>
    <div class="account-control" @click="toggleAccountDialog">
      <div class="account-circle"><img src="https://i.pravatar.cc/100" alt="Account"></div>
    </div>

    <!-- Основной контейнер для контента -->
    <div class="settings-container">
      <header class="settings-header">
        <h1>Settings Archipelago</h1>
      </header>
      
      <main class="settings-islands-container">

        <!-- Остров Профиля -->
        <SettingIsland title="My Profile" shape="profile">
          <div class="form-group">
            <label for="username">Player Name</label>
            <input id="username" type="text" v-model="username">
          </div>
          <button class="settings-button">Save Changes</button>
        </SettingIsland>

        <!-- Остров Уведомлений -->
        <SettingIsland title="Notifications" shape="notifications">
          <div class="setting-row">
            <span>Weekly Reports</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="notifications.weeklyReport">
              <span class="slider"></span>
            </label>
          </div>
          <div class="setting-row">
            <span>New Badge Alerts</span>
            <label class="toggle-switch">
              <input type="checkbox" v-model="notifications.newBadges">
              <span class="slider"></span>
            </label>
          </div>
        </SettingIsland>
        
        <!-- Остров Интеграций -->
        <SettingIsland title="Integrations" shape="integrations">
           <div class="setting-row">
              <span>Microsoft 365</span>
              <span class="status-badge" :class="{ 'connected': isMsGraphConnected }">
                {{ isMsGraphConnected ? 'Connected' : 'Disconnected' }}
              </span>
          </div>
          <button class="settings-button" v-if="!isMsGraphConnected" @click="connectGraph">Connect</button>
          <button class="settings-button disconnect" v-else @click="disconnectGraph">Disconnect</button>
        </SettingIsland>
        
        <!-- Остров Выхода из Системы -->
         <SettingIsland title="Log Out" shape="logout">
          <p>Are you sure you want to end your session?</p>
          <button class="settings-button logout" @click="logout">Log Out</button>
        </SettingIsland>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';
import SettingIsland from '@/components/SettingIsland.vue'; // <-- ИМПОРТ НОВОГО КОМПОНЕНТА

// --- UI State (ИСПРАВЛЕНО) ---
const screenWidth = ref(window.innerWidth);
onMounted(() => window.addEventListener('resize', () => { screenWidth.value = window.innerWidth; }));
onUnmounted(() => window.removeEventListener('resize', () => { screenWidth.value = window.innerWidth; }));
const isMobile = computed(() => screenWidth.value <= 768);

const isMobileMenuOpen = ref(false);
const isAccountDialogOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const toggleAccountDialog = () => { isAccountDialogOpen.value = !isAccountDialogOpen.value; };

// --- Settings State (ИСПРАВЛЕНО) ---
const username = ref('Player Bear'); // <-- Заменено некорректное значение
const notifications = ref({ weeklyReport: true, newBadges: false });
const isMsGraphConnected = ref(false);

// --- Methods ---
const connectGraph = () => { isMsGraphConnected.value = true; };
const disconnectGraph = () => { if (confirm('Are you sure you want to disconnect?')) { isMsGraphConnected.value = false; } };
const logout = () => { console.log('User logged out.'); alert('Logged out!'); };
</script>

<style scoped>
/* --- Page Layout --- */
.settings-page {
  width: 100vw;
  height: 100vh;
  color: white;
}
.settings-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 80px 40px 40px 140px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.settings-header {
  text-align: center;
}
.settings-header h1 {
  margin: 0;
  font-size: 2.5rem;
  text-shadow: 0 3px 6px rgba(0,0,0,0.25);
}
.settings-islands-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 60px 50px; /* Увеличил вертикальный отступ для тени */
  width: 100%;
  max-width: 1100px;
}

/* --- Form Elements (стили контента островов) --- */
.form-group {
  display: flex;
  flex-direction: column;
  width: 80%;
}
.form-group label {
  font-size: 0.9rem;
  color: #3a6994;
  margin-bottom: 5px;
}
input[type="text"] {
  border: none;
  background-color: white;
  padding: 12px 18px;
  border-radius: 15px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  box-sizing: border-box;
}
.settings-button {
  background-color: white;
  color: #2c3e50;
  border: none;
  border-radius: 20px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 6px 0 0 rgba(0,0,0,0.15);
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
}
.settings-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 0 rgba(0,0,0,0.15);
}
.settings-button:active {
  transform: translateY(1px);
  box-shadow: 0 5px 0 0 rgba(0,0,0,0.15);
}

/* --- Toggle Switch & Rows --- */
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #2c3e50;
  font-weight: 500;
}
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  border-radius: 28px;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}
input:checked + .slider {
  background-color: #4A7FA7;
}
input:checked + .slider:before {
  transform: translateX(22px);
}

/* --- Status Badge --- */
.status-badge {
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  background-color: #e0e0e0;
  color: #757575;
}
.status-badge.connected {
  background-color: #3d8b40;
  color: white;
}

/* --- Logout & Disconnect Buttons --- */
.settings-button.logout {
  background-color: #757575;
  color: white;
}
.settings-button.disconnect {
  background-color: #e57373;
  color: white;
}
.settings-islands-container p {
  color: #424242;
  margin: 0;
}


/* --- Mobile View --- */
@media (max-width: 768px) {
  .settings-container {
    padding: 80px 20px 40px 20px;
  }
  .settings-islands-container {
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
}

/* --- UI Elements --- */
.account-control { position: fixed; top: 20px; right: 20px; z-index: 1020; }
.hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1020; background: none; border: none; cursor: pointer; padding: 10px; color: white; }
.hamburger-btn svg { fill: white; }
.account-circle { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
.account-circle img { width: 100%; height: 100%; object-fit: cover; }
</style>
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import StatsPage from '../views/StatsPage.vue'; // <-- 1. ИМПОРТИРУЕМ новый компонент

// Можно оставить заглушку только для /soon
const Soon = { template: '<div>Coming Soon</div>' }; 

const routes = [
  { path: '/', name: 'Home', component: HomePage, },
  { path: '/team', name: 'Team', component: HomePage, },
  { 
    path: '/stats', 
    name: 'Statistic', 
    component: StatsPage, // <-- 2. ИСПОЛЬЗУЕМ его здесь
  },
  { path: '/soon', name: 'Soon', component: Soon },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
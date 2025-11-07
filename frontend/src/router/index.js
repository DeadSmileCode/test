import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  // Здесь могут быть ваши другие страницы
  // { path: '/about', name: 'About', component: AboutPage },
];

const router = createRouter({
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Просто вызываем createWebHistory() без аргументов.
  // Он автоматически определит базовый путь.
  history: createWebHistory(), 
  routes,
});

export default router;
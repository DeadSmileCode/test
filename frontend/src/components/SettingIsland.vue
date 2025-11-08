// ./components/SettingIsland.vue

<template>
  <div class="setting-island-wrapper">
    <div class="island-body" :class="`shape--${shape}`">
      <div class="island-content">
        <h2 v-if="title">{{ title }}</h2>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: false
  },
  shape: {
    type: String,
    default: 'profile',
    validator: (value) => ['profile', 'notifications', 'integrations', 'logout'].includes(value)
  }
});
</script>

<style scoped>
.setting-island-wrapper {
  width: 450px;
  height: 320px;
  position: relative;
}

.island-body {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: #8FA8C0;
  z-index: 2; /* Основное тело НАД тенью */
  transition: transform 0.2s ease-out;
}

/* Тень создается через псевдо-элемент */
.island-body::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: #B3CFE5;
  transform: translate(-10px, -10px);
  z-index: -1; /* Тень ПОД основным телом */
  transition: transform 0.2s ease-out;
}

.setting-island-wrapper:hover .island-body {
  transform: translate(2px, 2px);
}
.setting-island-wrapper:hover .island-body::before {
  transform: translate(-14px, -14px);
}


/* Уникальные формы через border-radius */
.shape--profile, .shape--profile::before {
  border-radius: 65% 35% 66% 34% / 48% 65% 35% 52%;
}
.shape--notifications, .shape--notifications::before {
  border-radius: 40px 60px 40px 60px / 30px 50px 30px 50px;
}
.shape--integrations, .shape--integrations::before {
  border-radius: 50%;
}
.shape--logout, .shape--logout::before {
  border-radius: 73% 27% 31% 69% / 54% 30% 70% 46%;
  background-color: #e0e0e0;
}
.shape--logout::before {
  background-color: #bdbdbd;
}


/* Содержимое острова */
.island-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 40px;
  box-sizing: border-box;
  gap: 25px;
  text-align: center;
  height: 100%;
}

.island-content h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .setting-island-wrapper {
    width: 90vw;
    max-width: 450px;
    height: auto;
    min-height: 280px;
  }
}
</style>
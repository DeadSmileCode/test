<template>
	<div class="menu-container" :class="{ open: isOpen, mobile: isMobile }">
		<!-- Затемняющий фон для мобильной версии -->
		<div v-if="isMobile && isOpen" class="overlay" @click="closeMenu"></div>
		
		<nav class="menu-nav">
			<ul>
				<!-- Текст переведен на английский -->
				<li><router-link to="/">Home</router-link></li>
				<li><router-link to="/team">Teams</router-link></li>
				<li><router-link to="/stats">Statistics</router-link></li>
				<!-- <li><router-link to="/soon">Soon</router-link></li> -->
			</ul>
		</nav>
	</div>
</template>

<script setup>
defineProps({
	isOpen: Boolean,
	isMobile: Boolean
});

const emit = defineEmits(['close']);

const closeMenu = () => {
	emit('close');
};
</script>

<style scoped>
/* Стили для десктопа */
.menu-container {
	position: fixed;
	left: 40px;
	top: 50%;
	transform: translateY(-50%);
	z-index: 1000;
}

.menu-nav ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.menu-nav li {
	margin-bottom: 20px;
}

/* --- НОВЫЕ СТИЛИ ДЛЯ ССЫЛОК И ЭФФЕКТА НАВЕДЕНИЯ --- */
.menu-nav a {
	position: relative; /* Нужно для позиционирования псевдо-элемента */
	text-decoration: none;
	color: white;
	font-size: 24px;
	font-weight: bold;
	padding-bottom: 5px; /* Небольшой отступ для подчеркивания */
}

/* Создаем псевдо-элемент для линии подчеркивания */
.menu-nav a::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 2px;
	background-color: white;
	bottom: 0;
	left: 0;
	transform: scaleX(0); /* Изначально линия невидима (масштаб по X = 0) */
	transform-origin: left; /* Анимация будет идти слева направо */
	transition: transform 0.3s ease-in-out;
}

/* При наведении масштабируем линию до полной ширины */
.menu-nav a:hover::after {
	transform: scaleX(1);
}
/* --- КОНЕЦ НОВЫХ СТИЛЕЙ --- */


/* Стили для мобильной версии (остаются без изменений) */
.menu-container.mobile {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transform: none;
	visibility: hidden;
}

.menu-container.mobile.open {
	visibility: visible;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.menu-container.mobile.open .overlay {
	opacity: 1;
}

.menu-container.mobile .menu-nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 80%;
	height: 100%;
	background-color: #3a6994;
	transform: translateX(-100%);
	transition: transform 0.3s ease-in-out;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
}

.menu-container.mobile.open .menu-nav {
	transform: translateX(0);
}
</style>
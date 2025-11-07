<template>
	<div class="bear-container">
		<!-- Это SVG минималистичного мишки. Вы можете заменить его на свой компонент -->
		<!-- <svg 
			viewBox="0 0 100 100" 
			xmlns="http://www.w3.org/2000/svg"
			class="bear-svg"
		>
			<g stroke="#333" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"> -->
				<!-- Голова -->
				<!-- <circle cx="50" cy="40" r="15"/> -->
				<!-- Уши -->
				<!-- <circle cx="38" cy="28" r="5"/> -->
				<!-- <circle cx="62" cy="28" r="5"/> -->
				<!-- Тело -->
				<!-- <path d="M50 55 v 20 a 15 15 0 0 0 30 0 v -20"/> -->
				<!-- <path d="M50 55 v 20 a 15 15 0 0 1 -30 0 v -20"/> -->
				<!-- Глаза -->
				<!-- <circle cx="45" cy="40" r="1" fill="#333"/> -->
				<!-- <circle cx="55" cy="40" r="1" fill="#333"/> -->
				<!-- Нос -->
				<!-- <path d="M50 45 l -2 2 l 4 0 Z" fill="#333"/> -->
			<!-- </g> -->
		<!-- </svg> -->
	</div>
</template>

<style scoped>
.bear-container {
	width: 100px;
	height: 100px;
	/* Анимация покачивания для примера */
	animation: sway 5s ease-in-out infinite;
}

.bear-svg {
	width: 100%;
	height: 100%;
}

@keyframes sway {
	0%, 100% {
		transform: rotate(-2deg);
	}
	50% {
		transform: rotate(2deg);
	}
}
</style>
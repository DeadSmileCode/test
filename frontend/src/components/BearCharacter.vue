<template>
	<div class="bear-container" :style="positionStyle">
		<!-- НОВАЯ ОБЕРТКА, отвечающая только за разворот -->
		<div class="bear-flipper" :class="{ 'is-flipped': isFacingRight }">
		 <svg
	 viewBox="0 0 48 48"
	 xmlns="http://www.w3.org/2000/svg"
	 class="bear-svg"
	 id="svg1">
	<defs
		 id="defs1" />
	<g
		 id="layer1">
		<path
			 style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
			 d="m 7.2883885,18.516855 c 1.122897,-1.08321 2.4838704,-3.706623 4.5146285,-3.917604 2.030758,-0.210981 0.295734,-2.013744 1.230124,-2.105159 2.101578,-0.205607 -0.370022,2.122436 1.594913,2.024447 1.964935,-0.09799 2.700355,-0.204748 3.789706,-0.436226 5.806085,-1.233736 14.564226,-2.823656 17.357521,0.636788 3.576107,4.430223 0.355795,15.630953 -0.494382,16.344569 -0.850177,0.713616 -3.895131,0 -3.895131,0 l -0.03679,-3.480976 0.05992,0.01367 0.0368,3.467311 c 0,0 -2.587345,0.961165 -3.655431,0.05992 -1.068086,-0.90124 0.347321,-3.593612 -0.719101,-4.674158 -1.066422,-1.080546 -6.014233,-1.027543 -7.116105,0.05992 -1.101871,1.087469 0.256377,3.878482 -0.719101,4.734083 -0.975478,0.855601 -2.996255,0.05992 -2.996255,0.05992 l -0.271236,-3.71227 h 0.257567 l 0.01367,3.65235 c 0,0 -2.031532,0.905159 -3.116105,0 C 12.039018,30.338282 13.61255,27.41779 12.16479,25.970032 11.561661,25.366904 7.9614275,24.494679 6.9839135,24.366612 5.6149946,24.187265 4.8337559,24.833756 4.1498128,24.149813 3.2280286,23.228029 2.4081831,20.142087 3.3600199,20.319163 c 0.8382857,0.155952 1.3800178,0.912931 -0.1468181,0.139736 -0.9004283,-0.455981 2.952291,-0.858834 4.0751867,-1.942044 z"
			 id="path1"
			 sodipodi:nodetypes="zzszsczcccczzzzcccczsssssz" />
		<circle
			 style="fill:#000000;fill-opacity:1;stroke:none;stroke-width:1.25926;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:none;stroke-opacity:1"
			 id="path2"
			 cx="10.792073"
			 cy="18.150307"
			 r="0.64148688" />
	</g>
</svg>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const x = ref(0);
const y = ref(0);

// --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ОТСЛЕЖИВАНИЯ НАПРАВЛЕНИЯ ---
const lastX = ref(0); // Где мишка был в прошлый раз
const isFacingRight = ref(false); // Куда он сейчас смотрит (false = налево, true = направо)

const wanderZone = { x: 50, y: 25 }; 
let intervalId = null;

onMounted(() => {
	intervalId = setInterval(() => {
		const targetX = (Math.random() - 0.5) * 2 * wanderZone.x;
		const targetY = (Math.random() - 0.5) * 2 * wanderZone.y;

		// --- ЛОГИКА ОПРЕДЕЛЕНИЯ НАПРАВЛЕНИЯ ---
		// Сравниваем новую цель с предыдущей позицией
		if (targetX > lastX.value) {
			isFacingRight.value = true; // Двигается вправо
		} else if (targetX < lastX.value) {
			isFacingRight.value = false; // Двигается влево
		}
		// Если targetX === lastX.value, направление не меняем

		// Применяем новое положение
		x.value = targetX;
		y.value = targetY;

		// Запоминаем текущую позицию для следующего раза
		lastX.value = targetX;

	}, 2500);
});

onUnmounted(() => {
	clearInterval(intervalId);
});

const positionStyle = computed(() => ({
	transform: `translate(${x.value}px, ${y.value}px)`,
}));
</script>

<style scoped>
/* Родительский контейнер отвечает за ПЕРЕМЕЩЕНИЕ */
.bear-container {
	width: 100px;
	height: 100px;
	transition: transform 2s linear; 
}

/* НОВЫЙ СТИЛЬ: Обертка отвечает за ПЛАВНЫЙ РАЗВОРОТ */
.bear-flipper {
	width: 100%;
	height: 100%;
	transition: transform 0.4s ease-in-out; /* Анимация самого разворота */
}
.bear-flipper.is-flipped {
	transform: scaleX(-1); /* Отзеркаливание */
}

/* SVG отвечает за ПОКАЧИВАНИЕ (ходьбу) */
.bear-svg {
	width: 100%;
	height: 100%;
	animation: walk-bounce 0.7s ease-in-out infinite;
}

@keyframes walk-bounce {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-4px);
	}
}
</style>
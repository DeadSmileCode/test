<template>
	<canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
	points: {
		type: Array,
		default: () => [
			{ x: 0.2, y: 0.6 },
			{ x: 0.5, y: 0.3 },
			{ x: 0.8, y: 0.6 },
			{ x: 0.5, y: 0.9 }
		]
	},
	// 1. Цвет изменен на запрошенный
	color: {
		type: String,
		default: '#B3CFE5' // Новый цвет острова
	},
	// 2. Добавляем пропсы для "толщины"
	shadowColor: {
		type: String,
		default: '#8FA8C0' // Более темный оттенок для боковой грани
	},
	thickness: {
		type: Number,
		default: 10 // Толщина в пикселях
	}
});

const canvasRef = ref(null);

const drawIsland = () => {
	const canvas = canvasRef.value;
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	ctx.scale(dpr, dpr);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (props.points.length < 2) return;

	const scaledPoints = props.points.map(p => ({
		x: p.x * rect.width,
		y: p.y * rect.height
	}));
	
	// --- 3. Рисуем "толщину" (нижний слой) ---
	const shadowPoints = scaledPoints.map(p => ({
		x: p.x,
		y: p.y + props.thickness // Смещаем каждую точку вниз
	}));
	
	ctx.fillStyle = props.shadowColor;
	ctx.beginPath();
	ctx.moveTo(
		(shadowPoints[0].x + shadowPoints[shadowPoints.length - 1].x) / 2,
		(shadowPoints[0].y + shadowPoints[shadowPoints.length - 1].y) / 2
	);
	
	for (let i = 0; i < shadowPoints.length; i++) {
		const p1 = shadowPoints[i];
		const p2 = shadowPoints[(i + 1) % shadowPoints.length];
		ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
	}
	ctx.closePath();
	ctx.fill();

	// --- 4. Рисуем основную фигуру (верхний слой) ---
	ctx.fillStyle = props.color;
	ctx.beginPath();
	ctx.moveTo(
		(scaledPoints[0].x + scaledPoints[scaledPoints.length - 1].x) / 2,
		(scaledPoints[0].y + scaledPoints[scaledPoints.length - 1].y) / 2
	);
	
	for (let i = 0; i < scaledPoints.length; i++) {
		const p1 = scaledPoints[i];
		const p2 = scaledPoints[(i + 1) % scaledPoints.length];
		ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
	}

	ctx.closePath();
	ctx.fill();
};

onMounted(() => {
	drawIsland();
	window.addEventListener('resize', drawIsland);
});

onUnmounted(() => {
	window.removeEventListener('resize', drawIsland);
});

watch(props, drawIsland, { deep: true });
</script>

<style scoped>
canvas {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
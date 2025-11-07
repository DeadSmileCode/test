<template>
	<canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
	points: {
		type: Array,
		required: true,
		default: () => []
	},
	viewBox: {
		type: Object,
		default: () => ({ x: -100, y: -100, width: 200, height: 200 })
	},
	color: {
		type: String,
		default: '#B3CFE5'
	},
	shadowColor: {
		type: String,
		default: '#8FA8C0'
	},
	thickness: {
		type: Number,
		default: 10
	},
	// --- НОВЫЙ PROP ДЛЯ СКРУГЛЕНИЯ ---
	cornerRadius: {
		type: Number,
		default: 0 // По умолчанию углы острые
	}
});

const canvasRef = ref(null);

// Функция отрисовки фигуры теперь учитывает радиус скругления
const drawShape = (ctx, pointsToDraw, color, radius) => {
	if (pointsToDraw.length < 3) return; // Скруглять можно только фигуры от 3 углов

	ctx.fillStyle = color;
	ctx.beginPath();

	// Если радиус не задан, рисуем обычный полигон с острыми углами
	if (!radius || radius <= 0) {
		ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);
		for (let i = 1; i < pointsToDraw.length; i++) {
			ctx.lineTo(pointsToDraw[i].x, pointsToDraw[i].y);
		}
	} else {
		// Логика для скругленных углов
		// Начинаем с точки на последнем отрезке, чтобы правильно замкнуть контур
		ctx.moveTo(
			(pointsToDraw[pointsToDraw.length - 1].x + pointsToDraw[0].x) / 2,
			(pointsToDraw[pointsToDraw.length - 1].y + pointsToDraw[0].y) / 2
		);

		// Проходим по всем вершинам, используя их как контрольные точки для arcTo
		for (let i = 0; i < pointsToDraw.length; i++) {
			const p1 = pointsToDraw[i];
			const p2 = pointsToDraw[(i + 1) % pointsToDraw.length];
			// arcTo(x1, y1, x2, y2, radius) рисует дугу к касательной, проходящей через (x1, y1) и (x2, y2)
			ctx.arcTo(p1.x, p1.y, p2.x, p2.y, radius);
		}
	}

	ctx.closePath();
	ctx.fill();
};

const renderCanvas = () => {
	const canvas = canvasRef.value;
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	ctx.scale(dpr, dpr);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const mapPointToCanvas = (point) => {
		const canvasX = ((point.x - props.viewBox.x) / props.viewBox.width) * rect.width;
		const canvasY = ((point.y - props.viewBox.y) / props.viewBox.height) * rect.height;
		return { x: canvasX, y: canvasY };
	};

	const scaledPoints = props.points.map(mapPointToCanvas);

	// Передаем cornerRadius в обе функции отрисовки
	const shadowPoints = scaledPoints.map(p => ({ x: p.x, y: p.y + props.thickness }));
	drawShape(ctx, shadowPoints, props.shadowColor, props.cornerRadius);

	drawShape(ctx, scaledPoints, props.color, props.cornerRadius);
};

onMounted(() => {
	renderCanvas();
	window.addEventListener('resize', renderCanvas);
});

onUnmounted(() => {
	window.removeEventListener('resize', renderCanvas);
});

watch(props, renderCanvas, { deep: true });

</script>

<style scoped>
canvas {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
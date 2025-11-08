<template>
	<canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// --- PROPS (без изменений) ---
const props = defineProps({
	points: { type: Array, required: true, default: () => [] },
	viewBox: { type: Object, default: () => ({ x: -100, y: -100, width: 20000, height: 2000 }) },
	color: { type: String, default: '#B3CFE5' },
	shadowColor: { type: String, default: '#8FA8C0' },
	thickness: { type: Number, default: 10 },
	cornerRadius: { type: Number, default: 0 }
});

// --- EMITS (без изменений) ---
const emit = defineEmits(['update:points']);

// --- REFS И СОСТОЯНИЕ (без изменений) ---
const canvasRef = ref(null);

// --- ФУНКЦИИ ОТРИСОВКИ (без изменений) ---


// const renderCanvas = () => {
// 	const canvas = canvasRef.value;
// 	if (!canvas) return;
// 	const ctx = canvas.getContext('2d');
// 	const dpr = window.devicePixelRatio || 1;
// 	const rect = canvas.getBoundingClientRect();
// 	canvas.width = rect.width * dpr;
// 	canvas.height = rect.height * dpr;
	
// 	ctx.save();
// 	ctx.scale(dpr, dpr);
// 	ctx.clearRect(0, 0, rect.width, rect.height);


// 	function isoProject(vertices, options = {}) {
// 	    const cos30 = Math.sqrt(3) / 2; // ≈0.866
// 	    const sin30 = 0.5;
	    
// 	    const scale = options.scale || 100;      
// 	    const offsetX = options.offsetX || 0;    
// 	    const offsetY = options.offsetY || 0;    
	    
// 	    return vertices.map(({x, y, z = 0}) => {
//         // классическая изометрическая проекция (Z добавляет высоту)
// 	        const isoX = (x - y) * cos30;
// 	        const isoY = (x + y) * sin30 - z;  // вычитаем z, чтобы верх был выше
// 	        return {
// 	            x: offsetX + isoX * scale,
// 	            y: offsetY + isoY * scale
// 	        };
// 	    });
// 	}

// 	let pointsToRender = isoProject(props.points, {
// 		scale: 100, // масштабируем до пикселей
// 		offsetX: rect.width / 2,  // центрируем по X
// 		offsetY: rect.height / 2  // центрируем по Y
// 	});
	

// 	if (pointsToRender.length < 2) {
// 		ctx.restore();
// 		return;
// 	}

// 	console.log(pointsToRender)

	

// 	drawShape(ctx, pointsToRender.map(p => ({ x: p.x, y: p.y + props.thickness })), props.shadowColor, props.cornerRadius);
// 	drawShape(ctx, pointsToRender, props.color, props.cornerRadius);
	
// 	ctx.restore();
// };
// 
// 
function renderCanvas() {
    const canvas = canvasRef.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    function isoProject(vertices, scale = 1, offsetX = 0, offsetY = 0) {
        const cos30 = Math.sqrt(3) / 2;
        const sin30 = 0.5;
        return vertices.map(({x, y, z = 0}) => {
            const isoX = (x - y) * cos30;
            const isoY = (x + y) * sin30 - z;
            return { x: isoX * scale + offsetX, y: isoY * scale + offsetY };
        });
    }

    if (props.points.length < 2) {
        ctx.restore();
        return;
    }

    // --- Вычисляем диапазон исходных координат ---
    const xs = props.points.map(p => p.x);
    const ys = props.points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // --- Подбираем масштаб, чтобы фигура поместилась на canvas ---
    const figWidth = (maxX - minX) * Math.sqrt(3); // прибл. изометрическая ширина
    const figHeight = (maxY - minY) * 1; // прибл. высота (без Z)
    const scaleX = rect.width / figWidth * 0.8; // 0.8 - небольшой отступ
    const scaleY = rect.height / figHeight * 0.8;
    const scale = Math.min(scaleX, scaleY);

    // --- Смещаем в центр canvas ---
    const offsetX = rect.width / 2;
    const offsetY = rect.height / 2;

    const pointsToRender = isoProject(props.points, scale, offsetX, offsetY);

    drawShape(ctx, pointsToRender.map(p => ({ x: p.x, y: p.y + props.thickness })), props.shadowColor, props.cornerRadius);
    drawShape(ctx, pointsToRender, props.color, props.cornerRadius);

    ctx.restore();
}



const drawShape = (ctx, pointsToDraw, color, radius) => {
	if (pointsToDraw.length < 2) return;
	ctx.fillStyle = color;
	ctx.beginPath();
	if (pointsToDraw.length < 3 || !radius || radius <= 0) {
		ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);
		for (let i = 1; i < pointsToDraw.length; i++) {
			ctx.lineTo(pointsToDraw[i].x, pointsToDraw[i].y);
		}
	} else {
		ctx.moveTo((pointsToDraw[pointsToDraw.length - 1].x + pointsToDraw[0].x) / 2, (pointsToDraw[pointsToDraw.length - 1].y + pointsToDraw[0].y) / 2);
		for (let i = 0; i < pointsToDraw.length; i++) {
			const p1 = pointsToDraw[i];
			const p2 = pointsToDraw[(i + 1) % pointsToDraw.length];
			ctx.arcTo(p1.x, p1.y, p2.x, p2.y, radius);
		}
	}
	ctx.closePath();
	ctx.fill();
};


// --- LIFECYCLE HOOKS & EXPOSE (без изменений) ---
onMounted(() => {
	renderCanvas();
	window.addEventListener('resize', renderCanvas);
});
// watch(() => props.points, () => {
// 	if (!isAnimating.value) {
// 		renderCanvas();
// 	}
// }, { deep: true });
watch(() => props.color, renderCanvas);

// defineExpose({ expandIsland });
</script>

<style scoped>
canvas {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
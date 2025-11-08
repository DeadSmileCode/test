<!-- src/components/IslandDisplay.vue -->
<template>
	<div
		class="island-wrapper"
		:class="{ 'list-layout': layout === 'list' }"
		:style="positionStyle"
	>
		<div 
			class="island-rating-display" 
			:class="{ 'main-island-rating': island.isMain && onTeamPage }"
		>
			{{ island.rating.toLocaleString('ru-RU') }}
		</div>
		
		<div class="island-canvas-container" :style="sizeStyle">
			<IslandCanvas
				:points="island.shape"
				:view-box="island.viewBox"
				:corner-radius="20"
			/>
			<div v-if="island.isMain" class="bear-wrapper">
				<BearCharacter />
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import IslandCanvas from './IslandCanvas.vue';
import BearCharacter from './BearCharacter.vue';

const props = defineProps({
	island: { type: Object, required: true },
	onTeamPage: { type: Boolean, default: false },
	// НОВЫЙ PROP для управления поведением
	layout: { type: String, default: 'absolute' } // 'absolute' or 'list'
});

const positionStyle = computed(() => {
	// Если это элемент списка, позиционирование не нужно
	if (props.layout === 'list') {
		return {};
	}
	// Иначе возвращаем абсолютные координаты
	return {
		left: `${50 + props.island.x}%`,
		top: `${50 + props.island.y}%`,
		transform: `translate(-50%, -50%)`,
	};
});

const sizeStyle = computed(() => ({
	width: `${props.island.size}px`,
	height: `${props.island.size * 0.7}px`,
}));
</script>

<style scoped>
/* Стиль по умолчанию для абсолютного позиционирования */
.island-wrapper {
	position: absolute;
	transition: all 0.5s ease-in-out;
}

/* НОВЫЙ СТИЛЬ: Переопределяем поведение для макета списка */
.island-wrapper.list-layout {
	position: relative;
	left: auto;
	top: auto;
	transform: none;
	/* Добавим отступ снизу для красоты */
	margin-bottom: 30px; 
}

/* Остальные стили без изменений */
.island-rating-display {
	position: absolute;
	top: -40px;
	left: 50%;
	transform: translateX(-50%);
	color: white;
	font-size: 1.5rem;
	font-weight: bold;
	text-shadow: 0 2px 4px rgba(0,0,0,0.3);
	transition: color 0.5s ease;
}
.main-island-rating { color: rgba(255, 255, 255, 0.6); }
.island-canvas-container {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: width 0.5s ease-in-out, height 0.5s ease-in-out;
}
.bear-wrapper {
	position: absolute;
	transform: translate(-50%, -60%) scale(0.8);
	left: 50%;
	top: 50%;
}
</style>
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
			{{ (island.rating || 0).toLocaleString('ru-RU') }} Kg
		</div>
		
		<div class="island-canvas-container" :style="sizeStyle">
			<IslandCanvas
				ref="islandCanvasRef"
				:points="points"
				:view-box="island.viewBox"
				:corner-radius="20"
				@update:points="onPointsUpdate"
			/>
			<div v-if="island.isMain" class="bear-wrapper">
				<BearCharacter />
			</div>
		</div>
	</div>
</template>





<script setup>
import { computed, ref } from 'vue';
import IslandCanvas from './IslandCanvas.vue';
import BearCharacter from './BearCharacter.vue';

const islandCanvasRef = ref(null);

const props = defineProps({
	island: { type: Object, required: true },
	points: { type: Array, required: true },
	onTeamPage: { type: Boolean, default: false },
	layout: { type: String, default: 'absolute' }
});

const emit = defineEmits(['update:points']);

const triggerExpansion = (options) => {
	if (islandCanvasRef.value) {
		islandCanvasRef.value.expandIsland(options);
	}
};

const positionStyle = computed(() => {
	if (props.layout === 'list') {
		return {};
	}
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
/* Ваши стили остаются без изменений */
.island-wrapper { position: absolute; transition: all 0.5s ease-in-out; }
.island-wrapper.list-layout { position: relative; left: auto; top: auto; transform: none; margin-bottom: 30px; }
.island-rating-display { position: absolute; top: -40px; left: 50%; transform: translateX(-50%) translateY(150%); color: white; font-size: 1.5rem; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3); transition: color 0.5s ease; }
.main-island-rating { color: rgba(255, 255, 255, 0.6); }
.island-canvas-container { position: relative; display: flex; justify-content: center; align-items: center; transition: width 0.5s ease-in-out, height 0.5s ease-in-out; }
.bear-wrapper { position: absolute; transform: translate(-50%, -60%) scale(0.8); left: 50%; top: 50%; }
</style>
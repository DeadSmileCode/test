<template>
	<div class="home-page" :class="{ 'mobile-list-active': isMobileTeamView }">
		<!-- UI элементы -->
		<SideMenu :is-mobile="isMobile" :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
		<AccountDialog :is-open="isAccountDialogOpen" @close="isAccountDialogOpen = false" />
		
		<!-- Добавлено событие @expand, которое запускает рост острова -->
		<ExpandIslandDialog 
			:is-open="isExpandDialogOpen" 
			@close="isExpandDialogOpen = false"
			@expand="expandMainIsland" 
		/>

		<button v-if="isMobile" @click="toggleMobileMenu" class="hamburger-btn">
			<svg viewBox="0 0 100 80" width="24" height="24"><rect width="100" height="15" rx="8"></rect><rect y="30" width="100" height="15" rx="8"></rect><rect y="60" width="100" height="15" rx="8"></rect></svg>
		</button>
		<div class="account-control" @click="toggleAccountDialog">
			<div class="account-circle"><img src="@/assets/icon.png" alt="Account"></div>
		</div>
		
		<div v-if="user">
			<!-- Контент страницы -->
			<div v-if="!isMobileTeamView" class="islands-stage">
				<TransitionGroup name="island-fade">
					<IslandDisplay
						v-for="island in desktopIslands"
						:key="island.id"
						:ref="el => setIslandRef(el, island.id)"
						:island="island"
						:points="island.shape"
						@update:points="newPoints => handlePointsUpdate(island.id, newPoints)"
						:on-team-page="isTeamPage"
						layout="absolute"
					/>
				</TransitionGroup>
			</div>
			<div v-else class="mobile-team-list">
				<!-- Здесь тоже убираем v-model, если он был, и добавляем явную передачу -->
				<IslandDisplay
					v-for="island in mobileIslands"
					:key="island.id"
					:island="island"
					:points="island.shape"
					:on-team-page="isTeamPage"
					layout="list"
				/>
			</div>
		</div>

		<!-- Кнопка -->
		<Transition name="fade">
			<div v-if="!isTeamPage" class="expand-button-container">
				<button class="expand-button" @click="isExpandDialogOpen = true">Expand Island</button>
			</div>
		</Transition>
	</div>
</template>











<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

// Импорты
import SideMenu from '@/components/SideMenu.vue';
import AccountDialog from '@/components/AccountDialog.vue';
import ExpandIslandDialog from '@/components/ExpandIslandDialog.vue';
import IslandDisplay from '@/components/IslandDisplay.vue';

// import { ref, computed, onMounted, onUnmounted } from 'vue';
// import { useRoute } from 'vue-router';
import { useUser } from '@/composables/useUser';
import { useTeams } from '@/composables/useTeams';

const { user, fetchUser } = useUser();
const { teams, fetchTeams } = useTeams();

// --- ЛОГИКА UI (без изменений) ---
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value <= 768);
const isMobileMenuOpen = ref(false);
const isAccountDialogOpen = ref(false);
const isExpandDialogOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
const toggleAccountDialog = () => { isAccountDialogOpen.value = !isAccountDialogOpen.value; };
onMounted(() => { window.addEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });
onUnmounted(() => { window.removeEventListener('resize', () => { screenWidth.value = window.innerWidth; }); });



const route = useRoute();
const isTeamPage = computed(() => route.path === '/team');
const isMobileTeamView = computed(() => isMobile.value && isTeamPage.value);
const teamIslandsData = ref([]);



watchEffect(() => {
	if (isTeamPage.value) {
		fetchTeams(); // <-- ВЫЗЫВАЕМ ИМПОРТИРОВАННУЮ ФУНКЦИЮ
	}
});

// --- НОВОЕ: Следим за переключением на страницу команд ---
watchEffect(() => {
	// Если мы перешли на страницу команд и данные еще не загружены
	if (isTeamPage.value && teamIslandsData.value.length === 0) {
		fetchTeams();
	}
});




const mainIslandData = computed(() => ({
	id: 'main',
	isMain: true,
	rating: user.value.total_co2_saved_kg,
	shape: [ { x: -25, y: 0 }, { x: 0, y: -25 }, { x: 25, y: 0 }, { x: 0, y: 25 } ],
}));



// const teamIslandsData = [
// 	{ id: 'team1', rating: 8450, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 250 },
// 	{ id: 'team2', rating: 11200, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 280 },
// 	{ id: 'team3', rating: 8450, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 250 },
// 	{ id: 'team4', rating: 11200, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 280 },
// 	{ id: 'team5', rating: 8450, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 250 },
// 	{ id: 'team6', rating: 11200, shape: mainIslandData.value.shape, viewBox: mainIslandData.value.viewBox, size: 280 },
// ];



const islandRefs = ref({});
const setIslandRef = (el, id) => {
	if (el) {
		islandRefs.value[id] = el;
	}
};



const handlePointsUpdate = (islandId, newPoints) => {
	if (islandId === 'main') {
		mainIslandData.value.shape = newPoints;
	}
};

const expandMainIsland = (options) => {
	isExpandDialogOpen.value = false; // Закрываем диалог
	const mainIslandComponent = islandRefs.value['main'];

	if (mainIslandComponent) {
		mainIslandComponent.triggerExpansion({
			width: options.width || 50,
			height: options.height || 30,
		});
	}
};


const desktopIslands = computed(() => {
		if (!mainIslandData.value) return []; // Добавим проверку


		const baseSize = isMobile.value ? screenWidth.value * 0.5 : 400;
		const dynamicSize = baseSize + (mainIslandData.value.rating / 0.5); 

		if (isTeamPage.value) {
				const smallMainIsland = { ...mainIslandData.value, size: 400, x: 0, y: 0 };

				const adaptedTeams = teams.value
    		    .filter(team => team.team_id !== user.value.team_id) 
     			.map(team => {
			        const baseSize = 200;
			        const bonusSize = team.total_co2_saved_kg * 4;
			        const finalSize = baseSize + bonusSize;

			        return {
			          id: `team${team.team_id}`,
			          rating: team.total_co2_saved_kg,
			          // Теперь у нас есть и участники! (пока не используем, но они есть)
			          members: team.members ? team.members.split(',') : [],
			          shape: mainIslandData.value.shape,
			          size: finalSize
			        };
			    });

				
				// Используем загруженные данные
				const positionedTeamIslands = adaptedTeams.map((island, index) => {
				    const count = adaptedTeams.length;
				    const angle = (index / count) * 2 * Math.PI;
				    
				    // БЫЛО: const radius = isMobile.value ? 25 : 35;
				    // СТАЛО: Уменьшаем радиус для десктопа
				    const radius = isMobile.value ? 25 : 25; 
				    
				    const x = radius * Math.cos(angle);
				    const y = radius * Math.sin(angle) * 0.7; // 0.7 для изометрической перспективы
				    return { ...island, x, y };
				});

				return [smallMainIsland, ...positionedTeamIslands];
		} else {
				// Используем новый динамический размер
				const mainSize = isMobile.value ? screenWidth.value * 0.85 : dynamicSize;
				return [{ ...mainIslandData.value, size: Math.min(mainSize, screenWidth.value * 0.9), x: 0, y: 0 }]; // Ограничим макс. размер
		}
});

const mobileIslands = computed(() => {
    // Эта часть остается без изменений
    if (!user.value || !mainIslandData.value) return [];
    const listMainIsland = { ...mainIslandData.value, size: screenWidth.value * 0.8 };

    // --- ПРИМЕНЯЕМ ТУ ЖЕ ЛОГИКУ, ЧТО И ДЛЯ ДЕСКТОПА ---
    const listTeamIslands = teams.value
        // 1. Фильтруем команду текущего пользователя
        .filter(team => team.team_id !== user.value.team_id)
        // 2. Адаптируем данные с сервера под нужный формат
        .map(team => ({
            id: `team${team.team_id}`,
            rating: team.total_co2_saved_kg,
            shape: mainIslandData.value.shape,
            // Используем размер, подходящий для мобильного списка
            size: screenWidth.value * 0.7 
        }));

    return [listMainIsland, ...listTeamIslands];
});

onMounted(() => {
	fetchUser();
});
</script>










<style scoped>
.home-page { width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; }
.account-control { position: fixed; top: 20px; right: 20px; z-index: 1020; }
.hamburger-btn { position: fixed; top: 20px; left: 20px; z-index: 1020; background: none; border: none; cursor: pointer; padding: 10px; color: white; }
.hamburger-btn svg { fill: white; }
.account-circle { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
.account-circle img { width: 100%; height: 100%; object-fit: cover; }
.islands-stage { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.mobile-team-list { width: 100%; height: 100%; padding: 80px 0; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 40px; overflow-y: auto; }
.expand-button-container { position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 100; }
.expand-button { background-color: #B3CFE5; color: #2c3e50; border: none; border-radius: 20px; padding: 14px 28px; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 8px 0 0 #8FA8C0; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out; }
.expand-button:hover { transform: translateY(-3px); box-shadow: 0 11px 0 0 #8FA8C0; }
.expand-button:active { transform: translateY(2px); box-shadow: 0 6px 0 0 #8FA8C0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
.island-fade-enter-active, .island-fade-leave-active { transition: all 0.5s ease-in-out; }
.island-fade-enter-from, .island-fade-leave-to { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
.home-page.mobile-list-active {
    overflow-y: auto;
}
</style>
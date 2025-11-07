<template>
	<div class="dialog-wrapper" v-if="isOpen">
		<div class="overlay" @click="closeDialog"></div>
		<div class="dialog-box">
			<header class="dialog-header">
				<h3>Expand the Island</h3>
				<button class="close-btn" @click="closeDialog">&times;</button>
			</header>

			<div class="dialog-content">
				<label for="activity-search">Select an Activity</label>
				
				<!-- Search -->
				<div class="search-container">
					<input
						id="activity-search"
						type="text"
						v-model="searchTerm"
						placeholder="e.g., 'Plant a tree'"
						@focus="isDropdownVisible = true"
					/>
					<ul v-if="isDropdownVisible && filteredActivities.length > 0" class="activity-dropdown">
						<li v-for="activity in filteredActivities" :key="activity.id" @click="selectActivity(activity)">
							{{ activity.name }}
						</li>
					</ul>
				</div>
				
				<!-- Dynamic input form -->
				<div v-if="selectedActivity" class="dynamic-form">
					<p class="activity-description">{{ selectedActivity.description }}</p>
					<div v-for="input in selectedActivity.inputs" :key="input.name" class="form-group">
						<label :for="input.name">{{ input.label }}</label>
						<input
							v-if="input.type === 'number'"
							:id="input.name"
							type="number"
							:placeholder="input.placeholder"
							class="form-input"
						/>
						<input
							v-if="input.type === 'file'"
							:id="input.name"
							type="file"
							class="form-input"
						/>
					</div>
				</div>
				<div v-else class="form-placeholder">
					<p>Select an activity type to see the required input fields.</p>
				</div>

			</div>
			
			<footer class="dialog-footer">
				<button class="submit-btn" :disabled="!selectedActivity">Add Contribution</button>
			</footer>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);

const searchTerm = ref('');
const selectedActivity = ref(null);
const isDropdownVisible = ref(false);

// --- PROTOTYPING DATA (TRANSLATED) ---
const ACTIVITIES = [
	{ 
		id: 1, 
		name: 'Plant a tree', 
		description: 'Specify the number of trees you have planted.', 
		inputs: [
			{ type: 'number', name: 'tree_count', label: 'Number of trees', placeholder: 'e.g., 5' }
		]
	},
	{ 
		id: 2, 
		name: 'Recycle Paper', 
		description: 'Enter the weight of the recycled paper in kilograms.', 
		inputs: [
			{ type: 'number', name: 'paper_weight', label: 'Weight (kg)', placeholder: 'e.g., 12.5' }
		]
	},
	{ 
		id: 3, 
		name: 'Dispose of E-waste', 
		description: 'Attach a photo confirmation of dropping off electronics at a collection point.', 
		inputs: [
			{ type: 'file', name: 'ewaste_proof', label: 'Proof of disposal' }
		]
	},
	{ 
		id: 4, 
		name: 'Community Cleanup Volunteering', 
		description: 'Specify the number of hours and attach a photo from the event.', 
		inputs: [
			{ type: 'number', name: 'volunteer_hours', label: 'Number of hours', placeholder: 'e.g., 3' },
			{ type: 'file', name: 'volunteer_photo', label: 'Photo report' }
		]
	}
];
// ------------------------------------

const filteredActivities = computed(() => {
	if (!searchTerm.value) return ACTIVITIES;
	return ACTIVITIES.filter(a => a.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const selectActivity = (activity) => {
	selectedActivity.value = activity;
	searchTerm.value = activity.name;
	isDropdownVisible.value = false;
};

const closeDialog = () => {
	selectedActivity.value = null;
	searchTerm.value = '';
	emit('close');
};
</script>

<style scoped>
/* Стили не менялись, поэтому здесь они опущены для краткости */
/* ... ваши существующие стили для .dialog-wrapper, .overlay и т.д. ... */
.dialog-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 2000;
	display: flex;
	justify-content: center;
	align-items: center;
}
.overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(5px);
}
.dialog-box {
	position: relative;
	background: white;
	border-radius: 16px;
	width: 90%;
	max-width: 500px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.2);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 24px;
	border-bottom: 1px solid #e0e0e0;
}
.dialog-header h3 {
	margin: 0;
	font-size: 1.25rem;
	color: #2c3e50;
}
.close-btn {
	background: none; border: none; font-size: 2rem; cursor: pointer; color: #999;
}
.dialog-content { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.search-container { position: relative; }
input {
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #ccc;
	border-radius: 8px;
	font-size: 1rem;
	box-sizing: border-box;
}
.activity-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border: 1px solid #ccc;
	border-top: none;
	border-radius: 0 0 8px 8px;
	list-style: none;
	margin: 0;
	padding: 0;
	z-index: 10;
	max-height: 150px;
	overflow-y: auto;
}
.activity-dropdown li {
	padding: 12px 16px;
	cursor: pointer;
}
.activity-dropdown li:hover { background-color: #f0f8ff; }
.dynamic-form { border-top: 1px solid #e0e0e0; margin-top: 16px; padding-top: 16px; display: flex; flex-direction: column; gap: 12px; }
.activity-description { font-style: italic; color: #555; margin-top: 0; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-placeholder { text-align: center; color: #888; padding: 30px 10px; border: 2px dashed #e0e0e0; border-radius: 8px; margin-top: 16px;}
.dialog-footer {
	padding: 16px 24px;
	background-color: #f7f7f7;
	border-top: 1px solid #e0e0e0;
	display: flex;
	justify-content: flex-end;
}
.submit-btn {
	background-color: #3d8b40;
	color: white;
	border: none;
	padding: 12px 24px;
	font-size: 1rem;
	font-weight: bold;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s;
}
.submit-btn:hover { background-color: #4CAF50; }
.submit-btn:disabled { background-color: #ccc; cursor: not-allowed; }
</style>
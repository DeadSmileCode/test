import { ref } from 'vue';

const teams = ref([]);
const isLoading = ref(false);

export function useTeams() {
  const fetchTeams = async () => {
    isLoading.value = true;
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    try {
      const response = await fetch('/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch teams');
      
      teams.value = await response.json();
      console.log("Teams state updated:", teams.value);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    teams,
    isLoading,
    fetchTeams,
  };
}
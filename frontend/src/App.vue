<template>
  <!-- Render router pages -->
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
// import { supabase } from "./lib/supabaseClient";

// async function testConnection() {
//   const { data, error } = await supabase.from('employees').select('*')
//   console.log(data)
// }

// // ✅ run when the app mounts
// onMounted(testConnection);
</script>

<style>
/* Global reset styles */
body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent scroll on main page */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>

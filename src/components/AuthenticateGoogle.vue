<template>
    <div>
        <button @click="googleSignIn" class="google-signin-button">        <img :src = "google" class = "w-8 rounded-md">
Assist</button>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';
import google from "@/images/google.png"
const googleSignIn = async () => {
    const redirectUri = import.meta.env.VITE_SELF + '/assist';  // Adjust this to your setup
    const clientId = '601202775910-c9v9k03qippsb467vov1au393fmd4fog.apps.googleusercontent.com'; //from https://console.cloud.google.com/apis/credentials
    const scope = 'profile email https://www.googleapis.com/auth/gmail.readonly';  // Adjust scopes as needed
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    // Redirect the user to the Google OAuth endpoint
    window.location.href = authUrl;
};
</script>
  
<style scoped>

.google-signin-button {
    @apply bg-white dark:bg-gray-700 border border-gray-300 text-gray-700 dark:text-gray-200 px-4 py-2 flex items-center justify-center rounded shadow hover:shadow-md transition duration-200 ease-in;
}
</style>
  
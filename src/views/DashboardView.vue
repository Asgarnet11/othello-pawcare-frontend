<template>
  <div>
    <h1>Selamat Datang di Dashboard!</h1>
    <p v-if="auth.user">Anda login sebagai: {{ auth.user.name }} ({{ auth.user.role }})</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>

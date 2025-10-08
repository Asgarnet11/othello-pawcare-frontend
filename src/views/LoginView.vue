<template>
  <v-app>
    <v-main class="d-flex justify-center align-center bg-grey-lighten-4">
      <v-card width="400" elevation="5">
        <v-card-title class="text-center text-h5 py-4 bg-primary">
          Othello PawCare
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form @submit.prevent="handleLogin">
            <v-text-field v-model="email" label="Email" type="email" prepend-inner-icon="mdi-email-outline"
              variant="outlined" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" prepend-inner-icon="mdi-lock-outline"
              variant="outlined" required></v-text-field>
            <v-alert v-if="error" type="error" variant="tonal" dense class="mb-4">
              Email atau password salah.
            </v-alert>
            <v-btn :loading="loading" type="submit" color="primary" block size="large">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref(false)
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  error.value = false
  loading.value = true
  const success = await authStore.login(email.value, password.value)
  loading.value = false

  if (success) {
    router.push('/dashboard')
  } else {
    error.value = true
  }
}
</script>

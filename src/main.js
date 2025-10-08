import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
  store.router = router
})

app.use(pinia)
app.use(router)
app.use(vuetify)

const authStore = useAuthStore()
authStore.tryAutoLogin()

app.mount('#app')

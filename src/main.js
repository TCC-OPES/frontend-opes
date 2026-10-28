import './assets/main.css'
import { inicializarTema } from '@/services/tema'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css'

import App from './App.vue'
import router from './router'

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister())
  })
}

inicializarTema()
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

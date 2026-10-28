import './assets/main.css'
import { inicializarTema } from '@/services/tema'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fortawesome/fontawesome-free/css/all.min.css'

import App from './App.vue'
import router from './router'

const app = inicializarTema()
createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

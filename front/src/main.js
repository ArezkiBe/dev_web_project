import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import './assets/tailwind.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedstate)

app.use(pinia) 
app.use(router)

app.mount('#app')

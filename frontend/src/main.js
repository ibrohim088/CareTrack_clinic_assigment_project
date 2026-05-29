import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Bootstrap CSS (birinchi)
import 'bootstrap/dist/css/bootstrap.min.css'

// Loyiha global stillari
import './assets/styles/main.css'
import './assets/styles/auth.css'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

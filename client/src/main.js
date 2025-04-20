import { createApp } from 'vue'
import '/index.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useLobbyStore } from './stores/lobby'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Conecta WebSocket antes de montar a app
const lobby = useLobbyStore()
lobby.connect()

app.mount('#app')

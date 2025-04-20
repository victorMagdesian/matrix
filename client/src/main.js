import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useLobbyStore } from './stores/lobby'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Conecta e expõe globalmente
const lobby = useLobbyStore()
lobby.connect()
// expõe para o console
window.lobby = lobby
window.socket = lobby.socket

app.mount('#app')

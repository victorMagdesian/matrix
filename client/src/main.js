import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import App             from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// conecta já ao lobby e expõe para debug
import { useLobbyStore } from './stores/lobby'
const lobby = useLobbyStore()
lobby.connect()
window.lobby  = lobby
window.socket = lobby.socket

app.mount('#app')

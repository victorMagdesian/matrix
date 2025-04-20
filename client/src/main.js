import './index.css'                 // ⬅️ make sure this import is at top!
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())

// expose lobby+socket for debug
import { useLobbyStore } from './stores/lobby'
const lobby = useLobbyStore()
lobby.connect()
window.lobby  = lobby
window.socket = lobby.socket

app.mount('#app')

<template>
    <canvas ref="canvas" class="w-full h-64 bg-gray-800 rounded-lg"></canvas>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useLobbyStore } from '../stores/lobby'

const canvas = ref(null)
const lobby = useLobbyStore()
const socket = window.socket

const state = reactive({ hands: {}, discardPiles: {}, melds: {}, turnOrder: [], currentTurnIndex: 0 })
let ctx, raf

function drawAll() {
    const c = canvas.value
    ctx.clearRect(0, 0, c.width, c.height)
    // você pode reutilizar o código de cards que já fizemos antes…
    raf = requestAnimationFrame(drawAll)
}

onMounted(() => {
    ctx = canvas.value.getContext('2d')
    canvas.value.width = canvas.value.clientWidth
    canvas.value.height = canvas.value.clientHeight

    socket.on('gameStart', s => Object.assign(state, s))
    socket.on('stateUpdate', u => Object.assign(state, u))

    drawAll()
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>
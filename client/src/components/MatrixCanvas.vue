<template>
    <div ref="canvasContainer" class="w-full h-64 sm:h-96 bg-black rounded-lg overflow-hidden"></div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
  import * as PIXI from 'pixi.js'
  
  const props = defineProps({
    room: { type: String, required: true }
  })
  
  const canvasContainer = ref(null)
  let app = null
  
  onMounted(() => {
    // inicializa Pixi
    app = new PIXI.Application({
      width: canvasContainer.value.clientWidth,
      height: canvasContainer.value.clientHeight,
      backgroundAlpha: 0
    })
    canvasContainer.value.appendChild(app.view)
  
    // exemplo básico: efeito “chuva” de caracteres
    const cols = Math.floor(app.screen.width / 20)
    const drops = Array(cols).fill(0)
    const style = new PIXI.TextStyle({ fill: '#0f0', fontFamily: 'monospace', fontSize: 18 })
    const ticker = () => {
      const container = new PIXI.Container()
      for (let i = 0; i < cols; i++) {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96)
        const txt = new PIXI.Text(char, style)
        txt.x = i * 20
        txt.y = drops[i] * 20
        container.addChild(txt)
        drops[i] = (drops[i] + 1) % (app.screen.height / 20)
      }
      app.stage.removeChildren()
      app.stage.addChild(container)
    }
    app.ticker.add(ticker)
  })
  
  onBeforeUnmount(() => {
    if (app) {
      app.destroy(true, { children: true })
      app = null
    }
  })
  </script>
  
  <style scoped>
  /* responsivo */
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  
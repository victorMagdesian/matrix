<!-- client/src/components/MatrixCanvas.vue -->
<template>
    <div
      ref="canvasContainer"
      class="w-full h-64 sm:h-96 bg-black rounded-lg overflow-hidden"
    ></div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import { Application, TextStyle, Container, Text } from 'pixi.js'
  
  const props = defineProps({
    room: {
      type: String,
      required: true
    }
  })
  
  const canvasContainer = ref(null)
  let app = null
  
  onMounted(async () => {
    // Cria a instância (sem opções, para evitar o construtor deprecated)
    app = new Application()
    // Usa o método assíncrono init() da instância
    await app.init({
      width:  canvasContainer.value.clientWidth,
      height: canvasContainer.value.clientHeight,
      backgroundAlpha: 0
    })
    // Anexa o elemento canvas ao container
    canvasContainer.value.appendChild(app.canvas)
  
    const cols = Math.floor(app.screen.width / 20)
    const drops = Array(cols).fill(0)
    const style = new TextStyle({
      fill: '#0f0',
      fontFamily: 'monospace',
      fontSize: 18
    })
  
    // Efeito “chuva” de caracteres
    app.ticker.add(() => {
      // Limpa e redesenha cada frame
      app.stage.removeChildren()
      const container = new Container()
      for (let i = 0; i < cols; i++) {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96)
        const txt = new Text(char, style)
        txt.x = i * 20
        txt.y = drops[i] * 20
        container.addChild(txt)
        drops[i] = (drops[i] + 1) % (app.screen.height / 20)
      }
      app.stage.addChild(container)
    })
  })
  
  onBeforeUnmount(() => {
    if (app) {
      app.destroy(true, { children: true })
      app = null
    }
  })
  </script>
  
  <style scoped>
  /* Garante que o canvas expanda para preencher o container */
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  
<template>
    <div ref="wrapper" class="w-full h-64 sm:h-96 bg-black rounded-lg overflow-hidden">
      <application :width="w" :height="h" :options="{ backgroundAlpha: 0 }">
        <container>
          <text
            v-for="(_, i) in cols"
            :key="i"
            :text="chars[i].char"
            :x="chars[i].x"
            :y="chars[i].y"
            :style="textStyle"
          />
        </container>
      </application>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Application, onTick } from 'vue3-pixi'
  
  const wrapper = ref(null)
  const w = ref(0), h = ref(0)
  const fontSize = 18, cols = ref(0), drops = ref([]), chars = ref([])
  
  function update() {
    w.value = wrapper.value.clientWidth
    h.value = wrapper.value.clientHeight
    cols.value = Math.floor(w.value / fontSize)
    drops.value = Array(cols.value).fill(0)
    chars.value = Array.from({ length: cols.value }, (_, i) => ({ x: i*fontSize, y:0, char:'' }))
  }
  
  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })
  onUnmounted(() => window.removeEventListener('resize', update))
  
  const textStyle = { fill:'#0f0', fontFamily:'monospace', fontSize }
  
  onTick(() => {
    for (let i = 0; i < cols.value; i++) {
      drops.value[i] = (drops.value[i]+1) % Math.ceil(h.value/fontSize)
      chars.value[i].char = String.fromCharCode(0x30A0 + Math.random()*96)
      chars.value[i].y    = drops.value[i]*fontSize
    }
  })
  </script>
  
  <style scoped>
  .wrapper, canvas { width:100%!important; height:100%!important; }
  </style>
  
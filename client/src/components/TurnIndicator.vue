<template>
    <transition name="fade-scale">
      <div
        v-if="visible"
        class="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div
          class="bg-yellow-400/90 text-black font-bold text-3xl px-8 py-4 rounded-2xl shadow-2xl"
        >
          Sua vez!
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  const props = defineProps({ show: Boolean })
  const visible = ref(false)
  
  watch(
    () => props.show,
    v => {
      if (v) {
        visible.value = true
        setTimeout(() => (visible.value = false), 3000)
      } else visible.value = false
    },
    { immediate: true }
  )
  </script>
  
  <style scoped>
  .fade-scale-enter-active,
  .fade-scale-leave-active { transition: all .1s ease; }
  .fade-scale-enter-from,
  .fade-scale-leave-to     { opacity:0; transform:scale(.8); }
  </style>
  
<template>
  <div
    class="card flex items-center justify-center w-12 h-16 sm:w-16 sm:h-24 rounded-md font-bold text-white border-2 transition-transform duration-150 cursor-pointer select-none"
    :class="[
      bgClass,
      selected
        ? 'border-yellow-300 scale-110 shadow-lg z-10'
        : 'border-gray-500 hover:scale-105 hover:shadow'
    ]"
    @click="$emit('click')"
  >
    {{ value }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: String,
  value: Number,
  selected: Boolean
})

const bgClass = computed(() => {
  switch (props.color) {
    case 'red': return 'bg-red-600'
    case 'blue': return 'bg-blue-600'
    case 'green': return 'bg-green-600'
    case 'yellow': return 'bg-yellow-300 text-black'
    default: return 'bg-gray-400'
  }
})
</script>

<style scoped>
.card {
  font-size: 1.25rem;
}
</style>

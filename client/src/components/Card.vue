<template>
  <div
    class="card relative cursor-pointer select-none"
    :style="{
      width: '3.5rem',
      height: '5rem',
      backgroundColor: bgColor,
      borderRadius: '0.5rem',
      padding: '0.15rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }
    "
    @click="$emit('click')"
  >
    <!-- Borda branca interna -->
    <div
      :style="{
        position: 'absolute', top: '0', left: '0', right: '0', bottom: '0',
        border: '4px solid white', borderRadius: '0.35rem',
      }"
    ></div>

    <!-- Círculo central -->
    <div
      :style="{
        position: 'relative',
        width: '70%', height: '70%',
        margin: 'auto', top: '15%',
        backgroundColor: 'white',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }"
    >
      <span
        :style="{
          color: bgColor,
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }"
      >
        {{ value }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  color: { type: String, default: '' },
  value: { type: [String, Number], required: true }
})

const colorMap = {
  red:    '#D32F2F',
  blue:   '#1976D2',
  green:  '#388E3C',
  yellow: '#FBC02D'
}

const bgColor = computed(() => colorMap[props.color] || '#555')
</script>
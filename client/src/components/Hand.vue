<template>
    <div class="hand flex flex-wrap gap-2 my-4">
      <div
        v-for="card in cards"
        :key="card.__uid"
        @click="toggle(card)"
        :class="[
          'card w-12 h-16 bg-white flex items-center justify-center rounded shadow cursor-pointer',
          selected.includes(card.__uid) ? 'ring-2 ring-primary' : ''
        ]"
      >
        <span :class="`text-${card.color}-600`">
          {{ card.color[0].toUpperCase() }}{{ card.value }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  const props = defineProps({ cards:Array, selected:Array })
  const emit = defineEmits(['update:selected'])
  function toggle(card) {
    const key = card.__uid
    const next = props.selected.includes(key)
      ? props.selected.filter(k=>k!==key)
      : [...props.selected, key]
    emit('update:selected', next)
  }
  </script>
  
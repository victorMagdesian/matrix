<template>
    <div class="meld-area my-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <div
          v-for="(meld, mi) in melds"
          :key="mi"
          class="flex gap-1 p-2 bg-green-800/60 rounded"
        >
          <div v-for="card in meld" :key="card.color+'-'+card.value" class="w-8 h-12 bg-white text-xs flex items-center justify-center rounded">
            <span :class="`text-${card.color}-600`">
              {{ card.color[0].toUpperCase() }}{{ card.value }}
            </span>
          </div>
        </div>
      </div>
      <button class="px-3 py-1 bg-primary text-white rounded"
        @click="$emit('meld')"
        :disabled="selected.length < 2"
      >Baixar grupo</button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  defineProps({
    melds:    { type:Array, default:()=>[] },
    selected: { type:Array, default:()=>[] }
  })
  </script>
  
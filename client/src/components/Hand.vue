<template>
  <div class="hand flex flex-wrap justify-center gap-2 p-4 bg-gray-800/60 rounded-xl shadow-inner max-w-full">
    <Card
      v-for="(card, index) in cards"
      :key="index"
      :color="card.color"
      :value="card.value"
      :selected="selectedIndex === index"
      @click="select(index)"
    />
  </div>
</template>

<script setup>
import Card from './Card.vue'

const props = defineProps({
  cards: Array,
  selectedIndex: Number
})

const emit = defineEmits(['select'])

function select(index) {
  emit('select', index)
}
</script>

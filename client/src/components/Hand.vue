<template>
  <div
    class="hand flex flex-wrap justify-center gap-2 p-4 rounded-xl shadow-inner transition ring-offset-2"
    :class="myTurn ? 'ring-4 ring-yellow-400' : 'bg-gray-800/60'"
  >
    <Card
      v-for="card in cardsSafe"
      :key="card.__uid"
      :color="card.color"
      :value="card.value"
      :selected="selectedSafe.includes(card.__uid)"
      @click="handleClick(card.__uid, card)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  cards:       { type: Array,  default: () => [] },
  selected:    { type: Array,  default: () => [] },
  phase:       { type: String, default: 'draw' },
  myTurn:      { type: Boolean, default: false },
  autoDiscard: { type: Boolean, default: false }
})
const emit = defineEmits(['update:selected', 'discard'])

const cardsSafe    = computed(() => props.cards ?? [])
const selectedSafe = computed(() => props.selected ?? [])

function toggle(uid) {
  const next = selectedSafe.value.slice()
  const i = next.indexOf(uid)
  i === -1 ? next.push(uid) : next.splice(i, 1)
  emit('update:selected', next)
}
function handleClick(uid, card) {
  props.autoDiscard ? emit('discard', card) : toggle(uid)
}
</script>

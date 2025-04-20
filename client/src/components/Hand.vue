<!-- client/src/components/Hand.vue -->
<template>
  <div class="hand flex flex-wrap justify-center gap-2 p-4 bg-gray-800/60 rounded-xl shadow-inner">
    <Card
      v-for="card in cards"
      :key="card.__uid"
      :color="card.color"
      :value="card.value"
      :selected="selected.includes(card.__uid)"
      @click="toggle(card.__uid)"
      @dblclick="tryDiscard(card)"
    />
  </div>
</template>

<script setup>
import Card from './Card.vue'

const props = defineProps({
  cards    : { type: Array,   default: () => [] },
  selected : { type: Array,   default: () => [] },
  phase    : { type: String,  default: 'draw' },
  myTurn   : { type: Boolean, default: false }
})
const emit = defineEmits(['update:selected', 'discard'])

/* alterna seleção */
function toggle(uid) {
  const next = props.selected.slice()
  const idx  = next.indexOf(uid)
  idx === -1 ? next.push(uid) : next.splice(idx, 1)
  emit('update:selected', next)
}

/* duplo‑clique para descartar imediatamente (atalho) */
function tryDiscard(card) {
  if (props.myTurn && props.phase === 'discard') {
    emit('discard', card)
  }
}
</script>

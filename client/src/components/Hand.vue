<template>
  <div
    class="hand grid grid-cols-6 gap-2 p-4"
    :style="{ backgroundColor: '#222', borderRadius: '0.5rem' }"
  >
    <Card
      v-for="card in cards"
      :key="card.id"
      :color="card.color"
      :value="card.value"
      @click="onCardClick(card)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Card from './Card.vue'

const props = defineProps({
  cards:      Array,
  phase:      String,
  myTurn:     Boolean,
  autoDiscard:Boolean
})
const emit = defineEmits(['update:selected','discard'])

function onCardClick(card) {
  if (!props.myTurn) return
  if (props.phase === 'discard' && props.autoDiscard) {
    emit('discard', card)
  } else {
    emit('update:selected', card.id)
  }
}
</script>
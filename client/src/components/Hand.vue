<template>
    <div class="space-y-1">
        <h3 class="font-semibold">Sua mão</h3>
        <div class="flex flex-wrap gap-2">
            <div v-for="card in cards" :key="card.__uid" @click="toggle(card)" :class="[
                'w-12 h-16 bg-white flex items-center justify-center rounded shadow cursor-pointer',
                selected.includes(card.__uid) ? 'ring-2 ring-primary' : ''
            ]">
                <span :class="`text-${card.color}-600`">{{ card.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ cards: Array, selected: Array })
const emit = defineEmits(['update:selected'])
function toggle(card) {
    const key = card.__uid
    const arr = props.selected.includes(key)
        ? props.selected.filter(k => k !== key)
        : [...props.selected, key]
    emit('update:selected', arr)
}
</script>
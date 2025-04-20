<template>
    <div class="space-y-1 text-center">
        <h4 class="text-sm">{{ label }}</h4>
        <div class="w-12 h-16 bg-gray-200 flex items-center justify-center rounded shadow mx-auto" v-if="topCard">
            <span :class="`text-${topCard.color}-600`">{{ topCard.value }}</span>
        </div>
        <div v-else
            class="w-12 h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-500 mx-auto">
            –
        </div>
        <button class="mt-1 px-2 py-1 bg-primary text-white rounded text-xs"
            @click="$emit('draw', fromPlayerId)">Pegar</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    topCard: Object,
    label: String,
    fromPlayerId: String
})
</script>
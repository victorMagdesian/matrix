<template>
    <div class="space-y-2">
        <h3 class="font-semibold">Grupos baixados</h3>
        <div class="flex flex-wrap gap-2">
            <div v-for="(meld, mi) in melds" :key="mi" class="flex gap-1 p-2 bg-green-800/60 rounded">
                <div v-for="card in meld" :key="card.color + '-' + card.value"
                    class="w-8 h-12 bg-white text-xs flex items-center justify-center rounded">
                    <span :class="`text-${card.color}-600`">{{ card.value }}</span>
                </div>
            </div>
        </div>
        <button class="mt-1 px-3 py-1 bg-primary text-white rounded text-sm" @click="$emit('meld')"
            :disabled="selected.length < 2">Baixar grupo</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    melds: { type: Array, default: () => [] },
    selected: { type: Array, default: () => [] }
})
</script>
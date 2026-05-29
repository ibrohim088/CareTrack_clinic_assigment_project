<template>
  <div class="schedule-header">
    <h3>Jadval</h3>
    <div class="controls">
      <button @click="$emit('prev-month')"><ChevronLeft :size="18" /></button>
      <span class="current-month">{{ currentMonth }}</span>
      <button @click="$emit('next-month')"><ChevronRight :size="18" /></button>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  month: { type: String, required: true }
})

const currentMonth = computed(() => {
  return new Date(props.month).toLocaleString('default', { month: 'long', year: 'numeric' })
})

defineEmits(['prev-month', 'next-month'])
</script>
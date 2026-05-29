<template>
  <div class="slots-grid">
    <button
      v-for="slot in slots"
      :key="slot.start"
      class="time-slot"
      :class="{ booked: slot.isBooked }"
      @click="$emit('select-slot', slot)"
      :disabled="slot.isBooked"
    >
      {{ slot.start }} - {{ slot.end }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  slots: { type: Array, default: () => [] }
})
defineEmits(['select-slot'])
</script>
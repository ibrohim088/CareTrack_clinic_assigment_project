<template>
  <div class="calendar-grid">
    <!-- Weekday headers -->
    <div v-for="weekday in weekdays" :key="weekday" class="weekday-header">
      {{ weekday }}
    </div>

    <!-- Days -->
    <CalendarDay
      v-for="day in days"
      :key="day.date || day.day"
      :day="day.day"
      :date="day.date"
      :in-current-month="day.inCurrentMonth"
      :is-today="day.isToday"
      :is-selected="day.isSelected"
      :is-working-day="day.isWorkingDay"
      :has-events="day.hasEvents"
      :mode="mode"
      @select="emitSelect"
    />
  </div>
</template>

<script setup>
import CalendarDay from './CalendarDay.vue'

defineProps({
  days: { type: Array, required: true },
  weekdays: { type: Array, default: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  mode: { type: String, default: 'view' }
})

const emit = defineEmits(['select-date'])

const emitSelect = (payload) => {
  emit('select-date', payload)
}
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.weekday-header {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--ct-muted);
  padding: 8px 4px;
  text-transform: uppercase;
}
</style>
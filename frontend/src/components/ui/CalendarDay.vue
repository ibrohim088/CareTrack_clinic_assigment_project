<template>
  <div 
    class="calendar-day"
    :class="{
      'other-month': !inCurrentMonth,
      'today': isToday,
      'selected': isSelected,
      'working-day': isWorkingDay,
      'has-events': hasEvents
    }"
    @click="handleClick"
  >
    <span class="day-number">{{ day }}</span>
    
    <!-- Event indicator -->
    <div v-if="hasEvents" class="event-dot"></div>
    
    <!-- Working day badge (edit mode uchun) -->
    <div v-if="showWorkingIndicator" class="working-indicator"></div>
  </div>
</template>

<script setup>
defineProps({
  day: { type: Number, required: true },
  date: { type: String, default: null },
  inCurrentMonth: { type: Boolean, default: true },
  isToday: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  isWorkingDay: { type: Boolean, default: false },
  hasEvents: { type: Boolean, default: false },
  mode: { type: String, default: 'view' } // view | edit
})

const emit = defineEmits(['select'])

const handleClick = () => {
  if (!inCurrentMonth) return
  emit('select', { date, day })
}
</script>

<style scoped>
.calendar-day {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid transparent;
}

.calendar-day:hover {
  background: var(--ct-primary-light);
  transform: scale(1.05);
}

.calendar-day.other-month {
  color: #d1d5db;
  cursor: default;
}

.calendar-day.today {
  background: #e0f2fe;
  font-weight: 600;
}

.calendar-day.selected {
  background: var(--ct-primary);
  color: white;
  font-weight: 700;
}

.calendar-day.working-day {
  background: #f0fdf4;
  border-color: #86efac;
}

.day-number {
  font-size: 15px;
  font-weight: 500;
}

.event-dot {
  position: absolute;
  bottom: 8px;
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.working-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}
</style>
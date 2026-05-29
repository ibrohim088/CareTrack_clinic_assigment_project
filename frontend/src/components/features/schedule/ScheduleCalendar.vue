<template>
  <div class="schedule-calendar">
    <ScheduleHeader :month="currentMonthStr" @prev-month="prevMonth" @next-month="nextMonth" />
    
    <AppCalendar 
      :mode="mode"
      :workingDays="workingDays"
      :selectedDate="selectedDate"
      @update:selectedDate="selectDate"
      @select-slot="selectTimeSlot"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ScheduleHeader from './ScheduleHeader.vue'
import AppCalendar from '../../ui/AppCalendar.vue'

const props = defineProps({
  mode: { type: String, default: 'view' },
  workingDays: { type: Array, default: () => [1,2,3,4,5] }
})

const emit = defineEmits(['select-date', 'select-slot'])

const currentDate = ref(new Date())
const selectedDate = ref(null)

const currentMonthStr = computed(() => currentDate.value.toISOString().slice(0,7))

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const selectDate = (date) => {
  selectedDate.value = date
  emit('select-date', date)
}

const selectTimeSlot = (payload) => {
  emit('select-slot', payload)
}
</script>
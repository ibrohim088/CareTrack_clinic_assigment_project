<template>
  <div class="app-calendar">
    <!-- Navigation Header -->
    <div class="calendar-header">
      <button class="nav-btn" @click="prevMonth"><ChevronLeft :size="18" /></button>
      <h4 class="month-title">{{ monthLabel }}</h4>
      <button class="nav-btn" @click="nextMonth"><ChevronRight :size="18" /></button>
    </div>

    <!-- Edit Mode: Working Days Selection -->
    <div v-if="mode === 'edit'" class="edit-section">
      <div class="working-days">
        <h5>Ish kunlari:</h5>
        <div class="days-selector">
          <label v-for="day in 7" :key="day" class="day-checkbox">
            <input type="checkbox" :checked="workingDays.includes(day - 1)" @change="toggleWorkingDay(day - 1)" />
            {{ dayLabels[day - 1] }}
          </label>
        </div>
      </div>

      <div class="working-hours">
        <h5>Ish soatlari:</h5>
        <div class="time-inputs">
          <div class="form-group">
            <label>Boshlanish:</label>
            <input v-model="workingHoursLocal.start" type="time" class="form-control" />
          </div>
          <div class="form-group">
            <label>Tugash:</label>
            <input v-model="workingHoursLocal.end" type="time" class="form-control" />
          </div>
        </div>
      </div>

      <button class="btn btn-primary btn-save" @click="saveSchedule">
        Jadvalni saqlash
      </button>
    </div>

    <!-- View Mode: Calendar Grid -->
    <CalendarGrid v-else :days="calendarDays" :mode="mode" @select-date="handleDateSelect" />

    <!-- Selected Date Time Slots (View Mode) -->
    <div v-if="internalSelectedDate && mode === 'view'" class="time-slots-section">
      <h5 class="slots-title">{{ selectedDateLabel }} — Bo'sh vaqtlar</h5>
      <div v-if="availableSlots.length > 0" class="slots-container">
        <button v-for="slot in availableSlots" :key="slot" class="time-slot-btn" :class="{ booked: isSlotBooked(slot) }"
          :disabled="isSlotBooked(slot)" @click="selectTimeSlot(slot)">
          {{ slot }}
        </button>
      </div>
      <div v-else class="no-slots">
        Bu kun bo'sh vaqt yo'q
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CalendarGrid from './CalendarGrid.vue'

const props = defineProps({
  mode: { type: String, enum: ['view', 'edit'], default: 'view' },
  doctorId: { type: String, default: null },
  workingDays: { type: Array, default: () => [1, 2, 3, 4, 5] },
  workingHours: { type: Object, default: () => ({ start: '09:00', end: '17:00' }) },
  selectedDate: { type: String, default: null },
  availableSlots: { type: Array, default: () => [] },
  bookedSlots: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:selectedDate', 'select-slot', 'update:schedule'])

const currentDate = ref(new Date())
const internalSelectedDate = ref(props.selectedDate)
const workingDaysLocal = ref([...props.workingDays])
const workingHoursLocal = ref({ ...props.workingHours })

const dayLabels = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']

const monthLabel = computed(() => {
  return currentDate.value.toLocaleString('uz-UZ', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  // Oldingi oyning kunlari
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: '', inCurrentMonth: false })
  }

  // Joriy oyning kunlari
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayOfWeek = new Date(year, month, day).getDay()
    const isToday = dateStr === new Date().toISOString().slice(0, 10)

    days.push({
      day,
      date: dateStr,
      inCurrentMonth: true,
      isToday,
      isSelected: dateStr === internalSelectedDate.value,
      isWorkingDay: props.workingDays.includes(dayOfWeek),
      isPastDay: new Date(dateStr) < new Date() && !isToday,
      isDayOfWeek: dayOfWeek
    })
  }

  return days
})

const selectedDateLabel = computed(() => {
  if (!internalSelectedDate.value) return ''
  const date = new Date(internalSelectedDate.value + 'T00:00:00')
  return date.toLocaleDateString('uz-UZ', { weekday: 'long', month: 'long', day: 'numeric' })
})

const handleDateSelect = (payload) => {
  internalSelectedDate.value = payload.date
  emit('update:selectedDate', payload.date)
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1)
}

const selectTimeSlot = (slot) => {
  if (!isSlotBooked(slot)) {
    emit('select-slot', {
      date: internalSelectedDate.value,
      time: slot
    })
  }
}

const isSlotBooked = (slot) => {
  return props.bookedSlots?.includes(slot) || false
}

const toggleWorkingDay = (day) => {
  const index = workingDaysLocal.value.indexOf(day)
  if (index > -1) {
    workingDaysLocal.value.splice(index, 1)
  } else {
    workingDaysLocal.value.push(day)
    workingDaysLocal.value.sort((a, b) => a - b)
  }
}

const saveSchedule = () => {
  emit('update:schedule', {
    workingDays: workingDaysLocal.value,
    workingHours: workingHoursLocal.value
  })
}
</script>

<style scoped>
.app-calendar {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1.5rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.month-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: #333;
  flex: 1;
  text-align: center;
}

.nav-btn {
  background: white;
  border: 1px solid #dee2e6;
  width: 40px;
  height: 40px;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #495057;
  padding: 0;
}

.nav-btn:hover {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

/* Edit Mode Styles */
.edit-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
}

.edit-section h5 {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.days-selector {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.day-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
}

.day-checkbox input {
  cursor: pointer;
  accent-color: #007bff;
}

.working-hours {
  display: flex;
  flex-direction: column;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.form-control {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.btn-save {
  grid-column: 1 / -1;
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.btn-save:hover {
  background-color: #218838;
}

.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Time Slots Styles */
.time-slots-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.slots-title {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.slots-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.time-slot-btn {
  padding: 0.75rem 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #007bff;
}

.time-slot-btn:hover:not(:disabled) {
  border-color: #007bff;
  background: #e7f1ff;
}

.time-slot-btn.booked,
.time-slot-btn:disabled {
  background: #fee2e2;
  color: #991b1b;
  border-color: #dc3545;
  cursor: not-allowed;
  opacity: 0.6;
}

.no-slots {
  padding: 1rem;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
}

@media (max-width: 768px) {
  .edit-section {
    grid-template-columns: 1fr;
  }

  .time-inputs {
    grid-template-columns: 1fr;
  }

  .slots-container {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }
}
</style>
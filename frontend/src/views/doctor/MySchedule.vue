<template>
  <div class="schedule-page">
    <div class="page-header">
      <div>
        <h1>My Schedule</h1>
        <p class="subtitle">Manage your working calendar</p>
      </div>
      <button class="btn-primary" @click="openAddModal">+ Add Schedule</button>
    </div>

    <!-- Month Navigation -->
    <div class="month-nav">
      <button class="nav-btn" @click="prevMonth">&#8592;</button>
      <span class="month-label">{{ currentMonthLabel }}</span>
      <button class="nav-btn" @click="nextMonth">&#8594;</button>
    </div>

    <div v-if="loading" class="loading-state">Loading...</div>

    <div v-else class="calendar-grid">
      <div class="weekday-header" v-for="d in weekdays" :key="d">{{ d }}</div>
      <div v-for="day in calendarDays" :key="day.date || Math.random()" class="calendar-day"
        :class="{ 'has-schedule': day.schedule, 'today': day.isToday, 'empty-cell': !day.date }"
        @click="day.date && openDayModal(day)">
        <template v-if="day.date">
          <div class="day-number">{{ day.dayNum }}</div>
          <div v-if="day.schedule" class="day-schedule">
            <div class="slots-count">{{ day.schedule.timeSlots?.length || 0 }} slots</div>
            <div class="avail-badge" :class="{ unavail: !day.schedule.isAvailable }">
              {{ day.schedule.isAvailable ? 'Available' : 'Unavailable' }}
            </div>
            <div class="slot-tags">
              <span v-for="slot in day.schedule.timeSlots?.slice(0, 2)" :key="slot._id" class="slot-tag"
                :class="{ booked: slot.isBooked }">
                {{ slot.start }}
              </span>
            </div>
          </div>
          <div v-else class="add-hint">+ Add</div>
        </template>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <AppModal v-if="showModal" :title="`${editingSchedule ? 'Edit' : 'Add'} Schedule — ${modalDate}`"
      @close="closeModal">
      <div class="form-group">
        <label>Available</label>
        <label class="toggle">
          <input type="checkbox" v-model="form.isAvailable" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="form-group">
        <label>Note</label>
        <input v-model="form.note" type="text" placeholder="e.g. On leave after 2pm" />
      </div>
      <div class="form-group">
        <label>Time Slots</label>
        <div v-for="(slot, i) in form.timeSlots" :key="i" class="slot-row">
          <input type="time" v-model="slot.start" />
          <span>—</span>
          <input type="time" v-model="slot.end" />
          <button class="remove-slot" @click="removeSlot(i)">
            <X :size="16" />
          </button>
        </div>
        <button class="btn-outline" @click="addSlot">+ Add Time Slot</button>
      </div>
      <template #footer>
        <button v-if="editingSchedule" class="btn-danger" @click="deleteSchedule">Delete</button>
        <div style="display:flex;gap:10px;margin-left:auto">
          <button class="btn-outline" @click="closeModal">Cancel</button>
          <button class="btn-primary" :disabled="saving" @click="saveSchedule">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import '@/assets/styles/views/doctor/my-schedule.css'
import { ref, computed, onMounted } from 'vue'
import {
  getMySchedule, createSchedule, updateSchedule, deleteSchedule as apiDelete
} from '../../api/schedule.api.js'

const schedules = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingSchedule = ref(null)
const modalDate = ref('')

const today = new Date()
const currentMonth = ref(today.getMonth() + 1)
const currentYear = ref(today.getFullYear())

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const form = ref({ isAvailable: true, note: '', timeSlots: [] })

const currentMonthLabel = computed(() =>
  `${monthNames[currentMonth.value - 1]} ${currentYear.value}`
)

const loadSchedules = async () => {
  loading.value = true
  try {
    const res = await getMySchedule({ month: currentMonth.value, year: currentYear.value })
    schedules.value = res.data.data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const todayStr = new Date().toISOString().slice(0, 10)
  const days = []

  for (let i = 0; i < firstDay; i++) days.push({ date: null })
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: dateStr, dayNum: d, isToday: dateStr === todayStr,
      schedule: schedules.value.find(s => s.date === dateStr) || null,
    })
  }
  return days
})

const prevMonth = () => {
  if (currentMonth.value === 1) { currentMonth.value = 12; currentYear.value-- }
  else currentMonth.value--
  loadSchedules()
}
const nextMonth = () => {
  if (currentMonth.value === 12) { currentMonth.value = 1; currentYear.value++ }
  else currentMonth.value++
  loadSchedules()
}

const openAddModal = () => {
  const todayStr = new Date().toISOString().slice(0, 10)
  openDayModal({ date: todayStr, dayNum: new Date().getDate(), schedule: null })
}

const openDayModal = (day) => {
  modalDate.value = day.date
  editingSchedule.value = day.schedule || null
  if (day.schedule) {
    form.value = {
      isAvailable: day.schedule.isAvailable,
      note: day.schedule.note || '',
      timeSlots: day.schedule.timeSlots.map(s => ({ start: s.start, end: s.end, isBooked: s.isBooked })),
    }
  } else {
    form.value = { isAvailable: true, note: '', timeSlots: [] }
  }
  showModal.value = true
}

const closeModal = () => { showModal.value = false; editingSchedule.value = null }

const addSlot = () => form.value.timeSlots.push({ start: '09:00', end: '10:00', isBooked: false })
const removeSlot = (i) => form.value.timeSlots.splice(i, 1)

const saveSchedule = async () => {
  saving.value = true
  try {
    if (editingSchedule.value) {
      await updateSchedule(editingSchedule.value._id, form.value)
    } else {
      await createSchedule({ ...form.value, date: modalDate.value })
    }
    await loadSchedules()
    closeModal()
  } catch (e) {
    alert(e.response?.data?.message || 'Error saving schedule')
  } finally { saving.value = false }
}

const deleteSchedule = async () => {
  if (!confirm('Delete this schedule?')) return
  try {
    await apiDelete(editingSchedule.value._id)
    await loadSchedules()
    closeModal()
  } catch (e) { alert('Error deleting') }
}

onMounted(loadSchedules)
</script>

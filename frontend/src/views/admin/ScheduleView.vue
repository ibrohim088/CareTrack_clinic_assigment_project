<template>
  <div class="schedule-page">
    <div class="page-header">
      <h1>Clinicians Schedule</h1>
      <div class="header-filters">
        <select v-model="selectedClinicianId" @change="loadSchedules">
          <option value="">All Clinicians</option>
          <option v-for="c in clinicians" :key="c._id" :value="c._id">
            {{ c.user?.fullName }}
          </option>
        </select>
        <select v-model="selectedMonth" @change="loadSchedules">
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
        <select v-model="selectedYear" @change="loadSchedules">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">Loading schedules...</div>

    <div v-else class="calendar-grid">
      <div v-for="day in calendarDays" :key="day.date" class="calendar-day"
        :class="{ 'has-schedule': day.schedule, 'today': day.isToday, 'empty': !day.date }">
        <template v-if="day.date">
          <div class="day-number">{{ day.dayNum }}</div>
          <div v-if="day.schedule" class="day-schedule">
            <div class="clinician-name">{{ day.schedule.clinician?.user?.fullName }}</div>
            <div class="slots-count">{{ day.schedule.timeSlots?.length || 0 }} slots</div>
            <div class="slot-tags">
              <span v-for="slot in day.schedule.timeSlots?.slice(0, 3)" :key="slot._id" class="slot-tag"
                :class="{ booked: slot.isBooked }">
                {{ slot.start }}
              </span>
              <span v-if="day.schedule.timeSlots?.length > 3" class="slot-tag more">
                +{{ day.schedule.timeSlots.length - 3 }}
              </span>
            </div>
          </div>
          <div v-else class="day-empty">No schedule</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/views/admin/schedule-view.css'
import { ref, computed, onMounted } from 'vue'
import { getSchedules } from '../../api/schedule.api.js'
import { getDoctors } from '../../api/doctor.api.js'

const schedules = ref([])
const clinicians = ref([])
const loading = ref(false)
const selectedClinicianId = ref('')
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

const months = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
]
const years = [2024, 2025, 2026, 2027]

const loadSchedules = async () => {
  loading.value = true
  try {
    const params = { month: selectedMonth.value, year: selectedYear.value }
    if (selectedClinicianId.value) params.clinicianId = selectedClinicianId.value
    const res = await getSchedules(params)
    schedules.value = res.data.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date().toISOString().slice(0, 10)

  const days = []
  // Bo'sh kunlar (oy boshidan oldin)
  for (let i = 0; i < firstDay; i++) days.push({ date: null })

  for (let d = 1; d <= daysInMonth; d++) {
    const pad = String(d).padStart(2, '0')
    const padM = String(month).padStart(2, '0')
    const dateStr = `${year}-${padM}-${pad}`
    const schedule = schedules.value.find(s => s.date === dateStr)
    days.push({
      date: dateStr,
      dayNum: d,
      isToday: dateStr === today,
      schedule: schedule || null,
    })
  }
  return days
})

onMounted(async () => {
  const res = await getDoctors()
  clinicians.value = res.data.data?.data || res.data.data || []
  await loadSchedules()
})
</script>

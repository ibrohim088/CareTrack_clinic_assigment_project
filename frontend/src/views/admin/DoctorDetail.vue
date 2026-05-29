<template>
  <div>
    <div class="breadcrumb-ct">
      <router-link to="/admin/doctors">Shifokorlar</router-link>
      <span class="sep">/</span>
      <span class="cur">{{ clinician?.user?.fullName || 'Shifokor' }}</span>
    </div>

    <div v-if="loading" style="text-align:center;padding:60px;color:#9ca3af">Yuklanmoqda...</div>

    <template v-else-if="clinician">
      <!-- Profile -->
      <div class="card-block" style="margin-bottom:20px">
        <div style="display:flex;align-items:flex-start;gap:20px">
          <div class="avatar xl">{{ getInitials(clinician.user?.fullName) }}</div>
          <div style="flex:1">
            <h3 style="margin:0 0 4px;font-size:20px;font-weight:700">{{ clinician.user?.fullName }}</h3>
            <div style="font-size:13.5px;color:#6b7280;margin-bottom:4px">{{ clinician.specialization }}</div>
            <div style="font-size:13px;color:#6b7280">Litsenziya: {{ clinician.licenseNumber }} · {{ clinician.experience }} yil tajriba</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
              <div>
                <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">EMAIL</div>
                <div style="font-size:13.5px">{{ clinician.user?.email || '—' }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">TELEFON</div>
                <div style="font-size:13.5px">{{ clinician.user?.phone || '—' }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">XONA</div>
                <div style="font-size:13.5px">{{ clinician.roomNumber || '—' }}</div>
              </div>
              <div>
                <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">HOLAT</div>
                <span class="status-pill" :class="clinician.isAvailable ? 'confirmed' : 'cancelled'">
                  {{ clinician.isAvailable ? 'Faol' : 'Faol emas' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Working Days & Schedule -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
        <!-- Working Days -->
        <div class="card-block">
          <h4 class="card-block-title">Ish kunlari va soatlari</h4>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div v-for="day in allDays" :key="day.code"
              style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border:1px solid #e5e9f0;border-radius:8px">
              <div>
                <div style="font-size:13.5px;font-weight:500">{{ day.name }}</div>
                <div v-if="isWorkingDay(day.code)" style="font-size:12px;color:#6b7280">
                  {{ clinician.workingHours?.start || '09:00' }} – {{ clinician.workingHours?.end || '18:00' }}
                </div>
                <div v-else style="font-size:12px;color:#9ca3af">Dam olish</div>
              </div>
              <span v-if="isWorkingDay(day.code)"
                style="background:#dcfce7;color:#16a34a;font-size:11px;padding:2px 8px;border-radius:20px;font-weight:600">
                Ish kuni
              </span>
            </div>
          </div>
        </div>

        <!-- Schedule Calendar -->
        <div class="card-block">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
            <h4 class="card-block-title" style="margin:0">Jadval Kalendari</h4>
            <div style="display:flex;align-items:center;gap:8px">
              <button class="btn-ct btn-ct-ghost" @click="prevMonth">&#8592;</button>
              <span style="font-size:13px;font-weight:500">{{ monthLabel }}</span>
              <button class="btn-ct btn-ct-ghost" @click="nextMonth">&#8594;</button>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:#e5e9f0;border:1px solid #e5e9f0;border-radius:8px;overflow:hidden">
            <div v-for="d in ['Du','Se','Ch','Pa','Ju','Sh','Ya']" :key="d"
              style="background:#f4f6fb;padding:6px;text-align:center;font-size:11px;font-weight:600;color:#6b7280">{{ d }}</div>
            <div v-for="day in calDays" :key="day.key"
              style="background:#fff;padding:6px;min-height:48px;cursor:pointer"
              :style="day.selected ? 'background:#1a56db' : day.hasSchedule ? 'background:#f0fdf4' : ''"
              @click="day.date && (selectedDate=day.date)">
              <div style="font-size:12px;font-weight:500" :style="day.selected ? 'color:#fff' : 'color:#1a1f36'">{{ day.num }}</div>
              <div v-if="day.hasSchedule" style="font-size:10px" :style="day.selected ? 'color:#dbeafe' : 'color:#16a34a'">
                {{ day.slots }} slot
              </div>
            </div>
          </div>

          <!-- Selected day slots -->
          <div v-if="selectedDaySchedule" style="margin-top:12px">
            <div style="font-size:13px;font-weight:600;margin-bottom:8px">{{ selectedDate }} — slotlar</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span v-for="slot in selectedDaySchedule.timeSlots" :key="slot.start"
                style="padding:4px 10px;border-radius:6px;font-size:12px"
                :style="slot.isBooked ? 'background:#fee2e2;color:#dc2626' : 'background:#dcfce7;color:#16a34a'">
                {{ slot.start }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else style="text-align:center;padding:60px;color:#9ca3af">Shifokor topilmadi</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClinicianStore } from '@/stores/clinician.store.js'
import { getSchedules } from '@/api/schedule.api.js'

const route = useRoute()
const clinicianStore = useClinicianStore()

const clinician = ref(null)
const loading = ref(false)
const schedules = ref([])
const selectedDate = ref('')

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
const allDays = [
  { code: 'Mon', name: 'Dushanba' }, { code: 'Tue', name: 'Seshanba' },
  { code: 'Wed', name: 'Chorshanba' }, { code: 'Thu', name: 'Payshanba' },
  { code: 'Fri', name: 'Juma' }, { code: 'Sat', name: 'Shanba' },
  { code: 'Sun', name: 'Yakshanba' }
]

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const isWorkingDay = (code) => clinician.value?.workingDays?.includes(code)
const monthLabel = computed(() => `${MONTHS[currentMonth.value]} ${currentYear.value}`)

const calDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7 // Monday start
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push({ num: '', key: `p${i}`, date: null, hasSchedule: false, slots: 0, selected: false })
  for (let i = 1; i <= daysInMonth; i++) {
    const pad = String(month + 1).padStart(2, '0')
    const dayStr = `${year}-${pad}-${String(i).padStart(2, '0')}`
    const sched = schedules.value.find(s => s.date === dayStr)
    days.push({ num: i, key: `d${i}`, date: dayStr, hasSchedule: !!sched, slots: sched?.timeSlots?.length || 0, selected: dayStr === selectedDate.value })
  }
  return days
})

const selectedDaySchedule = computed(() =>
  selectedDate.value ? schedules.value.find(s => s.date === selectedDate.value) : null
)

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
  loadSchedules()
}
const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
  loadSchedules()
}

const loadSchedules = async () => {
  if (!clinician.value) return
  try {
    const res = await getSchedules({ clinicianId: clinician.value._id, month: currentMonth.value + 1, year: currentYear.value })
    schedules.value = res.data.data || []
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  loading.value = true
  try {
    await clinicianStore.fetchClinicianById(route.params.id)
    clinician.value = clinicianStore.selectedClinician
    await loadSchedules()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
.avatar.xl { width: 72px; height: 72px; font-size: 24px; border-radius: 16px; }
</style>

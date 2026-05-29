<template>
  <div>
    <div style="margin-bottom:24px">
      <h3 style="font-size:22px;font-weight:700;margin:0 0 4px">Welcome back, {{ doctorName }}</h3>
      <p style="font-size:13.5px;color:#6b7280;margin:0">
        You have {{ stats.today }} appointments today
      </p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
      <div class="stat-card">
        <div class="label">Today</div>
        <div class="value">{{ String(stats.today).padStart(2,'0') }}</div>
      </div>
      <div class="stat-card">
        <div class="label">This Week</div>
        <div class="value">{{ stats.week }}</div>
      </div>
      <div class="stat-card">
        <div class="label">My Patients</div>
        <div class="value">{{ stats.patients }}</div>
      </div>
      <div class="stat-card">
        <div class="label">Pending</div>
        <div class="value">{{ String(stats.pending).padStart(2,'0') }}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 280px;gap:20px">
      <div class="card-block">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h4 class="card-block-title" style="margin:0">Today's Appointments</h4>
          <router-link to="/clinician/appointments" style="font-size:13px;color:#1a56db;text-decoration:none">View all</router-link>
        </div>
        <div v-if="loadingAppts" style="text-align:center;padding:32px;color:#9ca3af">Loading...</div>
        <div v-else-if="todayAppointments.length === 0" style="text-align:center;padding:32px;color:#9ca3af">No appointments today</div>
        <div v-else>
          <div v-for="appt in todayAppointments" :key="appt._id" class="appt-row">
            <div class="appt-time">{{ appt.timeSlot }}</div>
            <div class="avatar">{{ getInitials(appt.patient?.user?.fullName) }}</div>
            <div style="flex:1">
              <div style="font-size:13.5px;font-weight:500">{{ appt.patient?.user?.fullName || '—' }}</div>
              <div style="font-size:12px;color:#6b7280">{{ appt.reason || 'Consultation' }}</div>
            </div>
            <span class="status-pill" :class="appt.status">{{ appt.status }}</span>
            <button class="btn-ct btn-ct-ghost" style="padding:4px 8px"
              @click="changeStatus(appt._id, appt.status === 'confirmed' ? 'completed' : 'confirmed')">
              <MoreHorizontal :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="card-block" style="margin-bottom:16px">
          <h4 class="card-block-title">This Week</h4>
          <div style="display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 4px">
            <div v-for="d in weekData" :key="d.day"
              style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="width:100%;border-radius:4px 4px 0 0;background:#1a56db;opacity:0.8"
                :style="{ height: (maxWeek ? d.count / maxWeek * 70 : 0) + 'px' }"></div>
              <div style="font-size:10px;color:#6b7280">{{ d.day }}</div>
              <div style="font-size:10px;font-weight:600;color:#1a1f36">{{ d.count }}</div>
            </div>
          </div>
        </div>

        <div class="card-block">
          <h4 class="card-block-title">Recent Appointments</h4>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div v-for="appt in recentAppointments" :key="appt._id"
              style="display:flex;align-items:flex-start;gap:8px">
              <div style="width:8px;height:8px;border-radius:50%;background:#1a56db;margin-top:5px;flex-shrink:0"></div>
              <div>
                <div style="font-size:13px">{{ appt.patient?.user?.fullName }}</div>
                <div style="font-size:11px;color:#9ca3af">{{ formatDate(appt.date) }} · {{ appt.status }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.store.js'
import { getAppointments, updateAppointmentStatus } from '../../api/appointment.api.js'
import { getPatients } from '../../api/patient.api.js'
import { MoreHorizontal } from 'lucide-vue-next'

const authStore = useAuthStore()
const doctorName = computed(() => authStore.user?.fullName || 'Doctor')

const allAppointments = ref([])
const loadingAppts = ref(false)
const totalPatients = ref(0)

const today = new Date().toISOString().slice(0, 10)
const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const todayAppointments = computed(() =>
  allAppointments.value.filter(a => a.date?.slice(0, 10) === today)
)

const stats = computed(() => ({
  today: todayAppointments.value.length,
  week: allAppointments.value.filter(a => isThisWeek(a.date)).length,
  patients: totalPatients.value,
  pending: allAppointments.value.filter(a => a.status === 'pending').length,
}))

const weekData = computed(() => {
  return weekDayNames.map((day, i) => {
    const date = getWeekDay(i)
    const count = allAppointments.value.filter(a => a.date?.slice(0, 10) === date).length
    return { day, count }
  })
})

const maxWeek = computed(() => Math.max(...weekData.value.map(d => d.count), 1))

const recentAppointments = computed(() =>
  [...allAppointments.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
)

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'

const isThisWeek = (dateStr) => {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  startOfWeek.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return d >= startOfWeek && d <= endOfWeek
}

const getWeekDay = (offset) => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  startOfWeek.setDate(startOfWeek.getDate() + offset)
  return startOfWeek.toISOString().slice(0, 10)
}

const changeStatus = async (id, status) => {
  try {
    await updateAppointmentStatus(id, status)
    const appt = allAppointments.value.find(a => a._id === id)
    if (appt) appt.status = status
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  loadingAppts.value = true
  try {
    const [apptRes, patientRes] = await Promise.all([
      getAppointments({ limit: 100 }),
      getPatients({ limit: 1 }),
    ])
    allAppointments.value = apptRes.data.data?.data || apptRes.data.data || []
    totalPatients.value = patientRes.data.data?.total || 0
  } catch (e) { console.error(e) }
  finally { loadingAppts.value = false }
})
</script>
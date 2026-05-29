<template>
  <div class="dashboard">
    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><Stethoscope :size="26" color="#1d4ed8" /></div>
        <div class="stat-info">
          <div class="stat-label">Jami Shifokorlar</div>
          <div class="stat-value">{{ stats.totalClinicians }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><Users :size="26" color="#16a34a" /></div>
        <div class="stat-info">
          <div class="stat-label">Jami Bemorlar</div>
          <div class="stat-value">{{ stats.totalPatients }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow"><CalendarDays :size="26" color="#d97706" /></div>
        <div class="stat-info">
          <div class="stat-label">Bugungi Qabullar</div>
          <div class="stat-value">{{ stats.todayAppointments }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><Clock :size="26" color="#dc2626" /></div>
        <div class="stat-info">
          <div class="stat-label">Kutilayotgan</div>
          <div class="stat-value">{{ stats.pendingAppointments }}</div>
        </div>
      </div>
    </div>

    <!-- Recent + Today Queue -->
    <div class="bottom-grid">

      <!-- Recent Appointments -->
      <div class="card">
        <div class="card-header">
          <h3>So'nggi Qabullar</h3>
        </div>
        <div v-if="dashboardStore.loading" class="loading">Yuklanmoqda...</div>
        <div v-else-if="recentAppointments.length === 0" class="empty">Qabullar yo'q</div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Bemor</th>
              <th>Sana</th>
              <th>Vaqt</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appt in recentAppointments" :key="appt._id">
              <td>{{ appt.patient?.user?.fullName || '—' }}</td>
              <td>{{ formatDate(appt.date) }}</td>
              <td>{{ appt.timeSlot }}</td>
              <td>
                <span class="badge" :class="appt.status">{{ appt.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Today Queue -->
      <div class="card">
        <div class="card-header">
          <h3>Bugungi Navbat</h3>
        </div>
        <div v-if="dashboardStore.loading" class="loading">Yuklanmoqda...</div>
        <div v-else-if="todayQueue.length === 0" class="empty">Bugun navbat yo'q</div>
        <div v-else class="queue-list">
          <div v-for="(item, index) in todayQueue" :key="item._id" class="queue-item">
            <div class="queue-num">{{ index + 1 }}</div>
            <div class="queue-info">
              <div class="queue-name">{{ item.patient?.user?.fullName || '—' }}</div>
              <div class="queue-time">{{ item.timeSlot }}</div>
            </div>
            <span class="badge" :class="item.status">{{ item.status }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Stethoscope, Users, CalendarDays, Clock } from 'lucide-vue-next'
import '@/assets/styles/views/admin/admin-dashboard.css'
import { computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard.store.js'

const dashboardStore = useDashboardStore()

const stats = computed(() => dashboardStore.stats)
const recentAppointments = computed(() => dashboardStore.recentAppointments)
const todayQueue = computed(() => dashboardStore.todayQueue)

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('uz-UZ')
}

onMounted(async () => {
  await Promise.all([
    dashboardStore.fetchDashboardStats(),
    dashboardStore.fetchRecentAppointments(),
    dashboardStore.fetchTodayQueue()
  ])
})
</script>

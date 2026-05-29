import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios.js'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalPatients: 0,
    totalClinicians: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0
  })
  const recentAppointments = ref([])
  const todayQueue = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getStats = computed(() => stats.value)
  const getRecentAppointments = computed(() => recentAppointments.value)
  const getTodayQueue = computed(() => todayQueue.value)

  // Statslarni mavjud endpointlar orqali parallel hisoblash
  const fetchDashboardStats = async () => {
    loading.value = true
    error.value = null
    try {
      const todayStr = new Date().toISOString().slice(0, 10)

      const [patientsRes, cliniciansRes, allApptRes, pendingRes, todayRes] = await Promise.allSettled([
        api.get('/patients', { params: { limit: 1 } }),
        api.get('/clinicians', { params: { limit: 1 } }),
        api.get('/appointments', { params: { limit: 1 } }),
        api.get('/appointments', { params: { status: 'pending', limit: 1 } }),
        api.get('/appointments', { params: { date: todayStr, limit: 1 } }),
      ])

      stats.value = {
        totalPatients:      patientsRes.value?.data?.data?.total || 0,
        totalClinicians:    cliniciansRes.value?.data?.data?.total || 0,
        totalAppointments:  allApptRes.value?.data?.data?.total || 0,
        pendingAppointments: pendingRes.value?.data?.data?.total || 0,
        todayAppointments:  todayRes.value?.data?.data?.total || 0,
      }
    } catch (err) {
      error.value = err.message
      console.error('Dashboard stats error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchRecentAppointments = async (limit = 5) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/appointments', { params: { limit } })
      const data = res.data.data
      recentAppointments.value = data?.data || data || []
    } catch (err) {
      error.value = err.message
      console.error('Recent appointments error:', err)
    } finally {
      loading.value = false
    }
  }

  // Bugungi qabullarni mavjud endpoint orqali olamiz
  const fetchTodayQueue = async () => {
    loading.value = true
    error.value = null
    try {
      const todayStr = new Date().toISOString().slice(0, 10)
      const res = await api.get('/appointments', {
        params: { date: todayStr, limit: 20 }
      })
      const data = res.data.data
      todayQueue.value = (data?.data || data || []).sort((a, b) =>
        (a.timeSlot || '').localeCompare(b.timeSlot || '')
      )
    } catch (err) {
      error.value = err.message
      console.error('Today queue error:', err)
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    stats.value = {
      totalPatients: 0,
      totalClinicians: 0,
      totalAppointments: 0,
      pendingAppointments: 0,
      todayAppointments: 0
    }
    recentAppointments.value = []
    todayQueue.value = []
    error.value = null
  }

  return {
    stats, recentAppointments, todayQueue, loading, error,
    getStats, getRecentAppointments, getTodayQueue,
    fetchDashboardStats, fetchRecentAppointments, fetchTodayQueue, reset
  }
})

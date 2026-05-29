import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as scheduleAPI from '@/api/schedule.api'

export const useScheduleStore = defineStore('schedule', () => {
  const schedules = ref([])
  const selectedSchedule = ref(null)
  const availableSlots = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getSchedules = computed(() => schedules.value)
  const getSelectedSchedule = computed(() => selectedSchedule.value)
  const getAvailableSlots = computed(() => availableSlots.value)

  // Barcha jadvallarni olish (admin yoki filter bilan)
  const fetchSchedules = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await scheduleAPI.getSchedules(params)
      schedules.value = res.data.data || []
    } catch (err) {
      error.value = err.message
      console.error('Schedules fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // Clinician o'z jadvalini oladi
  const fetchMySchedule = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await scheduleAPI.getMySchedule(params)
      schedules.value = res.data.data || []
    } catch (err) {
      error.value = err.message
      console.error('My schedule fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // Ma'lum clinicianning jadvalini olish (patient/admin uchun)
  const fetchClinicianSchedule = async (clinicianId, params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await scheduleAPI.getSchedules({ clinicianId, ...params })
      schedules.value = res.data.data || []
    } catch (err) {
      error.value = err.message
      console.error('Clinician schedule fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  // Bitta sananing bo'sh slotlarini olish
  const fetchAvailableSlots = async (clinicianId, date) => {
    loading.value = true
    error.value = null
    try {
      const [year, month] = date.split('-')
      const res = await scheduleAPI.getSchedules({ clinicianId, month: parseInt(month), year: parseInt(year) })
      const all = res.data.data || []
      const daySchedule = all.find(s => s.date === date)
      availableSlots.value = daySchedule?.timeSlots?.filter(s => !s.isBooked) || []
    } catch (err) {
      error.value = err.message
      console.error('Available slots error:', err)
    } finally {
      loading.value = false
    }
  }

  const createSchedule = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await scheduleAPI.createSchedule(payload)
      schedules.value.push(res.data.data)
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSchedule = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await scheduleAPI.updateSchedule(id, payload)
      const idx = schedules.value.findIndex(s => s._id === id)
      if (idx !== -1) schedules.value[idx] = res.data.data
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSchedule = async (id) => {
    loading.value = true
    error.value = null
    try {
      await scheduleAPI.deleteSchedule(id)
      schedules.value = schedules.value.filter(s => s._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    schedules.value = []
    selectedSchedule.value = null
    availableSlots.value = []
    error.value = null
  }

  return {
    schedules, selectedSchedule, availableSlots, loading, error,
    getSchedules, getSelectedSchedule, getAvailableSlots,
    fetchSchedules, fetchMySchedule, fetchClinicianSchedule,
    fetchAvailableSlots, createSchedule, updateSchedule, deleteSchedule, reset
  }
})

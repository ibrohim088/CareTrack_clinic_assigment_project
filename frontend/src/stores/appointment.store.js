import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as appointmentAPI from '@/api/appointment.api'

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref([])
  const selectedAppointment = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ page: 1, totalPages: 1, total: 0 })

  const getAppointments = computed(() => appointments.value)
  const getSelectedAppointment = computed(() => selectedAppointment.value)

  const fetchAppointments = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await appointmentAPI.getAppointments(params)
      const data = res.data.data
      appointments.value = data?.data || data || []
      pagination.value = data?.pagination || { page: 1, totalPages: 1, total: 0 }
    } catch (err) {
      error.value = err.message
      console.error('Appointments fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAppointmentById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await appointmentAPI.getAppointment(id)
      selectedAppointment.value = res.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createAppointment = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await appointmentAPI.createAppointment(payload)
      appointments.value.push(res.data.data)
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateAppointmentStatus(id, status)
      const appt = appointments.value.find(a => a._id === id)
      if (appt) appt.status = status
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteAppointment = async (id) => {
    loading.value = true
    error.value = null
    try {
      await appointmentAPI.deleteAppointment(id)
      appointments.value = appointments.value.filter(a => a._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    appointments.value = []
    selectedAppointment.value = null
    error.value = null
    pagination.value = { page: 1, totalPages: 1, total: 0 }
  }

  return {
    appointments, selectedAppointment, loading, error, pagination,
    getAppointments, getSelectedAppointment,
    fetchAppointments, fetchAppointmentById,
    createAppointment, updateStatus, deleteAppointment, reset
  }
})

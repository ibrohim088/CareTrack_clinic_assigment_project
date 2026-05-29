import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios.js'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref([])
  const selectedPatient = ref(null)
  const pagination = ref({ page: 1, totalPages: 1, total: 0 })
  const loading = ref(false)
  const error = ref(null)

  const getPatients = computed(() => patients.value)
  const getSelectedPatient = computed(() => selectedPatient.value)

  const fetchPatients = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/patients', { params })
      patients.value = res.data.data?.data || []
      pagination.value = res.data.data?.pagination || { page: 1, totalPages: 1, total: 0 }
    } catch (err) {
      error.value = err.message
      console.error('Patients fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPatientById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/patients/${id}`)
      selectedPatient.value = res.data.data
    } catch (err) {
      error.value = err.message
      console.error('Patient fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const createPatient = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/patients', payload)
      patients.value.push(res.data.data)
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePatient = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.put(`/patients/${id}`, payload)
      const index = patients.value.findIndex(p => p._id === id)
      if (index !== -1) patients.value[index] = res.data.data
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePatient = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/patients/${id}`)
      patients.value = patients.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    patients.value = []
    selectedPatient.value = null
    pagination.value = { page: 1, totalPages: 1, total: 0 }
    error.value = null
  }

  return {
    patients,
    selectedPatient,
    pagination,
    loading,
    error,
    getPatients,
    getSelectedPatient,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    reset
  }
})
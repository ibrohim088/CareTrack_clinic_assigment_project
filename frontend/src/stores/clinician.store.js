import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/axios.js'

export const useClinicianStore = defineStore('clinician', () => {
  const clinicians = ref([])
  const selectedClinician = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getClinicians = computed(() => clinicians.value)
  const getSelectedClinician = computed(() => selectedClinician.value)

  const fetchClinicians = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/clinicians', { params })
      clinicians.value = res.data.data?.data || []
    } catch (err) {
      error.value = err.message
      console.error('Clinicians fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchClinicianById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/clinicians/${id}`)
      selectedClinician.value = res.data.data
    } catch (err) {
      error.value = err.message
      console.error('Clinician fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const createClinician = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/clinicians', payload)
      clinicians.value.push(res.data.data)
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateClinician = async (id, payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await api.put(`/clinicians/${id}`, payload)
      const index = clinicians.value.findIndex(c => c._id === id)
      if (index !== -1) clinicians.value[index] = res.data.data
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteClinician = async (id) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/clinicians/${id}`)
      clinicians.value = clinicians.value.filter(c => c._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    clinicians.value = []
    selectedClinician.value = null
    error.value = null
  }

  return {
    clinicians,
    selectedClinician,
    loading,
    error,
    getClinicians,
    getSelectedClinician,
    fetchClinicians,
    fetchClinicianById,
    createClinician,
    updateClinician,
    deleteClinician,
    reset
  }
})
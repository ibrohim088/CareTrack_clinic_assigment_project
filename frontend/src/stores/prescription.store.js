import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as prescriptionAPI from '@/api/prescription.api'

export const usePrescriptionStore = defineStore('prescription', () => {
  const prescriptions = ref([])
  const selectedPrescription = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const getPrescriptions = computed(() => prescriptions.value)
  const getSelectedPrescription = computed(() => selectedPrescription.value)

  const fetchPrescriptions = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const res = await prescriptionAPI.getPrescriptions(params)
      const data = res.data.data
      prescriptions.value = data?.data || data || []
    } catch (err) {
      error.value = err.message
      console.error('Prescriptions fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPrescriptionById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const res = await prescriptionAPI.getPrescription(id)
      selectedPrescription.value = res.data.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createPrescription = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const res = await prescriptionAPI.createPrescription(payload)
      prescriptions.value.push(res.data.data)
      return res.data.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePrescription = async (id) => {
    loading.value = true
    error.value = null
    try {
      await prescriptionAPI.deletePrescription(id)
      prescriptions.value = prescriptions.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    prescriptions.value = []
    selectedPrescription.value = null
    error.value = null
  }

  return {
    prescriptions, selectedPrescription, loading, error,
    getPrescriptions, getSelectedPrescription,
    fetchPrescriptions, fetchPrescriptionById,
    createPrescription, deletePrescription, reset
  }
})

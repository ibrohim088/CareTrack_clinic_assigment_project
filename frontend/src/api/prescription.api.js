import api from './axios.js'

export const getPrescriptions = (params) => api.get('/prescriptions', { params })
export const getPrescription = (id) => api.get(`/prescriptions/${id}`)
export const createPrescription = (payload) => api.post('/prescriptions', payload)
export const deletePrescription = (id) => api.delete(`/prescriptions/${id}`)
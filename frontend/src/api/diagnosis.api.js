import api from './axios.js'

export const getDiagnoses = (params) => api.get('/diagnoses', { params })
export const getDiagnosis = (id) => api.get(`/diagnoses/${id}`)
export const createDiagnosis = (payload) => api.post('/diagnoses', payload)
export const updateDiagnosis = (id, payload) => api.put(`/diagnoses/${id}`, payload)
export const deleteDiagnosis = (id) => api.delete(`/diagnoses/${id}`)

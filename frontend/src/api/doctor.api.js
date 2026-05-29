import api from './axios.js'

export const getDoctors = (params) => api.get('/clinicians', { params })
export const getDoctor = (id) => api.get(`/clinicians/${id}`)
export const createDoctor = (payload) => api.post('/clinicians', payload)
export const updateDoctor = (id, payload) => api.put(`/clinicians/${id}`, payload)
export const deleteDoctor = (id) => api.delete(`/clinicians/${id}`)

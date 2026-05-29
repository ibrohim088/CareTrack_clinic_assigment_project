import api from './axios.js'

export const getMyProfile = () => api.get('/profile/me')
export const updateMyProfile = (payload) => api.put('/profile/me', payload)
export const getClinicianProfile = (id) => api.get(`/profile/clinician/${id}`)
export const getPatientProfile = (id) => api.get(`/profile/patient/${id}`)
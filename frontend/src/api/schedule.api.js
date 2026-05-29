import api from './axios.js'

export const getSchedules = (params) => api.get('/schedules', { params })
export const getMySchedule = (params) => api.get('/schedules/my', { params })
export const getScheduleById = (id) => api.get(`/schedules/${id}`)
export const createSchedule = (payload) => api.post('/schedules', payload)
export const updateSchedule = (id, payload) => api.put(`/schedules/${id}`, payload)
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`)
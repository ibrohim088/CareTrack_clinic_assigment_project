import api from './axios.js'

export const login = payload => api.post('/auth/login', payload)
export const register = payload => api.post('/auth/register', payload)
export const getMe = () => api.get('/auth/me')
export const forgotPassword = payload => api.post('/auth/forgot-password', payload)
export const resetPassword = payload => api.post('/auth/reset-password', payload)
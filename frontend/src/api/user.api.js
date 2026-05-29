import api from './axios.js'

export const getUsers = () => api.get('/users')
export const getUser = id => api.get(`/users/${id}`)
export const createUser = payload => api.post('/users', payload)
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload)
export const deleteUser = id => api.delete(`/users/${id}`)

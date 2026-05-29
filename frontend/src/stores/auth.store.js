import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMe } from '../api/auth.api.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('caretrack_token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const role = computed(() => user.value?.role || null)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('caretrack_token', newToken)
  }

  const fetchMe = async () => {
    try {
      const res = await getMe()
      user.value = res.data.data
    } catch {
      logout()
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('caretrack_token')
  }

  return { token, user, isAuthenticated, role, setToken, fetchMe, logout }
})

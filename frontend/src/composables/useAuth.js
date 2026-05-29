import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.store.js'

export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    login: authStore.setToken,
    logout: authStore.logout,
  }
}

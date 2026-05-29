<template>
  <header class="topbar bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between shadow-sm">
    <div>
      <h4 class="mb-0 fw-semibold text-dark">{{ title }}</h4>
    </div>
    
    <div class="d-flex align-items-center gap-3">
      <div class="text-end">
        <div class="fw-medium">{{ user?.fullName || 'Foydalanuvchi' }}</div>
        <small class="text-muted">{{ getRoleName(user?.role) }}</small>
      </div>
      
      <button @click="logout" class="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
        <LogOut size="18" /> Chiqish
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store.js'
import { LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const props = defineProps({ title: { type: String, required: true } })

const user = computed(() => authStore.user)

const getRoleName = (role) => {
  if (role === 'admin') return 'Administrator'
  if (role === 'clinician') return 'Shifokor'
  if (role === 'patient') return 'Bemor'
  return ''
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 1030;
}
</style>
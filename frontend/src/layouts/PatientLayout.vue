<template>
  <div style="display:flex">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-mark">CT</div>
        <div class="sidebar-brand">
          <h6>CareTrack</h6>
          <small>Clinic System</small>
        </div>
      </div>
      <div class="role-badge patient">PATIENT</div>

      <nav class="sidebar-nav">
        <router-link to="/patient/dashboard" class="nav-item" active-class="active">
          <LayoutDashboard :size="17" /> Dashboard
        </router-link>
        <router-link to="/patient/appointments" class="nav-item" active-class="active">
          <CalendarDays :size="17" /> My Appointments
        </router-link>
        <router-link to="/patient/find-doctor" class="nav-item" active-class="active">
          <Stethoscope :size="17" /> Find Doctor
        </router-link>
        <router-link to="/patient/prescriptions" class="nav-item" active-class="active">
          <Pill :size="17" /> Prescriptions
        </router-link>
        <router-link to="/patient/records" class="nav-item" active-class="active">
          <FolderOpen :size="17" /> Medical Records
        </router-link>
        <router-link to="/patient/settings" class="nav-item" active-class="active">
          <Settings :size="17" /> Settings
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/patient/profile" class="sidebar-user-link">
          <div class="user-avatar">{{ initials }}</div>
          <div>
            <div style="font-size:13px;font-weight:600">{{ user?.fullName }}</div>
            <div style="font-size:11px;color:#6b7280">PATIENT</div>
          </div>
        </router-link>

        <button @click="logout" style="margin-left:auto;background:none;border:none;cursor:pointer;color:#6b7280"
          title="Logout">
          <LogOut :size="16" />
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="topbar">
        <h5>{{ pageTitle }}</h5>
        <div class="topbar-right">
          <div class="search-box">
            <Search :size="15" />
            <input placeholder="Search…" v-model="search" />
          </div>

          <router-link to="/patient/profile" class="topbar-user-link">
            <div class="user-avatar">{{ initials }}</div>
            <div>
              <div style="font-size:13px;font-weight:600">{{ user?.fullName }}</div>
              <div style="font-size:11px;color:#6b7280">View profile</div>
            </div>
          </router-link>
        </div>
      </header>
      <div class="page-body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/layouts/patient-layout.css'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import { LayoutDashboard, CalendarDays, Stethoscope, Pill, FolderOpen, Settings, Search, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const search = ref('')

const user = computed(() => authStore.user)
const initials = computed(() => {
  const name = user.value?.fullName || 'P'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const titles = {
  '/patient/dashboard': 'Patient Dashboard',
  '/patient/appointments': 'My Appointments',
  '/patient/find-doctor': 'Find Doctor',
  '/patient/prescriptions': 'Prescriptions',
  '/patient/records': 'Medical Records',
  '/patient/settings': 'Settings',
}

const pageTitle = computed(() => {
  for (const key of Object.keys(titles)) {
    if (route.path.startsWith(key)) return titles[key]
  }
  return 'Patient'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

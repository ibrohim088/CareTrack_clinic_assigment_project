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
      <div class="role-badge doctor">CLINICIAN</div>

      <nav class="sidebar-nav">
        <router-link to="/clinician/dashboard" class="nav-item" active-class="active">
          <LayoutDashboard :size="17" /> Dashboard
        </router-link>
        <router-link to="/clinician/schedule" class="nav-item" active-class="active">
          <Clock :size="17" /> My Schedule
        </router-link>
        <router-link to="/clinician/patients" class="nav-item" active-class="active">
          <Users :size="17" /> My Patients
        </router-link>
        <router-link to="/clinician/appointments" class="nav-item" active-class="active">
          <CalendarDays :size="17" /> Appointments
        </router-link>
        <router-link to="/clinician/prescriptions" class="nav-item" active-class="active">
          <FileText :size="17" /> Prescriptions
        </router-link>
        <router-link to="/clinician/settings" class="nav-item" active-class="active">
          <Settings :size="17" /> Settings
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/clinician/profile" class="sidebar-user-link">
          <div class="user-avatar">{{ initials }}</div>
          <div>
            <div style="font-size:13px;font-weight:600">{{ user?.fullName }}</div>
            <div style="font-size:11px;color:#6b7280">CLINICIAN</div>
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
          <router-link to="/clinician/profile" class="topbar-user-link">
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
import '@/assets/styles/layouts/doctor-layout.css'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store.js'
import { LayoutDashboard, Clock, Users, CalendarDays, FileText, Settings, Search, LogOut } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const search = ref('')

const user = computed(() => authStore.user)
const initials = computed(() => {
  const name = user.value?.fullName || 'D'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const titles = {
  '/clinician/dashboard': 'Clinician Dashboard',
  '/clinician/schedule': 'My Schedule',
  '/clinician/patients': 'My Patients',
  '/clinician/appointments': 'Appointments',
  '/clinician/prescriptions': 'Prescriptions',
  '/clinician/settings': 'Settings',
}

const pageTitle = computed(() => {
  for (const key of Object.keys(titles)) {
    if (route.path.startsWith(key)) return titles[key]
  }
  return 'Clinician'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

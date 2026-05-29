<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="brand-logo">CT</div>
      <h1>CareTrack</h1>
      <p>Medical Clinic Management System</p>
      <div class="auth-features">
        <div class="auth-feature-item">
          <div class="auth-feature-icon">
            <Building2 :size="18" />
          </div>
          <span>Klinika boshqaruv tizimi</span>
        </div>
        <div class="auth-feature-item">
          <div class="auth-feature-icon">
            <ShieldCheck :size="18" />
          </div>
          <span>Xavfsiz va ishonchli tizim</span>
        </div>
        <div class="auth-feature-item">
          <div class="auth-feature-icon">
            <Smartphone :size="18" />
          </div>
          <span>Qulay interfeys</span>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-form-wrap">
        <h2>Ro'yxatdan o'tish</h2>
        <p class="auth-sub">Yangi akkaunt yaratish uchun ma'lumotlaringizni kiriting</p>

        <div v-if="error" class="auth-alert error">
          <AlertTriangle :size="15" /> {{ error }}
        </div>

        <div class="mb-3">
          <label class="d-block mb-2" style="font-size:13px;font-weight:600;color:#374151;">Rolni tanlang</label>
          <div class="role-grid">
            <div v-for="r in roles" :key="r.value" class="role-option" :class="{ selected: form.role === r.value }"
              @click="form.role = r.value">
              <div class="role-icon">
                <component :is="iconMap[r.icon]" :size="20" />
              </div>
              <div class="role-label">{{ r.label }}</div>
            </div>
          </div>
        </div>

        <div class="row g-3 mb-2">
          <div class="col-12">
            <AppInput label="To'liq ism" v-model="form.fullName" type="text" placeholder="Ism Familiya" />
          </div>
          <div class="col-12">
            <AppInput label="Email manzil" v-model="form.email" type="email" placeholder="email@example.com" />
          </div>
          <div class="col-12">
            <AppInput label="Telefon" v-model="form.phone" type="tel" placeholder="+998 90 000 00 00" />
          </div>
          <div class="col-12">
            <AppInput label="Parol" v-model="form.password" type="password" placeholder="Kamida 6 ta belgi" />
          </div>
        </div>

        <AppButton class="btn-auth" :disabled="loading" @click="handleRegister">
          {{ loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish' }}
        </AppButton>

        <p class="auth-switch">
          Allaqachon akkauntingiz bormi?
          <router-link to="/login">Kirish</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Building2, ShieldCheck, Smartphone, AlertTriangle, Users, Stethoscope } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store.js'
import { register } from '../../api/auth.api.js'
import { AppInput, AppButton } from '../../components/ui'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const iconMap = { Stethoscope, Users, ShieldCheck }

const roles = [
  { value: 'clinician', label: 'Shifokor', icon: 'Stethoscope' },
  { value: 'patient', label: 'Bemor', icon: 'Users' },
  { value: 'admin', label: 'Admin', icon: 'ShieldCheck' },
]

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  phone: '',
  role: 'patient',
})

const handleRegister = async () => {
  if (!form.fullName || !form.email || !form.password) {
    error.value = 'Barcha maydonlarni to\'ldiring'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await register(form)
    const token = res.data.token || res.data.data?.token
    if (token) {
      authStore.setToken(token)
      await authStore.fetchMe()
      const role = authStore.user?.role
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'clinician') router.push('/clinician/dashboard')
      else router.push('/patient/dashboard')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-left-inner">
        <div class="brand-logo">
          <div class="logo-mark" style="width:48px;height:48px;font-size:18px;">CT</div>
        </div>
        <div class="brand-text">
          <h1>CareTrack</h1>
          <p>Medical Management System</p>
        </div>
        <div class="login-illustration">
          <svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="40" width="220" height="150" rx="12" fill="#e8f0fe" />
            <rect x="60" y="70" width="80" height="8" rx="4" fill="#1a56db" opacity="0.3" />
            <rect x="60" y="86" width="120" height="6" rx="3" fill="#1a56db" opacity="0.2" />
            <rect x="60" y="98" width="100" height="6" rx="3" fill="#1a56db" opacity="0.2" />
            <rect x="60" y="115" width="140" height="40" rx="8" fill="#fff" />
            <rect x="70" y="125" width="30" height="20" rx="4" fill="#1a56db" opacity="0.15" />
            <rect x="112" y="127" width="60" height="6" rx="3" fill="#1a56db" opacity="0.25" />
            <rect x="112" y="137" width="40" height="5" rx="2.5" fill="#1a56db" opacity="0.15" />
            <circle cx="240" cy="60" r="24" fill="#1a56db" opacity="0.12" />
            <path d="M232 60h16M240 52v16" stroke="#1a56db" stroke-width="2.5" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrap">
        <h2>Sign in</h2>
        <p class="login-sub">Access your account</p>

        <div v-if="error" class="alert-ct error">{{ error }}</div>

        <div class="form-ct">
          <div style="margin-bottom:16px">
            <AppInput label="Email" v-model="form.email" type="email" placeholder="your@email.com"
              @keyup.enter="submit" />
          </div>

          <div style="margin-bottom:8px">
            <AppInput label="Password" v-model="form.password" type="password" placeholder="••••••••"
              @keyup.enter="submit" />
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
            <router-link to="/forgot-password" style="font-size:13px; color:#1a56db; text-decoration:none">
              Forgot password?
            </router-link>
          </div>

          <AppButton class="btn-ct btn-ct-primary" style="width:100%; justify-content:center; padding:11px"
            :disabled="loading" @click="submit">
            <span v-if="loading">Signing in...</span>
            <span v-else>SIGN IN</span>
          </AppButton>
        </div>

        <div class="quick-access">
          <div class="qa-divider"><span>Quick access as</span></div>
          <div class="qa-buttons">
            <AppButton class="qa-btn" @click="quickLogin('admin')">Admin</AppButton>
            <AppButton class="qa-btn" @click="quickLogin('clinician')">Clinician</AppButton>
            <AppButton class="qa-btn" @click="quickLogin('patient')">Patient</AppButton>
          </div>
        </div>

        <p class="register-link">Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store.js'
import { login } from '../../api/auth.api.js'
import { AppInput, AppButton } from '../../components/ui'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '', remember: false })
const loading = ref(false)
const error = ref('')

const QUICK_CREDENTIALS = {
  admin: { email: 'admin@caretrack.com', password: '123456' },
  clinician: { email: 'clinician@caretrack.com', password: '123456' },
  patient: { email: 'patient@caretrack.com', password: '123456' },
}

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await login({ email: form.value.email, password: form.value.password })
    const { token, user } = res.data.data
    authStore.setToken(token)
    authStore.user = user // set directly from login response
    router.push(`/${user.role}/dashboard`)
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

const quickLogin = (role) => {
  const creds = QUICK_CREDENTIALS[role]
  form.value.email = creds.email
  form.value.password = creds.password
  submit()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.login-left {
  background: #f4f6fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-left-inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  padding: 48px;
}

.brand-logo {
  margin-bottom: 8px;
}

.brand-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1f36;
  margin: 0 0 4px;
}

.brand-text p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-illustration svg {
  width: 300px;
  max-width: 100%;
}

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.login-form-wrap {
  width: 360px;
  max-width: 90vw;
}

.login-form-wrap h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #1a1f36;
}

.login-sub {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 28px;
}

.quick-access {
  margin-top: 24px;
}

.qa-divider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.qa-divider::before,
.qa-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e9f0;
}

.qa-divider span {
  font-size: 12px;
  color: #9ca3af;
  white-space: nowrap;
}

.qa-buttons {
  display: flex;
  gap: 10px;
}

.qa-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e9f0;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #1a1f36;
  cursor: pointer;
  transition: all 0.15s;
}

.qa-btn:hover {
  border-color: #1a56db;
  color: #1a56db;
  background: #e8f0fe;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #6b7280;
}

.register-link a {
  color: #1a56db;
  text-decoration: none;
}
</style>

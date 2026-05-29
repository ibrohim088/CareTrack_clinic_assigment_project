<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="brand-logo">CT</div>
      <h1>CareTrack</h1>
      <p>Parolni tiklash</p>
      <div class="auth-features">
        <div class="auth-feature-item">
          <div class="auth-feature-icon">
            <Mail :size="18" />
          </div>
          <span>Email manzilingizga kod yuboramiz</span>
        </div>
        <div class="auth-feature-item">
          <div class="auth-feature-icon">
            <KeyRound :size="18" />
          </div>
          <span>Yangi parol o'rnating</span>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-form-wrap">
        <h2>Parolni tiklash</h2>
        <p class="auth-sub">Email manzilingizni kiriting — tiklash havolasini yuboramiz</p>

        <div v-if="sent" class="auth-alert success">
          <Check :size="15" /> Tiklash havolasi {{ form.email }} manziliga yuborildi
        </div>
        <div v-if="error" class="auth-alert error">
          <AlertTriangle :size="15" /> {{ error }}
        </div>

        <template v-if="!sent">
          <div class="auth-field">
            <AppInput label="Email manzil" v-model="form.email" type="email" placeholder="email@example.com" @keyup.enter="submit" />
          </div>
          <AppButton class="btn-auth" :disabled="loading" @click="submit">
            {{ loading ? 'Yuborilmoqda...' : 'Havola yuborish' }}
          </AppButton>
        </template>

        <p class="auth-switch">
          <router-link to="/login">
            <ChevronLeft :size="14" /> Kirish sahifasiga qaytish
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Mail, KeyRound, AlertTriangle, ChevronLeft, Check } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { AppInput, AppButton } from '../../components/ui'

const loading = ref(false)
const sent = ref(false)
const error = ref('')
const form = reactive({ email: '' })

const submit = async () => {
  if (!form.email) { error.value = 'Email kiriting'; return }
  loading.value = true
  error.value = ''
  // TODO: real forgot-password API endpoint qo'shilganda ulash
  setTimeout(() => { sent.value = true; loading.value = false }, 1000)
}
</script>

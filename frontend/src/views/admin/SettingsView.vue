<template>
  <div style="max-width:700px">
    <h3 style="font-size:20px;font-weight:700;margin:0 0 20px">Settings</h3>

    <div class="card-block" style="margin-bottom:16px">
      <h4 class="card-block-title">Change Password</h4>
      <div style="display:flex;flex-direction:column;gap:12px;max-width:400px">
        <div class="form-group">
          <label>Current Password</label>
          <input v-model="pw.current" type="password" placeholder="Enter current password" />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input v-model="pw.newPw" type="password" placeholder="Enter new password" />
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input v-model="pw.confirm" type="password" placeholder="Confirm new password" />
        </div>
        <div v-if="pwMsg" :style="{ color: pwSuccess ? '#16a34a' : '#dc2626', fontSize: '13px' }">{{ pwMsg }}</div>
        <button class="btn-ct btn-ct-primary" style="width:fit-content" :disabled="pwSaving" @click="changePassword">
          {{ pwSaving ? 'Saving...' : 'Update Password' }}
        </button>
      </div>
    </div>

    <div class="card-block">
      <h4 class="card-block-title">Account Info</h4>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="info-row"><span>Full Name</span><b>{{ user?.fullName }}</b></div>
        <div class="info-row"><span>Email</span><b>{{ user?.email }}</b></div>
        <div class="info-row"><span>Role</span><b style="text-transform:capitalize">{{ user?.role }}</b></div>
      </div>
      <div style="margin-top:16px">
        <router-link to="/admin/profile" class="btn-ct btn-ct-ghost">View Full Profile <ChevronRight :size="14" /></router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next'
import '@/assets/styles/views/settings-view.css'
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth.store.js'
import api from '../../api/axios.js'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const pw = ref({ current: '', newPw: '', confirm: '' })
const pwSaving = ref(false)
const pwMsg = ref('')
const pwSuccess = ref(false)

const changePassword = async () => {
  pwMsg.value = ''
  if (!pw.value.current || !pw.value.newPw) return (pwMsg.value = 'Fill all fields')
  if (pw.value.newPw !== pw.value.confirm) return (pwMsg.value = 'Passwords do not match')
  if (pw.value.newPw.length < 6) return (pwMsg.value = 'Password must be at least 6 characters')
  pwSaving.value = true
  try {
    await api.put(`/users/${user.value._id}`, { password: pw.value.newPw })
    pwMsg.value = 'Password updated successfully'
    pwSuccess.value = true
    pw.value = { current: '', newPw: '', confirm: '' }
  } catch (e) {
    pwMsg.value = e.response?.data?.message || 'Error updating password'
    pwSuccess.value = false
  } finally { pwSaving.value = false }
}
</script>

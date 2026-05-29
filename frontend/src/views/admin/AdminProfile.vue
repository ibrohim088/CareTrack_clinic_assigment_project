<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-state">Loading...</div>
    <template v-else>
      <div class="profile-header-card">
        <div class="avatar-wrap">
          <div class="avatar-placeholder">{{ initials }}</div>
        </div>
        <div class="header-info">
          <h1>{{ user?.fullName }}</h1>
          <span class="role-badge admin">Administrator</span>
          <p class="meta"><Mail :size="13" /> {{ user?.email }} · <Phone :size="13" /> {{ user?.phone || '—' }}</p>
          <p class="meta">Member since {{ formatDate(user?.createdAt) }}</p>
        </div>
        <button class="btn-primary" @click="showEdit = true">Edit Profile</button>
      </div>

      <div class="info-card">
        <h3>Account Details</h3>
        <div class="info-row"><span>Full Name</span><b>{{ user?.fullName }}</b></div>
        <div class="info-row"><span>Email</span><b>{{ user?.email }}</b></div>
        <div class="info-row"><span>Phone</span><b>{{ user?.phone || '—' }}</b></div>
        <div class="info-row"><span>Role</span><b>Administrator</b></div>
        <div class="info-row">
          <span>Status</span>
          <span class="status-badge">Active</span>
        </div>
      </div>

      <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Edit Profile</h3>
            <button @click="showEdit = false" class="close-btn"><X :size="16" /></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="editForm.fullName" type="text" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="editForm.phone" type="text" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outline" @click="showEdit = false">Cancel</button>
            <button class="btn-primary" :disabled="saving" @click="saveProfile">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { Mail, Phone, X } from 'lucide-vue-next'
import '@/assets/styles/views/admin/admin-profile.css'
import { ref, computed, onMounted } from 'vue'
import { getMyProfile, updateMyProfile } from '../../api/profile.api.js'

const loading = ref(true)
const saving = ref(false)
const showEdit = ref(false)
const user = ref(null)
const editForm = ref({ fullName: '', phone: '' })

const initials = computed(() => {
  return (user.value?.fullName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await getMyProfile()
    user.value = res.data.data.user
    editForm.value = { fullName: user.value.fullName, phone: user.value.phone || '' }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await updateMyProfile(editForm.value)
    await loadProfile()
    showEdit.value = false
  } catch (e) { alert('Error saving') }
  finally { saving.value = false }
}

onMounted(loadProfile)
</script>

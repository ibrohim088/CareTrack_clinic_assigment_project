<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-state">Loading profile...</div>
    <template v-else>
      <div class="profile-header-card">
        <div class="avatar-wrap">
          <img v-if="user?.avatar" :src="user.avatar" class="avatar" alt="avatar" />
          <div v-else class="avatar-placeholder">{{ initials }}</div>
        </div>
        <div class="header-info">
          <h1>{{ user?.fullName }}</h1>
          <span class="role-badge">Clinician</span>
          <p class="meta">{{ clinician?.specialization }} · {{ clinician?.experience }} yrs experience</p>
          <p class="meta"><Mail :size="13" /> {{ user?.email }} · <Phone :size="13" /> {{ user?.phone || '—' }}</p>
        </div>
        <button class="btn-primary" @click="showEdit = true">Edit Profile</button>
      </div>

      <div class="profile-grid">
        <div class="info-card">
          <h3>Professional Info</h3>
          <div class="info-row"><span>Specialization</span><b>{{ clinician?.specialization || '—' }}</b></div>
          <div class="info-row"><span>License No.</span><b>{{ clinician?.licenseNumber || '—' }}</b></div>
          <div class="info-row"><span>Education</span><b>{{ clinician?.education || '—' }}</b></div>
          <div class="info-row"><span>Room</span><b>{{ clinician?.roomNumber || '—' }}</b></div>
          <div class="info-row"><span>Experience</span><b>{{ clinician?.experience }} years</b></div>
          <div class="info-row">
            <span>Working Days</span>
            <div class="days-wrap">
              <span v-for="d in clinician?.workingDays" :key="d" class="day-chip">{{ d }}</span>
            </div>
          </div>
          <div class="info-row">
            <span>Working Hours</span>
            <b>{{ clinician?.workingHours?.start || '09:00' }} — {{ clinician?.workingHours?.end || '18:00' }}</b>
          </div>
          <div class="info-row">
            <span>Status</span>
            <span class="status-badge" :class="{ inactive: !clinician?.isAvailable }">
              {{ clinician?.isAvailable ? 'Available' : 'Not Available' }}
            </span>
          </div>
        </div>

        <div class="info-card">
          <h3>Upcoming Schedule</h3>
          <div v-if="schedules.length === 0" class="empty-state">No upcoming schedules</div>
          <div v-for="s in schedules.slice(0, 5)" :key="s._id" class="schedule-row">
            <div class="sched-date">{{ formatDate(s.date) }}</div>
            <div class="sched-slots">{{ s.timeSlots?.length || 0 }} slots</div>
            <span class="avail-badge" :class="{ unavail: !s.isAvailable }">
              {{ s.isAvailable ? 'Open' : 'Closed' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Edit Profile</h3>
            <button @click="showEdit = false" class="close-btn"><X :size="16" /></button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="editForm.fullName" type="text" />
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input v-model="editForm.phone" type="text" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Specialization</label>
                <input v-model="editForm.specialization" type="text" />
              </div>
              <div class="form-group">
                <label>Experience (years)</label>
                <input v-model="editForm.experience" type="number" min="0" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Education</label>
                <input v-model="editForm.education" type="text" />
              </div>
              <div class="form-group">
                <label>Room Number</label>
                <input v-model="editForm.roomNumber" type="text" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Time</label>
                <input v-model="editForm.workingHours.start" type="time" />
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input v-model="editForm.workingHours.end" type="time" />
              </div>
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
import '@/assets/styles/views/doctor/doctor-profile.css'
import { ref, computed, onMounted } from 'vue'
import { getMyProfile, updateMyProfile } from '../../api/profile.api.js'

const loading = ref(true)
const saving = ref(false)
const showEdit = ref(false)
const user = ref(null)
const clinician = ref(null)
const schedules = ref([])

const initials = computed(() => {
  const name = user.value?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const editForm = ref({
  fullName: '', phone: '', specialization: '', experience: 0,
  education: '', roomNumber: '', workingHours: { start: '09:00', end: '18:00' }
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await getMyProfile()
    const data = res.data.data
    user.value = data.user
    clinician.value = data.clinician
    schedules.value = data.schedules || []
    editForm.value = {
      fullName: data.user.fullName,
      phone: data.user.phone || '',
      specialization: data.clinician?.specialization || '',
      experience: data.clinician?.experience || 0,
      education: data.clinician?.education || '',
      roomNumber: data.clinician?.roomNumber || '',
      workingHours: { ...data.clinician?.workingHours } || { start: '09:00', end: '18:00' },
    }
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

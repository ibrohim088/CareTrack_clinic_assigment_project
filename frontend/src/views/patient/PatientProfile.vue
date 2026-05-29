<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-state">Loading...</div>
    <template v-else>
      <div class="profile-header-card">
        <div class="avatar-placeholder">{{ initials }}</div>
        <div class="header-info">
          <h1>{{ user?.fullName }}</h1>
          <span class="role-badge">Patient</span>
          <p class="meta">📧 {{ user?.email }} · 📞 {{ user?.phone || '—' }}</p>
        </div>
        <button class="btn-primary" @click="showEdit = true">Edit Profile</button>
      </div>

      <div class="profile-grid">
        <div class="info-card">
          <h3>Personal Info</h3>
          <div class="info-row"><span>Date of Birth</span><b>{{ formatDate(patient?.dateOfBirth) }}</b></div>
          <div class="info-row"><span>Gender</span><b>{{ patient?.gender || '—' }}</b></div>
          <div class="info-row"><span>Blood Type</span>
            <b class="blood-badge">{{ patient?.bloodType || '—' }}</b>
          </div>
          <div class="info-row"><span>Address</span><b>{{ patient?.address || '—' }}</b></div>
          <div class="info-row"><span>Insurance No.</span><b>{{ patient?.insuranceNumber || '—' }}</b></div>
        </div>

        <div class="info-card">
          <h3>Medical Info</h3>
          <div class="info-row">
            <span>Allergies</span>
            <div class="tags-wrap">
              <span v-if="patient?.allergies?.length === 0 || !patient?.allergies">—</span>
              <span v-for="a in patient?.allergies" :key="a" class="allergy-tag">{{ a }}</span>
            </div>
          </div>
          <div class="info-row">
            <span>Emergency Contact</span>
            <div>
              <div><b>{{ patient?.emergencyContact?.name || '—' }}</b></div>
              <div style="font-size:12px;color:#9ca3af">{{ patient?.emergencyContact?.phone || '' }}</div>
            </div>
          </div>
        </div>
      </div>

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
                <label>Date of Birth</label>
                <input v-model="editForm.dateOfBirth" type="date" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select v-model="editForm.gender">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Blood Type</label>
                <select v-model="editForm.bloodType">
                  <option value="">Select</option>
                  <option v-for="b in bloodTypes" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Insurance No.</label>
                <input v-model="editForm.insuranceNumber" type="text" />
              </div>
            </div>
            <div class="form-group">
              <label>Address</label>
              <input v-model="editForm.address" type="text" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Emergency Contact Name</label>
                <input v-model="editForm.emergencyContact.name" type="text" />
              </div>
              <div class="form-group">
                <label>Emergency Contact Phone</label>
                <input v-model="editForm.emergencyContact.phone" type="text" />
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
import { X } from 'lucide-vue-next'
import '@/assets/styles/views/patient/patient-profile.css'
import { ref, computed, onMounted } from 'vue'
import { getMyProfile, updateMyProfile } from '../../api/profile.api.js'

const loading = ref(true)
const saving = ref(false)
const showEdit = ref(false)
const user = ref(null)
const patient = ref(null)
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const initials = computed(() =>
  (user.value?.fullName || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
)

const editForm = ref({
  fullName: '', phone: '', dateOfBirth: '', gender: '',
  bloodType: '', address: '', insuranceNumber: '',
  emergencyContact: { name: '', phone: '' }
})

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await getMyProfile()
    user.value = res.data.data.user
    patient.value = res.data.data.patient
    editForm.value = {
      fullName: user.value.fullName,
      phone: user.value.phone || '',
      dateOfBirth: patient.value?.dateOfBirth?.slice(0, 10) || '',
      gender: patient.value?.gender || '',
      bloodType: patient.value?.bloodType || '',
      address: patient.value?.address || '',
      insuranceNumber: patient.value?.insuranceNumber || '',
      emergencyContact: { ...patient.value?.emergencyContact } || { name: '', phone: '' },
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

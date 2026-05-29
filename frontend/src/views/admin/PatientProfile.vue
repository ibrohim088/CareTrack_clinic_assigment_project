<template>
  <div>
    <div class="breadcrumb-ct">
      <router-link to="/admin/patients">Bemorlar</router-link>
      <span class="sep">/</span>
      <span class="cur">{{ patient?.user?.fullName || 'Bemor' }}</span>
    </div>

    <div v-if="loading" style="text-align:center;padding:60px;color:#9ca3af">Yuklanmoqda...</div>

    <template v-else-if="patient">
      <!-- Profile header -->
      <div class="card-block" style="margin-bottom:20px">
        <div style="display:flex;align-items:flex-start;gap:20px">
          <div class="avatar xl">{{ getInitials(patient.user?.fullName) }}</div>
          <div style="flex:1">
            <h3 style="margin:0 0 6px;font-size:20px;font-weight:700">{{ patient.user?.fullName }}</h3>
            <p style="margin:0 0 12px;font-size:13.5px;color:#6b7280;text-transform:capitalize">
              {{ patient.gender || '—' }} · {{ calcAge(patient.dateOfBirth) }}
            </p>
            <p style="margin:0;font-size:13.5px;color:#6b7280">
              Qon guruhi:
              <span style="background:#fee2e2;color:#dc2626;padding:1px 6px;border-radius:6px;font-weight:700;margin-right:8px">
                {{ patient.bloodType || '—' }}
              </span>
              Allergiyalar: {{ patient.allergies?.join(', ') || 'Yo\'q' }}
            </p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1">
            <div>
              <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">TELEFON</div>
              <div style="font-size:13.5px">{{ patient.user?.phone || '—' }}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">EMAIL</div>
              <div style="font-size:13.5px">{{ patient.user?.email || '—' }}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">MANZIL</div>
              <div style="font-size:13.5px">{{ patient.address || '—' }}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:3px">SUG'URTA</div>
              <div style="font-size:13.5px">{{ patient.insuranceNumber || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-ct">
        <button v-for="t in tabs" :key="t.id" class="tab-btn" :class="{active: activeTab===t.id}" @click="activeTab=t.id">
          {{ t.label }}
        </button>
      </div>

      <!-- Appointments tab -->
      <div v-if="activeTab==='appointments'" class="card-block">
        <div v-if="appointments.length===0" style="text-align:center;padding:32px;color:#9ca3af">Qabullar yo'q</div>
        <table v-else class="ct-table">
          <thead><tr><th>Sana</th><th>Shifokor</th><th>Vaqt</th><th>Sabab</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="a in appointments" :key="a._id">
              <td>{{ formatDate(a.date) }}</td>
              <td>{{ a.clinician?.user?.fullName || '—' }}</td>
              <td>{{ a.timeSlot }}</td>
              <td style="color:#6b7280">{{ a.reason || '—' }}</td>
              <td><span class="status-pill" :class="a.status">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Diagnoses tab -->
      <div v-if="activeTab==='diagnoses'" class="card-block">
        <div v-if="diagnoses.length===0" style="text-align:center;padding:32px;color:#9ca3af">Tashxislar yo'q</div>
        <table v-else class="ct-table">
          <thead><tr><th>Sana</th><th>Shifokor</th><th>Tashxis</th><th>ICD Kodi</th><th>Og'irlik</th></tr></thead>
          <tbody>
            <tr v-for="d in diagnoses" :key="d._id">
              <td>{{ formatDate(d.createdAt) }}</td>
              <td>{{ d.clinician?.user?.fullName || '—' }}</td>
              <td>{{ d.description }}</td>
              <td style="color:#6b7280">{{ d.icdCode || '—' }}</td>
              <td>
                <span class="status-pill" :class="d.severity">{{ d.severity }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Prescriptions tab -->
      <div v-if="activeTab==='prescriptions'" class="card-block">
        <div v-if="prescriptions.length===0" style="text-align:center;padding:32px;color:#9ca3af">Retseptlar yo'q</div>
        <table v-else class="ct-table">
          <thead><tr><th>Sana</th><th>Shifokor</th><th>Dorilar</th><th>Amal qilish muddati</th></tr></thead>
          <tbody>
            <tr v-for="p in prescriptions" :key="p._id">
              <td>{{ formatDate(p.issuedAt) }}</td>
              <td>{{ p.clinician?.user?.fullName || '—' }}</td>
              <td>
                <div v-for="m in p.medicines?.slice(0,2)" :key="m.name" style="font-size:12px">{{ m.name }} {{ m.dosage }}</div>
                <span v-if="p.medicines?.length > 2" style="font-size:11px;color:#9ca3af">+{{ p.medicines.length-2 }} ta</span>
              </td>
              <td style="color:#6b7280">{{ p.expiresAt ? formatDate(p.expiresAt) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div v-else style="text-align:center;padding:60px;color:#9ca3af">Bemor topilmadi</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios.js'

const route = useRoute()
const loading = ref(false)
const patient = ref(null)
const appointments = ref([])
const diagnoses = ref([])
const prescriptions = ref([])
const activeTab = ref('appointments')

const tabs = [
  { id: 'appointments', label: 'Qabullar' },
  { id: 'diagnoses', label: 'Tashxislar' },
  { id: 'prescriptions', label: 'Retseptlar' },
]

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
const calcAge = (dob) => {
  if (!dob) return '— yosh'
  const age = Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
  return `${age} yosh`
}

onMounted(async () => {
  loading.value = true
  try {
    const [patientRes, apptRes, diagRes, rxRes] = await Promise.all([
      api.get(`/patients/${route.params.id}`),
      api.get('/appointments', { params: { limit: 50 } }),
      api.get('/diagnoses', { params: { patient: route.params.id, limit: 50 } }),
      api.get('/prescriptions', { params: { patient: route.params.id, limit: 50 } }),
    ])
    patient.value = patientRes.data.data
    const apptData = apptRes.data.data
    appointments.value = (apptData?.data || apptData || []).filter(a =>
      a.patient?._id === route.params.id || a.patient === route.params.id
    )
    const diagData = diagRes.data.data
    diagnoses.value = diagData?.data || diagData || []
    const rxData = rxRes.data.data
    prescriptions.value = rxData?.data || rxData || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<style scoped>
.avatar.xl { width: 72px; height: 72px; font-size: 24px; border-radius: 16px; }
</style>

<template>
  <div>
    <h3 style="font-size:20px;font-weight:700;margin:0 0 20px">My Prescriptions</h3>

    <div class="card-block">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
      <div v-else-if="prescriptions.length===0" style="text-align:center;padding:48px;color:#9ca3af">No prescriptions yet</div>
      <div v-else style="display:flex;flex-direction:column;gap:12px">
        <div v-for="p in prescriptions" :key="p._id"
          style="border:1px solid #e5e9f0;border-radius:12px;padding:16px;cursor:pointer"
          @click="selected=p;showDetail=true">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px">
              <div class="avatar">{{ getInitials(p.clinician?.user?.fullName) }}</div>
              <div>
                <div style="font-size:14px;font-weight:600">{{ p.clinician?.user?.fullName || 'Doctor' }}</div>
                <div style="font-size:12px;color:#6b7280">Issued: {{ formatDate(p.issuedAt) }}</div>
              </div>
            </div>
            <span v-if="p.expiresAt" style="font-size:12px;color:#9ca3af">
              Expires: {{ formatDate(p.expiresAt) }}
            </span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span v-for="m in p.medicines" :key="m.name"
              style="background:#f0f4ff;color:#1d4ed8;font-size:12px;padding:3px 10px;border-radius:20px">
              {{ m.name }} {{ m.dosage }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetail && selected" class="modal-overlay" @click.self="showDetail=false">
      <div class="modal">
        <div class="modal-header">
          <h3>Prescription Detail</h3>
          <button @click="showDetail=false" class="close-btn"><X :size="16" /></button>
        </div>
        <div style="padding:20px 24px">
          <p style="margin:0 0 4px"><b>Shifokor:</b> {{ selected.clinician?.user?.fullName }}</p>
          <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Issued: {{ formatDate(selected.issuedAt) }}</p>
          <table class="ct-table">
            <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
            <tbody>
              <tr v-for="m in selected.medicines" :key="m.name">
                <td>{{ m.name }}</td><td>{{ m.dosage }}</td><td>{{ m.frequency }}</td><td>{{ m.duration||'—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="padding:12px 24px;border-top:1px solid #e5e9f0;display:flex;justify-content:flex-end">
          <button class="btn-ct btn-ct-ghost" @click="showDetail=false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import '@/assets/styles/views/modal-shared.css'
import { ref, onMounted } from 'vue'
import { getPrescriptions } from '../../api/prescription.api.js'

const prescriptions = ref([])
const loading = ref(false)
const showDetail = ref(false)
const selected = ref(null)

const getInitials = (name) => (name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'

onMounted(async () => {
  loading.value = true
  try {
    const res = await getPrescriptions({ limit: 50 })
    const data = res.data.data
    prescriptions.value = data?.data || data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:700;margin:0">Prescriptions</h3>
      <button class="btn-ct btn-ct-primary" @click="showCreate = true">+ New Prescription</button>
    </div>

    <div class="card-block">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
      <div v-else-if="prescriptions.length === 0" style="text-align:center;padding:48px;color:#9ca3af">No prescriptions
        found</div>
      <table v-else class="ct-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Medicines</th>
            <th>Issued</th>
            <th>Expires</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in prescriptions" :key="p._id">
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="avatar">{{ getInitials(p.patient?.user?.fullName) }}</div>
                {{ p.patient?.user?.fullName || '—' }}
              </div>
            </td>
            <td>
              <div v-for="m in p.medicines?.slice(0, 2)" :key="m.name" style="font-size:12px;color:#374151">
                {{ m.name }} — {{ m.dosage }}
              </div>
              <span v-if="p.medicines?.length > 2" style="font-size:11px;color:#9ca3af">
                +{{ p.medicines.length - 2 }} more
              </span>
            </td>
            <td style="color:#6b7280">{{ formatDate(p.issuedAt) }}</td>
            <td style="color:#6b7280">{{ p.expiresAt ? formatDate(p.expiresAt) : '—' }}</td>
            <td>
              <button class="btn-ct btn-ct-ghost" style="padding:4px 10px;font-size:12px"
                @click="selected = p; showDetail = true">View</button>
              <button class="btn-ct btn-ct-ghost" style="padding:4px 10px;font-size:12px;color:#dc2626"
                @click="remove(p._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <AppModal v-if="showDetail && selected" title="Prescription Detail" @close="showDetail = false">
      <p style="margin:0 0 4px"><b>Patient:</b> {{ selected.patient?.user?.fullName }}</p>
      <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Issued: {{ formatDate(selected.issuedAt) }}</p>
      <table class="ct-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in selected.medicines" :key="m.name">
            <td>{{ m.name }}</td>
            <td>{{ m.dosage }}</td>
            <td>{{ m.frequency }}</td>
            <td>{{ m.duration || '—' }}</td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <button class="btn-ct btn-ct-ghost" @click="showDetail = false">Close</button>
      </template>
    </AppModal>

    <!-- Create Modal -->
    <AppModal v-if="showCreate" title="New Prescription" @close="showCreate = false">
      <div class="form-group">
        <label>Patient</label>
        <select v-model="form.patient">
          <option value="">Select patient</option>
          <option v-for="p in patientsList" :key="p._id" :value="p._id">
            {{ p.user?.fullName }}
          </option>
        </select>
      </div>
      <div v-for="(med, i) in form.medicines" :key="i" style="border:1px solid #e5e9f0;border-radius:10px;padding:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <b style="font-size:13px">Medicine {{ i + 1 }}</b>
          <button class="btn-ct btn-ct-ghost" style="padding:2px 8px;font-size:12px;color:#dc2626"
            @click="form.medicines.splice(i, 1)">Remove</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="form-group"><label>Name</label><input v-model="med.name" type="text" /></div>
          <div class="form-group"><label>Dosage</label><input v-model="med.dosage" type="text"
              placeholder="e.g. 500mg" />
          </div>
          <div class="form-group"><label>Frequency</label><input v-model="med.frequency" type="text"
              placeholder="e.g. 3x daily" /></div>
          <div class="form-group"><label>Duration</label><input v-model="med.duration" type="text"
              placeholder="e.g. 7 days" /></div>
        </div>
      </div>
      <button class="btn-ct btn-ct-ghost" @click="form.medicines.push({ name: '', dosage: '', frequency: '', duration: '' })">+
        Add
        Medicine</button>
      <div class="form-group">
        <label>Expires At</label>
        <input v-model="form.expiresAt" type="date" />
      </div>
      <template #footer>
        <button class="btn-ct btn-ct-ghost" @click="showCreate = false">Cancel</button>
        <button class="btn-ct btn-ct-primary" :disabled="saving" @click="save">
          {{ saving ? 'Saving...' : 'Create' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import '@/assets/styles/views/modal-shared.css'
import { ref, onMounted } from 'vue'
import { getPrescriptions, createPrescription, deletePrescription } from '../../api/prescription.api.js'
import { getPatients } from '../../api/patient.api.js'

const prescriptions = ref([])
const patientsList = ref([])
const loading = ref(false)
const saving = ref(false)
const showDetail = ref(false)
const showCreate = ref(false)
const selected = ref(null)

const form = ref({ patient: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], expiresAt: '' })

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const load = async () => {
  loading.value = true
  try {
    const res = await getPrescriptions({ limit: 50 })
    const data = res.data.data
    prescriptions.value = data?.data || data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const save = async () => {
  if (!form.value.patient) return alert('Select patient')
  saving.value = true
  try {
    await createPrescription(form.value)
    await load()
    showCreate.value = false
    form.value = { patient: '', medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], expiresAt: '' }
  } catch (e) { alert(e.response?.data?.message || 'Error') }
  finally { saving.value = false }
}

const remove = async (id) => {
  if (!confirm('Delete this prescription?')) return
  try { await deletePrescription(id); await load() } catch (e) { alert('Error') }
}

onMounted(async () => {
  await load()
  const res = await getPatients({ limit: 100 })
  const data = res.data.data
  patientsList.value = data?.data || data || []
})
</script>

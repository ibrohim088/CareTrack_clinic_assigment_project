<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:700;margin:0">Appointments</h3>
      <div style="display:flex;gap:10px">
        <select v-model="statusFilter" @change="load" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div class="card-block">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
      <div v-else-if="appointments.length === 0" style="text-align:center;padding:48px;color:#9ca3af">No appointments found</div>
      <table v-else class="ct-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in appointments" :key="appt._id">
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="avatar">{{ getInitials(appt.patient?.user?.fullName) }}</div>
                {{ appt.patient?.user?.fullName || '—' }}
              </div>
            </td>
            <td style="color:#6b7280">{{ appt.clinician?.user?.fullName || '—' }}</td>
            <td>{{ formatDate(appt.date) }}</td>
            <td>{{ appt.timeSlot }}</td>
            <td><span class="status-pill" :class="appt.status">{{ appt.status }}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <select style="font-size:12px;border:1px solid #e5e9f0;border-radius:6px;padding:3px 8px"
                  :value="appt.status" @change="setStatus(appt._id, $event.target.value)">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button class="btn-ct btn-ct-ghost" style="padding:4px 8px;font-size:12px;color:#dc2626"
                  @click="remove(appt._id)"><X :size="16" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="total > limit" style="display:flex;justify-content:center;gap:8px;margin-top:16px">
        <button class="btn-ct btn-ct-ghost" :disabled="page===1" @click="page--;load()"></button>
        <span style="padding:6px 12px;font-size:13px">Page {{ page }} of {{ Math.ceil(total/limit) }}</span>
        <button class="btn-ct btn-ct-ghost" :disabled="page>=Math.ceil(total/limit)" @click="page++;load()">Next <ChevronRight :size="14" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '../../api/appointment.api.js'

const appointments = ref([])
const loading = ref(false)
const statusFilter = ref('')
const page = ref(1)
const limit = 15
const total = ref(0)

const getInitials = (name) => (name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'

const load = async () => {
  loading.value = true
  try {
    const params = { page: page.value, limit }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await getAppointments(params)
    const data = res.data.data
    appointments.value = data?.data || data || []
    total.value = data?.total || appointments.value.length
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const setStatus = async (id, status) => {
  try { await updateAppointmentStatus(id, status); await load() }
  catch (e) { alert('Error') }
}

const remove = async (id) => {
  if (!confirm('Delete this appointment?')) return
  try { await deleteAppointment(id); await load() }
  catch (e) { alert('Error') }
}

onMounted(load)
</script>
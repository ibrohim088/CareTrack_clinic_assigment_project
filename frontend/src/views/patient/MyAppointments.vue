<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:700;margin:0">My Appointments</h3>
      <button class="btn-ct btn-ct-primary" @click="showBook = true">+ Book Appointment</button>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button v-for="s in statuses" :key="s.val"
        :class="['btn-ct', statusFilter === s.val ? 'btn-ct-primary' : 'btn-ct-ghost']"
        style="padding:6px 14px;font-size:13px" @click="statusFilter = s.val; load()">
        {{ s.label }}
      </button>
    </div>

    <div class="card-block">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
      <div v-else-if="appointments.length === 0" style="text-align:center;padding:48px;color:#9ca3af">No appointments
        found</div>
      <div v-else style="display:flex;flex-direction:column;gap:12px">
        <div v-for="appt in appointments" :key="appt._id"
          style="display:flex;align-items:center;gap:14px;padding:14px;border:1px solid #e5e9f0;border-radius:12px">
          <div style="width:50px;text-align:center;flex-shrink:0">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase">{{ formatMonth(appt.date) }}</div>
            <div style="font-size:22px;font-weight:800;color:#1a1f36">{{ formatDay(appt.date) }}</div>
          </div>
          <div style="width:1px;height:40px;background:#e5e9f0"></div>
          <div class="avatar" style="flex-shrink:0">{{ getInitials(appt.clinician?.user?.fullName) }}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600">{{ appt.clinician?.user?.fullName || 'Doctor' }}</div>
            <div style="font-size:12px;color:#6b7280">{{ appt.clinician?.specialization || '' }} · {{ appt.timeSlot }}
            </div>
            <div v-if="appt.reason" style="font-size:12px;color:#9ca3af;margin-top:2px">{{ appt.reason }}</div>
          </div>
          <span class="status-pill" :class="appt.status">{{ appt.status }}</span>
        </div>
      </div>
    </div>

    <!-- Book Modal -->
    <AppModal v-if="showBook" title="Book Appointment" @close="showBook = false">
      <div class="form-group">
        <label>Doctor</label>
        <select v-model="form.clinician" @change="loadSlots">
          <option value="">Select doctor</option>
          <option v-for="d in doctors" :key="d._id" :value="d._id">
            {{ d.user?.fullName }} — {{ d.specialization }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Date</label>
        <input v-model="form.date" type="date" :min="todayStr" @change="loadSlots" />
      </div>
      <div v-if="slots.length > 0" class="form-group">
        <label>Time Slot</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          <button v-for="slot in slots" :key="slot.start"
            :class="['btn-ct', form.timeSlot === slot.start ? 'btn-ct-primary' : 'btn-ct-ghost']"
            :disabled="slot.isBooked" style="padding:6px 14px;font-size:13px" @click="form.timeSlot = slot.start">
            {{ slot.start }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label>Reason</label>
        <input v-model="form.reason" type="text" placeholder="e.g. Regular checkup" />
      </div>
      <template #footer>
        <button class="btn-ct btn-ct-ghost" @click="showBook = false">Cancel</button>
        <button class="btn-ct btn-ct-primary" :disabled="saving || !form.timeSlot" @click="book">
          {{ saving ? 'Booking...' : 'Book' }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import '@/assets/styles/views/modal-shared.css'
import { ref, onMounted, computed } from 'vue'
import { getAppointments, createAppointment } from '../../api/appointment.api.js'
import { getDoctors } from '../../api/doctor.api.js'
import { getSchedules } from '../../api/schedule.api.js'

const appointments = ref([])
const doctors = ref([])
const slots = ref([])
const loading = ref(false)
const saving = ref(false)
const showBook = ref(false)
const statusFilter = ref('')
const statuses = [
  { val: '', label: 'All' }, { val: 'pending', label: 'Pending' },
  { val: 'confirmed', label: 'Confirmed' }, { val: 'completed', label: 'Completed' },
  { val: 'cancelled', label: 'Cancelled' },
]
const form = ref({ clinician: '', date: '', timeSlot: '', reason: '' })
const todayStr = new Date().toISOString().slice(0, 10)

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
const formatMonth = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short' }) : ''
const formatDay = (d) => d ? new Date(d).getDate() : ''

const load = async () => {
  loading.value = true
  try {
    const params = { limit: 50 }
    if (statusFilter.value) params.status = statusFilter.value
    const res = await getAppointments(params)
    const data = res.data.data
    appointments.value = data?.data || data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const loadSlots = async () => {
  if (!form.value.clinician || !form.value.date) return
  slots.value = []
  try {
    const [year, month] = form.value.date.split('-')
    const res = await getSchedules({ clinicianId: form.value.clinician, month: parseInt(month), year: parseInt(year) })
    const schedules = res.data.data || []
    const daySchedule = schedules.find(s => s.date === form.value.date)
    slots.value = daySchedule?.timeSlots || []
  } catch (e) { console.error(e) }
}

const book = async () => {
  saving.value = true
  try {
    await createAppointment(form.value)
    await load()
    showBook.value = false
    form.value = { clinician: '', date: '', timeSlot: '', reason: '' }
    slots.value = []
  } catch (e) { alert(e.response?.data?.message || 'Error booking') }
  finally { saving.value = false }
}

onMounted(async () => {
  await load()
  const res = await getDoctors({ limit: 100 })
  const data = res.data.data
  doctors.value = data?.data || data || []
})
</script>

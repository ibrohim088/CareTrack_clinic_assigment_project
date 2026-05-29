<template>
  <div>
    <div style="margin-bottom:20px">
      <h3 style="font-size:22px;font-weight:700;margin:0 0 4px">Salom, {{ patientName }}</h3>
      <p style="font-size:13.5px;color:#6b7280;margin:0">
        {{ nextAppointment ? `Keyingi qabulingiz: ${formatDate(nextAppointment.date)} · ${nextAppointment.timeSlot}` : 'Hozircha kelgusi qabul yo\'q' }}
      </p>
    </div>

    <!-- Next appointment hero -->
    <div v-if="nextAppointment" class="card-block" style="margin-bottom:20px;border-left:4px solid #1a56db;background:linear-gradient(135deg,#f0f7ff,#fff)">
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <div>
          <div style="font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Keyingi Qabul</div>
          <div style="font-size:18px;font-weight:700;color:#1a1f36;margin-bottom:6px">
            {{ nextAppointment.clinician?.user?.fullName || 'Shifokor' }} — {{ nextAppointment.clinician?.specialization || '' }}
          </div>
          <div style="font-size:13.5px;color:#6b7280">{{ formatDate(nextAppointment.date) }} · {{ nextAppointment.timeSlot }}</div>
        </div>
        <span class="status-pill" :class="nextAppointment.status">{{ nextAppointment.status }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
      <div class="stat-card">
        <div class="label">Kelgusi</div>
        <div class="value">{{ String(stats.upcoming).padStart(2,'0') }}</div>
      </div>
      <div class="stat-card">
        <div class="label">O'tgan</div>
        <div class="value">{{ String(stats.past).padStart(2,'0') }}</div>
      </div>
      <div class="stat-card">
        <div class="label">Retseptlar</div>
        <div class="value">{{ String(stats.prescriptions).padStart(2,'0') }}</div>
      </div>
      <div class="stat-card">
        <div class="label">Kutilayotgan</div>
        <div class="value">{{ String(stats.pending).padStart(2,'0') }}</div>
      </div>
    </div>

    <!-- Appointments list -->
    <div style="display:grid;grid-template-columns:1fr 300px;gap:20px">
      <div class="card-block">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <h4 class="card-block-title" style="margin:0">Kelgusi Qabullar</h4>
          <button class="btn-ct btn-ct-primary" @click="showBookModal=true"><Plus :size="15"/> Yangi Qabul</button>
        </div>
        <div v-if="loadingAppts" style="text-align:center;padding:32px;color:#9ca3af">Yuklanmoqda...</div>
        <div v-else-if="upcomingAppointments.length===0" style="text-align:center;padding:32px;color:#9ca3af">Kelgusi qabul yo'q</div>
        <div v-else>
          <div v-for="appt in upcomingAppointments" :key="appt._id" class="appt-row">
            <div style="background:#e8f0fe;border-radius:8px;padding:8px 10px;text-align:center;min-width:52px">
              <div style="font-size:10px;font-weight:600;color:#1a56db;text-transform:uppercase">{{ formatMonth(appt.date) }}</div>
              <div style="font-size:18px;font-weight:700;color:#1a56db">{{ formatDay(appt.date) }}</div>
            </div>
            <div style="flex:1">
              <div style="font-size:13.5px;font-weight:500">{{ appt.clinician?.user?.fullName || 'Shifokor' }}</div>
              <div style="font-size:12px;color:#6b7280">{{ appt.clinician?.specialization || '' }} · {{ appt.timeSlot }}</div>
              <div v-if="appt.reason" style="font-size:12px;color:#9ca3af;margin-top:2px">{{ appt.reason }}</div>
            </div>
            <span class="status-pill" :class="appt.status">{{ appt.status }}</span>
          </div>
        </div>
      </div>

      <!-- Prescriptions -->
      <div class="card-block">
        <h4 class="card-block-title">Faol Retseptlar</h4>
        <div v-if="loadingRx" style="text-align:center;padding:20px;color:#9ca3af">Yuklanmoqda...</div>
        <div v-else-if="prescriptions.length===0" style="text-align:center;padding:20px;color:#9ca3af">Retsept yo'q</div>
        <div v-else style="display:flex;flex-direction:column;gap:10px">
          <div v-for="rx in prescriptions" :key="rx._id"
            style="padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e9f0">
            <div v-for="med in rx.medicines?.slice(0,1)" :key="med.name">
              <div style="font-size:13.5px;font-weight:600;margin-bottom:4px">{{ med.name }}</div>
              <div style="font-size:12px;color:#6b7280">{{ med.dosage }} · {{ med.frequency }}</div>
            </div>
            <div v-if="rx.medicines?.length > 1" style="font-size:11px;color:#9ca3af;margin-top:4px">
              +{{ rx.medicines.length - 1 }} ta dori
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Book Appointment Modal -->
    <div v-if="showBookModal" class="modal-overlay" @click.self="showBookModal=false">
      <div class="modal-box">
        <h5>Yangi Qabul Belgilash</h5>
        <div class="form-ct">
          <div style="margin-bottom:14px">
            <label>Shifokorni tanlang</label>
            <select v-model="bookForm.clinician" @change="loadSlots">
              <option value="">Shifokor tanlang</option>
              <option v-for="d in clinicians" :key="d._id" :value="d._id">
                {{ d.user?.fullName }} — {{ d.specialization }}
              </option>
            </select>
          </div>
          <div style="margin-bottom:14px">
            <label>Sana</label>
            <input v-model="bookForm.date" type="date" :min="todayStr" @change="loadSlots" />
          </div>
          <div v-if="slots.length > 0" style="margin-bottom:14px">
            <label>Vaqt</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px">
              <button v-for="slot in slots" :key="slot.start"
                :class="['btn-ct', bookForm.timeSlot===slot.start ? 'btn-ct-primary' : 'btn-ct-ghost']"
                :disabled="slot.isBooked"
                style="padding:6px 14px;font-size:13px"
                @click="bookForm.timeSlot=slot.start">
                {{ slot.start }}
              </button>
            </div>
          </div>
          <div v-else-if="bookForm.clinician && bookForm.date" style="margin-bottom:14px;color:#9ca3af;font-size:13px">
            Bu kunda bo'sh vaqt yo'q
          </div>
          <div style="margin-bottom:14px">
            <label>Sabab</label>
            <textarea v-model="bookForm.reason" rows="2" placeholder="Tashrif sababi..." style="resize:none;width:100%;border:1px solid #e5e9f0;border-radius:8px;padding:8px;font-size:13px"></textarea>
          </div>
          <div style="display:flex;gap:10px">
            <button class="btn-ct btn-ct-primary" style="flex:1;justify-content:center"
              :disabled="saving || !bookForm.timeSlot" @click="book">
              {{ saving ? 'Saqlanmoqda...' : 'Tasdiqlash' }}
            </button>
            <button class="btn-ct btn-ct-outline" @click="showBookModal=false">Bekor</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.store.js'
import { Plus } from 'lucide-vue-next'
import { getAppointments, createAppointment } from '../../api/appointment.api.js'
import { getPrescriptions } from '../../api/prescription.api.js'
import { getDoctors } from '../../api/doctor.api.js'
import { getSchedules } from '../../api/schedule.api.js'

const authStore = useAuthStore()
const patientName = computed(() => authStore.user?.fullName || 'Bemor')

const allAppointments = ref([])
const prescriptions = ref([])
const clinicians = ref([])
const slots = ref([])
const loadingAppts = ref(false)
const loadingRx = ref(false)
const showBookModal = ref(false)
const saving = ref(false)
const todayStr = new Date().toISOString().slice(0, 10)

const bookForm = ref({ clinician: '', date: '', timeSlot: '', reason: '' })

const upcomingAppointments = computed(() =>
  allAppointments.value.filter(a =>
    ['pending', 'confirmed'].includes(a.status) && new Date(a.date) >= new Date()
  ).sort((a, b) => new Date(a.date) - new Date(b.date))
)

const nextAppointment = computed(() => upcomingAppointments.value[0] || null)

const stats = computed(() => ({
  upcoming: upcomingAppointments.value.length,
  past: allAppointments.value.filter(a => a.status === 'completed').length,
  prescriptions: prescriptions.value.length,
  pending: allAppointments.value.filter(a => a.status === 'pending').length,
}))

const formatDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
const formatMonth = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short' }) : ''
const formatDay = (d) => d ? new Date(d).getDate() : ''

const loadSlots = async () => {
  if (!bookForm.value.clinician || !bookForm.value.date) return
  slots.value = []
  try {
    const [year, month] = bookForm.value.date.split('-')
    const res = await getSchedules({ clinicianId: bookForm.value.clinician, month: parseInt(month), year: parseInt(year) })
    const all = res.data.data || []
    const daySchedule = all.find(s => s.date === bookForm.value.date)
    slots.value = daySchedule?.timeSlots || []
  } catch (e) { console.error(e) }
}

const book = async () => {
  saving.value = true
  try {
    await createAppointment(bookForm.value)
    const res = await getAppointments({ limit: 100 })
    const data = res.data.data
    allAppointments.value = data?.data || data || []
    showBookModal.value = false
    bookForm.value = { clinician: '', date: '', timeSlot: '', reason: '' }
    slots.value = []
  } catch (e) {
    alert(e.response?.data?.message || 'Xatolik yuz berdi')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loadingAppts.value = true
  loadingRx.value = true
  try {
    const [apptRes, rxRes, docRes] = await Promise.all([
      getAppointments({ limit: 100 }),
      getPrescriptions({ limit: 10 }),
      getDoctors({ limit: 100 }),
    ])
    const apptData = apptRes.data.data
    allAppointments.value = apptData?.data || apptData || []
    const rxData = rxRes.data.data
    prescriptions.value = rxData?.data || rxData || []
    const docData = docRes.data.data
    clinicians.value = docData?.data || docData || []
  } catch (e) { console.error(e) }
  finally {
    loadingAppts.value = false
    loadingRx.value = false
  }
})
</script>

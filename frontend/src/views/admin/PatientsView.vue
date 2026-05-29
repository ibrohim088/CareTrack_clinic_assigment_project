<template>
  <div>
    <!-- Filters -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap">
      <input v-model="search" placeholder="Ism yoki email bo'yicha qidirish..."
        style="width:280px;height:36px;border:1px solid #e5e9f0;border-radius:8px;padding:0 12px;font-size:13px;outline:none"
        @input="debouncedLoad" />
      <button class="btn-ct btn-ct-primary" style="margin-left:auto" @click="showModal=true">
        + Yangi Bemor
      </button>
    </div>

    <!-- Table -->
    <div class="card-block" style="padding:0">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Yuklanmoqda...</div>
      <div v-else-if="patients.length===0" style="text-align:center;padding:48px;color:#9ca3af">Bemorlar topilmadi</div>
      <table v-else class="ct-table">
        <thead>
          <tr>
            <th>Ism</th>
            <th>Jinsi</th>
            <th>Qon guruhi</th>
            <th>Telefon</th>
            <th>Allergiyalar</th>
            <th>Sug'urta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p._id" style="cursor:pointer" @click="openPatient(p._id)">
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="avatar">{{ getInitials(p.user?.fullName) }}</div>
                <div>
                  <div style="font-weight:500;font-size:13.5px">{{ p.user?.fullName || '—' }}</div>
                  <div style="font-size:12px;color:#6b7280">{{ p.user?.email || '—' }}</div>
                </div>
              </div>
            </td>
            <td style="text-transform:capitalize;color:#6b7280">{{ p.gender || '—' }}</td>
            <td>
              <span v-if="p.bloodType" style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:8px;font-size:12px;font-weight:700">
                {{ p.bloodType }}
              </span>
              <span v-else style="color:#9ca3af">—</span>
            </td>
            <td style="font-size:13px;color:#6b7280">{{ p.user?.phone || '—' }}</td>
            <td style="font-size:12px;color:#6b7280">{{ p.allergies?.join(', ') || '—' }}</td>
            <td style="font-size:13px;color:#6b7280">{{ p.insuranceNumber || '—' }}</td>
            <td @click.stop>
              <button class="btn-ct btn-ct-ghost" style="padding:4px 10px;font-size:12px;color:#dc2626"
                @click="handleDelete(p._id)">O'chirish</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid #e5e9f0">
        <span style="font-size:13px;color:#6b7280">
          Jami {{ pagination.total }} ta bemor
        </span>
        <div style="display:flex;gap:4px">
          <button class="btn-ct btn-ct-ghost" :disabled="page===1" @click="page--;load()">&lt;</button>
          <button v-for="p in pagination.totalPages" :key="p" class="btn-ct"
            :class="p===page?'btn-ct-primary':'btn-ct-ghost'"
            @click="page=p;load()" style="width:32px;justify-content:center">{{ p }}</button>
          <button class="btn-ct btn-ct-ghost" :disabled="page===pagination.totalPages" @click="page++;load()">&gt;</button>
        </div>
      </div>
    </div>

    <!-- New Patient Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal=false">
      <div class="modal-box">
        <h5>+ Yangi Bemor</h5>
        <div class="form-ct">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div><label>To'liq ism</label><input v-model="form.fullName" type="text" placeholder="Ism Familiya" /></div>
            <div><label>Email</label><input v-model="form.email" type="email" placeholder="email@example.com" /></div>
            <div><label>Jinsi</label>
              <select v-model="form.gender">
                <option value="">Tanlang</option>
                <option value="male">Erkak</option>
                <option value="female">Ayol</option>
              </select>
            </div>
            <div><label>Qon guruhi</label>
              <select v-model="form.bloodType">
                <option value="">Tanlang</option>
                <option v-for="t in ['A+','A-','B+','B-','AB+','AB-','O+','O-']" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div><label>Telefon</label><input v-model="form.phone" type="text" placeholder="+998 90 000 00 00" /></div>
            <div><label>Sug'urta raqami</label><input v-model="form.insuranceNumber" type="text" /></div>
          </div>
          <div style="margin-top:12px"><label>Manzil</label><input v-model="form.address" type="text" placeholder="Toshkent, ..." /></div>
          <div style="margin-top:12px"><label>Allergiyalar</label><input v-model="form.allergiesInput" type="text" placeholder="Penitsillin, chang... (vergul bilan)" /></div>
          <div style="display:flex;gap:10px;margin-top:18px">
            <button class="btn-ct btn-ct-primary" style="flex:1;justify-content:center"
              :disabled="saving" @click="handleCreate">
              {{ saving ? 'Saqlanmoqda...' : 'Qo\'shish' }}
            </button>
            <button class="btn-ct btn-ct-outline" @click="showModal=false">Bekor</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/patient.store.js'

const router = useRouter()
const patientStore = usePatientStore()

const patients = ref([])
const loading = ref(false)
const showModal = ref(false)
const saving = ref(false)
const search = ref('')
const page = ref(1)
const pagination = ref({ total: 0, totalPages: 1 })
let debounceTimer = null

const form = ref({
  fullName: '', email: '', gender: '', bloodType: '',
  phone: '', insuranceNumber: '', address: '', allergiesInput: ''
})

const getInitials = (name) => (name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const load = async () => {
  loading.value = true
  try {
    const params = { page: page.value, limit: 12 }
    await patientStore.fetchPatients(params)
    patients.value = patientStore.patients
    pagination.value = patientStore.pagination
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const debouncedLoad = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(load, 400)
}

const openPatient = (id) => router.push(`/admin/patients/${id}`)

const handleCreate = async () => {
  saving.value = true
  try {
    const payload = {
      ...form.value,
      allergies: form.value.allergiesInput ? form.value.allergiesInput.split(',').map(s => s.trim()) : []
    }
    delete payload.allergiesInput
    await patientStore.createPatient(payload)
    await load()
    showModal.value = false
    form.value = { fullName: '', email: '', gender: '', bloodType: '', phone: '', insuranceNumber: '', address: '', allergiesInput: '' }
  } catch (e) {
    alert(e.response?.data?.message || 'Xatolik yuz berdi')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return
  try {
    await patientStore.deletePatient(id)
    patients.value = patients.value.filter(p => p._id !== id)
  } catch (e) { alert('O\'chirishda xatolik') }
}

onMounted(load)
</script>

<template>
  <div class="doctors-page">
    <div class="page-header">
      <div>
        <h1>Shifokorlar</h1>
        <p class="subtitle">Barcha klinikalar ro'yxati</p>
      </div>
      <button class="btn-primary" @click="openAddModal">+ Shifokor qo'shish</button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input v-model="search" type="text" placeholder="Ism yoki mutaxassislik bo'yicha qidirish..."
        @input="handleSearch" />
    </div>

    <!-- Loading -->
    <div v-if="clinicianStore.loading" class="loading">Yuklanmoqda...</div>

    <!-- Empty -->
    <div v-else-if="clinicians.length === 0" class="empty">Shifokorlar topilmadi</div>

    <!-- Table -->
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Ism</th>
            <th>Mutaxassislik</th>
            <th>Tajriba</th>
            <th>Xona</th>
            <th>Holat</th>
            <th>Amallar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in clinicians" :key="doc._id">
            <td>
              <div class="doc-name">
                <div class="avatar">{{ getInitials(doc.user?.fullName) }}</div>
                <div>
                  <div class="name">{{ doc.user?.fullName || '—' }}</div>
                  <div class="email">{{ doc.user?.email || '—' }}</div>
                </div>
              </div>
            </td>
            <td>{{ doc.specialization }}</td>
            <td>{{ doc.experience }} yil</td>
            <td>{{ doc.roomNumber || '—' }}</td>
            <td>
              <span class="badge" :class="doc.isAvailable ? 'available' : 'unavailable'">
                {{ doc.isAvailable ? 'Faol' : 'Faol emas' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="openEditModal(doc)">Tahrirlash</button>
                <button class="btn-delete" @click="handleDelete(doc._id)">O'chirish</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <AppModal v-if="showModal" :title="editingDoc ? 'Tahrirlash' : 'Yangi Shifokor'" @close="closeModal">
      <div class="form-group">
        <label>Mutaxassislik</label>
        <input v-model="form.specialization" type="text" placeholder="Kardiolog..." />
      </div>
      <div class="form-group">
        <label>Litsenziya raqami</label>
        <input v-model="form.licenseNumber" type="text" placeholder="LIC-12345" />
      </div>
      <div class="form-group">
        <label>Tajriba (yil)</label>
        <input v-model="form.experience" type="number" min="0" />
      </div>
      <div class="form-group">
        <label>Xona raqami</label>
        <input v-model="form.roomNumber" type="text" placeholder="101" />
      </div>
      <div class="form-group">
        <label>Ta'lim</label>
        <input v-model="form.education" type="text" placeholder="Toshkent tibbiyot..." />
      </div>
      <template #footer>
        <button class="btn-outline" @click="closeModal">Bekor</button>
        <button class="btn-primary" :disabled="saving" @click="handleSave">
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </template>
    </AppModal>

  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import AppModal from '@/components/ui/AppModal.vue'
import '@/assets/styles/views/admin/doctors-view.css'
import { ref, computed, onMounted } from 'vue'
import { useClinicianStore } from '@/stores/clinician.store.js'

const clinicianStore = useClinicianStore()
const search = ref('')
const showModal = ref(false)
const editingDoc = ref(null)
const saving = ref(false)

const form = ref({
  specialization: '',
  licenseNumber: '',
  experience: 0,
  roomNumber: '',
  education: ''
})

const clinicians = computed(() => clinicianStore.clinicians)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleSearch = async () => {
  await clinicianStore.fetchClinicians({ specialization: search.value })
}

const openAddModal = () => {
  editingDoc.value = null
  form.value = { specialization: '', licenseNumber: '', experience: 0, roomNumber: '', education: '' }
  showModal.value = true
}

const openEditModal = (doc) => {
  editingDoc.value = doc
  form.value = {
    specialization: doc.specialization,
    licenseNumber: doc.licenseNumber,
    experience: doc.experience,
    roomNumber: doc.roomNumber || '',
    education: doc.education || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingDoc.value = null
}

const handleSave = async () => {
  saving.value = true
  try {
    if (editingDoc.value) {
      await clinicianStore.updateClinician(editingDoc.value._id, form.value)
    } else {
      await clinicianStore.createClinician(form.value)
    }
    closeModal()
  } catch (e) {
    alert(e.response?.data?.message || 'Xatolik yuz berdi')
  } finally {
    saving.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return
  try {
    await clinicianStore.deleteClinician(id)
  } catch (e) {
    alert('O\'chirishda xatolik')
  }
}

onMounted(() => clinicianStore.fetchClinicians())
</script>

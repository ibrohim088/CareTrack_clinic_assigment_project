<template>
  <div>
    <h3 style="font-size:20px;font-weight:700;margin:0 0 20px">Find a Doctor</h3>

    <div style="display:flex;gap:10px;margin-bottom:20px">
      <input v-model="search" placeholder="Search by name..." class="filter-select" style="flex:1" @input="debouncedLoad" />
      <input v-model="specialization" placeholder="Specialization..." class="filter-select" style="width:200px" @input="debouncedLoad" />
    </div>

    <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
    <div v-else-if="doctors.length===0" style="text-align:center;padding:48px;color:#9ca3af">No doctors found</div>
    <div v-else style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      <div v-for="doc in doctors" :key="doc._id"
        style="background:#fff;border:1px solid #e5e9f0;border-radius:14px;padding:20px;transition:box-shadow 0.15s"
        @mouseenter="$event.target.style.boxShadow='0 4px 16px #0001'"
        @mouseleave="$event.target.style.boxShadow='none'">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
          <div class="avatar" style="width:48px;height:48px;font-size:18px">{{ getInitials(doc.user?.fullName) }}</div>
          <div>
            <div style="font-size:15px;font-weight:700">{{ doc.user?.fullName }}</div>
            <div style="font-size:12px;color:#6b7280">{{ doc.specialization || '—' }}</div>
          </div>
        </div>
        <div style="font-size:13px;color:#6b7280;margin-bottom:6px">
          📅 {{ doc.workingDays?.join(', ') || '—' }}
        </div>
        <div style="font-size:13px;color:#6b7280;margin-bottom:12px">
          🕐 {{ doc.workingHours?.start || '09:00' }} — {{ doc.workingHours?.end || '18:00' }}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:12px;padding:3px 10px;border-radius:20px"
            :style="doc.isAvailable ? 'background:#dcfce7;color:#16a34a' : 'background:#fee2e2;color:#dc2626'">
            {{ doc.isAvailable ? 'Available' : 'Unavailable' }}
          </span>
          <button class="btn-ct btn-ct-primary" style="padding:6px 14px;font-size:13px"
            @click="bookWith(doc)">Book</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getDoctors } from '../../api/doctor.api.js'

const router = useRouter()
const doctors = ref([])
const loading = ref(false)
const search = ref('')
const specialization = ref('')
let debounceTimer = null

const getInitials = (name) => (name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)

const load = async () => {
  loading.value = true
  try {
    const params = { limit: 50 }
    if (specialization.value) params.specialization = specialization.value
    const res = await getDoctors(params)
    const data = res.data.data
    let list = data?.data || data || []
    if (search.value) {
      const q = search.value.toLowerCase()
      list = list.filter(d => d.user?.fullName?.toLowerCase().includes(q))
    }
    doctors.value = list
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const debouncedLoad = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(load, 400)
}

const bookWith = (doc) => {
  router.push({ path: '/patient/appointments', query: { doctorId: doc._id } })
}

onMounted(load)
</script>
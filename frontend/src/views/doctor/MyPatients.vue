<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <h3 style="font-size:20px;font-weight:700;margin:0">My Patients</h3>
      <input v-model="search" placeholder="Search patients..." class="filter-select"
        style="width:220px" @input="debouncedLoad" />
    </div>

    <div class="card-block">
      <div v-if="loading" style="text-align:center;padding:48px;color:#9ca3af">Loading...</div>
      <div v-else-if="patients.length === 0" style="text-align:center;padding:48px;color:#9ca3af">No patients found</div>
      <table v-else class="ct-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Blood Type</th>
            <th>Phone</th>
            <th>Insurance No.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p._id">
            <td>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="avatar">{{ getInitials(p.user?.fullName) }}</div>
                <div>
                  <div style="font-size:13.5px;font-weight:500">{{ p.user?.fullName || '—' }}</div>
                  <div style="font-size:12px;color:#9ca3af">{{ p.user?.email }}</div>
                </div>
              </div>
            </td>
            <td style="color:#6b7280;text-transform:capitalize">{{ p.gender || '—' }}</td>
            <td>
              <span v-if="p.bloodType" style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:8px;font-size:12px;font-weight:700">
                {{ p.bloodType }}
              </span>
              <span v-else style="color:#9ca3af">—</span>
            </td>
            <td style="color:#6b7280">{{ p.user?.phone || '—' }}</td>
            <td style="color:#6b7280">{{ p.insuranceNumber || '—' }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="total > limit" style="display:flex;justify-content:center;gap:8px;margin-top:16px">
        <button class="btn-ct btn-ct-ghost" :disabled="page === 1" @click="page--;load()"></button>
        <span style="padding:6px 12px;font-size:13px">Page {{ page }} of {{ Math.ceil(total/limit) }}</span>
        <button class="btn-ct btn-ct-ghost" :disabled="page >= Math.ceil(total/limit)" @click="page++;load()">Next <ChevronRight :size="14" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { getPatients } from '../../api/patient.api.js'

const patients = ref([])
const loading = ref(false)
const search = ref('')
const page = ref(1)
const limit = 10
const total = ref(0)
let debounceTimer = null

const getInitials = (name) => (name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)

const load = async () => {
  loading.value = true
  try {
    const params = { page: page.value, limit }
    if (search.value) params.search = search.value
    const res = await getPatients(params)
    const data = res.data.data
    patients.value = data?.data || data || []
    total.value = data?.total || patients.value.length
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const debouncedLoad = () => {
  clearTimeout(debounceTimer)
  page.value = 1
  debounceTimer = setTimeout(load, 400)
}

onMounted(load)
</script>
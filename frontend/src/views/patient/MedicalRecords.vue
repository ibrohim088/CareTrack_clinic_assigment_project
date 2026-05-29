<template>
  <div>
    <h3 style="font-size:20px;font-weight:700;margin:0 0 20px">Tibbiy Yozuvlar</h3>

    <!-- Tabs -->
    <div style="display:flex;gap:8px;margin-bottom:20px">
      <button v-for="t in tabs" :key="t.id"
        :class="['btn-ct', activeTab===t.id ? 'btn-ct-primary' : 'btn-ct-ghost']"
        style="padding:6px 16px;font-size:13px"
        @click="activeTab=t.id">
        {{ t.label }}
      </button>
    </div>

    <!-- Diagnoses -->
    <div v-if="activeTab==='diagnoses'" class="card-block">
      <div v-if="loading" style="text-align:center;padding:40px;color:#9ca3af">Yuklanmoqda...</div>
      <div v-else-if="diagnoses.length===0" style="text-align:center;padding:40px;color:#9ca3af">Tashxislar yo'q</div>
      <div v-else style="display:flex;flex-direction:column;gap:12px">
        <div v-for="d in diagnoses" :key="d._id"
          style="border:1px solid #e5e9f0;border-radius:12px;padding:16px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
            <div>
              <div style="font-size:14px;font-weight:700;color:#1a1f36">{{ d.description }}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">
                ICD: {{ d.icdCode || '—' }} · {{ formatDate(d.createdAt) }}
              </div>
              <div style="font-size:12px;color:#6b7280">
                Shifokor: {{ d.clinician?.user?.fullName || '—' }}
              </div>
            </div>
            <span class="status-pill" :class="d.severity">{{ d.severity || 'moderate' }}</span>
          </div>
          <div v-if="d.notes" style="font-size:13px;color:#374151;background:#f9fafb;border-radius:8px;padding:10px">
            {{ d.notes }}
          </div>
        </div>
      </div>
    </div>

    <!-- Medical Records -->
    <div v-if="activeTab==='records'" class="card-block">
      <div v-if="loading" style="text-align:center;padding:40px;color:#9ca3af">Yuklanmoqda...</div>
      <div v-else-if="records.length===0" style="text-align:center;padding:40px;color:#9ca3af">Yozuvlar yo'q</div>
      <table v-else class="ct-table">
        <thead>
          <tr>
            <th>Sana</th>
            <th>Tur</th>
            <th>Shifokor</th>
            <th>Tavsif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in records" :key="r._id">
            <td>{{ formatDate(r.recordDate || r.createdAt) }}</td>
            <td>
              <span style="background:#eff6ff;color:#1d4ed8;font-size:12px;padding:2px 8px;border-radius:6px">
                {{ r.type }}
              </span>
            </td>
            <td style="color:#6b7280">{{ r.clinician?.user?.fullName || '—' }}</td>
            <td style="color:#374151">{{ r.description || r.title || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getDiagnoses } from '../../api/diagnosis.api.js'
import api from '../../api/axios.js'

const activeTab = ref('diagnoses')
const loading = ref(false)
const diagnoses = ref([])
const records = ref([])

const tabs = [
  { id: 'diagnoses', label: 'Tashxislar' },
  { id: 'records', label: 'Tibbiy Yozuvlar' },
]

const formatDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

const loadData = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'diagnoses') {
      const res = await getDiagnoses({ limit: 50 })
      const data = res.data.data
      diagnoses.value = data?.data || data || []
    } else {
      const res = await api.get('/medical-records', { params: { limit: 50 } })
      const data = res.data.data
      records.value = data?.data || data || []
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

watch(activeTab, loadData)
onMounted(loadData)
</script>

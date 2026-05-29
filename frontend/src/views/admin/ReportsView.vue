<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
      <div>
        <h3 style="font-size:20px;font-weight:700;margin:0 0 4px">Hisobotlar & Tahlil</h3>
        <p style="font-size:13px;color:#6b7280;margin:0">Klinika faoliyati umumiy ko'rinishi</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
      <div class="card-block" style="display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;background:#eff6ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px"><Users :size="24" color="#1d4ed8" /></div>
        <div>
          <div style="font-size:24px;font-weight:800;color:#1a1f36">{{ loading ? '...' : stats.totalPatients }}</div>
          <div style="font-size:12px;color:#6b7280">Jami Bemorlar</div>
        </div>
      </div>
      <div class="card-block" style="display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;background:#f0fdf4;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px"><CalendarDays :size="24" color="#16a34a" /></div>
        <div>
          <div style="font-size:24px;font-weight:800;color:#1a1f36">{{ loading ? '...' : stats.totalAppointments }}</div>
          <div style="font-size:12px;color:#6b7280">Jami Qabullar</div>
        </div>
      </div>
      <div class="card-block" style="display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;background:#f5f3ff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px"><Stethoscope :size="24" color="#7c3aed" /></div>
        <div>
          <div style="font-size:24px;font-weight:800;color:#1a1f36">{{ loading ? '...' : stats.totalClinicians }}</div>
          <div style="font-size:12px;color:#6b7280">Shifokorlar</div>
        </div>
      </div>
      <div class="card-block" style="display:flex;align-items:center;gap:16px">
        <div style="width:48px;height:48px;background:#fff7ed;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px"><CheckCircle :size="24" color="#ea580c" /></div>
        <div>
          <div style="font-size:24px;font-weight:800;color:#1a1f36">
            {{ loading ? '...' : completionRate + '%' }}
          </div>
          <div style="font-size:12px;color:#6b7280">Bajarilgan %</div>
        </div>
      </div>
    </div>

    <!-- Appointments by status -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div class="card-block">
        <h4 class="card-block-title">Qabullar Holati bo'yicha</h4>
        <div v-if="loading" style="text-align:center;padding:32px;color:#9ca3af">Yuklanmoqda...</div>
        <div v-else style="display:flex;flex-direction:column;gap:12px">
          <div v-for="s in statusBreakdown" :key="s.status"
            style="display:flex;align-items:center;gap:12px">
            <div style="width:110px;font-size:13px;font-weight:500;text-transform:capitalize">{{ s.label }}</div>
            <div style="flex:1;height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden">
              <div :style="{width: s.pct+'%', height:'100%', background: s.color, borderRadius:'4px'}"></div>
            </div>
            <div style="font-size:13px;font-weight:700;width:40px;text-align:right">{{ s.count }}</div>
          </div>
        </div>
      </div>

      <div class="card-block">
        <h4 class="card-block-title">So'nggi Qabullar</h4>
        <div v-if="loading" style="text-align:center;padding:32px;color:#9ca3af">Yuklanmoqda...</div>
        <div v-else-if="recentAppointments.length===0" style="text-align:center;padding:32px;color:#9ca3af">Qabullar yo'q</div>
        <table v-else class="ct-table">
          <thead><tr><th>Bemor</th><th>Sana</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="a in recentAppointments" :key="a._id">
              <td>{{ a.patient?.user?.fullName || '—' }}</td>
              <td style="color:#6b7280">{{ formatDate(a.date) }}</td>
              <td><span class="status-pill" :class="a.status">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, CalendarDays, Stethoscope, CheckCircle } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios.js'

const loading = ref(false)
const allAppointments = ref([])
const stats = ref({ totalPatients: 0, totalAppointments: 0, totalClinicians: 0 })

const formatDate = (d) => d ? new Date(d).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' }) : '—'

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444',
}
const statusLabels = {
  pending: 'Kutilmoqda',
  confirmed: 'Tasdiqlangan',
  completed: 'Bajarilgan',
  cancelled: 'Bekor qilingan',
}

const statusBreakdown = computed(() => {
  const total = allAppointments.value.length || 1
  return ['pending', 'confirmed', 'completed', 'cancelled'].map(s => {
    const count = allAppointments.value.filter(a => a.status === s).length
    return { status: s, label: statusLabels[s], count, pct: Math.round(count / total * 100), color: statusColors[s] }
  })
})

const recentAppointments = computed(() =>
  [...allAppointments.value].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
)

const completionRate = computed(() => {
  const total = allAppointments.value.length
  if (!total) return 0
  const completed = allAppointments.value.filter(a => a.status === 'completed').length
  return Math.round(completed / total * 100)
})

onMounted(async () => {
  loading.value = true
  try {
    const [pRes, cRes, aRes] = await Promise.all([
      api.get('/patients', { params: { limit: 1 } }),
      api.get('/clinicians', { params: { limit: 1 } }),
      api.get('/appointments', { params: { limit: 200 } }),
    ])
    stats.value.totalPatients = pRes.data.data?.total || 0
    stats.value.totalClinicians = cRes.data.data?.total || 0
    const aData = aRes.data.data
    allAppointments.value = aData?.data || aData || []
    stats.value.totalAppointments = aData?.total || allAppointments.value.length
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>

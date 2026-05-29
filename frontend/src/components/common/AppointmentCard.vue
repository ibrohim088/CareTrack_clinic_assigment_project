<template>
  <div class="appt-card">
    <div class="appt-time">
      <div class="time">{{ formatTime(appointment.date) }}</div>
      <div class="date">{{ formatDateShort(appointment.date) }}</div>
    </div>
    <div class="appt-info">
      <div class="clinician-info">
        <AppAvatar :name="appointment.clinician?.user?.fullName" size="md" />
        <div>
          <h4>{{ appointment.clinician?.user?.fullName || '—' }}</h4>
          <p class="specialty">{{ appointment.clinician?.specialization }}</p>
        </div>
      </div>
      <div class="status">
        <StatusBadge :status="appointment.status" />
      </div>
    </div>
    <div class="reason">{{ appointment.reason || 'Sabab ko\'rsatilmagan' }}</div>
  </div>
</template>

<script setup>
import AppAvatar from '../ui/AppAvatar.vue'
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({
  appointment: { type: Object, required: true }
})

const formatTime = (date) => new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
const formatDateShort = (date) => new Date(date).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
</script>

<style scoped>
.appt-card {
  background: white;
  border: 1px solid var(--ct-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  transition: all 0.2s;
}
.appt-card:hover { border-color: var(--ct-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.appt-time { text-align: center; min-width: 70px; }
.time { font-weight: 700; font-size: 18px; color: var(--ct-primary); }
.date { font-size: 13px; color: var(--ct-muted); }
.appt-info { flex: 1; }
.clinician-info { display: flex; gap: 12px; align-items: center; }
.specialty { font-size: 13px; color: var(--ct-muted); margin: 2px 0 0; }
.reason { font-size: 13.5px; color: #374151; margin-top: 8px; }
</style>

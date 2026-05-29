<template>
  <div class="doctor-card">
    <AppAvatar :name="doctor.user?.fullName" size="lg" :src="doctor.user?.avatar" />
    <h4>{{ doctor.user?.fullName }}</h4>
    <p class="specialization">{{ doctor.specialization }}</p>
    <p class="experience">{{ doctor.experience }} yil tajriba</p>
    
    <div class="availability">
      <StatusBadge :status="doctor.isAvailable ? 'available' : 'busy'" />
    </div>
  </div>
</template>

<script setup>
import AppAvatar from '../ui/AppAvatar.vue'
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({
  doctor: { type: Object, required: true }
})
</script>

<style scoped>
.doctor-card {
  background: white;
  border: 1px solid var(--ct-border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
}

.specialization { color: var(--ct-primary); font-weight: 500; margin: 4px 0; }
.experience { font-size: 13px; color: var(--ct-muted); }
</style>
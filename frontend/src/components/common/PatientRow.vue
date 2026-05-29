<template>
  <tr>
    <td>
      <div class="patient-info">
        <AppAvatar :name="patient.user?.fullName" size="md" />
        <div>
          <div class="name">{{ patient.user?.fullName }}</div>
          <div class="email">{{ patient.user?.email }}</div>
        </div>
      </div>
    </td>
    <td>{{ patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('uz-UZ') : '—' }}</td>
    <td>{{ patient.gender || '—' }}</td>
    <td>{{ patient.bloodType || '—' }}</td>
    <td>
      <StatusBadge :status="patient.user?.isActive ? 'active' : 'inactive'" />
    </td>
  </tr>
</template>

<script setup>
import AppAvatar from '../ui/AppAvatar.vue'
import StatusBadge from '../ui/StatusBadge.vue'

defineProps({ patient: Object })
</script>
<template>
  <span class="status-badge" :class="variant">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'success', 'warning', 'danger', 'info', 'available', 'busy', 'off'].includes(v)
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.success   { background: #d1fae5; color: #065f46; }
.status-badge.warning   { background: #fef3c7; color: #92400e; }
.status-badge.danger    { background: #fee2e2; color: #991b1b; }
.status-badge.info      { background: #dbeafe; color: #1e40af; }
.status-badge.available { background: #d1fae5; color: #065f46; }
.status-badge.busy      { background: #fee2e2; color: #991b1b; }
.status-badge.off       { background: #f3f4f6; color: #6b7280; }
</style>
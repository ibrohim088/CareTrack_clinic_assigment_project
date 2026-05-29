<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="sub" class="stat-sub">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  sub: { type: String, default: '' }
})
</script>

<style scoped>
.stat-card {
  background: var(--ct-surface);
  border: 1px solid var(--ct-border);
  border-radius: 12px;
  padding: 20px 22px;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ct-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--ct-text);
  line-height: 1;
}

.stat-sub {
  font-size: 12px;
  color: var(--ct-muted);
  margin-top: 6px;
}
</style>
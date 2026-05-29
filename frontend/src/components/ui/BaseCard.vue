<template>
  <div class="base-card" :class="variant">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' } // default, elevated, bordered
})
</script>

<style scoped>
.base-card {
  background: var(--ct-surface);
  border-radius: 12px;
  border: 1px solid var(--ct-border);
  overflow: hidden;
}

.base-card.elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--ct-border);
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--ct-border);
}
</style>
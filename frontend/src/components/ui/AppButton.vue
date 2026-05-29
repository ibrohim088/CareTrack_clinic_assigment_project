<template>
  <button
    class="app-button"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { loading: loading }
    ]"
    :disabled="loading || disabled"
    @click="$emit('click', $event)"
  >
    <AppSpinner v-if="loading" size="small" class="mr-2" />
    <slot v-else />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, outline, ghost, danger
  size: { type: String, default: 'md' },         // sm, md, lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  gap: 8px;
}

.variant-primary {
  background: var(--ct-primary);
  color: white;
}
.variant-primary:hover { background: var(--ct-primary-dark); }

.variant-secondary {
  background: #64748b;
  color: white;
}
.variant-outline {
  background: transparent;
  border: 1px solid var(--ct-border);
  color: var(--ct-text);
}
.variant-ghost {
  background: transparent;
  color: var(--ct-muted);
}
.variant-danger {
  background: var(--ct-danger);
  color: white;
}

.size-sm { padding: 6px 12px; font-size: 13px; }
.size-md { padding: 10px 16px; font-size: 14px; }
.size-lg { padding: 12px 20px; font-size: 15px; }

.app-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
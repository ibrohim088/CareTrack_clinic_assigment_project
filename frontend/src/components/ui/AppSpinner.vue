<template>
  <div class="app-spinner" :class="size"></div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' } // sm, md, lg
})
</script>

<style scoped>
.app-spinner {
  border: 3px solid #e5e7eb;
  border-top-color: var(--ct-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.app-spinner.sm { width: 20px; height: 20px; border-width: 2px; }
.app-spinner.md { width: 28px; height: 28px; }
.app-spinner.lg { width: 40px; height: 40px; border-width: 4px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
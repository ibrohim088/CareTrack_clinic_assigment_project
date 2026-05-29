<template>
  <span class="app-badge">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #e5e7eb;
  color: #111827;
  font-size: 0.85rem;
}
</style>

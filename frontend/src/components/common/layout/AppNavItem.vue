<template>
  <div class="nav-item">
    <slot />
  </div>
</template>

<style scoped>
.nav-item {
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nav-item:hover {
  background: #eef2ff;
}
</style>

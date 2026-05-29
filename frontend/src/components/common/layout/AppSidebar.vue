<template>
  <div class="sidebar bg-white border-end shadow-sm" style="width: 260px; height: 100vh; overflow-y: auto;">
    <!-- Logo va Sarlavha -->
    <div class="p-4 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <div class="logo-circle bg-primary text-white d-flex align-items-center justify-content-center">
          CT
        </div>
        <div>
          <h4 class="mb-0 fw-bold text-primary">CareTrack</h4>
          <small class="text-muted">Clinic System</small>
        </div>
      </div>
    </div>

    <!-- Navigatsiya -->
    <div class="p-3">
      <nav class="nav flex-column gap-1">
        <slot />
      </nav>
    </div>

    <!-- Footer qism (ixtiyoriy) -->
    <div class="mt-auto p-3 border-top">
      <small class="text-muted d-block text-center">© 2026 CareTrack Clinic</small>
    </div>
  </div>
</template>

<script setup>
// Lucide iconlarini bu yerda emas, har bir layoutda alohida import qilamiz
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1020;
}

.logo-circle {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 18px;
}

.nav-link {
  color: #374151;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #4338ca;
}

.nav-link.router-link-active {
  background-color: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}
</style>
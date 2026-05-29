<template>
  <div class="app-avatar" :class="size" :style="backgroundStyle">
    <img v-if="src" :src="src" :alt="alt" class="avatar-img" />
    <span v-else class="avatar-initials">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: String,
  name: String,
  size: { type: String, default: 'md' }, // sm, md, lg, xl
  alt: { type: String, default: 'Avatar' }
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const backgroundStyle = computed(() => ({
  backgroundColor: props.src ? 'transparent' : 'var(--ct-primary-light)'
}))
</script>

<style scoped>
.app-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: var(--ct-primary-light);
  color: var(--ct-primary);
  font-weight: 700;
  flex-shrink: 0;
}

.app-avatar.sm { width: 32px; height: 32px; font-size: 12px; }
.app-avatar.md { width: 40px; height: 40px; font-size: 14px; }
.app-avatar.lg { width: 56px; height: 56px; font-size: 18px; }
.app-avatar.xl { width: 80px; height: 80px; font-size: 24px; }

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
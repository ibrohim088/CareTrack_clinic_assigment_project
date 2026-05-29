<template>
  <div class="empty-state">
    <slot name="icon">
      <div class="empty-icon"><Inbox :size="48" /></div>
    </slot>
    <h4 class="empty-title">{{ title }}</h4>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Hech narsa topilmadi' },
  description: { type: String, default: '' }
})
import { Inbox } from 'lucide-vue-next'
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--ct-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ct-text);
  margin: 0 0 8px;
}

.empty-description {
  font-size: 14px;
  max-width: 320px;
  margin: 0 auto 20px;
}
</style>
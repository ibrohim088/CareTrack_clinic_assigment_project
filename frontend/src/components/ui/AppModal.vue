<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content" :style="{ maxWidth: width + 'px' }">
        <div class="modal-header">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
          <button class="modal-close" @click="$emit('close')"><X :size="18" /></button>
        </div>
        
        <div class="modal-body">
          <slot />
        </div>
        
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  title: { type: String, default: '' },
  width: { type: Number, default: 480 }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: var(--ct-surface);
  border-radius: 16px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--ct-border);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--ct-muted);
  padding: 4px 8px;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--ct-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
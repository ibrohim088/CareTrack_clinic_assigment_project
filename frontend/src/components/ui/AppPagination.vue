<template>
  <div class="pagination">
    <button 
      class="page-btn" 
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      ← Prev
    </button>
    
    <div class="page-info">
      Page <strong>{{ currentPage }}</strong> of {{ totalPages }}
    </div>
    
    <button 
      class="page-btn" 
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      Next →
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, default: 1 },
  totalPages: { type: Number, required: true }
})

defineEmits(['update:currentPage'])
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid var(--ct-border);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--ct-muted);
}
</style>
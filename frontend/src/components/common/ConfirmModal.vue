<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <h5>{{ title }}</h5>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="btn-ct btn-ct-ghost" @click="$emit('close')">Bekor qilish</button>
        <button class="btn-ct btn-ct-danger" @click="$emit('confirm')">Tasdiqlash</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Tasdiqlash' },
  message: { type: String, required: true }
})

defineEmits(['close', 'confirm'])
</script>
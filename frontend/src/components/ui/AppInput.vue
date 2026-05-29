<template>
  <div class="app-input-wrapper">
    <label v-if="label" class="app-input-label">{{ label }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="app-input"
      :class="{ error: error }"
    />
    <small v-if="error" class="error-text">{{ error }}</small>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  error: String,
  disabled: Boolean
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ct-muted);
}

.app-input {
  padding: 10px 14px;
  border: 1px solid var(--ct-border);
  border-radius: 8px;
  font-size: 14px;
  transition: border 0.2s;
}

.app-input:focus {
  border-color: var(--ct-primary);
  outline: none;
}

.app-input.error {
  border-color: var(--ct-danger);
}

.error-text {
  color: var(--ct-danger);
  font-size: 12px;
}
</style>
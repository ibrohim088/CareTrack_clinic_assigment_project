<template>
  <div class="app-input-wrapper">
    <label v-if="label" class="app-input-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="app-select"
      :disabled="disabled"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  options: { type: Array, default: () => [] },
  disabled: Boolean
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.app-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--ct-border);
  border-radius: 8px;
  font-size: 14px;
  background: white;
}
</style>
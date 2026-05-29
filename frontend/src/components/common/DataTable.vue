<template>
  <div class="table-wrapper">
    <table class="ct-table">
      <thead>
        <tr><slot name="header" /></tr>
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>
    <AppEmptyState v-if="items.length === 0" title="Ma'lumot topilmadi" />
  </div>
</template>

<script setup>
import AppEmptyState from '../ui/AppEmptyState.vue'

defineProps({
  items: { type: Array, default: () => [] }
})
</script>
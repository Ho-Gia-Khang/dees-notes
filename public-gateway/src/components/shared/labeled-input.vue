<template>
  <div class="labeled_input">
    <label :for="id" class="labeled_input-label">
      {{ label }}
      <span v-if="required" class="labeled_input-label-required">*</span>
    </label>
    <slot :id="id" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.labeled_input {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &-required {
      color: $status-error;
    }
  }
}
</style>

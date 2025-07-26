<template>
  <span class="err-msg">{{ message }}</span>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<style lang="scss" scoped>
.err-msg {
  color: $status-error;
  font-size: 11px;
}
</style>

<template>
  <div class="confirm modal">
    <span>Are you sure you want to continue?</span>

    <div class="action-btn">
      <ElButton type="default" @click="emits('cancel')" :loading="loading" plain> Cancel </ElButton>
      <ElButton type="primary" @click="handleConfirm" :loading="loading" plain> Continue </ElButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";

import { delayMs } from "@/utils";

const emits = defineEmits(["confirm", "cancel"]);

const props = withDefaults(
  defineProps<{
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

async function handleConfirm() {
  emits("confirm");

  while (props.loading) {
    await delayMs(100);
  }
  emits("cancel");
}
</script>

<style lang="scss" scoped>
.confirm.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .action-btn {
    display: flex;
    gap: 8px;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

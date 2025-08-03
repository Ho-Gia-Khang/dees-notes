<template>
  <div class="paginator-wrapper">
    <ElPagination
      v-model:current-page="currentPage"
      v-model:page-size="model.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next, jumper"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiListRequest } from "@/types/shared/common";
import { ElPagination } from "element-plus";
import { computed } from "vue";

const model = defineModel<ApiListRequest>({
  required: true,
});

withDefaults(
  defineProps<{
    total?: number;
    disabled?: boolean;
  }>(),
  {
    total: 0,
    disabled: false,
  },
);

const currentPage = computed({
  get() {
    return model.value.page + 1;
  },
  set(value: number) {
    model.value.page = value - 1;
  },
});
</script>

<style scoped lang="scss">
.paginator-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
}
</style>

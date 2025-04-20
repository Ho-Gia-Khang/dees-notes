<template>
  <div class="gateway-items-container">
    <RouterLink v-for="item in items" :key="item.label" :to="item.to" class="card-item">
      <ElCard style="height: 100%">
        <template #header>
          <div class="card-header">
            <Icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </template>

        <template #default>
          <span v-if="item.description">
            {{ item.description }}
          </span>
        </template>
      </ElCard>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import type { INavItem } from "@/types/main/navItem";
import { ElCard } from "element-plus";
import type { PropType } from "vue";
import { RouterLink } from "vue-router";
import Icon from "../shared/icon.vue";

defineProps({
  items: {
    type: Array as PropType<INavItem[]>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.gateway-items-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  align-items: stretch;

  .card-item {
    width: 100%;
    max-width: 300px;
    text-decoration: none;
    color: black;
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>

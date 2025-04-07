<template>
  <MainLayout>
    <div class="dashboard">
      <h2>Deesnotes server</h2>

      <ElCollapse accordion>
        <ElCollapseItem :name="ECollapseItems.RecentActivity">
          <template #title>
            <h3 class="collapse-item-title">{{ ECollapseItems.RecentActivity }}</h3>
          </template>
        </ElCollapseItem>

        <ElCollapseItem :name="ECollapseItems.Storage">
          <template #title>
            <h3 class="collapse-item-title">{{ ECollapseItems.Storage }}</h3>
          </template>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from "element-plus";
import MainLayout from "../layouts/main-layout.vue";
import { provideDashboard } from "@/contexts/useDashboard";

enum ECollapseItems {
  Storage = "Storage",
  RecentActivity = "Recent activity",
}

provideDashboard();
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;

  h2 {
    margin-top: 0;
  }

  .collapse-item-title {
    margin: 0;
  }
}
</style>

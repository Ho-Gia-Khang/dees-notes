<template>
  <MainLayout>
    <div class="dashboard">
      <h2>Deesnotes server</h2>

      <ElCollapse v-model="activeItems">
        <ElCollapseItem :name="ECollapseItems.RecentActivity">
          <template #title>
            <h3 class="collapse-item-title">{{ ECollapseItems.RecentActivity }}</h3>
          </template>

          <Logger :logs="logs" />
        </ElCollapseItem>

        <ElCollapseItem :name="ECollapseItems.Storage">
          <template #title>
            <h3 class="collapse-item-title">{{ ECollapseItems.Storage }}</h3>
          </template>

          <div class="storage">
            <div class="item-count-wrapper">
              <div
                v-for="item in itemsCount"
                :key="item.label"
                class="item-count-item"
                :style="{ backgroundColor: item.backgroundColor }"
              >
                <SharedIcon :icon="item.icon" />
                <span class="item-label" :style="{ color: item.labelColor }">
                  {{ item.label }}
                </span>
                <span class="item-value" :style="{ color: item.labelColor }">
                  {{ item.value }} {{ item.unit }}
                </span>
              </div>
            </div>

            <div class="storage-details">
              <div v-for="item in storageDetail" :key="item.label" class="storage-detail-item">
                <span class="storage-detail-label">{{ item.label }}</span>

                <ElProgress
                  :percentage="item.percentage"
                  :format="(percent) => `${percent.toFixed(2)}%`"
                  :text-inside="true"
                  :stroke-width="24"
                  :status="item.status"
                />

                <span class="storage-detail-value">{{ item.value }} GB</span>
              </div>
            </div>
          </div>
        </ElCollapseItem>
      </ElCollapse>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { provideDashboard } from "@/contexts/useDashboard";
import { ElCollapse, ElCollapseItem, ElProgress } from "element-plus";
import MainLayout from "../layouts/main-layout.vue";
import SharedIcon from "../shared/icon.vue";
import type { Icon } from "@/types/shared/common";
import { computed, ref } from "vue";
import type { EpPropMergeType } from "element-plus/es/utils/index.mjs";
import Logger from "../shared/logger.vue";

enum ECollapseItems {
  Storage = "Storage",
  RecentActivity = "Recent activity",
}

const {
  state: { videoCount, imageCount, documentCount, totalStorage, usedStorage, freeStorage },
} = provideDashboard();

const activeItems = ref<ECollapseItems[]>([ECollapseItems.RecentActivity, ECollapseItems.Storage]);

const logs = computed(() => [
  { actor: "Admin", fileName: "file1.jpg", time: "2025-7-01 12:00" },
  { actor: "User1", fileName: "file2.mp4", time: "2025-7-01 12:05" },
  { actor: "User2", fileName: "file3.pdf", time: "2025-7-01 12:10" },
]);

const itemsCount = computed<
  Array<{
    label: string;
    value: number;
    backgroundColor: string;
    labelColor: string;
    icon: Icon;
    unit: string;
  }>
>(() => [
  {
    label: "Media",
    value: videoCount.value + imageCount.value,
    backgroundColor: "#f0f9eb",
    labelColor: "#52c41a",
    icon: "media",
    unit: "items",
  },
  {
    label: "Documents",
    value: documentCount.value,
    backgroundColor: "#fff5f5",
    labelColor: "#ff4d4f",
    icon: "document",
    unit: "items",
  },
  {
    label: "Storage",
    value: totalStorage.value,
    backgroundColor: "#e6f7ff",
    labelColor: "#1890ff",
    icon: "home",
    unit: "GB",
  },
]);

const storageDetail = computed<
  Array<{
    label: string;
    value: number;
    percentage: number;
    status: EpPropMergeType<StringConstructor, "" | "success" | "warning" | "exception", unknown>;
  }>
>(() => [
  {
    label: "Used",
    value: usedStorage.value,
    percentage: Number((usedStorage.value / totalStorage.value) * 100),
    status: usedStorage.value > 80 ? "warning" : "success",
  },
  {
    label: "Free",
    value: freeStorage.value,
    percentage: Number((freeStorage.value / totalStorage.value) * 100),
    status: freeStorage.value < 20 ? "warning" : "",
  },
]);
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  h2 {
    margin-top: 0;
  }

  .collapse-item-title {
    margin: 0;
  }

  :deep(.el-collapse-item) {
    border-bottom: 1px solid #333;
  }
  :deep(.el-collapse-item__wrap) {
    border: none;
  }

  :deep(.is-active) {
    .el-collapse-item__wrap {
      .el-collapse-item__content {
        display: flex;
        justify-content: center;
      }
    }
  }

  .storage {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    width: 80%;

    .item-count-wrapper {
      display: flex;
      width: 100%;
      gap: 16px;
      padding: 12px;
      flex-wrap: wrap;
      justify-content: space-evenly;

      .item-count-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        padding: 8px 12px;
        border: 1px solid #eee;
        border-radius: 4px;

        .item-label {
          font-weight: bold;
          font-size: 20px;
        }

        .item-value {
          font-size: 16px;
        }
      }
    }

    &-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 600px;
      max-width: 1000px;

      .storage-detail-item {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr max-content 1fr;
        gap: 8px;

        :deep(.el-progress) {
          min-width: 450px;
          margin-right: 16px;
        }

        justify-content: space-between;
        align-items: center;

        .storage-detail-label {
          font-weight: bold;
          font-size: 18px;
        }

        .storage-detail-value {
          font-size: 16px;
          margin-right: 16px;
        }
      }
    }
  }
}
</style>

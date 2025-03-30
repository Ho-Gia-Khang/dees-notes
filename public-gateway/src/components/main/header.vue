<template>
  <header class="main-header">
    <ElButton :icon="Setting" round class="header-btn" />
    <ElButton :icon="User" round class="header-btn" />
  </header>
</template>

<script setup lang="ts">
import { ElButton } from "element-plus";
import { User, Setting } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: $header-padding;
  height: $header-height;

  .header-btn {
    border: none;
  }
}
</style>

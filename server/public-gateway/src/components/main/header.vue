<template>
  <header class="main-header">
    <ElButton :icon="Setting" round class="header-btn" />
    <ElPopover trigger="click">
      <template #reference>
        <ElButton :icon="User" round class="header-btn" />
      </template>

      <ElMenu style="border-right: none">
        <ElMenuItemGroup v-if="state.isAdmin" title="Admin">
          <ElMenuItem index="0" @click="onManageAccounts">Manage accounts</ElMenuItem>
        </ElMenuItemGroup>
        <ElMenuItemGroup title="User">
          <ElMenuItem index="1" @click="onProfile">Profile</ElMenuItem>
          <ElMenuItem index="2" @click="logout">Logout</ElMenuItem>
        </ElMenuItemGroup>
      </ElMenu>
    </ElPopover>
  </header>
</template>

<script setup lang="ts">
import useAuthStore from "@/stores/auth";
import { Setting, User } from "@element-plus/icons-vue";
import { ElButton, ElMenu, ElMenuItem, ElMenuItemGroup, ElPopover } from "element-plus";
import { useRouter } from "vue-router";

const { state, logout } = useAuthStore();

const router = useRouter();

function onManageAccounts() {
  router.push("/auth/admin");
}

function onProfile() {
  router.push("/auth/profile");
}
</script>

<style lang="scss" scoped>
.main-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: $header-padding;
  height: $header-height;

  .header-btn {
    border: none;
  }
}
</style>

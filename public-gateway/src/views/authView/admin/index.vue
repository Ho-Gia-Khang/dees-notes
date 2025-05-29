<template>
  <div v-if="authState.isAdmin" class="admin_page">
    <div class="admin_page-header">
      <h2>User Management</h2>
      <ElButton type="primary" size="large" @click="isCreatingUser = true"> Add User </ElButton>
    </div>

    <ElTable
      :data="userState.usersList"
      key="id"
      v-loading="userState.isWorking"
      class="admin_page-table"
    >
      <ElTableColumn prop="phoneNumber" label="Phone number" />
      <ElTableColumn prop="createdAt" label="Created at" />
      <ElTableColumn prop="role" label="Role">
        <template #default="{ row }">
          <ElTag type="primary" v-if="row.role === ERoles.ADMIN">Admin</ElTag>
          <ElTag type="success" v-else>User</ElTag>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Actions">
        <template #default="{ row }">
          <ElButton
            type="danger"
            :icon="Delete"
            plain
            :disabled="userState.isWorking || row.role === ERoles.ADMIN"
            @click="isDeletingUser = true"
          />
        </template>
      </ElTableColumn>
    </ElTable>

    <ElDialog v-model="isCreatingUser" title="Create User">
      <CreateAccount @cancel="isCreatingUser = false" />
    </ElDialog>

    <ElDialog v-model="isDeletingUser" title="Delete User">
      <ActionWarn
        @cancel="isDeletingUser = false"
        @confirm="handleDeleteUser"
        :loading="userState.isWorking"
      />
    </ElDialog>
  </div>

  <div v-else class="forbidden-msg">
    <small>You are not authorized to view this page.</small>
  </div>
</template>

<script setup lang="ts">
import useAuthStore from "@/stores/auth";
import useUserStore from "@/stores/user";
import type { IUser } from "@/types/auth/User";
import { ERoles } from "@/constants";

import CreateAccount from "./CreateAccount.vue";
import ActionWarn from "@/components/shared/action-warn.vue";

import { ElTable, ElTableColumn, ElButton, ElDialog, ElTag } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { onBeforeMount, ref } from "vue";

const { state: authState } = useAuthStore();
const { state: userState, fetchUsersList, deleteMemberAccount } = useUserStore();

const isCreatingUser = ref(false);
const isDeletingUser = ref(false);

async function handleDeleteUser(user: IUser) {
  if (!authState.isAdmin) {
    console.warn("Unauthorized attempt to delete user:", user);
    return; // Prevent unauthorized deletion
  }
  if (!user.id || user.role === "admin") {
    return; // Prevent deletion of admin accounts
  }

  try {
    await deleteMemberAccount(user.id);
    await fetchUsersList(); // Refresh the user list after deletion
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

onBeforeMount(fetchUsersList);
</script>

<style lang="scss" scoped>
.forbidden-msg {
  text-align: center;
  color: $status-error;
}

.admin_page {
  width: 100%;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      margin: 0;
    }
  }

  &-table {
    width: 100%;
    margin-top: 1rem;

    .el-table__body {
      tr {
        td {
          text-align: center;
        }
      }
    }
  }
}
</style>

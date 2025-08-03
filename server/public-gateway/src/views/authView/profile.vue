<template>
  <div class="profile_page">
    <h2 class="profile_page-header">My Profile</h2>

    <div v-if="profile">
      <ElCard>
        <template #header>
          <h3 class="profile_card-header">Profile Information</h3>
        </template>

        <div v-if="!isEditMode" class="profile_card-body">
          <p class="row"><strong>Phone Number:</strong> {{ profile.phoneNumber }}</p>
          <p class="row"><strong>User name:</strong> {{ profile.userName }}</p>
          <p class="row">
            <strong>Role:</strong>
            <ElTag type="primary" v-if="profile.role === ERoles.ADMIN">Admin</ElTag>
            <ElTag type="success" v-else>User</ElTag>
          </p>
          <p class="row"><strong>Created At:</strong> {{ createdDate }}</p>
        </div>

        <div v-else class="profile_card-body">
          <p class="row">
            <strong>Phone Number:</strong> <ElInput v-model="profile.phoneNumber" />
          </p>
          <p class="row"><strong>User name:</strong> <ElInput v-model="profile.userName" /></p>
          <p class="row">
            <strong>Role:</strong>
            <ElTag type="primary" v-if="profile.role === ERoles.ADMIN">Admin</ElTag>
            <ElTag type="success" v-else>User</ElTag>
          </p>
          <p class="row"><strong>Created At:</strong> {{ createdDate }}</p>

          <p class="row">
            <strong>New Password: <ElInput v-model="newPassword" /> </strong>
          </p>
        </div>

        <template #footer>
          <div v-if="!isEditMode" class="action-btn">
            <ElButton type="primary" @click="isEditMode = true">Edit Profile</ElButton>
          </div>

          <div v-else class="action-btn">
            <ElButton @click="isEditMode = false">Cancel</ElButton>
            <ElButton
              type="danger"
              @click="isDeletingAccount = true"
              :disabled="profile.role === ERoles.ADMIN"
            >
              Delete Account
            </ElButton>
            <ElButton
              type="primary"
              @click="saveChanges"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Save Changes
            </ElButton>
          </div>
        </template>
      </ElCard>

      <ElDialog v-model="isDeletingAccount" title="Delete account">
        <ActionWarn @cancel="isDeletingAccount = false" @confirm="deleteAccount" />
      </ElDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ERoles } from "@/constants";
import { provideProfile } from "@/contexts/useProfile";
import ActionWarn from "@/components/shared/action-warn.vue";

import { ElButton, ElCard, ElDialog, ElInput, ElTag } from "element-plus";
import { computed, ref } from "vue";

const {
  state: { profile, isLoading },
  updateProfile,
  deleteAccount,
} = provideProfile();

const isEditMode = ref(false);
const newPassword = ref<string | undefined>(undefined);
const isDeletingAccount = ref(false);

const createdDate = computed(() => {
  if (profile.value && profile.value?.createdAt) {
    return new Date(profile.value.createdAt).toLocaleDateString();
  }
  return "";
});

async function saveChanges() {
  await updateProfile(profile.value?.phoneNumber, newPassword.value);
  isEditMode.value = false;
}
</script>

<style lang="scss" scoped>
.profile_page {
  .profile_page-header {
    margin-bottom: 20px;
  }

  .profile_card-header {
    margin-bottom: 10px;
  }

  .profile_card-body {
    display: flex;
    flex-direction: column;

    .row {
      display: flex;
      gap: 8px;
      margin-bottom: 10px;

      strong {
        font-weight: bold;
        white-space: nowrap;
      }
    }
  }

  .action-btn {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    button {
      min-width: 100px;
    }
  }
}
</style>

<template>
  <div v-if="authState.isAdmin" class="auth">
    <ElCard style="width: 100%">
      <template #header>
        <div class="auth-card-header">
          <Icon icon="home" :size="48" />
          <h2>Deesnotes</h2>
        </div>
      </template>

      <div class="auth-card-body">
        <LabeledInput label="Phone number" required>
          <ElInput
            v-model="createAccountModel.phoneNumber"
            :disabled="userState.isWorking"
            placeholder="Enter your phone number"
            class="input"
            @blur="touched.phoneNumber = true"
          />
        </LabeledInput>
        <SmallErrMsg
          v-if="touched.phoneNumber && error.emptyPhoneNumber"
          :message="error.emptyPhoneNumber"
        />

        <LabeledInput label="Password" required>
          <ElInput
            v-model="createAccountModel.password"
            type="password"
            show-password
            :disabled="userState.isWorking"
            placeholder="Enter password"
            class="input"
            @blur="touched.password = true"
          />
        </LabeledInput>
        <SmallErrMsg
          v-if="touched.password && error.emptyPassword"
          :message="error.emptyPassword"
        />

        <LabeledInput label="Confirm password" required>
          <ElInput
            v-model="createAccountModel.confirmPassword"
            type="password"
            show-password
            :disabled="userState.isWorking"
            placeholder="Type password again"
            class="input"
            @keydown.enter="handleCreateAccount"
            @blur="touched.confirmPassword = true"
          />
        </LabeledInput>
        <SmallErrMsg
          v-if="touched.confirmPassword && error.emptyConfirmPassword"
          :message="error.emptyConfirmPassword"
        />
        <SmallErrMsg
          v-if="touched.confirmPassword && error.confirmPasswordMismatch"
          :message="error.confirmPasswordMismatch"
        />
      </div>

      <template #footer>
        <div class="auth-card-footer">
          <ElButton type="default" @click="$emit('cancel')" :disabled="userState.isWorking" plain>
            Cancel
          </ElButton>
          <ElButton
            type="primary"
            :disabled="!isFormValid"
            :loading="userState.isWorking"
            plain
            @click="handleCreateAccount"
          >
            Create
          </ElButton>
        </div>
      </template>
    </ElCard>
  </div>

  <div v-else class="auth">
    <ElCard>
      <template #header>
        <div class="auth-card-header">
          <Icon icon="home" :size="48" />
          <h2>Deesnotes</h2>
        </div>
      </template>

      <div class="auth-card-body">
        <p>You are not authorized to create an account.</p>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import useAuthStore from "@/stores/auth";
import useUserStore from "@/stores/user";

import Icon from "@/components/shared/icon.vue";
import LabeledInput from "@/components/shared/labeled-input.vue";
import SmallErrMsg from "@/components/shared/small-err-msg.vue";

import { ElCard, ElInput, ElButton } from "element-plus";
import { reactive } from "vue";

const { state: authState } = useAuthStore();
const { state: userState, createUser } = useUserStore();

const emits = defineEmits(["cancel"]);

const createAccountModel = reactive({
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const error = reactive({
  emptyPhoneNumber: "",
  emptyPassword: "",
  emptyConfirmPassword: "",
  confirmPasswordMismatch: "",
});

const touched = reactive({
  phoneNumber: false,
  password: false,
  confirmPassword: false,
});

const isFormValid = () => {
  error.emptyPhoneNumber = createAccountModel.phoneNumber ? "" : "Phone number is required";
  error.emptyPassword = createAccountModel.password ? "" : "Password is required";
  error.emptyConfirmPassword = createAccountModel.confirmPassword
    ? ""
    : "Confirm password is required";

  if (createAccountModel.password !== createAccountModel.confirmPassword) {
    error.confirmPasswordMismatch = "Passwords do not match";
  } else {
    error.confirmPasswordMismatch = "";
  }

  return Object.values(error).every((msg) => !msg);
};

async function handleCreateAccount() {
  Object.keys(touched).forEach((key) => {
    // @ts-ignore
    touched[key] = true;
  });

  if (!isFormValid() || !authState.isAdmin) {
    return;
  }

  await createUser(
    createAccountModel.phoneNumber,
    createAccountModel.password,
    createAccountModel.confirmPassword,
  );
  emits("cancel");
}
</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .auth {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.auth {
  &-card {
    &-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;

      .input {
        min-width: 240px;
      }
    }

    &-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }
}
</style>

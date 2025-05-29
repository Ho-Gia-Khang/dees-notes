<template>
  <div class="auth">
    <ElCard>
      <template #header>
        <div class="auth-card-header">
          <Icon icon="home" :size="48" />
          <h2>Deesnotes</h2>
        </div>
      </template>

      <div class="auth-card-body">
        <LabeledInput label="Phone number" required>
          <ElInput
            v-model="loginModel.phoneNumber"
            placeholder="Enter your phone number"
            class="input"
          />
        </LabeledInput>

        <LabeledInput label="Password" required>
          <ElInput
            v-model="loginModel.password"
            type="password"
            show-password
            placeholder="Enter password"
            class="input"
            @keydown.enter="handleLogin"
          />
        </LabeledInput>
      </div>

      <template #footer>
        <div class="auth-card-footer">
          <ElButton type="primary" plain @click="handleLogin">Login</ElButton>
          <ElButton link>Forgot password?</ElButton>
        </div>
      </template>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElInput, ElButton } from "element-plus";
import Icon from "@/components/shared/icon.vue";
import LabeledInput from "@/components/shared/labeled-input.vue";
import { reactive } from "vue";
import useAuthStore from "@/stores/auth";

const loginModel = reactive({
  phoneNumber: "",
  password: "",
});

const { login } = useAuthStore();

async function handleLogin() {
  try {
    await login(loginModel.phoneNumber, loginModel.password);
    window.open("/", "_self");
  } catch (error) {
    console.error("Login failed:", error);
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .auth {
    min-height: 100vh;
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

      .input {
        min-width: 240px;
      }
    }

    &-footer {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>

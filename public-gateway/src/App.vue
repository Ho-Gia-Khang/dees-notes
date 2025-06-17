<template>
  <div v-if="state.isAuthenticated" class="main-layout">
    <Nav />
    <div>
      <Header />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>

  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "./components/main/header.vue";
import Nav from "./components/main/nav.vue";
import useAuthStore from "./stores/auth";

const { state } = useAuthStore();
</script>

<style scoped lang="scss">
.main-layout {
  padding: 1.5%;
  display: grid;
  height: 96%;
  grid-template-columns: min-content 1fr;
  overflow: auto;

  .main-content {
    padding: $header-padding 0 0 $header-padding;
    height: 90%;
  }
}
</style>

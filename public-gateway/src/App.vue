<template>
  <div class="main-layout">
    <Nav />
    <div>
      <Header />
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Nav from "./components/main/nav.vue";
import Header from "./components/main/header.vue";
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

<template>
  <div class="main-layout">
    <Nav />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Nav from "./components/main/nav.vue";
</script>

<style scoped lang="scss">
.main-layout {
  padding: 1.5%;
  display: grid;
  height: 96%;
  grid-template-columns: min-content 1fr;
  overflow: auto;
}
</style>

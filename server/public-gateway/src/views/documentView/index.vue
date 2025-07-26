<template>
  <Documents v-if="isAtRoot" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Documents from "@/components/documents/index.vue";

const route = useRoute();

const isAtRoot = computed(() => {
  return route.path === "/documents";
});
</script>

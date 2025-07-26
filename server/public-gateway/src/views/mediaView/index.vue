<template>
  <Media v-if="isAtRoot" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import Media from "@/components/media/index.vue";
import { computed } from "vue";

const route = useRoute();

const isAtRoot = computed(() => {
  return route.path === "/media";
});
</script>

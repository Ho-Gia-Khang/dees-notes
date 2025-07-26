<template>Media Player view</template>

<script setup lang="ts">
import useMediaStore from "@/stores/media";
import { onBeforeMount } from "vue";

const { goToPlayer } = useMediaStore();

onBeforeMount(() => {
  goToPlayer();
});
</script>

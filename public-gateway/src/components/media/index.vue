<template>
  <ServiceTemplate :items="serviceItems" />
</template>

<script setup lang="ts">
import { ENavLevel, type INavItem } from "@/types/main/navItem";
import ServiceTemplate from "../shared/service-template.vue";

const serviceItems: INavItem[] = [
  {
    label: "Player",
    to: "/media/player",
    description: "Media player implemented by Jellyfin.",
    level: ENavLevel.LEVEL_2,
    icon: "player",
  },
  {
    label: "Upload",
    to: "/media/upload",
    description: "Upload and manage media files.",
    level: ENavLevel.LEVEL_2,
    icon: "upload",
  },
];
</script>

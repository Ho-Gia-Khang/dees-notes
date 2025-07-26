<template>
  <ServiceTemplate :items="serviceItems" />
</template>

<script setup lang="ts">
import { ENavLevel, type INavItem } from "@/types/main/navItem";
import ServiceTemplate from "../shared/service-template.vue";

const serviceItems: INavItem[] = [
  {
    label: "Library",
    to: "/documents/library",
    description: "View and edit your documents and notes",
    level: ENavLevel.LEVEL_2,
    icon: "library",
  },
  {
    label: "Editor",
    to: "/documents/editor",
    description: "Create new documents",
    level: ENavLevel.LEVEL_2,
    icon: "editor",
  },
];
</script>

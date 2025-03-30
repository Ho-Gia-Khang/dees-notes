<template>
  <img :src="src" :height="size" :width="size" alt="icon" />
</template>

<script setup lang="ts">
import type { Icon } from "@/types/shared/common";
import { computed, type PropType } from "vue";

const props = defineProps({
  icon: {
    type: String as PropType<Icon>,
    required: true,
  },
  size: {
    type: Number,
    default: 24,
  },
});

const src = computed(() => `/icons/${props.icon}.svg`);
</script>

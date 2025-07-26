<template>
  <div class="logger">
    <div v-for="log in logs" :key="log.time" class="log-entry">
      <span class="log-actor">{{ log.actor }} </span>
      <span> has uploaded the file </span>
      <span class="log-file">{{ log.fileName }}</span>
      <span> at </span>
      <span class="log-time">{{ log.time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  logs: Array<{
    actor: string;
    fileName: string;
    time: string;
  }>;
}>();
</script>

<style scoped lang="scss">
.logger {
  padding: 10px;
  width: 100%;
  background-color: #e5e5e5;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;

  .log-entry {
    margin-bottom: 8px;
    font-size: 14px;

    .log-actor {
      font-weight: bold;
    }

    .log-file {
      color: #007bff;
    }

    .log-time {
      color: #888;
    }
  }
}
</style>

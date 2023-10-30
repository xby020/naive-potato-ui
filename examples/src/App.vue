<template>
  <div class="w-screen h-screen bg-dark-400 flex justify-center items-center">
    <n-message-provider>
      <content />
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import { NMessageProvider } from 'naive-ui';
import Content from './components/Content.vue';
</script>

<style scoped></style>

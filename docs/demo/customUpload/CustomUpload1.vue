<template>
  <div class="w-full h-full flex flex-col">
    <np-custom-upload v-model:value="files" type="text"></np-custom-upload>
  </div>
</template>

<script setup lang="ts">
import { NpCustomUpload } from '@naive-potato-ui/ui';
import { ref } from 'vue';

const files = ref();
</script>

<style scoped></style>

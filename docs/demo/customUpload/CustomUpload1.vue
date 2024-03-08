<template>
  <div class="w-full h-full flex flex-col">
    <np-custom-upload
      :headers="{
        Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMDAwNCwidXNlcm5hbWUiOiJRRFNKWlgiLCJleHAiOjE3MTIzNzQ3ODF9.9X-Zb4_ZNUA5FYTbCMnrGAhzEBTfc8P8kadnrQojOtI`,
      }"
      action="http://localhost:14514/api/storage/file"
      v-model:value="files"
      type="text"
      multiple
    ></np-custom-upload>
  </div>
</template>

<script setup lang="ts">
import { NpCustomUpload } from '@naive-potato-ui/ui';
import { ref } from 'vue';

const files = ref();
</script>

<style scoped></style>

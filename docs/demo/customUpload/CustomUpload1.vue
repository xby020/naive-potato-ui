<template>
  <div class="w-full h-full flex flex-col">
    <np-custom-upload
      :headers="{
        Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYTY4ZTUxYWU3MjE1NDQ2MWE1NWY3ZWEyZDgzNWIzMzAiLCJyb2xlIjoyMCwiZXhwIjoxNzE3NDcxMjc2fQ.RCSSuYteYZNBLRgY4yoPPu4VrsVGsVp4GIy23imaI58`,
      }"
      action="http://localhost:14514/api/v1/basic/upload-file"
      v-model:value="files"
      type="text"
      :is-error-state="
        (res) => {
          if (res.code !== 200) {
            console.error(res);
            return true;
          } else {
            return false;
          }
        }
      "
      multiple
    ></np-custom-upload>

    <div class="mt-4">
      <p>{{ files }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NpCustomUpload } from '@naive-potato-ui/ui';
import { ref } from 'vue';

const files = ref();
</script>

<style scoped></style>

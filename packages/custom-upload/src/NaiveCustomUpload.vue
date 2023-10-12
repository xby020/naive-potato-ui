<template>
  <n-upload
    :accept="accept"
    :action="action"
    :headers="headers"
    :data="extraData"
    :list-type="type || 'text'"
    :max="max"
    :multiple="multiple"
    v-model:file-list="uploadFileList"
  >
    <n-button>{{ props.label || '上传文件' }}</n-button>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { computed } from 'vue';

interface Props {
  value: UploadFileInfo[];
  label?: string;
  info?: Record<string, any>;
  accept?: string;
  action?: string;
  headers?: Record<string, string>;
  extraData?: Record<string, string>;
  disabled?: boolean;
  type?: 'text' | 'image' | 'image-card';
  max?: number;
  multiple?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  'update:value': [value: UploadFileInfo[]];
}>();

const uploadFileList = computed({
  get() {
    return props.value;
  },
  set(val: UploadFileInfo[]) {
    emits('update:value', val);
  },
});
</script>

<style scoped></style>

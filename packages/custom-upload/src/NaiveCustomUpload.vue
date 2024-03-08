<template>
  <n-upload
    :accept="accept"
    :action="action"
    :headers="headers"
    :data="extraData"
    :list-type="type || 'text'"
    :max="max"
    :multiple="multiple"
    v-model:file-list="fileList"
    @finish="handleFinish"
    @remove="handleRemove"
  >
    <component v-if="isVNode(props.label)" :is="props.label"></component>
    <n-button v-else>{{ label || '上传文件' }}</n-button>
    <n-text v-if="tips">
      {{ tips }}
    </n-text>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload, NButton, NText } from 'naive-ui';
import type { UploadFileInfo } from 'naive-ui';
import { isVNode } from 'vue';
import { ref, onMounted, watch, Ref, VNode } from 'vue';

interface Props {
  value?: Record<string, any>[];
  label?: string | VNode;
  info?: Record<string, any>;
  tips?: string;
  accept?: string;
  action?: string;
  headers?: Record<string, string>;
  extraData?: Record<string, string>;
  disabled?: boolean;
  type?: 'text' | 'image' | 'image-card';
  max?: number;
  multiple?: boolean;
  infoSet?: (infoList: Record<string, any>) => UploadFileInfo;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  'update:value': [value: Record<string, any>[]];
}>();

const fileList: Ref<UploadFileInfo[]> = ref([]);

// for edit
onMounted(() => {
  fileList.value =
    props.value?.map((item) => {
      return props.infoSet
        ? props.infoSet(item)
        : {
            id: item.id || item.uuid,
            name: item.name,
            status: 'finished',
            url: item.url || item.path,
          };
    }) || [];
});

const fileInfos = new Map<string, Record<string, any>>();
watch(fileList, () => {
  // all response
  const fileInfoList = Array.from(fileInfos.values());

  emits('update:value', fileInfoList);
});

// handle upload finished
function handleFinish(options: {
  file: UploadFileInfo;
  event?: ProgressEvent;
}) {
  const result = options.event?.target as XMLHttpRequest;
  const res = JSON.parse(result.response) as Record<string, any>;

  fileInfos.set(options.file.id, res);

  const newFile = { ...options.file, url: res.url };

  return newFile;
}

// handle remove
function handleRemove(options: {
  file: UploadFileInfo;
  fileList: Array<UploadFileInfo>;
}) {
  fileInfos.delete(options.file.id);
  fileList.value = options.fileList;
}
</script>

<style scoped></style>

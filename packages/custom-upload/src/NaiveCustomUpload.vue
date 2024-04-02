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
    :is-error-state="isErrorState"
    :custom-request="customRequest"
    @finish="handleFinish"
    @remove="handleRemove"
    @change="handleChange"
  >
    <component v-if="isVNode(props.label)" :is="props.label"></component>
    <div class="flex flex-col gap-2" v-else>
      <n-button>{{ label || '上传文件' }}</n-button>
      <n-text v-if="tips" class="text-12px text-opacity-80">
        {{ tips }}
      </n-text>
    </div>
  </n-upload>
</template>

<script setup lang="ts">
import { NUpload, NButton, NText } from 'naive-ui';
import type { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui';
import { FileInfo } from 'naive-ui/es/upload/src/interface';
import { isVNode } from 'vue';
import { ref, Ref, VNode, reactive } from 'vue';

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
  infoSet?: (infoList: Record<string, any> | string | number) => UploadFileInfo;
  infoGet?: (
    infoRes: Record<string, any> | string | number,
  ) => Record<string, any> | string | number;
  isErrorState?: (xhr: XMLHttpRequest) => boolean;
  customRequest?: (options: UploadCustomRequestOptions) => void;
}

const props = defineProps<Props>();

const fileInfos = reactive<{
  [key: string]: Record<string, any> | string | number;
}>({});

const emits = defineEmits<{
  'update:value': [value: Record<string, any> | string | number[]];
}>();

const defaultFileInfo =
  props.value && props.value.length !== 0
    ? props.value?.map((item) => {
        const fileItem = props.infoSet
          ? props.infoSet(item)
          : ({
              id: item.id || item.uuid,
              name: item.name,
              status: 'finished',
              url: item.url || item.path,
            } as FileInfo);

        // fileInfos.set(fileItem.id, item);
        if (fileItem) {
          if (fileItem.id) {
            fileInfos[fileItem.id] = item;
          } else {
            console.error('fileItem.id is undefined', fileItem);
          }
        }

        return fileItem;
      })
    : undefined;

const fileList: Ref<UploadFileInfo[] | undefined> = ref(defaultFileInfo);

function handleChange(options: {
  file: UploadFileInfo;
  fileList: Array<UploadFileInfo>;
  event?: Event;
}) {
  const fileInfoList = Object.values(fileInfos);
  emits('update:value', fileInfoList);
}

// handle upload finished
function handleFinish(options: {
  file: UploadFileInfo;
  event?: ProgressEvent;
}) {
  const result = options.event?.target as XMLHttpRequest;
  const res = JSON.parse(result.response) as Record<string, any>;

  const results = props.infoGet ? props.infoGet(res) : res;

  // fileInfos.set(options.file.id, results);
  fileInfos[options.file.id] = results;

  const newFile = { ...options.file, url: res.url };

  return newFile;
}

// handle remove
function handleRemove(options: {
  file: UploadFileInfo;
  fileList: Array<UploadFileInfo>;
}) {
  // fileInfos.delete(options.file.id);
  delete fileInfos[options.file.id];
  fileList.value = options.fileList;
}
</script>

<style scoped></style>

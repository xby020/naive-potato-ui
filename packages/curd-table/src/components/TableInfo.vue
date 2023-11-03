<template>
  <n-descriptions
    class="w-full"
    :style="{ width: widthStyle }"
    bordered
    label-placement="left"
    :column="cols"
  >
    <n-descriptions-item
      v-for="(item, index) in tableHeaders"
      :key="index"
      :label="getTitle(item)"
    >
      <table-info-item
        :info="info"
        :label="getTitle(item)"
        :type="getType(item)"
        :field="getField(item)"
        :option="getOption(item)"
      ></table-info-item>
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import {
  NCurdTableHeader,
  NCurdTableHeaderType,
} from '../../../../types/nCurdTable';
import { NDescriptions, NDescriptionsItem } from 'naive-ui';
import { computed } from 'vue';
import { getConfigWithBoolean } from './NaiveCurdTableTools';
import TableInfoItem from './TableInfoItem.vue';

interface Props {
  headers: NCurdTableHeader[];
  cols?: number;
  widthStyle?: string;
  info: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  widthStyle: '50%',
});

const tableHeaders = computed(() => {
  return props.headers.filter((item) => {
    if (typeof item.info === 'boolean') {
      return item;
    } else {
      return item.info?.show;
    }
  });
});

function getTitle(header: NCurdTableHeader) {
  return getConfigWithBoolean(header, 'info', 'title') as string;
}
function getType(header: NCurdTableHeader) {
  return getConfigWithBoolean(header, 'info', 'type') as NCurdTableHeaderType;
}
function getField(header: NCurdTableHeader) {
  return getConfigWithBoolean(header, 'info', 'key') as string;
}
function getOption(header: NCurdTableHeader) {
  const config = getConfigWithBoolean(header, 'info', 'defaultConfig') as any;
  return config;
}
</script>

<style scoped></style>

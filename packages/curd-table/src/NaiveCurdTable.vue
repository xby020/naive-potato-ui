<template>
  <div class="w-full h-full flex flex-col gap-2">
    <!-- Header -->
    <div class="w-full flex justify-between items-center gap-4">
      <!-- Query -->
      <div class="flex-auto grid grid-cols-3"></div>

      <!-- Action -->
      <div class="flex justify-center items-center gap-2 flex-nowrap">
        <slot name="prefix-action"></slot>

        <!-- reset -->
        <n-button type="default">重置</n-button>

        <!-- query -->
        <n-button type="info">查询</n-button>

        <!-- create -->
        <n-button type="success">新增</n-button>
        <slot name="suffix-action"></slot>
      </div>
    </div>

    <!-- Table -->
    <n-data-table></n-data-table>
  </div>
</template>

<script setup lang="ts" generic="TForm,TInfo">
import { NDataTable } from 'naive-ui';
import type { NCurdTableHeader } from '../../../types/nCurdTable';
import { VNode } from 'vue';

interface Props {
  prefixAction?: (uuid: any) => VNode[] | VNode;
  suffixAction?: (uuid: any) => VNode[] | VNode;
  paginate?: boolean;
  pageSize?: number;
  headers: NCurdTableHeader<TForm, TInfo>[];
  hideColumnEdit?: boolean;
  hideColumnDetail?: boolean;
  hideColumnDelete?: boolean;
  query: (params: any) => Promise<any>;
  queryDetail: (params: any) => Promise<any>;
  delete?: (params: any) => Promise<any>;
  create?: (params: any) => Promise<any>;
  update?: (uuid: string, params: any) => Promise<any>;
  choosen: string;
  fullScreenDrawer?: boolean;
  scrollX?: number;
  cols?: number;
  tableFormStyle?: Record<string, any>;
  editable?: (info: any) => boolean;
  detailable?: (info: any) => boolean;
  deletable?: (info: any) => boolean;
  rowKey?: (row: any) => any;
  hideCreate?: boolean;
  rowKeyDisable?: (info: any) => boolean;
}

const props = defineProps<Props>();
</script>

<style scoped></style>

<template>
  <n-form
    ref="tableFormRef"
    class="h-full"
    :style="{
      width: widthStyle,
    }"
    :model="form"
    :rules="rules"
  >
    <n-grid :cols="cols" :x-gap="24">
      <n-form-item-gi
        v-for="(header, headerIndex) in tableHeaders"
        :key="headerIndex"
        :label="getTitle(header)"
        label-placement="top"
        :path="getField(header)"
      >
        <table-edit-item
          v-model:value="props.form[getField(header)]"
          :label="getTitle(header)"
          :type="getType(header)"
          :form="props.form"
          :field="getField(header)"
          :info="props.info"
          :option="getOption(header)"
        ></table-edit-item>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { NCurdTableHeader, NCurdTableHeaderType } from '@dts/nCurdTable';
import { NForm, NGrid, NFormItemGi } from 'naive-ui';
import TableEditItem from './TableEditItem.vue';
import { computed, ref } from 'vue';
import { getConfigWithBoolean } from './NaiveCurdTableTools';

interface Props {
  form: Record<string, any>;
  headers: NCurdTableHeader[];
  mode: 'create' | 'edit';
  cols?: number;
  widthStyle?: string;
  info?: Record<string, any>;
  rules?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  widthStyle: '50%',
});

// From
const tableFormRef = ref();
const tableHeaders = computed(() => {
  return props.headers.filter((item) => {
    if (typeof item.create === 'boolean') {
      return item;
    } else {
      return item.create?.show;
    }
  });
});

function getTitle(header: NCurdTableHeader) {
  return getConfigWithBoolean(header, props.mode, 'title') as string;
}
function getType(header: NCurdTableHeader) {
  return getConfigWithBoolean(
    header,
    props.mode,
    'type',
  ) as NCurdTableHeaderType;
}
function getField(header: NCurdTableHeader) {
  return getConfigWithBoolean(header, props.mode, 'key') as string;
}
function getOption(header: NCurdTableHeader) {
  const config = getConfigWithBoolean(
    header,
    props.mode,
    'defaultConfig',
  ) as any;
  return config;
}

function validate() {
  return tableFormRef.value?.validate();
}

defineExpose({
  validate,
});
</script>

<style scoped></style>

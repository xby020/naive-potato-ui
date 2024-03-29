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
import { NCurdTableHeader, NCurdTableHeaderType } from '../types/curdTable';
import { NForm, NGrid, NFormItemGi, FormRules } from 'naive-ui';
import TableEditItem from './TableEditItem.vue';
import { computed, ref } from 'vue';
import {
  getConfigWithBoolean,
  getOptionWithBoolean,
} from './NaiveCurdTableTools';

interface Props {
  form: Record<string, any>;
  headers: NCurdTableHeader<any>[];
  mode: 'create' | 'edit';
  cols?: number;
  widthStyle?: string;
  info?: Record<string, any>;
  rules?: FormRules;
}

const props = withDefaults(defineProps<Props>(), {
  cols: 1,
  widthStyle: '50%',
});

// From
const tableFormRef = ref();
const tableHeaders = computed(() => {
  return props.headers.filter((item) => {
    const itemMode = item[props.mode];
    if (typeof itemMode === 'boolean') {
      return item;
    } else if (typeof itemMode === 'object') {
      const isShow = itemMode?.show;
      // active
      const isActive = getActive(item);
      return isShow && isActive;
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
  const config = getOptionWithBoolean(header, props.mode);
  return config;
}
function getActive(header: NCurdTableHeader) {
  const options = getOptionWithBoolean(header, props.mode);
  const activeFn = options?.active || header.defaultConfig?.active;
  return activeFn ? activeFn(props.form, props.info) : true;
}

function validate() {
  return tableFormRef.value?.validate();
}

defineExpose({
  validate,
});
</script>

<style scoped></style>

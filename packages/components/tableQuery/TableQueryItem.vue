<template>
  <!-- type:input -->
  <n-input
    v-if="type === 'input' || type === 'inputArea'"
    :type="type === 'inputArea' ? 'textarea' : 'text'"
    v-model:value="queryForm[key]"
  />
  <!-- type:select/multSelect -->
  <n-select
    v-if="type === 'select' || type === 'multSelect'"
    v-model:value="queryForm[key]"
    clearable
    :multiple="type === 'multSelect'"
    :options="option ? option() : []"
    class="min-w-12"
  />
  <!-- type:date -->
  <n-date-picker
    v-if="type === 'date' || type === 'datetime'"
    v-model:formatted-value="queryForm[key]"
    :value-format="format"
    :type="type === 'date' ? 'date' : 'datetime'"
    clearable
  ></n-date-picker>
  <!-- type:custom -->
  <component
    v-if="type === 'custom' && render"
    :is="render(queryForm)"
  ></component>
</template>

<script setup lang="ts" generic="T">
import { NaiveCurdTableInputType } from '../../types/naiveCurdTableProps';

interface Props {
  type?: NaiveCurdTableInputType;
  value?: T;
  config?: any;
  form?: any;
  render?: (queryForm: any) => any;
}
</script>

<style scoped></style>

<template>
  <div class="w-full h-full">
    <!-- text -->
    <n-input
      v-if="type === 'text'"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      clearable
      :disabled="isDisabled()"
    >
      <template #prefix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
    </n-input>
    <!-- textarea -->
    <n-input
      v-if="type === 'textarea'"
      type="textarea"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      clearable
      :disabled="isDisabled()"
    >
    </n-input>

    <!-- password -->
    <n-input
      v-if="type === 'password'"
      type="password"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      clearable
      :disabled="isDisabled()"
    >
      <template #prefix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
    </n-input>

    <!-- number -->
    <n-input-number
      v-if="type === 'number'"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      :show-button="option?.config.showButton || false"
      clearable
      :disabled="isDisabled()"
    >
      <template #prefix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="option?.config.prefix"
          :is="option.config.prefix()"
        ></component>
      </template>
    </n-input-number>

    <!-- select -->
    <n-select
      v-if="type === 'select' || type === 'multSelect'"
      v-model:value="formValue"
      :placeholder="`请选择${label}`"
      clearable
      :disabled="isDisabled()"
      :options="option?.config.options"
      :label-field="option?.config.labelField || 'label'"
      :value-field="option?.config.valueField || 'value'"
      :multiple="type === 'multSelect'"
    />

    <!-- asyncSelect -->
    <n-async-select
      v-if="type === 'asyncSelect'"
      v-model:value="formValue"
      :placeholder="`请选择${label}或输入查询`"
      :disabled="isDisabled()"
      :label-field="option?.config.labelField || 'label'"
      :value-field="option?.config.valueField || 'value'"
      :query-field="option?.config.queryField"
      :query="option?.config.query"
      :multiple="option?.config.multiple || false"
    ></n-async-select>
  </div>
</template>

<script setup lang="ts">
import type {
  NCurdTableHeaderRenderOptions,
  NCurdTableHeaderType,
} from '@dts/nCurdTable';
import { NInput, NInputNumber, NSelect } from 'naive-ui';
import { computed } from 'vue';
import NAsyncSelect from '@naive-potato-ui/async-select';

interface Props {
  label: string;
  type: NCurdTableHeaderType;
  value: any;
  info?: Record<string, any>;
  option?: NCurdTableHeaderRenderOptions<any, any>;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  'update:value': [value: any];
}>();

const formValue = computed({
  get() {
    return props.value;
  },
  set(value) {
    emits('update:value', value);
  },
});

// Disabled
function isDisabled() {
  return props.option?.disabled
    ? props.option.disabled(props.value, props.info)
    : false;
}
</script>

<style scoped></style>

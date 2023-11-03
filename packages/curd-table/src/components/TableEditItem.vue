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
          v-if="option?.config.suffix"
          :is="option.config.suffix()"
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

    <!-- radio -->
    <n-radio-group
      v-if="type === 'asyncSelect'"
      v-model:value="formValue"
      :name="label"
      :disabled="isDisabled()"
    >
      <n-radio
        v-for="(item, index) in option?.config.options"
        :key="index"
        :value="item[option?.config.valueField || 'value']"
      >
        {{ item[option?.config.labelField || 'label'] }}
      </n-radio>
    </n-radio-group>

    <!-- 'date' | 'datetime' -->
    <n-date-picker
      v-if="['date', 'datetime'].includes(type) && !option?.config?.range"
      v-model:formatted-value="formValue"
      :value-format="option?.config.format"
      :type="type === 'date' ? 'date' : 'datetime'"
    />
    <n-date-picker
      v-if="['date', 'datetime'].includes(type) && option?.config?.range"
      v-model:formatted-value="dateRangeValue"
      :value-format="option?.config.format"
      :type="type === 'date' ? 'date' : 'datetime'"
    />

    <!-- time -->
    <n-time-picker
      v-if="type === 'time'"
      v-model:formatted-value="formValue"
      :value-format="option?.config.format"
    />

    <!-- upload -->
    <n-custom-upload
      v-if="type === 'upload'"
      v-model:value="formValue"
      :label="option?.config.label"
      :accept="option?.config.accept"
      :info="info"
      :action="option?.config.action"
      :headers="option?.config.headers"
      :extra-data="option?.config.extraData"
      :disabled="isDisabled()"
      :type="option?.config.type"
      :max="option?.config.max"
      :multiple="option?.config.multiple"
    ></n-custom-upload>

    <!-- custom -->
    <component
      v-if="type === 'custom'"
      v-model:value="formValue"
      :is="option?.render ? option?.render(form, info) : ''"
      :config="option?.config"
    ></component>
  </div>
</template>

<script setup lang="ts">
import type {
  NCurdTableHeaderRenderOptions,
  NCurdTableHeaderType,
} from '../../../../types/nCurdTable';
import {
  NInput,
  NInputNumber,
  NSelect,
  NRadioGroup,
  NRadio,
  NDatePicker,
  NTimePicker,
} from 'naive-ui';
import { computed } from 'vue';
import NAsyncSelect from '@naive-potato-ui/async-select';
import NCustomUpload from '@naive-potato-ui/custom-upload';

interface Props {
  label: string;
  type: NCurdTableHeaderType;
  form?: Record<string, any>;
  field: string;
  value: any;
  info?: Record<string, any>;
  option?: NCurdTableHeaderRenderOptions<any, any>;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  'update:form': [value: Record<string, any>];
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
    ? props.option.disabled(formValue, props.info)
    : false;
}

// Date Range
const dateRangeValue = computed({
  get() {
    return [
      formValue.value[props.option?.config?.startField || 'start'],
      formValue.value[props.option?.config?.endField || 'start'],
    ] as [string, string];
  },
  set(v: [string, string]) {
    formValue.value[props.option?.config?.startField || 'start'] = v[0];
    formValue.value[props.option?.config?.endField || 'start'] = v[1];
  },
});
</script>

<style scoped></style>

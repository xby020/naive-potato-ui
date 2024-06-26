<template>
  <div class="w-full h-full">
    <!-- text -->
    <n-input
      v-if="type === 'text'"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      clearable
      :disabled="isDisabled"
    >
      <template #prefix>
        <component
          v-if="optionConfig?.prefix"
          :is="optionConfig.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="optionConfig?.suffix"
          :is="optionConfig.suffix()"
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
      :disabled="isDisabled"
    >
    </n-input>

    <!-- password -->
    <n-input
      v-if="type === 'password'"
      type="password"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      clearable
      :disabled="isDisabled"
    >
      <template #prefix>
        <component
          v-if="optionConfig?.prefix"
          :is="optionConfig.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="optionConfig?.prefix"
          :is="optionConfig.prefix()"
        ></component>
      </template>
    </n-input>

    <!-- number -->
    <n-input-number
      v-if="type === 'number'"
      v-model:value="formValue"
      :placeholder="`请输入${label}`"
      :show-button="optionConfig?.showButton || false"
      clearable
      :disabled="isDisabled"
    >
      <template #prefix>
        <component
          v-if="optionConfig?.prefix"
          :is="optionConfig.prefix()"
        ></component>
      </template>
      <template #suffix>
        <component
          v-if="optionConfig?.suffix"
          :is="optionConfig.suffix()"
        ></component>
      </template>
    </n-input-number>

    <!-- select -->
    <n-select
      v-if="type === 'select' || type === 'multSelect'"
      v-model:value="formValue"
      :placeholder="`请选择${label}`"
      clearable
      :disabled="isDisabled"
      :options="optionConfig?.options"
      :label-field="optionConfig?.labelField || 'label'"
      :value-field="optionConfig?.valueField || 'value'"
      :multiple="type === 'multSelect'"
    />

    <!-- asyncSelect -->
    <np-async-select
      v-if="type === 'asyncSelect'"
      v-model:value="formValue"
      :placeholder="`请选择${label}或输入查询`"
      :disabled="isDisabled"
      :label-field="optionConfig?.labelField || 'label'"
      :value-field="optionConfig?.valueField || 'value'"
      :query-field="optionConfig?.queryField"
      :query="optionConfig?.query"
      :multiple="optionConfig?.multiple || false"
    ></np-async-select>

    <!-- radio -->
    <n-radio-group
      v-if="type === 'radio'"
      v-model:value="formValue"
      :name="label"
      :disabled="isDisabled"
    >
      <n-radio
        v-for="(item, index) in optionConfig?.options"
        :key="index"
        :value="item[optionConfig?.valueField || 'value']"
      >
        {{ item[optionConfig?.labelField || 'label'] }}
      </n-radio>
    </n-radio-group>

    <!-- 'date' | 'datetime' -->
    <n-date-picker
      v-if="['date', 'datetime'].includes(type) && !optionConfig?.range"
      :disabled="isDisabled"
      v-model:formatted-value="formValue"
      :value-format="optionConfig?.format"
      :type="type === 'date' ? 'date' : 'datetime'"
      :shortcuts="optionConfig?.shortcuts"
    />
    <n-date-picker
      v-if="['date', 'datetime'].includes(type) && optionConfig?.range"
      :disabled="isDisabled"
      v-model:formatted-value="dateRangeValue"
      :value-format="optionConfig?.format"
      :type="type === 'date' ? 'daterange' : 'datetimerange'"
      :shortcuts="optionConfig?.shortcuts"
    />

    <!-- time -->
    <n-time-picker
      v-if="type === 'time'"
      :disabled="isDisabled"
      v-model:formatted-value="formValue"
      :value-format="optionConfig?.format"
      :shortcuts="optionConfig?.shortcuts"
    />

    <!-- upload -->
    <np-custom-upload
      v-if="type === 'upload'"
      v-model:value="uploadValue"
      :label="optionConfig?.label"
      :accept="optionConfig?.accept"
      :tips="optionConfig?.tips"
      :info="info"
      :action="optionConfig?.action"
      :headers="optionConfig?.headers"
      :extra-data="optionConfig?.extraData"
      :disabled="isDisabled"
      :type="optionConfig?.type"
      :max="optionConfig?.max"
      :multiple="optionConfig?.multiple"
      :info-set="optionConfig?.parse?.set"
      :info-get="optionConfig?.parse?.get"
      :is-error-state="optionConfig?.isErrorState"
      :custom-request="optionConfig?.customRequest"
    ></np-custom-upload>

    <!-- custom -->
    <component
      v-if="type === 'custom'"
      v-model:value="formValue"
      :is="optionRender(form, info)"
      :config="optionConfig"
    ></component>
  </div>
</template>

<script setup lang="ts">
import type {
  NCurdTableHeaderRenderOptions,
  NCurdTableHeaderType,
} from '../types/curdTable';
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
import { NpAsyncSelect } from '@naive-potato-ui/async-select';
import { NpCustomUpload } from '@naive-potato-ui/custom-upload';
import { h } from 'vue';

interface Props {
  label: string;
  type: NCurdTableHeaderType;
  form?: Record<string, any>;
  field: string | number | symbol;
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

// option render
const optionConfig = computed(() => {
  return props.option?.config;
});
const optionRender = computed(() => {
  return props.option?.render
    ? props.option?.render
    : (TForm: any, TInfo: any) => h('div', {}, props.value);
});

// Disabled
const isDisabled = computed(() => {
  const isDisabledFn = props.option?.disabled;
  if (isDisabledFn) {
    return isDisabledFn(props.form, props.info);
  } else {
    return false;
  }
});

// Date Range
const dateRangeValue = computed<[string, string] | null>({
  get(): [string, string] | null {
    const startField = props.option?.config?.startField || 'start';
    const endField = props.option?.config?.endField || 'end';

    if (props.form && props.form[startField] && props.form[endField]) {
      return [props.form[startField], props.form[endField]] as [string, string];
    } else {
      return null;
    }
  },
  set(v: [string, string] | null) {
    if (v !== null && props.form) {
      props.form[props.option?.config?.startField || 'start'] = v[0];
      props.form[props.option?.config?.endField || 'end'] = v[1];
    }
  },
});

// Upload
const uploadValue = computed({
  get() {
    const isArray = Array.isArray(formValue.value);
    const isSingleFile = props.option?.config?.max === 1;

    if (isArray) {
      return formValue.value;
    }

    if (isSingleFile) {
      return formValue.value !== undefined && formValue.value !== null
        ? [formValue.value]
        : undefined;
    } else {
      if (formValue.value) {
        console.warn(
          `未设置 max 为 1 时，不能传递非数组结构: ${formValue.value}`,
        );
        return undefined;
      }
      return undefined;
    }
  },
  set(v) {
    const isSingleFile = props.option?.config?.max === 1;
    // console.log(v);
    if (isSingleFile) {
      formValue.value = v[0];
    } else {
      formValue.value = v;
    }
  },
});
</script>

<style scoped></style>

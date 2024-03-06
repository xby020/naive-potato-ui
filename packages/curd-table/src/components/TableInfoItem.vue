<template>
  <div class="w-full h-full">
    <!-- text | textarea |password | number -->
    <div
      class="flex gap-1"
      v-if="['text', 'textarea', 'password', 'number'].includes(type)"
    >
      <component
        v-if="optionConfig?.prefix"
        :is="optionConfig?.prefix()"
      ></component>
      <n-text>{{ infoValue }}</n-text>
      <component
        v-if="optionConfig?.suffix"
        :is="optionConfig?.suffix()"
      ></component>
    </div>

    <!-- select -->
    <n-text v-if="type === 'select'"> {{ selectLabel }} </n-text>

    <!-- multSelect -->
    <div class="flex gap-1" v-if="type === 'multSelect'">
      <n-tag v-for="(tag, tagIndex) in selectLabel" :key="tagIndex">
        {{ tag }}
      </n-tag>
    </div>

    <!-- asyncSelect -->
    <n-text v-if="type === 'asyncSelect'">{{ asycnSelectLable }}</n-text>

    <!-- radio -->
    <n-text v-if="type === 'radio'"> </n-text>

    <!-- 'date' | 'datetime' -->
    <n-text v-if="['date', 'datetime'].includes(type) && optionConfig?.range">
      {{ `${dateRangeValue[0]} ~ ${dateRangeValue[1]}` }}
    </n-text>
    <n-text v-if="['date', 'datetime'].includes(type) && !optionConfig?.range">
      {{ infoValue }}
    </n-text>

    <!-- time -->
    <n-text v-if="type === 'time'">
      {{ infoValue }}
    </n-text>

    <!-- upload -->
    <div v-if="type === 'upload' && ['image', 'image-card'].includes(type)">
      <n-image
        :width="100"
        v-if="!Array.isArray(infoValue)"
        :src="infoValue.url"
      />
      <n-image-group v-else>
        <n-image
          v-for="(item, index) in infoValue"
          :key="index"
          :src="item.url"
        />
      </n-image-group>
    </div>

    <!-- custom -->
    <component
      v-if="type === 'custom'"
      v-model:value="infoValue"
      :is="optionRender"
      :config="optionConfig"
    ></component>
  </div>
</template>

<script setup lang="ts">
import type {
  NCurdTableHeaderRenderOptions,
  NCurdTableHeaderType,
} from '../types/curdTable';
import { NText, NTag, NImageGroup, NImage } from 'naive-ui';
import { computed, onMounted, ref, h } from 'vue';

interface Props {
  label: string;
  type: NCurdTableHeaderType;
  info: Record<string, any>;
  field: string;
  option?: NCurdTableHeaderRenderOptions<any, any>;
}

const props = defineProps<Props>();

const infoValue = computed(() => {
  return props.info[props.field];
});

// Disabled
// function isDisabled() {
//   return props.option?.disabled
//     ? props.option.disabled(infoValue, props.info)
//     : false;
// }

// Date Range
const dateRangeValue = computed(() => {
  return [
    infoValue.value[props.option?.config?.startField || 'start'],
    infoValue.value[props.option?.config?.endField || 'start'],
  ] as [string, string];
});

const optionRender = computed(() => {
  return props.option?.render
    ? props.option.render(infoValue.value, props.info)
    : h('div', {}, infoValue.value);
});

const optionConfig = computed(() => {
  return props.option?.config || {};
});

// async select info
const asycnSelectLable = ref('');
onMounted(async () => {
  if (props.type === 'asyncSelect') {
    const res = await props.option?.config?.query({
      [props.option?.config?.queryField || 'name']: infoValue.value,
    });
    asycnSelectLable.value = res.find((item: Record<string, any>) => {
      return (
        item[props.option?.config?.valueField || 'value'] === infoValue.value
      );
    })[props.option?.config?.labelField || 'label'];
  }
});

// select label
const selectLabel = computed<string | string[]>(() => {
  if (['asyncSelect', 'select', 'multSelect'].includes(props.type)) {
    const option = props.option?.config?.options;
    const valueField = props.option?.config?.valueField || 'value';
    const labelField = props.option?.config?.labelField || 'label';
    const value = infoValue.value;
    if (Array.isArray(value)) {
      return value.map((item: any) => {
        const opt = option.find((optionItem: any) => {
          return optionItem[valueField] === item;
        });
        if (opt) {
          return opt[labelField];
        } else {
          console.error('No option found in', option, 'for', item);
          return '';
        }
      });
    } else {
      return option.find((optionItem: any) => {
        return optionItem[valueField] === value;
      })[labelField];
    }
  } else {
    return '';
  }
});
</script>

<style scoped></style>

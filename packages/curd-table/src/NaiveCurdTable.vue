<template>
  <div class="w-full h-full flex flex-col gap-2">
    <!-- Header -->
    <div class="w-full flex justify-between items-start gap-4">
      <!-- Query -->
      <div
        class="flex-auto grid grid-cols-3 gap-x-2 overflow-hidden transition-all duration-300 ease-in-out transform-gpu"
        :style="
          queryShowMore
            ? {
                height: Math.ceil(queryList.length / 3) * 58 + 'px',
              }
            : {
                height: '58px',
              }
        "
      >
        <n-form-item
          v-for="(query, queryIndex) in queryList"
          :key="queryIndex"
          :label="query.title"
          label-placement="left"
        >
          <table-edit-item
            :label="query.title"
            :type="getQueryType(query)"
            v-model:value="queryForm[query.key]"
            :option="
              query.query && typeof query.query === 'object'
                ? query.query
                : undefined
            "
          ></table-edit-item>
        </n-form-item>
      </div>

      <!-- Query More -->
      <n-button type="info" quaternary @click="queryShowMore = !queryShowMore">
        {{ queryShowMore ? '收起' : '展开' }}
      </n-button>

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
    <n-data-table class="w-full flex-auto"></n-data-table>
  </div>
</template>

<script setup lang="ts">
import { NDataTable, NFormItem } from 'naive-ui';
import type { NCurdTableHeader } from '@dts/nCurdTable';
import { computed, ref } from 'vue';
import TableEditItem from './components/TableEditItem.vue';

interface Props {
  headers: NCurdTableHeader[];
}

const props = defineProps<Props>();

/* Query */
const queryList = computed(() => {
  return props.headers.filter((header) => header.query);
});

function getQueryType(header: NCurdTableHeader) {
  if (typeof header.query === 'boolean' && header.query) {
    // query设置为true，从header.type中获取
    if (header.type) {
      return header.type;
    } else {
      throw new Error('query设置为true时，必须设置header.type');
    }
  } else {
    // query设置为对象，从header.query.type中获取
    if (header.query && (header.query.type || header.type)) {
      return header.query.type || header.type;
    } else {
      throw new Error(
        'query设置为对象时，必须设置header.query.type或header.type',
      );
    }
  }
}

function getQueryDefault(header: NCurdTableHeader) {
  if (typeof header.query !== 'boolean' && header.query) {
    return header.query.default || null;
  } else {
    return header.default || null;
  }
}

// form
const queryForm = ref(
  queryList.value.reduce((form, header) => {
    form[header.key] = getQueryDefault(header);
    return form;
  }, {} as Record<string, any>),
);

// query show more
const queryShowMore = ref(false);
</script>

<style scoped></style>

<template>
  <n-select
    v-model:value="selectValue"
    filterable
    :placeholder="placeholder"
    :options="options"
    :loading="loading"
    :label-field="labelField || 'label'"
    :value-field="valueField || 'value'"
    clearable
    remote
    @search="debounceSearch"
    :disabled="disabled"
    :multiple="multiple"
  >
    <template #action>
      <n-pagination
        :page="pageInfo.page"
        :page-count="pageInfo.pageCount"
        @update:page="handlePageUpdate"
      />
    </template>
  </n-select>
</template>

<script setup lang="ts">
import { NSelect, NPagination } from 'naive-ui';
import { ref, computed, watch, reactive, onMounted } from 'vue';
import { debounce } from 'lodash';

interface Props {
  value?: string | string[];
  query: (options: Record<string, any>) => Promise<any>;
  labelField?: string;
  valueField?: string;
  queryField?: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:value', 'update:info']);

const choosenInfo = ref<any>({});

const selectValue = computed({
  get() {
    return props.value;
  },
  set(val) {
    const item = options.value.find(
      (item) => item[props.valueField || 'value'] === val,
    );

    choosenInfo.value = item;
    emits('update:value', val);
  },
});

watch(selectValue, () => {
  emits('update:info', choosenInfo.value);
});

const options = ref<any[]>([]);
const loading = ref(false);
const name = ref('');

const pageInfo = reactive({
  page: 1,
  pageCount: 1,
  size: 20,
});

async function handleQuery() {
  const queryParams = {
    [props.queryField || 'name']: name.value,
    page: pageInfo.page,
    size: pageInfo.size,
  };
  try {
    loading.value = true;
    const res = await props.query(queryParams);
    pageInfo.pageCount = Math.ceil(res.count / pageInfo.size);
    options.value = res.items;
  } finally {
    loading.value = false;
  }
}

async function handleSearch(searchVal: string) {
  pageInfo.page = 1;
  name.value = searchVal;
  await handleQuery();
}

const debounceSearch = debounce((val) => {
  handleSearch(val);
}, 500);

async function handlePageUpdate(page: number) {
  pageInfo.page = page;
  await handleQuery();
}

onMounted(async () => {
  emits('update:value', undefined);
  await handleQuery();
});
</script>

<style scoped></style>

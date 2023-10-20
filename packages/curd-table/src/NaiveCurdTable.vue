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
            v-model:form="queryForm"
            :field="query.key"
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
        <n-button type="default" @click="resetQuery">重置</n-button>

        <!-- query -->
        <n-button type="info" @click="queryData">查询</n-button>

        <!-- create -->
        <n-button type="success">新增</n-button>
        <slot name="suffix-action"></slot>
      </div>
    </div>

    <!-- Table -->
    <n-data-table
      remote
      class="w-full flex-auto"
      ref="tableRef"
      :loading="tableLoading"
      :columns="finalHeader"
      :pagination="pagination"
      :data="tableValue"
      flex-height
      @update-page="handleTablePaginate"
    ></n-data-table>
  </div>
</template>

<script setup lang="ts" generic="TInfo extends Record<string,any>">
import {
  DataTableColumn,
  DataTableColumns,
  NButton,
  NDataTable,
  NFormItem,
  PaginationInfo,
} from 'naive-ui';
import type { NCurdTableHeader } from '@dts/nCurdTable';
import { Ref, VNode, computed, h, onMounted, ref } from 'vue';
import TableEditItem from './components/TableEditItem.vue';
import { getConfigWithBoolean } from './components/NaiveCurdTableTools';

interface Props {
  headers: NCurdTableHeader[];
  query: (queryParams: Record<string, any>) => Promise<Record<string, any>>;
  countField?: string;
  dataField?: string;
  extraQuery?: Record<string, any>;
  serialNumber?: boolean;
  checkable?: boolean;
  checkDisabled?: (row: TInfo) => boolean;
  checked?: string[] | number[];
  prefixAction?: (row: TInfo) => VNode;
  suffixAction?: (row: TInfo) => VNode;
  actionWidth?: number;
  choosen: string | number;
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

// query form
const queryForm = ref(
  queryList.value.reduce((form, header) => {
    form[header.key] = getQueryDefault(header);
    return form;
  }, {} as Record<string, any>),
);

/**
 * @description 重置queryForm
 */
function resetQueryForm() {
  queryForm.value = queryList.value.reduce((form, header) => {
    form[header.key] = getQueryDefault(header);
    return form;
  }, {} as Record<string, any>);
}

async function resetQuery() {
  resetQueryForm();
  pagination.value.page = 1;
  await queryData();
}

// query show more
const queryShowMore = ref(false);

/* Table */
const tableRef = ref();
const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  prefix: (info: PaginationInfo) => {
    return `共 ${info.pageCount} 页`;
  },
});

const tableValue = ref<TInfo[]>([]) as Ref<TInfo[]>;
const tableLoading = ref(false);

// table header

// 传入的header
const propsHeader = computed((): DataTableColumns<TInfo> => {
  return props.headers.map((header) => {
    return {
      title: getConfigWithBoolean(header, 'column', 'title') as string,
      key: getConfigWithBoolean(header, 'column', 'key') as string,
      render: getConfigWithBoolean(header, 'column', 'render', 'infoRender'),
    };
  });
});

// 序号header
const indexHeader: DataTableColumn<TInfo> = {
  title: '序号',
  key: 'index',
  render: (info: TInfo, index: number) => {
    return index + 1;
  },
};

// 选择header
const selectHeader: DataTableColumn<TInfo> = {
  type: 'selection',
  disabled(row: TInfo) {
    return props.checkDisabled ? props.checkDisabled(row) : false;
  },
};

// 操作header
const emits = defineEmits<{
  'update:choosen': [choosen: string | number];
}>();
// 当前操作的条目的id
const choosen = computed({
  get() {
    return props.choosen;
  },
  set(val) {
    emits('update:choosen', val);
  },
});
const actionHeader = computed((): DataTableColumn<TInfo> => {
  return {
    title: '操作',
    key: 'action',
    align: 'center',
    width: props.actionWidth || 300,
    render(row) {
      return h(
        'div',
        { class: 'flex gap-2 flex-nowarp justify-center items-center' },
        {
          default: () => [
            props.prefixAction ? props.prefixAction(row) : null,
            h(NButton, { type: 'primary', size: 'small' }, () => '编辑'),
            h(NButton, { type: 'info', size: 'small' }, () => '详情'),
            h(NButton, { type: 'warning', size: 'small' }, () => '删除'),
            props.suffixAction ? props.suffixAction(row) : null,
          ],
        },
      );
    },
  };
});

const finalHeader = computed(() => {
  return [
    ...(props.serialNumber ? [indexHeader] : []),
    ...(props.checkable ? [selectHeader] : []),
    ...propsHeader.value,
    actionHeader.value,
  ];
});

// table pagination
async function handleTablePaginate(page: number) {
  pagination.value.page = page;
  await queryData();
}

/* Query */
const countField = computed(() => {
  return props.countField || 'count';
});

const dataField = computed(() => {
  return props.dataField || 'data';
});

/**
 * @description: 查询数据方法
 */
async function queryData() {
  try {
    tableLoading.value = true;

    // 组建queryParams
    const queryParams = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...queryForm.value,
      ...props.extraQuery,
    };

    // 请求数据
    const res = await props.query(queryParams);

    // 设置tableValue
    tableValue.value = res[dataField.value];
    // 设置pagination
    pagination.value.itemCount = res[countField.value];
  } catch (error) {
    console.error(error);
  } finally {
    tableLoading.value = false;
  }
}

onMounted(async () => {
  await queryData();
});
</script>

<style scoped></style>

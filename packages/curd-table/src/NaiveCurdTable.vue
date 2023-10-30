<template>
  <div class="relative w-full h-full flex flex-col gap-2 p-4 overflow-hidden">
    <div
      class="w-full h-full top-0 left-0 absolute overflow-hidden"
      id="table"
    ></div>
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
            :field="query.key"
            :option="getQueryOption(query)"
          ></table-edit-item>
        </n-form-item>
      </div>

      <!-- Query More -->
      <n-button
        v-if="Object.keys(queryForm).length > 3"
        type="info"
        quaternary
        @click="queryShowMore = !queryShowMore"
      >
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
        <n-button type="success" @click="handleAdd">新增</n-button>
        <slot name="suffix-action"></slot>
      </div>
    </div>

    <!-- Table -->
    <n-data-table
      remote
      class="w-full flex-auto"
      ref="tableRef"
      :row-key="rowKey ? rowKey : (row) => row.uuid"
      :loading="tableLoading"
      :columns="finalHeader"
      :pagination="pagination"
      :data="tableValue"
      flex-height
      @update-page="handleTablePaginate"
    ></n-data-table>

    <!-- Drawer -->
    <n-drawer
      :close-on-esc="false"
      width="100%"
      height="100%"
      v-model:show="drawerShow"
      to="#table"
      placement="right"
      :trap-focus="false"
      :block-scroll="false"
      :mask-closable="false"
      :show-mask="false"
      :native-scrollbar="true"
    >
      <!-- Drawer content -->
      <n-drawer-content>
        <template #header>
          <!-- title -->
          <div class="w-full flex justify-between items-center">
            <n-text class="font-bold text-2xl">{{ drawerTitle }}</n-text>

            <div class="flex items-center gap-2">
              <!-- Confirm -->
              <n-button
                type="success"
                v-if="drawerMode !== 'info'"
                :loading="drawerConfirmLoading"
                @click="handleDrawerConfirm"
                >保存</n-button
              >
              <!-- Back -->
              <n-popconfirm
                v-if="drawerBackConfirm"
                placement="bottom-end"
                @positive-click="drawerShow = false"
                positive-text="确定"
                negative-text="取消"
              >
                <template #trigger>
                  <n-button type="warning">返回</n-button>
                </template>
                <n-text>确认返回吗，所有未保存的内容都会丢失。</n-text>
              </n-popconfirm>
              <n-button v-else type="warning" @click="drawerShow = false"
                >返回</n-button
              >
            </div>
          </div>
        </template>

        <!-- content -->
        <div class="w-full h-full">
          <!-- Create -->
          <div class="w-full h-full">
            <!-- If Tab -->
            <n-tabs
              v-if="drawerTab"
              class="w-full h-full"
              pane-class="h-full overflow-hidden"
            >
              <n-tab-pane tab="基本信息" name="info">
                <n-scrollbar class="w-full h-full">
                  <table-edit
                    ref="createFormRef"
                    mode="create"
                    v-model:form="createForm"
                    :headers="headers"
                    :rules="createFormRules"
                  ></table-edit>
                </n-scrollbar>
              </n-tab-pane>
              <slot name="extraDrawerTab"></slot>
            </n-tabs>
            <!-- Else Default Info -->
            <n-scrollbar v-else class="w-full h-full">
              <table-edit
                ref="createFormRef"
                mode="create"
                v-model:form="createForm"
                :headers="headers"
                :cols="cols"
                :rules="createFormRules"
              ></table-edit>
            </n-scrollbar>
          </div>
          <!-- TODO:Edit -->

          <!-- TODO:Info -->
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts" generic="TInfo extends Record<string,any>">
import {
  DataTableColumn,
  DataTableColumns,
  NButton,
  NDataTable,
  NFormItem,
  NPopconfirm,
  PaginationInfo,
  NDrawer,
  NDrawerContent,
  NText,
  NTabs,
  NTabPane,
  NScrollbar,
} from 'naive-ui';
import type { NCurdTableFormRules, NCurdTableHeader } from '@dts/nCurdTable';
import { Ref, VNode, computed, h, onMounted, ref, watch } from 'vue';
import TableEditItem from './components/TableEditItem.vue';
import { getConfigWithBoolean } from './components/NaiveCurdTableTools';
import TableEdit from './components/TableEdit.vue';

interface Props {
  headers: NCurdTableHeader[];
  query: (queryParams: Record<string, any>) => Promise<Record<string, any>>;
  message?: Record<string, Function>;
  countField?: string;
  dataField?: string;
  extraQuery?: Record<string, any>;
  serialNumber?: boolean;
  checkable?: boolean;
  checkDisabled?: (row: TInfo) => boolean;
  checked?: string[] | number[];
  rowKey?: (row: TInfo) => string | number;
  prefixAction?: (row: TInfo) => VNode;
  suffixAction?: (row: TInfo) => VNode;
  actionWidth?: number;
  choosen: string | number;
  cols?: number;
  create: (data: Record<string, any>) => Promise<void>;
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

function getQueryOption(header: NCurdTableHeader) {
  const config = getConfigWithBoolean(header, 'query', 'defaultConfig');
  return config;
}

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
            h(
              NPopconfirm,
              {
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick() {
                  console.log('delete');
                },
              },
              {
                default: () => '确定删除吗？',
                trigger: () =>
                  h(NButton, { type: 'warning', size: 'small' }, () => '删除'),
              },
            ),
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

// Edit,info and create
const drawerShow = ref(false);
const drawerTitle = ref('新增');
const drawerBackConfirm = ref(false);
const drawerTab = ref(false);

// drawer mode
type DrawerMode = 'create' | 'edit' | 'info';
const drawerMode = ref<DrawerMode>('create');

watch(
  drawerMode,
  (val) => {
    switch (val) {
      case 'create':
        drawerTitle.value = '新增';
        drawerBackConfirm.value = true;
        break;
      case 'edit':
        drawerTitle.value = '编辑';
        drawerBackConfirm.value = true;
        break;
      case 'info':
        drawerTitle.value = '详情';
        drawerBackConfirm.value = false;
        break;
    }
  },
  { immediate: true },
);

// drawer confirm
const drawerConfirmLoading = computed(() => {
  return drawerMode.value === 'create'
    ? createDataLoading.value
    : editDataLoading.value;
});
async function handleDrawerConfirm() {
  if (drawerMode.value === 'create') {
    await createData();
  } else {
    // await editData();
  }
}

// drawer off
async function handleDrawerOff() {
  drawerShow.value = false;
  drawerMode.value = 'create';
  await resetQuery();
}

// Add
const defaultCreateForm = computed(() => {
  return props.headers.reduce((form, header) => {
    const key = getConfigWithBoolean(header, 'create', 'key');
    const defaultVal = getConfigWithBoolean(header, 'create', 'default');
    form[key] = defaultVal;
    return form;
  }, {} as Record<string, any>);
});
const createForm = ref(defaultCreateForm.value);
const createFormRef = ref();
const createFormRules = computed((): NCurdTableFormRules => {
  return props.headers.reduce((rules, header) => {
    if (
      header.create &&
      typeof header.create === 'object' &&
      header.create.rule
    ) {
      rules[header.key] = header.create.rule;
    } else if (
      header.create &&
      typeof header.create === 'object' &&
      header.create.required
    ) {
      // 当没有rule时，根据required生成rule
      const type = header.create.type || header.type;
      if (type === 'number') {
        // number
        rules[header.key] = [
          {
            type: 'number',
            trigger: 'blur',
            required: true,
            message: `请输入${header.create.title || header.title}`,
          },
        ];
      } else if (type === 'multSelect' || header.create.config?.multiple) {
        // array
        rules[header.key] = [
          {
            type: 'array',
            trigger: 'blur',
            required: true,
            message: `请选择${header.create.title || header.title}`,
          },
        ];
      } else {
        // default text
        rules[header.key] = [
          {
            trigger: 'blur',
            required: true,
            message: `请输入${header.create.title || header.title}`,
          },
        ];
      }
    }
    return rules;
  }, {} as NCurdTableFormRules);
});
function handleAdd() {
  drawerMode.value = 'create';
  drawerShow.value = true;
}

const createDataLoading = ref(false);
async function createData() {
  try {
    // validator
    await createFormRef.value.validate();

    // create Data
    createDataLoading.value = true;
    await props.create(createForm.value);

    props.message && props.message.success(`新增成功`);
    createDataLoading.value = false;
    await handleDrawerOff();
  } catch (err) {
    props.message && props.message.error(`表单输入有误，请检查表单`);
  }
}

// Edit
const editDataLoading = ref(false);
</script>

<style scoped>
:deep(.n-drawer-header__main) {
  width: 100%;
}
</style>

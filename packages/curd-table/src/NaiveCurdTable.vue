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
            :form="queryForm"
            v-model:value="queryForm[getQueryKey(query) as keyof typeof queryForm]"
            :field="getQueryKey(query)"
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
        <slot name="prefixAction"></slot>

        <!-- reset -->
        <n-button type="default" @click="resetQuery">重置</n-button>

        <!-- query -->
        <n-button type="info" @click="queryData">查询</n-button>

        <!-- create -->
        <n-button
          type="success"
          v-if="create !== undefined && !hideCreate"
          @click="handleAdd"
          >新增</n-button
        >
        <slot name="suffixAction"></slot>
      </div>
    </div>

    <!-- Table -->
    <n-data-table
      remote
      class="w-full flex-auto"
      ref="tableRef"
      :row-key="rowKey ? rowKey : (row) => row[rowKeyField || 'uuid']"
      :loading="tableLoading"
      :columns="finalHeader"
      :pagination="pagination"
      :data="tableValue"
      flex-height
      @update-page="handleTablePaginate"
      @update-page-size="handleTablePaginateSize"
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
              <slot name="extraDrawerAction"></slot>
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
        <n-spin class="w-full h-full" :show="drawerContentLoading">
          <!-- Create -->
          <div class="w-full h-full" v-if="drawerMode === 'create'">
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
                    :cols="cols"
                    :rules="createFormRules"
                    :info="info"
                  ></table-edit>
                </n-scrollbar>
              </n-tab-pane>
              <slot
                name="extraCreateTab"
                :form="createForm"
                :info="info"
              ></slot>
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
                :info="info"
              ></table-edit>
              <slot
                name="extraCreateForm"
                :form="createForm"
                :info="info"
              ></slot>
            </n-scrollbar>
          </div>

          <!-- Edit -->
          <div class="w-full h-full" v-if="drawerMode === 'edit'">
            <!-- If Tab -->
            <n-tabs
              v-if="drawerTab"
              class="w-full h-full"
              pane-class="h-full overflow-hidden"
            >
              <n-tab-pane tab="基本信息" name="info">
                <n-scrollbar class="w-full h-full">
                  <table-edit
                    v-if="!drawerContentLoading"
                    ref="editFormRef"
                    mode="edit"
                    v-model:form="editForm"
                    :info="info"
                    :headers="headers"
                    :rules="editFormRules"
                  ></table-edit>
                </n-scrollbar>
              </n-tab-pane>
              <slot name="extraEditTab" :form="editForm" :info="info"></slot>
            </n-tabs>
            <!-- Else Default Info -->
            <n-scrollbar v-else class="w-full h-full">
              <table-edit
                v-if="!drawerContentLoading"
                ref="editFormRef"
                mode="edit"
                v-model:form="editForm"
                :info="info"
                :headers="headers"
                :cols="cols"
                :rules="editFormRules"
              ></table-edit>
              <slot name="extraEditForm" :form="editForm" :info="info"></slot>
            </n-scrollbar>
          </div>

          <!-- Info -->
          <div class="w-full h-full" v-if="drawerMode === 'info'">
            <!-- If Tab -->
            <n-tabs
              v-if="drawerTab"
              class="w-full h-full"
              pane-class="h-full overflow-hidden"
            >
              <n-tab-pane tab="基本信息" name="info">
                <n-scrollbar class="w-full h-full">
                  <table-info
                    v-if="info && !drawerContentLoading"
                    :info="info"
                    :headers="headers"
                    :cols="cols"
                  ></table-info>
                </n-scrollbar>
              </n-tab-pane>
              <slot name="extraInfoTab" :info="info"></slot>
            </n-tabs>
            <!-- Else Default Info -->
            <n-scrollbar v-else class="w-full h-full">
              <table-info
                v-if="info && !drawerContentLoading"
                :info="info"
                :headers="headers"
                :cols="cols"
              ></table-info>
              <slot name="extraInfoForm" :info="info"></slot>
            </n-scrollbar>
          </div>
        </n-spin>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="TForm extends Record<string,any>,TInfo extends TForm"
>
import {
  DataTableColumn,
  DataTableColumns,
  NButton,
  NDataTable,
  NFormItem,
  NPopconfirm,
  NDrawer,
  NDrawerContent,
  NText,
  NTabs,
  NTabPane,
  NScrollbar,
  NSpin,
} from 'naive-ui';
import type {
  NCurdTableFormRules,
  NCurdTableHeader,
  NCurdTableHeaderType,
} from './types/curdTable';
import { Ref, VNode, computed, h, onMounted, ref, watch, nextTick } from 'vue';
import TableEditItem from './components/TableEditItem.vue';
import {
  getConfigWithBoolean,
  getOptionWithBoolean,
} from './components/NaiveCurdTableTools';
import TableEdit from './components/TableEdit.vue';
import TableInfo from './components/TableInfo.vue';
import { RowData } from 'naive-ui/es/data-table/src/interface';
import { PaginationInfo } from 'naive-ui';

interface Props {
  headers: NCurdTableHeader<TForm, TInfo>[];
  query: (queryParams: Record<string, any>) => Promise<Record<string, any>>;
  message?: Record<string, any>;
  countField?: string;
  dataField?: string;
  idField?: string;
  pageSizeField?: string;
  extraQuery?: Record<string, any>;
  serialNumber?: boolean;
  checkable?: boolean;
  checkDisabled?: (row: TInfo) => boolean;
  checked?: string[] | number[];
  rowKey?: (row: TInfo) => string | number;
  rowKeyField?: string;
  prefixAction?: (row: TInfo) => VNode;
  suffixAction?: (row: TInfo) => VNode;
  actionWidth?: number;
  choosen: string | number;
  cols?: number;
  create?: (data: Record<string, any>) => Promise<any>;
  queryDetail?: (data: Record<string, any>) => Promise<TInfo>;
  edit?: (data: Record<string, any>) => Promise<any>;
  delete?: (data: Record<string, any>) => Promise<any>;
  hideCreate?: boolean;
  hideColumnEdit?: boolean;
  editable?: (row: TInfo) => boolean;
  hideColumnInfo?: boolean;
  infoable?: (row: TInfo) => boolean;
  hideColumnDelete?: boolean;
  deleteable?: (row: TInfo) => boolean;
  hideAction?: boolean;
  /* 没有详情接口，数据从列表返回 */
  noDetail?: boolean;
  drawerTab?: boolean;
  pageSizes?: number[];
}

const props = defineProps<Props>();

/* Query */
const queryList = computed(() => {
  return props.headers.filter((header) => header.query);
});

function getQueryKey(header: NCurdTableHeader<TForm, TInfo>): string {
  if (typeof header.query === 'boolean' && header.query) {
    return header.key as string;
  } else if (typeof header.query === 'object') {
    return header.query.key || (header.key as string);
  } else {
    throw new Error('query设置为对象时，必须设置header.query.key或header.key');
  }
}

function getQueryType(
  header: NCurdTableHeader<TForm, TInfo>,
): NCurdTableHeaderType {
  if (typeof header.query === 'boolean' && header.query) {
    // query设置为true，从header.type中获取
    if (header.type) {
      return header.type;
    } else {
      throw new Error('query设置为true时，必须设置header.type');
    }
  } else {
    // query设置为对象，从header.query.type中获取
    if (typeof header.query === 'object') {
      if (header.query.type) {
        return header.query.type;
      } else if (header.type) {
        return header.type;
      } else {
        throw new Error(
          'query设置为对象时，必须设置header.query.type或header.type',
        );
      }
    } else {
      throw new Error(
        'query设置为对象时，必须设置header.query.type或header.type',
      );
    }
  }
}

function getQueryDefault(header: NCurdTableHeader<TForm, TInfo>) {
  if (typeof header.query !== 'boolean' && header.query) {
    return header.query.default || null;
  } else {
    return header.default || null;
  }
}

// query form
const queryForm = ref(
  queryList.value.reduce((form, header) => {
    form[getQueryKey(header)] = getQueryDefault(header);
    return form;
  }, {} as Record<string, any>),
);

function getQueryOption(header: NCurdTableHeader<TForm, TInfo>) {
  const config = getOptionWithBoolean(header, 'query');
  return config;
}

/**
 * @description 重置queryForm
 */
function resetQueryForm() {
  queryForm.value = queryList.value.reduce((form, header) => {
    form[header.key as keyof typeof form] = getQueryDefault(header);
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
  pageSizes: props.pageSizes || [10],
  showSizePicker: true,
  showQuickJumper: true,
  prefix: (info: PaginationInfo) => {
    return `共 ${info.itemCount} 条`;
  },
});

const tableValue = ref<TInfo[]>([]) as Ref<RowData[]>;
const tableLoading = ref(false);

// table header

// 传入的header
const propsHeader = computed((): DataTableColumns<TInfo> => {
  return props.headers
    .filter((header) => {
      return header.column;
    })
    .map((header) => {
      const headerColumnConfig =
        typeof header.column === 'object' ? header.column : {};
      return {
        ...(headerColumnConfig as any),
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
  width: 80,
  align: 'center',
  render: (info: TInfo, index: number) => {
    return h(
      'div',
      {
        class: 'w-full h-8 flex justify-center items-center',
      },
      h(
        'div',
        {
          class: 'w-7 h-7 font-semibold flex justify-center items-center',
        },
        `${index + 1}`,
      ),
    );
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

function canEdit(row: TInfo) {
  if (props.hideColumnEdit) {
    return false;
  } else {
    if (props.edit) {
      return props.editable ? props.editable(row) : true;
    } else {
      return false;
    }
  }
}

function canInfo(row: TInfo) {
  if (props.hideColumnInfo) {
    return false;
  } else {
    return props.infoable ? props.infoable(row) : true;
  }
}

function canDelete(row: TInfo) {
  if (props.hideColumnDelete) {
    return false;
  } else {
    if (props.delete) {
      return props.deleteable ? props.deleteable(row) : true;
    } else {
      return false;
    }
  }
}

const actionHeader = computed((): DataTableColumn<TInfo> => {
  return {
    title: '操作',
    key: 'action',
    align: 'center',
    width: props.actionWidth || 300,
    render(row: TInfo) {
      return h(
        'div',
        { class: 'flex gap-2 flex-nowarp justify-center items-center' },
        {
          default: () => [
            props.prefixAction ? props.prefixAction(row) : null,
            canEdit(row)
              ? h(
                  NButton,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => {
                      if (
                        row[props.rowKeyField || 'uuid'] &&
                        (typeof row[props.rowKeyField || 'uuid'] === 'string' ||
                          typeof row[props.rowKeyField || 'uuid'] === 'number')
                      ) {
                        choosen.value = row[props.rowKeyField || 'uuid'] as
                          | string
                          | number;
                        handleEdit(
                          row[props.rowKeyField || 'uuid'] as string | number,
                        );
                      } else {
                        console.error(
                          'rowKeyField in row is undefined or not a string/number, check your rowKeyField',
                        );
                      }
                    },
                  },
                  () => '编辑',
                )
              : null,
            canInfo(row)
              ? h(
                  NButton,
                  {
                    type: 'info',
                    size: 'small',
                    onClick: () => {
                      if (
                        row[props.rowKeyField || 'uuid'] &&
                        (typeof row[props.rowKeyField || 'uuid'] === 'string' ||
                          typeof row[props.rowKeyField || 'uuid'] === 'number')
                      ) {
                        choosen.value = row[props.rowKeyField || 'uuid'] as
                          | string
                          | number;
                        handleInfo(
                          row[props.rowKeyField || 'uuid'] as string | number,
                        );
                      } else {
                        console.error(
                          'rowKeyField in row is undefined or not a string/number, check your rowKeyField',
                        );
                      }
                    },
                  },
                  () => '详情',
                )
              : null,
            canDelete(row)
              ? h(
                  NPopconfirm,
                  {
                    positiveText: '确定',
                    negativeText: '取消',
                    onPositiveClick() {
                      if (
                        row[props.rowKeyField || 'uuid'] &&
                        (typeof row[props.rowKeyField || 'uuid'] === 'string' ||
                          typeof row[props.rowKeyField || 'uuid'] === 'number')
                      ) {
                        choosen.value = row[props.rowKeyField || 'uuid'] as
                          | string
                          | number;
                        deleteData(
                          row[props.rowKeyField || 'uuid'] as string | number,
                        );
                      } else {
                        console.error(
                          'rowKeyField in row is undefined or not a string/number, check your rowKeyField',
                        );
                      }
                    },
                  },
                  {
                    default: () => '确定删除吗？',
                    trigger: () =>
                      h(
                        NButton,
                        {
                          type: 'warning',
                          size: 'small',
                          loading:
                            deleteDataLoading.value[
                              row[props.rowKeyField || 'uuid'] as
                                | string
                                | number
                            ],
                        },
                        () => '删除',
                      ),
                  },
                )
              : null,
            props.suffixAction ? props.suffixAction(row) : null,
          ],
        },
      );
    },
  };
});

const finalHeader = computed(() => {
  const final = [
    ...(props.serialNumber ? [indexHeader] : []),
    ...(props.checkable ? [selectHeader] : []),
    ...propsHeader.value,
  ];

  if (!props.hideAction) {
    final.push(actionHeader.value);
  }

  return final;
});

// table pagination
async function handleTablePaginate(page: number) {
  pagination.value.page = page;
  await queryData();
}

async function handleTablePaginateSize(pageSize: number) {
  pagination.value.pageSize = pageSize;
  await queryData();
}

/* Query */
const countField = computed(() => {
  return props.countField || 'count';
});

const dataField = computed(() => {
  return props.dataField || 'data';
});

const idField = computed(() => {
  return props.idField || 'uuid';
});

const pageSizeField = computed(() => {
  return props.pageSizeField || 'pageSize';
});

/**
 * @description: 查询数据方法
 */
async function queryData() {
  try {
    tableLoading.value = true;

    // 组建queryParams
    const queryParams: Record<string, any> = {
      page: pagination.value.page,
      [pageSizeField.value]: pagination.value.pageSize,
      ...queryForm.value,
      ...props.extraQuery,
    };

    // 去掉 queryParams 中为 null 的值
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    // 请求数据
    const res = await props.query(queryParams);

    // 设置tableValue
    tableValue.value = res[dataField.value] || res;
    // 设置pagination
    pagination.value.itemCount = res[countField.value] || 0;
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
const drawerTab = computed(() => {
  return props.drawerTab;
});

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
  }
  await editData(choosen.value, editForm.value);
}

// drawer content loading
const drawerContentLoading = ref(false);

// drawer off
async function handleDrawerOff() {
  drawerShow.value = false;
  drawerMode.value = 'create';
  await resetQuery();
}

// Add
const defaultCreateForm = () => {
  return props.headers
    .filter((header) => {
      return header.create;
    })
    .reduce((form, header) => {
      const key = getConfigWithBoolean(header, 'create', 'key');
      const defaultVal = getConfigWithBoolean(header, 'create', 'default');
      form[key] = defaultVal;
      return form;
    }, {} as Record<string, any>);
};
const createForm = ref(defaultCreateForm());

function resetCreateForm() {
  createForm.value = defaultCreateForm();
}

const createFormRef = ref();
const createFormRules = computed((): NCurdTableFormRules => {
  return props.headers.reduce((rules, header) => {
    if (
      header.create &&
      typeof header.create === 'object' &&
      header.create.rule
    ) {
      rules[header.key as keyof typeof rules] = header.create.rule;
    } else if (
      header.create &&
      typeof header.create === 'object' &&
      header.create.required
    ) {
      // 当没有rule时，根据required生成rule
      const type = header.create.type || header.type;
      if (type === 'number') {
        // number
        rules[header.key as keyof typeof rules] = [
          {
            type: 'number',
            trigger: 'blur',
            required: true,
            message: `请输入${header.create.title || header.title}`,
          },
        ];
      } else if (type === 'multSelect' || header.create.config?.multiple) {
        // array
        rules[header.key as keyof typeof rules] = [
          {
            type: 'array',
            trigger: 'blur',
            required: true,
            message: `请选择${header.create.title || header.title}`,
          },
        ];
      } else {
        // default text
        rules[header.key as keyof typeof rules] = [
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
    drawerContentLoading.value = true;
    // validator
    await createFormRef.value.validate();

    // create Data
    createDataLoading.value = true;
    props.create && (await props.create(createForm.value));

    props.message && props.message.success(`新增成功`);
    createDataLoading.value = false;
    await handleDrawerOff();
    resetCreateForm();
  } catch (err) {
    props.message && props.message.error(`表单输入有误，请检查表单`);
  } finally {
    drawerContentLoading.value = false;
    createDataLoading.value = false;
  }
}

// Edit
const editDataLoading = ref(false);
const info = ref();

const defaultEditForm = computed(() => {
  if (info.value) {
    const form = props.headers.reduce((form, header) => {
      const key = getConfigWithBoolean(header, 'edit', 'key');
      const defaultVal = getConfigWithBoolean(header, 'edit', 'default');
      const infoVal = info.value[key];

      form[key] = infoVal || defaultVal;
      return form;
    }, {} as Record<string, any>);
    return form;
  } else {
    return defaultCreateForm();
  }
});

const editForm = ref(defaultEditForm.value);
const editFormRef = ref();
const editFormRules = computed((): NCurdTableFormRules => {
  return props.headers.reduce((rules, header) => {
    if (header.edit && typeof header.edit === 'object' && header.edit.rule) {
      rules[header.key as keyof typeof rules] = header.edit.rule;
    } else if (
      header.edit &&
      typeof header.edit === 'object' &&
      header.edit.required
    ) {
      // 当没有rule时，根据required生成rule
      const type = header.edit.type || header.type;
      if (type === 'number') {
        // number
        rules[header.key as keyof typeof rules] = [
          {
            type: 'number',
            trigger: 'blur',
            required: true,
            message: `请输入${header.edit.title || header.title}`,
          },
        ];
      } else if (type === 'multSelect' || header.edit.config?.multiple) {
        // array
        rules[header.key as keyof typeof rules] = [
          {
            type: 'array',
            trigger: 'blur',
            required: true,
            message: `请选择${header.edit.title || header.title}`,
          },
        ];
      } else {
        // default text
        rules[header.key as keyof typeof rules] = [
          {
            trigger: 'blur',
            required: true,
            message: `请输入${header.edit.title || header.title}`,
          },
        ];
      }
    }
    return rules;
  }, {} as NCurdTableFormRules);
});

async function handleEdit(uuid: string | number) {
  drawerMode.value = 'edit';
  drawerShow.value = true;
  try {
    drawerContentLoading.value = true;
    if (props.noDetail) {
      /* 详情从数据列表返回 */
      await nextTick();
      const res = tableValue.value.find((item) => {
        return item[idField.value] === choosen.value;
      });
      info.value = res;
    } else {
      /* 详情从接口返回 */
      const res = props.queryDetail
        ? await props.queryDetail({
            [idField.value]: uuid,
          })
        : {};
      info.value = res;
    }

    editForm.value = defaultEditForm.value;
  } finally {
    drawerContentLoading.value = false;
  }
}

function resetEditForm() {
  editForm.value = defaultEditForm.value;
}

async function editData(uuid: string | number, data: Record<string, any>) {
  try {
    drawerContentLoading.value = true;
    // validator
    await editFormRef.value.validate();

    // edit Data
    editDataLoading.value = true;
    props.edit &&
      (await props.edit({
        [idField.value]: uuid,
        ...data,
      }));

    props.message && props.message.success(`编辑成功`);
    editDataLoading.value = false;
    await handleDrawerOff();
    resetEditForm();
  } catch (err) {
    props.message && props.message.error(`表单输入有误，请检查表单`);
  } finally {
    drawerContentLoading.value = false;
    editDataLoading.value = false;
  }
}

// Info
async function handleInfo(uuid: string | number) {
  drawerMode.value = 'info';
  drawerShow.value = true;
  try {
    drawerContentLoading.value = true;
    if (props.noDetail) {
      /* 详情从数据列表返回 */
      await nextTick();
      const res = tableValue.value.find((item) => {
        return item[idField.value] === choosen.value;
      });
      info.value = res;
    } else {
      /* 详情从接口返回 */
      const res = props.queryDetail
        ? await props.queryDetail({
            [idField.value]: uuid,
          })
        : {};
      info.value = res;
    }
  } finally {
    drawerContentLoading.value = false;
  }
}

// Delete
const deleteDataLoading = ref<Record<string, boolean>>({});
async function deleteData(uuid: string | number) {
  try {
    deleteDataLoading.value[uuid] = true;
    if (props.delete) {
      await props.delete({
        [idField.value]: uuid,
      });
      props.message && props.message.success(`删除成功`);
      await queryData();
    } else {
      props.message && props.message.error(`删除失败，没有传入delete方法`);
    }
  } catch (err) {
    props.message && props.message.error(`删除失败`);
  } finally {
    deleteDataLoading.value[uuid] = false;
  }
}

// defineExpose
defineExpose({
  resetQuery,
  queryData,
  drawerShow,
  drawerMode,
});
</script>

<style scoped>
:deep(.n-drawer-header__main) {
  width: 100%;
}
</style>

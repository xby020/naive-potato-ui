<template>
  <div
    class="w-full h-full flex flex-col gap-2 bg-light-50 dark:bg-dark-400 rounded-md"
  >
    <!-- query -->
    <div class="w-full flex justify-between items-center gap-4 px-4">
      <n-form
        :model="queryForm"
        ref="formRef"
        :rules="rules"
        label-placement="left"
        :inline="true"
        size="medium"
      >
        <n-grid :x-gap="24" :cols="3">
          <n-form-item-gi
            :span="1"
            v-for="(query, queryIndex) in queryList"
            :key="queryIndex"
            :label="query.title"
            :path="query.key"
          >
            <!-- type:input -->
            <n-input
              v-if="query.type === 'input' || query.type === 'inputArea'"
              :type="query.type === 'inputArea' ? 'textarea' : 'text'"
              v-model:value="queryForm[query.key]"
            />
            <!-- type:select/multSelect -->
            <n-select
              v-if="query.type === 'select' || query.type === 'multSelect'"
              v-model:value="queryForm[query.key]"
              clearable
              :multiple="query.type === 'multSelect'"
              :options="query.option ? query.option() : []"
              class="min-w-12"
            />
            <!-- type:date -->
            <n-date-picker
              v-if="query.type === 'date' || query.type === 'datetime'"
              v-model:formatted-value="queryForm[query.key]"
              :value-format="query.format"
              :type="query.type === 'date' ? 'date' : 'datetime'"
              clearable
            ></n-date-picker>
            <!-- type:custom -->
            <component
              v-if="query.type === 'custom' && query.render"
              :is="query.render(queryForm)"
            ></component>
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <div class="h-full">
        <div class="flex gap-2">
          <n-button
            v-if="queryListAll.length > 3"
            text
            size="medium"
            @click="queryMore = !queryMore"
          >
            <template #icon>
              <n-icon size="16">
                <i-ep-arrow-up-bold v-if="queryMore"></i-ep-arrow-up-bold>
                <i-ep-arrow-down-bold v-else></i-ep-arrow-down-bold>
              </n-icon>
            </template>
            <span>更多</span>
          </n-button>
          <n-button
            v-if="queryListAll.length"
            type="default"
            size="medium"
            @click="setDefaultData"
            >重置</n-button
          >
          <n-button
            v-if="!queryListAll.length"
            type="default"
            size="medium"
            @click="setDefaultData"
            >刷新</n-button
          >
          <n-button
            v-if="queryListAll.length"
            type="info"
            size="medium"
            @click="queryData"
            >查询</n-button
          >
          <n-button
            type="success"
            size="medium"
            @click="handleAdd"
            v-if="create"
            >新增</n-button
          >
          <slot name="action" :checked="checkedRows"></slot>
        </div>
      </div>
    </div>

    <!-- Data table -->
    <div class="w-full flex-auto px-4 pb-4">
      <n-data-table
        class="w-full h-full"
        flex-height
        remote
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:page="handlePageChange"
        :scroll-x="scrollX"
        @update-checked-row-keys="handleCheck"
      ></n-data-table>
    </div>

    <!-- Drawer -->
    <n-drawer
      v-model:show="drawerShow"
      :mask-closable="false"
      to="#table"
      :width="fullScreenDrawer ? '100%' : 480"
      placement="right"
    >
      <n-drawer-content>
        <div class="w-full h-full flex flex-col gap-2">
          <!-- drawer header -->
          <div class="w-full flex justify-between items-center">
            <!-- left -->
            <h1 class="text-xl">{{ drawerTitle }}</h1>
            <!-- right -->
            <div class="flex gap-2">
              <!-- save btn -->
              <n-button
                v-if="drawerMode !== 'detail'"
                type="success"
                size="medium"
                @click="handleSave"
                >保存</n-button
              >
              <n-popconfirm
                placement="bottom"
                v-if="drawerMode !== 'detail'"
                @positive-click="drawerShow = !drawerShow"
              >
                <template #trigger>
                  <n-button type="warning" size="medium" @click=""
                    >返回</n-button
                  >
                </template>
                所有未保存的内容都会丢失，确定要返回吗？
              </n-popconfirm>
              <n-button
                v-else
                type="warning"
                size="medium"
                @click="drawerShow = !drawerShow"
                >返回</n-button
              >
            </div>
          </div>

          <!-- action -->
          <div class="w-full">
            <slot name="add" v-if="drawerMode === 'add'" :uuid="choosen"></slot>
            <slot
              name="edit"
              v-if="drawerMode === 'edit'"
              :uuid="choosen"
            ></slot>
          </div>

          <!-- drawer content -->
          <div class="w-full flex-auto overflow-y-auto" v-scrollbar>
            <!-- Add -->
            <table-form
              v-if="drawerMode === 'add'"
              :mode="drawerMode"
              :form="addForm"
              :form-rules="addFormRules"
              :list="addList"
              :cols="cols"
              ref="addFormRef"
            >
              <template #extraForm="{ form }">
                <slot name="extraForm" :form="form"></slot>
              </template>
              <template #extraFormPanel="{ form, info, mode }">
                <slot
                  name="extraFormPanel"
                  :form="form"
                  :info="info"
                  :mode="mode"
                ></slot>
              </template>
            </table-form>
            <!-- edit -->
            <table-form
              v-if="drawerMode === 'edit'"
              :mode="drawerMode"
              v-model:form="editForm"
              :form-rules="editFormRules"
              :list="editList"
              :info="editInfo"
              :cols="cols"
              ref="editFormRef"
            >
              <template #extraForm="{ form }">
                <slot name="extraForm" :form="form"></slot>
              </template>
              <template #extraFormPanel="{ form, info, mode }">
                <slot
                  name="extraFormPanel"
                  :form="form"
                  :info="info"
                  :mode="mode"
                ></slot>
              </template>
            </table-form>
            <!-- detail -->
            <table-info
              v-if="drawerMode === 'detail'"
              :table-info="detailInfo"
              :list="detailList"
              :loading="detailLoading"
              :cols="cols"
            >
              <template #action="{ info }">
                <slot
                  name="detail"
                  v-if="drawerMode === 'detail'"
                  :info="info"
                  :refresh="handleDetail"
                ></slot>
              </template>
            </table-info>
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts" generic="T">
import {
  DataTableBaseColumn,
  DataTableColumn,
  DataTableRowKey,
  FormRules,
  NButton,
  NPopconfirm,
  NSpace,
} from 'naive-ui';
import { computed, h, onMounted, provide, reactive, ref, watch } from 'vue';
import TableForm from './components/TableForm.vue';
import TableInfo from './components/TableInfo.vue';

import type { NaiveCurdTableProps } from './types/naiveCurdTableProps';

interface Props extends NaiveCurdTableProps {}

const props = defineProps<Props>();

// Provide
provide('tableFormStyle', props.tableFormStyle);

// Query
const queryMore = ref(false);
/**
 * header 中需要被筛选的列
 */
const queryListAll = computed(() => {
  return props.headers.filter((header) => header.query);
});
const queryList = computed(() => {
  if (queryMore.value) {
    return queryListAll.value;
  } else {
    return queryListAll.value.slice(0, 3);
  }
});
// 查询表单字段
const queryForm = ref<{ [key: string]: any }>({});
// 查询字段校验规则
const rules = ref({});
// 通过 queryList 生成查询表单字段和校验规则
watch(queryList, () => {
  queryList.value.forEach((header) => {
    if (header.type === 'custom') {
      if (header.default) {
        queryForm.value[header.key] = header.default;
      } else {
        queryForm.value[header.key] = null;
      }
    } else {
      queryForm.value[header.key] = null;
    }
  });
});

// 提供给接口的查询参数
const queryParams = computed(() => {
  // 将查询参数的值都转为字符串
  Object.keys(queryForm.value).forEach((key) => {
    if (queryForm.value[key] instanceof Array) {
      queryForm.value[key] = String(queryForm.value[key]);
    }
  });
  const params = {
    page: pagination.page,
    page_size: pagination.pageSize,
    ...queryForm.value,
  };
  return params;
});

// Table
const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: props.pageSize || 10,
  count: 0,
  prefix() {
    return `共 ${pagination.count} 条`;
  },
});
const loading = ref(false);

// column
const actionColumn = reactive<DataTableBaseColumn>({
  title: '操作',
  key: 'action',
  width: props.actionWidth || 200,
  align: 'center',
  fixed: 'right',
  render(row: any) {
    const uuid = row.uuid as string;
    const prefixAction = props.prefixAction ? props.prefixAction(uuid) : [];
    const suffixAction = props.suffixAction ? props.suffixAction(uuid) : [];

    return h(
      NSpace,
      {
        type: 'horizontal',
        justify: 'end',
        align: 'center',
      },
      {
        default: () => {
          const rowEditDisable =
            !(props.editable ? props.editable(row) : true) ||
            props.hideColumnEdit;
          const rowDetailDisable =
            !(props.detailable ? props.detailable(row) : true) ||
            props.hideColumnDetail;
          const rowDeletDisable =
            !(props.deletable ? props.deletable(row) : true) ||
            props.hideColumnDelete;

          return [
            ...prefixAction,
            rowEditDisable
              ? null
              : h(
                  NButton,
                  {
                    type: 'primary',
                    size: 'small',
                    onClick: () => {
                      handleEdit(uuid);
                    },
                  },
                  { default: () => '编辑' },
                ),
            rowDetailDisable
              ? null
              : h(
                  NButton,
                  {
                    type: 'info',
                    size: 'small',
                    onClick: () => {
                      handleDetail(uuid);
                    },
                  },
                  { default: () => '详情' },
                ),
            rowDeletDisable
              ? null
              : h(
                  NPopconfirm,
                  {
                    placement: 'bottom',
                    onPositiveClick: () => {
                      handleDelete(uuid);
                    },
                  },
                  {
                    trigger: () => {
                      return h(
                        NButton,
                        {
                          type: 'warning',
                          size: 'small',
                        },
                        { default: () => '删除' },
                      );
                    },
                    default: () => {
                      return '确定要删除该类型吗？';
                    },
                  },
                ),
            ...suffixAction,
          ];
        },
      },
    );
  },
});

const columns = computed<DataTableColumn[]>(() => {
  // 从 header 中获取需要展示的列
  const columns = props.headers
    .filter((header) => header.show)
    .map((header) => {
      // 没有title和key则从父节点获取
      const title = header.column?.title || header.title;
      const key = header.column?.key || header.key;
      return {
        title: title,
        key: key,
        ...header.column,
      } as DataTableColumn;
    });

  // 添加操作列
  columns.push(actionColumn as DataTableColumn);

  // 添加选择列
  if (props.rowKey) {
    columns.unshift({
      type: 'selection',
      width: 50,
    });
  }

  return columns;
});

// Data
const data = ref();
async function queryData() {
  try {
    loading.value = true;
    const res = await props.query(queryParams.value);
    // set data
    data.value = props.paginate ? res.items : res;
    // set pagination
    pagination.count = res.count;
    pagination.pageCount = Math.ceil(res.count / pagination.pageSize);
  } catch (err) {
    throw err;
  } finally {
    loading.value = false;
  }
}

// 列表恢复默认
async function setDefaultData() {
  // 重置查询表单
  queryList.value.forEach((header) => {
    if (header.type === 'custom') {
      if (header.default) {
        queryForm.value[header.key] = header.default;
      } else {
        queryForm.value[header.key] = null;
      }
    } else {
      queryForm.value[header.key] = null;
    }
  });
  // 重置分页
  pagination.page = 1;
  // 重置选择
  checkedRows.value = [];

  // 查询数据
  await queryData();
}

onMounted(() => {
  queryData();
});

// handle page change
async function handlePageChange(page: number) {
  pagination.page = page;
  await queryData();
}

/**
 * 查询
 */

/**
 * 抽屉插槽 Drawer
 */
const drawerShow = ref(false);
const drawerModes = ref([
  {
    label: '新增',
    value: 'add',
  },
  {
    label: '编辑',
    value: 'edit',
  },
  {
    label: '详情',
    value: 'detail',
  },
]);
const drawerMode = ref('');
const drawerTitle = computed(() => {
  const mode = drawerModes.value.find(
    (mode) => mode.value === drawerMode.value,
  );
  return mode ? mode.label : '';
});

// 新增
function handleAdd() {
  drawerShow.value = true;
  drawerMode.value = 'add';
}

const addForm = reactive<{ [key: string]: any }>({});
const addLoading = ref(false);
const addFormRules = reactive<{ [key: string]: any }>({});
const addList = computed(() => {
  const list = props.headers.filter((header) => header.add);
  list.forEach((item) => {
    addForm[item.key] = item.default || null;
  });
  return list;
});
// 新增表单规则
watch(
  addForm,
  () => {
    addList.value.forEach((item) => {
      if (item.addRule) {
        if (item.addRule instanceof Function) {
          addFormRules[item.key] = item.addRule(addForm);
        } else {
          addFormRules[item.key] = item.addRule;
        }
      }
    });
  },
  { immediate: true },
);

async function handleCreate() {
  try {
    addLoading.value = true;
    if (props.create) {
      await props.create(addForm);
    }
    await queryData();
    drawerShow.value = false;
  } catch (err) {
    throw err;
  } finally {
    addLoading.value = false;
  }
}

// 删除
const deleteLoading = ref(false);
async function handleDelete(uuid: string) {
  try {
    deleteLoading.value = true;
    if (props.delete) {
      await props.delete(uuid);
    }
    await queryData();
  } finally {
    deleteLoading.value = false;
  }
}

// 编辑
const editForm = reactive<{ [key: string]: any }>({});
const editLoading = ref(false);
const editFormRules = reactive<FormRules>({});
const editInfo = ref();
const editList = computed(() => {
  const list = props.headers.filter((header) => header.edit);
  list.forEach((item) => {
    editForm[item.key] = item.default || null;
  });
  return list;
});
async function handleEdit(uuid: string) {
  try {
    editLoading.value = true;
    // update props
    emits('update:choosen', uuid);
    // get info
    const res = await props.queryDetail(uuid);
    // 清空不符合规范的date字段
    editList.value.forEach((item) => {
      if (item.type === 'date' || item.type === 'datetime') {
        console.log(item);
        res[item.key] = res[item.key] ? res[item.key] : null;
      }
    });

    console.log(res);

    editInfo.value = res;
    // set form
    editList.value.forEach((item) => {
      editForm[item.key] = res[item.key];
    });

    // set form rules
    editList.value.forEach((item) => {
      if (item.editRule) {
        if (item.editRule instanceof Function) {
          editFormRules[item.key] = item.editRule(editForm);
        } else {
          editFormRules[item.key] = item.editRule;
        }
      }
    });

    watch(editForm, () => {
      editList.value.forEach((item) => {
        if (item.editRule) {
          if (item.editRule instanceof Function) {
            editFormRules[item.key] = item.editRule(editForm);
          } else {
            editFormRules[item.key] = item.editRule;
          }
        }
      });
    });

    drawerShow.value = true;
    drawerMode.value = 'edit';
  } catch (err) {
    throw err;
  } finally {
    editLoading.value = false;
  }
}
async function handleUpdate() {
  try {
    editLoading.value = true;
    if (props.update) {
      await props.update(editInfo.value.uuid, editForm);
    }
    await queryData();
    drawerShow.value = false;
  } catch (err) {
    throw err;
  } finally {
    editLoading.value = false;
  }
}

// 详情
const emits = defineEmits(['update:choosen']);
const detailInfo = ref();
const detailLoading = ref(false);
const detailList = computed(() => {
  const list = props.headers.filter((header) => header.detail);
  return list;
});
async function handleDetail(uuid: string) {
  // update props
  emits('update:choosen', uuid);
  // get info
  const info = await props.queryDetail(uuid);
  // 修改不符合规范的date字段
  detailList.value.forEach((item) => {
    if (item.type === 'date' || item.type === 'datetime') {
      info[item.key] = info[item.key] ? info[item.key] : null;
    }
  });

  detailInfo.value = info;
  drawerMode.value = 'detail';
  drawerShow.value = true;
}

// 清空数据
function clearFormData() {
  addList.value.forEach((item) => {
    addForm[item.key] = item.default || null;
  });
  editList.value.forEach((item) => {
    editForm[item.key] = item.default || null;
  });
}

// 监听抽屉关闭，刷新数据
watch(drawerShow, (val) => {
  if (!val) {
    clearFormData();
    queryData();
  }
});

const addFormRef = ref<any>(null);
const editFormRef = ref<any>(null);
async function handleSave() {
  if (drawerMode.value === 'add') {
    addFormRef.value.validator(async (error: any) => {
      if (!error) {
        await handleCreate();
      } else {
        console.table(addForm.value);
        window.$message.error('请检查表单');
      }
    });
  }

  if (drawerMode.value === 'edit') {
    editFormRef.value.validator(async (error: any) => {
      if (!error) {
        await handleUpdate();
      } else {
        console.table(editForm.value);
        window.$message.error('请检查表单');
      }
    });
  }
}

async function refreshTable() {
  drawerShow.value = false;
  await queryData();
}

// 选中行
const checkedRows = ref<any[]>([]);
function handleCheck(rowKeys: DataTableRowKey[]) {
  checkedRows.value = rowKeys;
}

defineExpose({
  refreshTable,
  checkedRows,
  handleAdd,
});
</script>

<style scoped></style>

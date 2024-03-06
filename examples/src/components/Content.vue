<template>
  <div class="w-1366px h-768px rounded-lg bg-light-100">
    <np-curd-table
      :headers="headers"
      v-model:choosen="choosen"
      :query="handleQuery"
      :query-detail="handleQueryDetail"
      :create="handleCreate"
      :edit="handleEditError"
      :delete="handleDelete"
      :cols="2"
      :message="message"
      :prefix-action="prefixAction"
      :suffix-action="suffixAction"
      :action-width="400"
      serial-number
    >
      <template #prefixAction>
        <n-button type="error" quaternary>Prefix</n-button>
      </template>
      <template #suffixAction>
        <n-button type="info" quaternary>Suffix</n-button>
      </template>
    </np-curd-table>
  </div>
</template>

<script setup lang="ts">
import { NpCurdTable, NpCurdTableHeader } from '@naive-potato-ui/ui';
import { NButton, useMessage } from 'naive-ui';

const message = useMessage();

onMounted(() => {
  message.info('Start');
});

type ResInfo = {
  uuid: string;
  name: string;
  age: number;
  department: string[];
  phone: string;
};

const headers = ref<NpCurdTableHeader<ResInfo>[]>([
  {
    title: '姓名',
    key: 'name',
    type: 'text',
    column: true,
    query: true,
    defaultConfig: {
      show: true,
      type: 'text',
      default: '人社局',
      config: {
        disabled: () => true,
      },
      rule: {
        trigger: 'blur',
        required: true,
        message: '请确定账号是否绑定部门',
      },
    },
    create: true,
    edit: true,
    info: {
      show: true,
      type: 'custom',
      render(row, info) {
        return h('div', {}, '附件文件');
      }
    }
  },
  {
    title: '年龄',
    key: 'age',
    type: 'number',
    infoRender(row: any) {
      return row.age + '岁';
    },
    column: true,
    query: {
      show: true,
      type: 'date',
      config: {
        format: 'yyyy-MM-dd',
        range: true,
        startField: 'start_date',
        endField: 'end_date',
      },
    },
    create: {
      show: true,
      type: 'text',
      required: true,
    },
    edit: true,
    info: true,
  },
  {
    title: '部门',
    key: 'department',
    type: 'multSelect',
    column: true,
    defaultConfig: {
      type: 'multSelect',
      config: {
        options: [
          {
            label: '技术部',
            value: '技术部',
          },
          {
            label: '市场部',
            value: '市场部',
          },
          {
            label: '财务部',
            value: '财务部',
          },
          {
            label: '行政部',
            value: '行政部',
          },
        ],
      },
    },
    query: true,
    create: {
      show: true,
      required: true,
    },
    edit: true,
    info: true,
  },
  {
    title: '手机号',
    key: 'phone',
    type: 'text',
    column: true,
    query: true,
    create: {
      show: true,
      required: true,
    },
    edit: true,
    info: true,
  },
]);

interface Employee {
  uuid: string;
  name: string;
  age: number;
  department: string;
  phone: string;
}
async function handleQuery(params: any): Promise<Record<string, any>> {
  console.log(params);

  const departments = ['技术部', '市场部', '财务部', '行政部'];

  const employees: Employee[] = [];

  for (let i = 0; i < 10; i++) {
    const uid = 'uuid' + Math.floor(Math.random() * 1000000000);

    const name = '员工' + (i + 1);

    const age = Math.floor(Math.random() * 15) + 22;

    const department =
      departments[Math.floor(Math.random() * departments.length)];

    const phone =
      '138' + Math.floor(Math.random() * 10000000 + 10000000).toString();

    employees.push({
      uuid: uid.toString(),
      name,
      age,
      department,
      phone,
    });
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: employees,
        count: 100,
      });
    }, 1000);
  });
}

async function handleQueryDetail(
  params: Record<string, any>,
): Promise<Record<string, any>> {
  const departments = ['技术部', '市场部', '财务部', '行政部'];

  const uid = Math.floor(Math.random() * 15) + 22;
  const name = '员工' + (Math.random() * 15 + 1);

  const age = Math.floor(Math.random() * 15) + 22;

  const department =
    departments[Math.floor(Math.random() * departments.length)];

  const phone =
    '138' + Math.floor(Math.random() * 10000000 + 10000000).toString();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        uuid: uid,
        name,
        age,
        department: [department],
        phone,
      });
    }, 1000);
  });
}

async function handleCreate(data: any) {
  console.log(`创建`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 200,
          message: '创建成功',
          data: {},
        },
        count: 100,
      });
    }, 1000);
  });
}

async function handleEdit(data: any) {
  console.log(`编辑`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 200,
          message: '创建成功',
          data: {},
        },
        count: 100,
      });
    }, 1000);
  });
}

async function handleEditError(data: any) {
  console.log(`编辑`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({
        data: {
          code: 400,
          message: '创建失败，测试失败消息',
          data: {},
        },
        count: 100,
      });
    }, 1000);
  });
}

async function handleDelete(data: any) {
  console.log(`删除`, data);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 200,
          message: '删除成功',
          data: {},
        },
        count: 100,
      });
    }, 1000);
  });
}

const choosen = ref('');

// Prefix and suffix action btn
const prefixAction = (row: any) => {
  return h(
    NButton,
    { type: 'primary', size: 'small', secondary: true },
    { default: () => 'Prefix' },
  );
};
const suffixAction = (row: any) => {
  return h('div', { class: 'flex items-center gap-2' }, [
    h(
      NButton,
      { type: 'warning', size: 'small', secondary: true },
      { default: () => 'Suffix1' },
    ),
    h(
      NButton,
      { type: 'info', size: 'small', secondary: true },
      { default: () => 'Suffix2' },
    ),
  ]);
};
</script>

<style scoped></style>

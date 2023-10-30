<template>
  <div class="w-1366px h-768px rounded-lg bg-light-100">
    <naive-curd-table
      :headers="headers"
      :query="handleQuery"
      v-model:choosen="choosen"
      :cols="2"
      :message="message"
      :create="handleCreate"
    ></naive-curd-table>
  </div>
</template>

<script setup lang="ts">
import { NaiveCurdTable } from '@naive-potato-ui/ui';
import { useMessage } from 'naive-ui';

const message = useMessage();

onMounted(() => {
  message.info('Start');
});

const headers = ref([
  {
    title: '姓名',
    key: 'name',
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
  {
    title: '年龄',
    key: 'age',
    type: 'number',
    infoRender(row: any) {
      return row.age + '岁';
    },
    column: true,
    query: true,
    create: {
      show: true,
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
      config: {
        options: [
          { label: '研发部', value: '研发部' },
          { label: '产品部', value: '产品部' },
          { label: '运营部', value: '运营部' },
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
  name: string;
  age: number;
  department: string;
  phone: string;
}
async function handleQuery(params: any): Promise<Record<string, any>> {
  const departments = ['技术部', '市场部', '财务部', '行政部'];

  const employees: Employee[] = [];

  for (let i = 0; i < 10; i++) {
    const name = '员工' + (i + 1);

    const age = Math.floor(Math.random() * 15) + 22;

    const department =
      departments[Math.floor(Math.random() * departments.length)];

    const phone =
      '138' + Math.floor(Math.random() * 10000000 + 10000000).toString();

    employees.push({
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
    }, 2000);
  });
}

async function handleCreate() {
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

const choosen = ref('');
</script>

<style scoped></style>

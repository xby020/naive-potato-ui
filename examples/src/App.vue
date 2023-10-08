<template>
  <div class="w-screen h-screen bg-dark-400 flex justify-center items-center">
    <div class="w-1366px h-768px rounded-lg p-4 bg-light-100">
      <naive-curd-table :headers="headers"></naive-curd-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NaiveCurdTable } from '@naive-potato-ui/ui';

const headers = ref([
  {
    title: '姓名',
    key: 'name',
    type: 'text',
    column: true,
    query: true,
    create: true,
    edit: true,
    info: true,
  },
  {
    title: '年龄',
    key: 'age',
    type: 'number',
    column: true,
    query: true,
    create: true,
    edit: true,
    info: true,
  },
  {
    title: '部门',
    key: 'department',
    type: 'multSelect',
    column: true,
    query: {
      config: {
        options: [
          { label: '研发部', value: '研发部' },
          { label: '产品部', value: '产品部' },
          { label: '运营部', value: '运营部' },
        ],
      },
    },
    create: true,
    edit: true,
    info: true,
  },
  {
    title: '手机号',
    key: 'phone',
    type: 'text',
    column: true,
    query: true,
    create: true,
    edit: true,
    info: true,
  },
]);
</script>

<style scoped></style>

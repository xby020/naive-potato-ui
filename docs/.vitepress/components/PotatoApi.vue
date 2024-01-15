<template>
  <n-config-provider
    :theme="isDark ? darkTheme : undefined"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="my-2 vp-raw"
  >
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th class="w-[10%]">Name</th>
          <th class="w-[10%]">Type</th>
          <th class="w-[10%]">Default</th>
          <th class="w-[70%]">Description</th>
        </tr>
      </thead>

      <tbody ref="tbodyRef">
        <slot name="default"></slot>
      </tbody>
    </n-table>
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, zhCN, dateZhCN, NConfigProvider, NTable } from 'naive-ui';
import { useData } from 'vitepress';
import { onMounted, ref } from 'vue';

const { isDark } = useData();

const tbodyRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // 删除 tbody 中所有的ul元素
  const uls = tbodyRef.value?.querySelectorAll('ul');
  uls?.forEach((ul) => {
    ul.remove();
  });
});
</script>

<style scoped></style>

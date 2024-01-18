<template>
  <div class="flex flex-col gap-2">
    <p>value: {{ value }}</p>
    <np-async-select
      v-model:value="value"
      :query="query"
      label-field="name"
      value-field="number"
    >
    </np-async-select>
  </div>
</template>

<script setup lang="ts">
import { NpAsyncSelect } from '@naive-potato-ui/ui';
import { ref } from 'vue';

const value = ref('');

function getMockLabels(index: number) {
  const labels = [];
  for (let i = 0; i < 20; i++) {
    const labelIndex = index * 20 + i;
    labels.push({
      name: `name-${labelIndex}`,
      number: `number-${labelIndex}`,
    });
  }
  return labels;
}

async function query(options: Record<string, any>): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const labels = getMockLabels(options.page - 1 || 0);
      const filterLabels = options.name
        ? labels.filter((item) => item.name.includes(options.name))
        : labels;

      resolve({
        items: filterLabels,
        count: 100,
      });
    }, 1000);
  });
}
</script>

<style scoped></style>

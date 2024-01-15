<template>
  <n-config-provider
    :theme="isDark ? darkTheme : undefined"
    :locale="zhCN"
    :date-locale="dateZhCN"
    class="my-2 vp-raw"
  >
    <n-card size="medium" :title="title">
      <!-- action -->
      <template #header-extra>
        <n-popover>
          <template #trigger>
            <n-button text @click="showCode = !showCode">
              <IconMdiCodeTags />
            </n-button>
          </template>
          代码
        </n-popover>
      </template>

      <!-- content -->
      <div class="overflow-auto">
        <div class="w-full min-w-1024px h-768px">
          <slot name="demo"></slot>
        </div>
      </div>

      <div v-show="showCode">
        <n-scrollbar class="h-360px">
          <!-- Code -->
          <slot name="code"> </slot>
        </n-scrollbar>
      </div>
    </n-card>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  darkTheme,
  zhCN,
  dateZhCN,
  NConfigProvider,
  NCard,
  NButton,
  NPopover,
  NScrollbar,
} from 'naive-ui';
import { useData } from 'vitepress';
import { ref } from 'vue';
// @ts-ignore
import IconMdiCodeTags from '~icons/mdi/code-tags';

const { isDark } = useData();

interface Props {
  title?: string;
}

defineProps<Props>();

const showCode = ref(false);
</script>

<style scoped></style>

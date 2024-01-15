<template>
  <tr>
    <td>
      <n-badge :value="need ? '必须' : 0">
        <n-text>
          <code>
            <slot name="name"></slot>
          </code>
        </n-text>
      </n-badge>
    </td>

    <td>
      <n-tag size="small">
        <code>
          <slot name="type"></slot>
        </code>
      </n-tag>
    </td>

    <td>
      <n-tag size="small">
        <code>
          <slot name="defaultValue"></slot>
        </code>
      </n-tag>
    </td>

    <td>
      <slot name="desc"></slot>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { NTag, NBadge, NText } from 'naive-ui';

defineProps<{
  need?: boolean;
}>();
</script>

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      '@dts': '../../types',
    },
  },
  build: {
    minify: false,
    lib: {
      entry: './src/index.ts',
      name: 'NaiveAsyncSelect',
      fileName: 'naive-async-select',
    },
    rollupOptions: {
      external: [/@naive-potato-ui.*/, 'vue', 'naive-ui'],
    },
  },
});

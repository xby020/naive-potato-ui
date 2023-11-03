import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS({
      include: ['src/**/*.{vue,ts}'],
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: './src/index.ts',
      name: 'NaiveCurdTable',
      fileName: 'naive-curd-table',
    },
    rollupOptions: {
      external: [/@naive-potato-ui.*/, 'vue', 'naive-ui'],
    },
  },
});

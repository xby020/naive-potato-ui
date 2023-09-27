import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'modules',
    minify: false,
    lib: {
      entry: './src/index.ts',
      name: 'NaivePotatoUI',
      fileName: 'naive-potato-ui',
    },
    rollupOptions: {
      external: [/@naive-potato-ui.*/, 'vue', 'naive-ui'],
    },
  },
});

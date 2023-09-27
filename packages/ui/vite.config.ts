import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
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

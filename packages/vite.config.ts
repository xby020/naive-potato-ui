import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './examples',
  plugins: [
    vue(),
    WindiCSS(),
    Components({
      dts: 'src/types/components.d.ts',
      dirs: ['src/components'],
      resolvers: [NaiveUiResolver()],
    }),
    AutoImport({
      dts: 'src/types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      imports: [
        // presets
        'vue',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@packages': resolve(__dirname, './'),
    },
  },

  build: {
    target: 'modules',
    outDir: '../dist',
    minify: true,
    rollupOptions: {
      external: ['vue', 'naive-ui'],
      input: ['index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: '../dist/es',
        },
      ],
    },
    lib: {
      entry: './index.ts',
      name: 'naive-curd-table',
      formats: ['es', 'cjs'],
    },
  },
});

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import { join } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS({
      scan: {
        dirs: ['src', '../packages'],
        fileExtensions: ['vue', 'js', 'ts'],
      },
    }),
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
    alias: [
      {
        find: /^@naive-potato-ui\/(.+)$/,
        replacement: join(__dirname, '..', 'packages', '$1', 'src'),
      },
    ],
  },

  server: {
    host: true,
    port: 14514,
  },
});

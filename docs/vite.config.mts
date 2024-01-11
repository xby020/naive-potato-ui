import { defineConfig } from 'vite';
import { join } from 'node:path';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    WindiCSS({
      scan: {
        dirs: [
          '../packages/*/src',
          './.vitepress/components',
          './components',
          './demo',
          './guide',
          '.',
        ],
        fileExtensions: ['vue', 'js', 'ts', 'md'],
      },
    }),
    Icons(),
  ],
  resolve: {
    alias: [
      {
        find: /^@naive-potato-ui\/(.+)$/,
        replacement: join(__dirname, '..', 'packages', '$1', 'src'),
      },
    ],
  },
});

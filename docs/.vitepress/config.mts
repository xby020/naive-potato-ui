import { defineConfig } from 'vitepress';
import { mdPlugin } from './plugins/mdPlugins';

export default defineConfig({
  base: '/naive-potato-ui/',
  lang: 'zh-CN',
  title: 'Naive Potato UI',
  themeConfig: {
    outline: {
      level: [2, 6],
      label: '页面导航',
    },
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/curd-table' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指引',
          items: [
            { text: '组件库介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
      ],
      // 组件部分的章节导航
      '/components/': [
        {
          text: '组件',
          items: [
            { text: 'Curd Table Curd表格', link: '/components/curd-table' },
            { text: 'Async Select 异步选择', link: '/components/async-select' },
            {
              text: 'Custom Upload 自定义上传',
              link: '/components/custom-upload',
            },
          ],
        },
      ],
    },
  },

  /* Markdown */
  markdown: {
    theme: {
      light: 'catppuccin-frappe',
      dark: 'catppuccin-macchiato',
    },
    config: (md) => {
      md.use(mdPlugin);
    },
  },

  /* build */
  ignoreDeadLinks: true,

  vite: {
    ssr: {
      noExternal: ['naive-ui', 'lodash'],
    },
  },
});

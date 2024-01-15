import { defineConfig } from 'vitepress';
import { mdPlugin } from './plugins/mdPlugins';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Naive Potato UI',
  themeConfig: {
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
});

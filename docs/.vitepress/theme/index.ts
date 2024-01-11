import DefaultTheme from 'vitepress/theme';
import { EnhanceAppContext, useData } from 'vitepress';
import { PotatoDemo } from '../components';
import { h } from 'vue';

import 'virtual:windi.css';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx);

    const { app } = ctx;

    app.component('PotatoDemo', PotatoDemo);
  },
  Layout: () => {
    const props: Record<string, any> = {};
    // 获取 frontmatter
    const { frontmatter } = useData();

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass;
    }

    return h(DefaultTheme.Layout, props);
  },
};

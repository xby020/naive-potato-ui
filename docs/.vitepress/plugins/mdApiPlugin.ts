import MarkdownIt from 'markdown-it';
import mdContainer from 'markdown-it-container';
import type Token from 'markdown-it/lib/token';
import type Renderer from 'markdown-it/lib/renderer';

export type MdApiContent = {
  name?: string;
  type?: string;
  need?: boolean;
  defaultValue?: string;
  description?: string;
};

export interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?(
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer,
  ): string;
}

const mdParser = new MarkdownIt();

export function mdApiPlugin(md: MarkdownIt) {
  md.use(mdContainer, 'api', <ContainerOpts>{
    validate(params) {
      return Boolean(params.trim().match(/^api\s*(.*)$/));
    },

    render(tokens, idx, options, env, self) {
      const token = tokens[idx];

      // 不考虑 :::api 的嵌套情况，碰到深层嵌套直接放弃渲染
      if (token.level > 0) return '';

      // :::api 开启标签时触发
      if (token.nesting === 1) {
        // 获取到 :::api 内部的路径
        const source = getContent(tokens, idx);

        // 拼接 <api> 组件的使用代码
        const txtStart = `
          <potato-api>
        `;

        // 拼接 :::api body
        let txtBody = '';

        source.forEach((item) => {
          const descHtml = mdParser.render(item.description || '', env);
          txtBody += `
            <potato-api-item :need='${item.need ? true : false}'>
              <template #name>${item.name?.toString()}</template>
              <template #type>${item.type?.toString()}</template>
              <template #defaultValue>${item.defaultValue?.toString()}</template>
              <template #desc>${descHtml}</template>
            </potato-api-item>
          `;
        });

        const txt = txtStart + txtBody;

        return txt;
      }
      // 读取到 :::api 闭合的 Token 时，输出闭合 </api> 标签
      return '</potato-api>';
    },
  });
}

/** 当读取到 :::api 开启的 Token 时，解析出内部的用例组件文件路径 */
export function getContent(tokens: Token[], idx: number): MdApiContent[] {
  // find all list item
  let contentList: MdApiContent[] = [];
  for (let i = idx; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'inline') {
      const content = token.content;
      // example:`props[string]:这是`props`的描述`
      let name = content.split(':')[0].split('[')[0];
      const type = content.match(/\[(.+)\]/)?.[1];
      const escapedTypeCode = type
        ?.replaceAll(/</g, '&lt;')
        .replaceAll(/>/g, '&gt;');

      let need = false;
      if (name.includes('*')) {
        name = name.replace('*', '');
        need = true;
      }

      const defaultValue = content.split('](')[1].split('):')[0].trim();
      const description = content.split('):')[1].trim();
      contentList.push({
        name,
        type: escapedTypeCode,
        need,
        defaultValue,
        description,
      });
    }

    if (token.type === 'container_api_close') {
      break;
    }
  }

  return contentList;
}

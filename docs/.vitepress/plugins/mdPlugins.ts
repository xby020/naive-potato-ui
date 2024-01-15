import type MarkdownIt from 'markdown-it';
import { mdDemoPlugin } from './mdDemoPlugin';
import { mdScriptSetupPlugin } from './mdDemoSetupPlugin';
import { mdApiPlugin } from './mdApiPlugin';

export const mdPlugin = (md: MarkdownIt) => {
  md.use(mdDemoPlugin);
  md.use(mdApiPlugin);
  md.use(mdScriptSetupPlugin);
};

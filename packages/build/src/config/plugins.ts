import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import Inspect from 'vite-plugin-inspect';
import { PluginOption } from 'vite';
import { pluginReplacePackageJson } from '../utils/replacePkg';
import { PackageJson } from 'type-fest';
import { pluginMoveDts } from '../utils/moveDts';
import { GenerateViteConfigOptions } from './options';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export function getVitePlugins(
  pkgJson?: PackageJson,
  options?: GenerateViteConfigOptions,
): PluginOption[] {
  // common plugins
  const commonPlugins = [
    Inspect({
      build: true,
      outputDir: '.vite-inspect',
    }),
    pluginReplacePackageJson(pkgJson),
  ];

  // vue plugins
  const vuePlugins = options?.vue ? [vue(), WindiCSS(), libInjectCss()] : [];

  // dts plugins
  const dtsPlugins = options?.dts ? [pluginMoveDts(options)] : [];

  const finalPlugins = [...commonPlugins, ...vuePlugins, ...dtsPlugins];

  console.log(JSON.stringify(finalPlugins));

  return finalPlugins as PluginOption[];
}

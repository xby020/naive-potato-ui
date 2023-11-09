import { PluginOption } from 'vite';
import { PackageJson } from 'type-fest';
import { getBasePkgOptions } from './basePkgOption';
import { readFile, writeFile } from 'node:fs/promises';
import { absCwd } from './getPath';
import { GenerateViteConfigOptions } from '../config/options';

/**
 * Replace package.json plugin options.
 *
 * @export
 * @interface ReplacePackageJsonOptions
 */
export interface ReplacePackageJsonOptions extends GenerateViteConfigOptions {
  /**
   * Prefix for production components name.
   * @example `curd-table` => `np-curd-table`
   * @default 'np'
   *
   * @type {string}
   * @memberof ReplacePackageJsonOptions
   */
  prefix?: string;
  /**
   * The file name of package.json.
   *
   * @type {string}
   * @memberof ReplacePackageJsonOptions
   */
  fileName?: string;
}

export const defaultPluginConfig = {
  prefix: 'np',
  fileName: '',
};

export function kebabToCamelCase(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export async function readPkgFile(pkgPath: string): Promise<PackageJson> {
  const pkgStr = await readFile(pkgPath, 'utf-8');
  return JSON.parse(pkgStr);
}

export async function writePkgFile(pkgJson: Object, pkgPath: string) {
  const pkgStr = JSON.stringify(pkgJson);
  await writeFile(pkgPath, pkgStr, 'utf-8');
}

export function pluginReplacePackageJson(
  pkgJson: PackageJson = {},
  options: ReplacePackageJsonOptions = {},
): PluginOption {
  const fileName =
    options.fileName ||
    pkgJson.name?.replace('@naive-potato-ui/', '') ||
    defaultPluginConfig.fileName;

  const prefix = options.prefix || defaultPluginConfig.prefix;

  const kebabCaseName = fileName.replace(/([A-Z])/g, '-$1').toLowerCase();

  // final kebab case name
  const kebabName = `${prefix}-${kebabCaseName}`;

  // plugins
  return {
    name: 'vite-plugin-replace-package-json',
    async closeBundle() {
      const pkgJsonObj = pkgJson || {};

      // 获取基础的 package.json
      const basePkgJson = getBasePkgOptions(pkgJsonObj);
      const exportsObj: Record<string, any> = {};

      // 获取 umd 路径
      const umdPath = `./dist/${kebabName}.umd.js`;
      basePkgJson.main = umdPath;
      exportsObj['.'] = {
        require: umdPath,
        module: umdPath,
      };

      // 获取 es 路径
      const esPath = `./dist/${kebabName}.es.js`;
      basePkgJson.module = esPath;
      exportsObj['.']['import'] = esPath;

      // 获取 dts 路径
      const dtsPath = `./dist/index.d.ts`;
      basePkgJson.types = dtsPath;
      exportsObj['.']['types'] = dtsPath;

      // 组装 package.json
      const finalPkgJson = {
        ...basePkgJson,
        name: `@naive-potato-ui/${kebabCaseName}`,
        exports: exportsObj,
      };

      // 更新或者创建 package.json
      await writePkgFile(finalPkgJson, absCwd('package.json'));
    },
  };
}

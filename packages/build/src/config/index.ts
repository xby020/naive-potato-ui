import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';
import { ReplacePackageJsonOptions, readPkgFile } from '../utils/replacePkg';
import { absCwd } from '../utils/getPath';
import { getVitePlugins } from './plugins';
import { getViteBuild } from './build';

export async function generateViteConfig(
  customOptions?: ReplacePackageJsonOptions,
  viteConfig?: UserConfig,
): Promise<UserConfig> {
  // 获取package.json
  const pkgJson = await readPkgFile(absCwd('package.json'));

  // 获取plugins
  const plugins = getVitePlugins(pkgJson, customOptions);

  // 获取build
  const build = getViteBuild(pkgJson, customOptions);

  const resolve = {
    dedupe: ['vue'],
  };

  const finalViteConfig: UserConfig = {
    plugins,
    build,
    ...viteConfig,
    resolve,
  };

  console.log('FINAL BUILD CONFIG');
  console.log(JSON.stringify(build));

  return mergeConfig(finalViteConfig, viteConfig || {});
}

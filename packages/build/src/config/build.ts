import { BuildOptions } from 'vite';
import {
  ReplacePackageJsonOptions,
  defaultPluginConfig,
  kebabToCamelCase,
} from '../utils/replacePkg';
import { PackageJson } from 'type-fest';
import { getExternal } from './external';

export function getViteBuild(
  pkgJson: PackageJson = {},
  options: ReplacePackageJsonOptions = {},
): BuildOptions {
  const fileName =
    options.fileName ||
    pkgJson.name?.replace('@naive-potato-ui/', '') ||
    defaultPluginConfig.fileName;

  const prefix = options?.prefix || defaultPluginConfig.prefix;

  const kebabCaseName = fileName.replace(/([A-Z])/g, '-$1').toLowerCase();

  const kebabName = `${prefix}-${kebabCaseName}`;

  const camelCaseName = kebabToCamelCase(kebabName);

  const external = getExternal(pkgJson, options);

  console.log(external);

  return {
    minify: false,
    lib: {
      entry: 'src/index.ts',
      name: camelCaseName,
      fileName: (format: string) => {
        return `${kebabName}.${format}.js`;
      },
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: external,
    },
  };
}

import { PackageJson } from 'type-fest';

export function getBasePkgOptions(pkg: PackageJson) {
  const basePkgOption: PackageJson = {
    description: 'A Naive UI component library for Vue 3.',
    keywords: ['vue', 'vue3', 'naive-ui'],
    author: 'xby020',
    license: 'MIT',
    homepage: 'https://www.xby020.cn',
    repository: {
      type: 'git',
      url: 'git+https://github.com/xby020/naive-potato-ui.git',
    },
    sideEffects: ['**/*.css'],
  };

  return {
    ...basePkgOption,
    ...pkg,
  };
}

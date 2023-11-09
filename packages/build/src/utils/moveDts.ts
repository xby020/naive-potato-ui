// packages/build/src/generateConfig/pluginMoveDts.ts
import { PluginOption } from 'vite';
import { getParsedCommandLineOfConfigFile, sys } from 'typescript';
import { cp } from 'node:fs/promises';
import { absCwd, relCwd, usePathAbs, usePathRel } from './getPath';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { GenerateViteConfigOptions } from '../config/options';

/** 自定义插件，将 d.ts 产物从集中目录移动到子包的产物目录 */
export function pluginMoveDts(
  options?: GenerateViteConfigOptions,
): PluginOption {
  // const { entry, outDir,  dts } = getOptions(options);

  const dts = absCwd(options?.dts || '../../tsconfig.src.json');

  console.log(dts);

  // 解析用于生成 d.ts 总体产物的 tsconfig 文件，并获取解析后的配置
  const tsconfigs = getParsedCommandLineOfConfigFile(dts, {}, sys as any);

  if (!tsconfigs) {
    throw new Error(`Could not find tsconfig file: ${dts}`);
  }

  // 解析出来的路径都是绝对路径
  const { rootDir, outDir: tsOutDir } = tsconfigs.options;

  if (!rootDir || !tsOutDir) {
    throw new Error(
      `Could not find rootDir or outDir in tsconfig file: ${dts}`,
    );
  }

  const relRoot = usePathRel(rootDir);
  const absRoot = usePathAbs(rootDir);

  /** 当前包相对于根目录的路径 */
  const relPackagePath = relRoot(process.cwd());

  // 源码入口的相对路径
  const { rel: relEntryPath } = resolveEntry('src/index.ts');

  return {
    name: 'move-dts',
    apply: 'build',
    async closeBundle() {
      const source = absRoot(tsOutDir, relPackagePath, relEntryPath);
      const target = absCwd('dist', relEntryPath);

      const sourceTypes = absCwd('src/types');
      const targetTypes = absCwd('dist/types');

      console.log(sourceTypes, targetTypes);

      try {
        // 移动产物
        await cp(source, target, {
          force: true,
          recursive: true,
        });

        // 移动类型
        await cp(sourceTypes, targetTypes, {
          force: true,
          recursive: true,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`[${relPackagePath}]: failed to move dts!`);
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
  };
}

interface EntryInfo {
  /** 子包源码入口文件的绝对路径 */
  abs: string;

  /** 子包源码入口文件相对于脚本执行位置的路径 */
  rel: string;

  /** 子包源码入口是不是文件 */
  isFile: boolean;
}

/**
 * 解析子包源码入口
 * @param entry 源码入口路径
 * @returns 子包源码入口信息，解析结果
 */
export function resolveEntry(entry: string): EntryInfo {
  /** 入口绝对路径 */
  const absEntry = absCwd(entry);

  /** 入口是否为文件 */
  const isEntryFile = statSync(absEntry).isFile();

  /** 入口文件夹绝对路径 */
  const absEntryFolder = isEntryFile ? join(absEntry, '..') : absEntry;

  return {
    abs: absEntry,
    rel: relCwd(absEntryFolder),
    isFile: isEntryFile,
  };
}

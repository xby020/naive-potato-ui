/**
 * Move dts files from root dist folder to single package dist folder
 */

import { join } from 'node:path';
import { readdir, cp } from 'node:fs/promises';
import LogSymbols from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';

/** 以根目录为基础解析路径 */
const fromRoot = (...paths: string[]) => join(__dirname, '..', ...paths);

/** 包的 d.ts 产物目录 */
const PKGS_DTS_DIR = fromRoot('dist/packages');

/** 包的目录 */
const PKGS_DIR = fromRoot('packages');

/** 单个包的 d.ts 产物相对目录 */
const PKG_DTS_RELATIVE_DIR = 'dist';

/** 包的代码入口相对目录 */
const PKG_ENTRY_RELATIVE_DIR = 'src';

async function main() {
  const pkgs = await match();
  const tasks = pkgs.map(resolve);
  await Promise.all(tasks);
}

/** 寻找所有需要移动 dts 的包 */
async function match() {
  const res = await readdir(PKGS_DTS_DIR, { withFileTypes: true });
  return res.filter((item) => item.isDirectory()).map((item) => item.name);
}

/**
 * 处理单个包的 dts 移动
 * @param pkgName 包名
 */
async function resolve(pkgName: string) {
  try {
    const sourceDir = join(PKGS_DTS_DIR, pkgName, PKG_ENTRY_RELATIVE_DIR);
    const targetDir = join(PKGS_DIR, pkgName, PKG_DTS_RELATIVE_DIR);
    const sourceFiles = await readdir(sourceDir);
    const cpTasks = sourceFiles.map((file) => {
      const source = join(sourceDir, file);
      const target = join(targetDir, file);
      console.log(
        `${chalk.blue(`[${pkgName}]`)}: moving: ${source} => ${target}`,
      );
      return cp(source, target, {
        force: true,
        recursive: true,
      });
    });
    await Promise.all(cpTasks);
    console.log(`${chalk.green(`[${pkgName}]`)}: 移动成功`);
  } catch (e) {
    console.log(`${chalk.green(`[${pkgName}]`)}: 移动失败`);
  }
}

/** RUN */
async function run() {
  const log = console.log;

  log(chalk.blue(LogSymbols.info, '开始移动 dts 文件...'));

  // 检测dist目录是否存在
  if (!PKGS_DTS_DIR) {
    log(chalk.red(LogSymbols.error, 'dist目录不存在，请先执行打包命令！'));
    process.exit(1);
  }

  try {
    const pkgList = await match();
    if (pkgList.length === 0) {
      log(chalk.red(LogSymbols.error, '没有需要移动的包！'));
      process.exit(1);
    }

    log(chalk.green(LogSymbols.success, `共检测到${pkgList.length}个包`));
    pkgList.forEach((pkg, index) => {
      log(chalk.blue(index + 1), pkg);
    });

    const movingSpinner = ora('开始移动...').start();

    try {
      await main();
      movingSpinner.succeed('移动完成！');
    } catch {}
  } catch (e) {
    log(chalk.red(LogSymbols.error, 'dist目录下没有包，请先执行打包命令！'));
    process.exit(1);
  }
}

run();

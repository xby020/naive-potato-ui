import { generateViteConfig } from './src';

export async function generateVueViteConfig() {
  return generateViteConfig({
    dts: '../../tsconfig.src.json',
    vue: true,
  });
}

export async function generateNodeViteConfig() {
  return generateViteConfig({
    dts: '../../tsconfig.node.json',
    vue: false,
  });
}

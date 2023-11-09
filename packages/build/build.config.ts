import { generateViteConfig } from './src';

export async function generateVueViteConfig() {
  return generateViteConfig({
    dts: '../../tsconfig.src.json',
  });
}

export async function generateNodeViteConfig() {
  return generateViteConfig({
    dts: '../../tsconfig.src.json',
    vue: false,
  });
}

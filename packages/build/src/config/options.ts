import { UserConfig } from 'vite';

export interface GenerateViteConfigOptions extends UserConfig {
  dts?: string;
  vue?: boolean;
}

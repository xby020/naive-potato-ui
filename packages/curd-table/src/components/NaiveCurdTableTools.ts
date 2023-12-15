import { NCurdTableHeader } from '../types/curdTable';

/**
 * @description 获取可选配置
 *
 * @export
 * @param {NCurdTableHeader} header 表头配置
 * @param {keyof NCurdTableHeader} config 需要获取的配置项
 * @param {(keyof NCurdTableHeader | string)} key 需要获取的字段key
 * @param {keyof NCurdTableHeader} [headerKey] 当header根目录key与config不同时，需要传入headerKey
 * @return {*}
 */
export function getConfigWithBoolean(
  header: NCurdTableHeader<any>,
  config: keyof NCurdTableHeader,
  key: keyof NCurdTableHeader | string,
  headerKey?: keyof NCurdTableHeader,
) {
  const target = header[config] as Record<string, any> | boolean;

  if (typeof target === 'boolean') {
    if (target) {
      return headerKey
        ? header[headerKey]
        : header[key as keyof NCurdTableHeader];
    } else {
      return null;
    }
  } else if (typeof target === 'object') {
    if (target[key]) {
      return target[key];
    } else {
      return headerKey
        ? header[headerKey]
        : header[key as keyof NCurdTableHeader];
    }
  } else {
    return null;
  }
}

export function getOptionWithBoolean(
  header: NCurdTableHeader<any>,
  type: keyof NCurdTableHeader,
) {
  const target = header[type] as Record<string, any> | boolean;
  const defaultConfig = header.defaultConfig;

  if (typeof target === 'boolean') {
    if (defaultConfig) {
      return defaultConfig;
    } else {
      return undefined;
    }
  } else if (typeof target === 'object') {
    // 结合defaultConfig
    const config = Object.assign({}, defaultConfig, target);
    return config;
  } else {
    console.warn(`CurdTable: ${type}配置不存在`);
    return undefined;
  }
}

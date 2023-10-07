import { DataTableColumn } from 'naive-ui';

export type NCurdTableProps = {};

export type NCurdTableHeaderType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multSelect'
  | 'ratio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'upload'
  | 'upload-img'
  | 'richtext'
  | 'custom';

export type NCurdTableHeaderTextConfig<TForm, TInfo> = {
  type: 'text' | 'textarea';
  options: {
    type?: 'text' | 'password';
    prefix?: () => VNode;
    suffix?: () => VNode;
  };
};

export type NCurdTableHeaderRenderConfig<TForm, TInfo> = {
  show?: boolean;
  type?: NCurdTableHeaderType;
  options?: Record<string, any>;
  render?: (row: TForm, info: TInfo) => VNode | string | number;
};

/**
 * @description Curd 表格列配置
 */
export type NCurdTableHeaderColumn<TForm, TInfo> = NCurdTableHeaderRenderConfig<
  TForm,
  TInfo
> &
  DataTableColumn<TForm>;

/**
 * @description Curd 表格查询配置
 */
export type NCurdTableHeaderQuery<TForm, TInfo> = NCurdTableHeaderRenderConfig<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格创建配置
 */
export type NCurdTableHeaderCreate<TForm, TInfo> = NCurdTableHeaderRenderConfig<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格编辑配置
 */
export type NCurdTableHeaderEdit<TForm, TInfo> = NCurdTableHeaderRenderConfig<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格详情配置
 */
export type NCurdTableHeaderInfo<TForm, TInfo> = NCurdTableHeaderRenderConfig<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格字段配置
 */
export type NCurdTableHeader<TForm, TInfo> = {
  title: string;
  key: string;
  type?: NCurdTableHeaderType;
  infoRender?: (info: TInfo) => VNode | string | number;
  formRender?: (form: TForm) => VNode | string | number;
  column?: NCurdTableHeaderColumn<TForm, TInfo> | boolean;
  query?: NCurdTableHeaderQuery<TForm, TInfo> | boolean;
  create?: NCurdTableHeaderCreate<TForm, TInfo> | boolean;
  edit?: NCurdTableHeaderEdit<TForm, TInfo> | boolean;
  info?: NCurdTableHeaderInfo<TForm, TInfo> | boolean;
};

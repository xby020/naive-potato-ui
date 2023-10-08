import { DataTableColumn, SelectGroupOption, SelectOption } from 'naive-ui';

export type NCurdTableProps = {};

/**
 * @description Curd 表格字段配置类型
 */
export type NCurdTableHeaderType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'number'
  | 'select'
  | 'multSelect'
  | 'asyncSelect'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'upload'
  | 'upload-img'
  | 'richtext'
  | 'custom';

/**
 * @description Curd 表格字段通用渲染配置
 */
export type NCurdTableHeaderBaseRenderConfig<TForm, TInfo> = {
  /**
   * @description 是否展示该字段(即使不展示，该字段也会在query,create,edit表单中存在)
   * @default true
   *
   * @type {boolean}
   */
  show?: boolean;
  /**
   * @description 根据数据判断是否在表单中展示该字段，为false时，不会渲染，在最终提交表单时，也不会提交该字段
   * @default true
   */
  active?: (row: TForm, info?: TInfo) => boolean;
  /**
   * @description 根据数据判断是否禁用该字段，为true时，不可编辑
   * @default false
   *
   */
  disabled?: (row: TForm, info?: TInfo) => boolean;
  /**
   * @description 字段展示和编辑的类型
   *
   * @type {NCurdTableHeaderType}
   */
  type?: NCurdTableHeaderType;
  /**
   * @description 字段展示和编辑的配置
   *
   * @type {Record<string, any>}
   */
  config?: Record<string, any>;
  /**
   * @description 字段type为 custom 时，需要传入的render函数
   *
   */
  render?: (row: TForm, info?: TInfo) => VNode | string | number;
  /**
   * @description 字段默认值,用于create和query表单中
   *
   * @type {any}
   */
  default?: any;
};

/**
 * @description 类型为 'text' | 'textarea' | 'password' | 'number'
 */
type NCurdTableHeaderTextRenderConfig<TForm, TInfo> = {
  type: 'text' | 'textarea' | 'password' | 'number';
  config: {
    prefix?: () => VNode;
    suffix?: () => VNode;
  };
};

/**
 * @description 类型为 'select' | 'multSelect'
 */
type NCurdTableHeaderSelectRenderConfig<TForm, TInfo> = {
  type: 'select' | 'multSelect';
  config: {
    /**
     * @description select的选项
     *
     * @type {(Array<SelectOption | SelectGroupOption>)}
     */
    options: Array<SelectOption | SelectGroupOption>;
    /**
     * @description select的显示字段
     * @default "label"
     *
     * @type {string}
     */
    labelField?: string;
    /**
     * @description select的值字段
     * @default "value"
     *
     * @type {string}
     */
    valueField?: string;
  };
};

/**
 * @description 类型为 'asyncSelect'
 */
type NCurdTableHeaderAsyncSelectRenderConfig<TForm, TInfo> = {
  type: 'asyncSelect';
  config: {
    /**
     * @description select选项异步查询函数
     *
     */
    query: (params: string) => Promise<Array<SelectOption | SelectGroupOption>>;
    /**
     * @description select选项异步查询函数的参数字段
     *
     * @type {string}
     */
    queryField: string;
    /**
     * @description select的显示字段
     * @default "label"
     *
     * @type {string}
     */
    labelField?: string;
    /**
     * @description select的值字段
     * @default "value"
     *
     * @type {string}
     */
    valueField?: string;
    /**
     * @description select是否为多选
     * @default false
     *
     * @type {boolean}
     */
    multiple?: boolean;
  };
};

/**
 * @description Curd 表格字段渲染配置
 */
export type NCurdTableHeaderRenderOptions<TForm, TInfo> =
  NCurdTableHeaderBaseRenderConfig<TForm, TInfo> &
    (
      | NCurdTableHeaderTextRenderConfig<TForm, TInfo>
      | NCurdTalbeHeaderSelectRenderConfig<TForm, TInfo>
    );

/**
 * @description Curd 表格字段表格渲染配置
 */
type NCurdTableHeaderColumn<TForm, TInfo> = NCurdTableHeaderRenderOptions<
  TForm,
  TInfo
> &
  DataTableColumn<TForm>;

/**
 * @description Curd 表格查询配置
 */
type NCurdTableHeaderQuery<TForm, TInfo> = NCurdTableHeaderRenderOptions<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格创建配置
 */
type NCurdTableHeaderCreate<TForm, TInfo> = NCurdTableHeaderRenderOptions<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格编辑配置
 */
type NCurdTableHeaderEdit<TForm, TInfo> = NCurdTableHeaderRenderOptions<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格详情配置
 */
type NCurdTableHeaderInfo<TForm, TInfo> = NCurdTableHeaderRenderOptions<
  TForm,
  TInfo
>;

/**
 * @description Curd 表格字段配置
 */
export type NCurdTableHeader<
  TForm = Record<string, any>,
  TInfo = Record<string, any>,
> = {
  title: string;
  key: keyof TForm;
  type?: NCurdTableHeaderType;
  infoRender?: (info: TInfo) => VNode | string | number;
  formRender?: (form: TForm) => VNode | string | number;
  default?: any;
  column?: NCurdTableHeaderColumn<TForm, TInfo> | boolean;
  query?: NCurdTableHeaderQuery<TForm, TInfo> | boolean;
  create?: NCurdTableHeaderCreate<TForm, TInfo> | boolean;
  edit?: NCurdTableHeaderEdit<TForm, TInfo> | boolean;
  info?: NCurdTableHeaderInfo<TForm, TInfo> | boolean;
};

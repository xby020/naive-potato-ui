import {
  DataTableColumn,
  FormItemRule,
  FormRules,
  SelectGroupOption,
  SelectOption,
  UploadFileInfo,
} from 'naive-ui';

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
  | 'datetime'
  | 'time'
  | 'upload'
  | 'custom';

export type NCurdTableFormRules = {
  [itemValidatePath: string]: FormItemRule | Array<FormItemRule> | FormRules;
};

/**
 * @description Curd 表格字段通用渲染配置
 */
export type NCurdTableHeaderBaseRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  /**
   * @description 字段标题
   *
   * @type {string}
   */
  title?: string;
  /**
   * @description 是否展示该字段(即使不展示，该字段也会在query,create,edit表单中存在)
   * @default true
   *
   * @type {boolean}
   */
  show?: boolean;
  /**
   * @description 渲染时使用的key，未设置会使用根目录的key
   *
   * @type {string}
   */
  key?: string;
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
  required?: boolean;
  rule?: FormItemRule | Array<FormItemRule>;
};

/**
 * @description 类型为 'text' | 'textarea' | 'password' | 'number'
 */
type NCurdTableHeaderTextRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'text' | 'textarea' | 'password' | 'number';
  config?: {
    prefix?: () => VNode;
    suffix?: () => VNode;
  };
};

/**
 * @description 类型为 'select' | 'multSelect'
 */
type NCurdTableHeaderSelectRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'select' | 'multSelect';
  config?: {
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
type NCurdTableHeaderAsyncSelectRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'asyncSelect';
  config?: {
    /**
     * @description select选项异步查询函数
     *
     */
    query: (params: Record<string, any>) => Promise<Record<string, any>>;
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
 * @description 类型为 'radio'
 */
type NCurdTableHeaderRadioRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'radio';
  config?: {
    /**
     * @description radio的选项
     *
     * @type {(Array<SelectOption | SelectGroupOption>)}
     */
    options: Array<SelectOption | SelectGroupOption>;
    /**
     * @description radio的显示字段
     * @default "label"
     *
     * @type {string}
     */
    labelField?: string;
    /**
     * @description radio的值字段
     * @default "value"
     *
     * @type {string}
     */
    valueField?: string;
  };
};

/**
 * @description 类型为 'date'  | 'datetime'
 */
type NCurdTableHeaderDateRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'date' | 'datetime';
  config?: {
    /**
     * @description 日期格式(见[🔗date-fns format 文档](https://date-fns.org/v2.23.0/docs/format))
     *
     * @type {string}
     */
    format: string;
    /**
     * @description 日期是否是范围选择
     * @default false
     *
     * @type {boolean}
     */
    range?: boolean;
    /**
     * @description 日期范围选择时，开始日期字段
     *
     * @type {string}
     */
    startField?: string;
    /**
     * @description 日期范围选择时，结束日期字段
     *
     * @type {string}
     */
    endField?: string;
    /**
     * @description 自定义快捷按钮
     *
     */
    shortcuts?:
      | Record<string, number | (() => number)>
      | Record<string, [number, number] | (() => [number, number])>;
  };
};

/**
 * @description 类型为 'time'
 */
type NCurdTableHeaderTimeRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'time';
  config?: {
    /**
     * @description 时间格式(见[🔗date-fns format 文档](https://date-fns.org/v2.23.0/docs/format))
     *
     * @type {string}
     */
    format: string;
    /**
     * @description 时间是否是范围选择
     * @default false
     *
     * @type {boolean}
     */
  };
};

type NCurdTableHeaderUploadRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'upload';
  config?: {
    /**
     * @description 上传文件按钮的文本
     *
     * @type {string}
     */
    label?: string | VNode;
    /**
     * @description 额外的form信息
     *
     * @type {Record<string, any>}
     */
    info?: Record<string, any>;
    /**
     * @description 显示在上传按钮下方的提示
     *
     * @type {string}
     */
    tips?: string;
    /**
     * @description 接受的文件类型，参考 [accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
     *
     * @type {string}
     */
    accept?: string;
    /**
     * @description 请求提交的地址
     *
     * @type {string}
     */
    action?: string;
    /**
     * @description HTTP 请求需要附加的 Headers
     *
     * @type {Record<string, string>}
     */
    headers?: Record<string, string>;
    /**
     * @description 提交表单需要附加的数据
     *
     * @type {Record<string, string>}
     */
    extraData?: Record<string, string>;
    /**
     * @description 是否禁用
     * @default false
     *
     * @type {boolean}
     */
    disabled?: boolean;
    /**
     * @description 文件列表的内建样式，text、image 和 image-card
     *
     * @type {('text' | 'image' | 'image-card')}
     */
    type?: 'text' | 'image' | 'image-card';
    /**
     * @description 限制上传文件数量
     *
     * @type {number}
     */
    max?: number;
    /**
     * @description 是否支持多个文件
     *
     * @type {boolean}
     */
    multiple?: boolean;
    /**
     * @description 转换上传文件和返回所需数据
     *
     */
    parse?: {
      /**
       * @description 从上传接口返回数据转换到所需数据
       *
       */
      get?: (
        info: Record<string, any> | string | number,
      ) => Record<string, any> | string | number;
      /**
       * @description 从传入formValue转换到标准上传数据结构
       *
       */
      set?: (
        info: Record<string, any> | string | number,
      ) => UploadFileInfo | null;
    };
  };
};

type NCurdTableHeaderCustomRenderConfig<
  TForm = Record<string, any>,
  TInfo = TForm,
> = {
  type?: 'custom';
};

/**
 * @description Curd 表格字段渲染配置
 */
export type NCurdTableHeaderRenderOptions<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderBaseRenderConfig<TForm, TInfo> &
  (
    | NCurdTableHeaderTextRenderConfig<TForm, TInfo>
    | NCurdTableHeaderSelectRenderConfig<TForm, TInfo>
    | NCurdTableHeaderAsyncSelectRenderConfig<TForm, TInfo>
    | NCurdTableHeaderRadioRenderConfig<TForm, TInfo>
    | NCurdTableHeaderDateRenderConfig<TForm, TInfo>
    | NCurdTableHeaderTimeRenderConfig<TForm, TInfo>
    | NCurdTableHeaderUploadRenderConfig<TForm, TInfo>
    | NCurdTableHeaderCustomRenderConfig<TForm, TInfo>
  );

type Column<T> = Omit<
  DataTableColumn<T>,
  keyof NCurdTableHeaderRenderOptions<T>
>;

/**
 * @description Curd 表格字段表格渲染配置
 */
type NCurdTableHeaderColumn<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderRenderOptions<TForm, TInfo> &
  Column<TForm> & { key?: string };

/**
 * @description Curd 表格查询配置
 */
type NCurdTableHeaderQuery<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderRenderOptions<TForm, TInfo>;

/**
 * @description Curd 表格创建配置
 */
type NCurdTableHeaderCreate<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderRenderOptions<TForm, TInfo>;

/**
 * @description Curd 表格编辑配置
 */
type NCurdTableHeaderEdit<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderRenderOptions<TForm, TInfo>;

/**
 * @description Curd 表格详情配置
 */
type NCurdTableHeaderInfo<
  TForm = Record<string, any>,
  TInfo = TForm,
> = NCurdTableHeaderRenderOptions<TForm, TInfo>;

/**
 * @description Curd 表格字段配置
 */
export type NCurdTableHeader<TForm = Record<string, any>, TInfo = TForm> = {
  title: string;
  key: keyof TForm | string;
  type?: NCurdTableHeaderType;
  infoRender?: (info: TInfo) => VNode | string | number;
  formRender?: (form: TForm) => VNode | string | number;
  default?: any;
  defaultConfig?: NCurdTableHeaderRenderOptions<TForm, TInfo>;
  column?: NCurdTableHeaderColumn<TForm, TInfo> | boolean;
  query?: NCurdTableHeaderQuery<TForm, TInfo> | boolean;
  create?: NCurdTableHeaderCreate<TForm, TInfo> | boolean;
  edit?: NCurdTableHeaderEdit<TForm, TInfo> | boolean;
  info?: NCurdTableHeaderInfo<TForm, TInfo> | boolean;
};

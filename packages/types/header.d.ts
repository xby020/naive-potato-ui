import {
  DataTableBaseColumn,
  FormRules,
  FormItemRule,
  SelectOption,
} from 'naive-ui';
import { VNode } from 'vue';
import { ListType } from 'naive-ui/es/upload/src/interface';

interface NaiveCurdTableColumn<T> extends DataTableBaseColumn<T> {
  /**
   * @description 表格列标题，没有则从全局获取
   *
   * @type {string}
   * @memberof SugonDataTableColumn
   */
  title?: string;
  /**
   * @description 表格列的字段key，没有则从全局获取
   *
   * @type {string}
   * @memberof SugonDataTableColumn
   */
  key?: string;
}

export type Header<T> = {
  title: string;
  key: string;
  /**
   * @description: 是否在表格内显示
   *
   * @type {boolean}
   * @memberof Header
   */
  show?: boolean;
  /**
   * @description: 表格列配置，参考https://www.naiveui.com/zh-CN/os-theme/components/data-table#API
   *
   * @type {SugonDataTableColumn<T>}
   * @memberof Header
   */
  column?: SugonDataTableColumn<T>;
  /**
   * @description: 是否作为查询字段
   *
   * @type {boolean}
   * @memberof Header
   */
  query?: boolean;
  type?:
    | 'input'
    | 'inputNumber'
    | 'inputArea'
    | 'select'
    | 'multSelect'
    | 'switch'
    | 'ratioGroup'
    | 'date'
    | 'time'
    | 'datetime'
    | 'upload'
    | 'upload-img'
    | 'richtext'
    | 'custom';
  /**
   * @description: 当 type 为 upload/upload-img 类型时的配置
   */
  uploadConfig?: {
    action?: string;
    accept?: string;
    max?: number;
    multiple?: boolean;
    // 默认的文件字段
    file?: string;
    listType?: ListType;
  };

  switchConfig?: {
    checkValue: string | number | boolean;
    unCheckedValue: string | number | boolean;
  };

  extraInfo?: string;

  /**
   * @description: type 为 select/multSelect 查询字段配置
   *
   * @type {{ label: string; value: string; disabled?: boolean }[]}
   */
  option?: () => SelectOption[];
  /**
   * @description: type 为 date/time/datetime 时的定义后端接收的格式
   *
   * @type {string}
   */
  format?: string;
  /**
   * @description: type 为 custom 自定义查询字段渲染的组件
   *
   */
  render?: (model: any) => VNode;
  /**
   * @description: type 为 custom 自定义查询字段渲染的组件的 props 默认值
   *
   * @type {*}
   */
  default?: any;

  prefixHeader?: (model: T, info: T) => VNode;

  /**
   * @description: 是否在新增表单出现
   */
  add?: boolean | 'custom';
  addRule?:
    | FormRules
    | FormItemRule
    | FormItemRule[]
    | ((model: T) => FormRules | FormItemRule | FormItemRule[]);
  addRender?: (model: T, info: T) => VNode;
  /**
   * @description: 是否在编辑表单出现
   */
  edit?: boolean | 'custom';
  editRule?:
    | FormRules
    | FormItemRule
    | FormItemRule[]
    | ((model: T) => FormRules | FormItemRule | FormItemRule[]);
  editRender?: (model: T, info: T) => VNode;
  /**
   * @description: 是否在详情表单出现
   */
  detail?: boolean | 'custom';
  /**
   * @description: 详情表单自定义渲染
   */
  detailRender?: (model: T) => VNode | string | number;
  /**
   * @description: 占据行数
   *
   * @type {number}
   */
  span?: number;
  deprecated?: (model: T) => boolean;
};

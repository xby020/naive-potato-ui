/**
 * @description CurdTable组件的props类型定义
 */
export type NaiveCurdTableProps = {
  /**
   * @description 是否分页
   *
   * @type {boolean}
   */
  paginate?: boolean;
  /**
   * @description 分页时每页条数
   *
   * @type {number}
   */
  pageSize?: number;
  /**
   * @description 表格增删查改字段配置
   *
   * @type {Header<any>[]}
   */
  headers: Header<any>[];
  /**
   * @description 是否隐藏所有条目的编辑按钮
   *
   * @type {boolean}
   */
  hideColumnEdit?: boolean;

  /**
   * @description 是否隐藏所有条目的详情按钮
   *
   * @type {boolean}
   */
  hideColumnDetail?: boolean;

  /**
   * @description 是否隐藏所有条目的删除按钮
   *
   * @type {boolean}
   */
  hideColumnDelete?: boolean;

  /**
   * @description 查询列表异步方法，接受查询参数，返回条目数量和当前页列表
   *
   */
  query: (params: any) => Promise<any>;

  /**
   * @description 查询详情异步方法，接受条目uuid，返回条目详情
   *
   */
  queryDetail: (params: any) => Promise<any>;

  /**
   * @description 删除条目异步方法，接受条目uuid
   *
   */
  delete?: (params: any) => Promise<any>;

  /**
   * @description 创建条目异步方法，接受条目详情
   *
   */
  create?: (params: any) => Promise<any>;

  /**
   * @description 更新条目异步方法，接受条目uuid和条目详情
   *
   */
  update?: (uuid: string, params: Record<string, any>) => Promise<any>;

  /**
   * @description 当前选中的条目uuid（编辑、详情、删除时使用）
   *
   * @type {string}
   */
  choosen: string;

  /**
   * @description 新建/编辑/详情时的抽屉是否全屏
   *
   * @type {boolean}
   */
  fullScreenDrawer?: boolean;

  /**
   * @description 需要表格X轴滚动时设定的宽度
   *
   * @type {number}
   */
  scrollX?: number;

  /**
   * @description 表单的列数
   * @default 1
   *
   * @type {number}
   */
  cols?: number;

  /**
   * @description 所有条目的操作列开头的自定义操作, 接受条目uuid，返回VNode数组
   *
   */
  prefixAction?: (uuid: any) => VNode[];

  /**
   * @description 所有条目的操作列结尾的自定义操作, 接受条目uuid，返回VNode数组
   *
   */
  suffixAction?: (uuid: any) => VNode[];

  /**
   * @description 表单的自定义样式，一般用于定义宽度
   *
   * @type {Record<string, any>}
   */
  tableFormStyle?: Record<string, any>;

  /**
   * @description 表格条目是否可编辑
   *
   */
  editable?: (info: any) => boolean;

  /**
   * @description 表格条目是否可查看详情
   *
   */
  detailable?: (info: any) => boolean;

  /**
   * @description 表格条目是否可删除
   *
   */
  deletable?: (info: any) => boolean;

  /**
   * @description 表格是否可勾选，以及获取勾选条目的uuid方法
   *
   */
  rowKey?: (row: any) => any;

  /**
   * @description 自定义表格操作列的宽度
   *
   * @type {number}
   */
  actionWidth?: number;
};

export type NaiveCurdTableInputType =
  | 'text'
  | 'textArea'
  | 'number'
  | 'select'
  | 'multSelect'
  | 'switch'
  | 'ratioGroup'
  | 'date'
  | 'time'
  | 'datetime'
  | 'upload'
  | 'richText'
  | 'custom';

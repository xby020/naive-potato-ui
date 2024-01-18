---
layout: doc
layoutClass: m-nav-layout
---

# Curd表格 Curd Table

## 演示

:::demo

[基础表格](../demo/curdTable/CurdTable1.vue)

```markdown
> 包含增删查改,即`curd`所有功能的表格
```

:::

## API

### Props

:::api

- *headers[NCurdTableHeader[]](-):表格的配置文件，具体见下表
- *query[(queryParams: Record<string, any>) => Promise<Record<string, any>>](-):查询列表的查询方法，接受查询参数(在props.headers中配置)并返回查询结果列表，**返回结果格式需要符合要求** 
- message[Record<success|info|warning|error,Function>](-):消息提示方法，必须为对象，包含success、info、warning、error四个方法
- countField[string]('count'):查询结果中的总数字段名
- dataField[string]('data'):查询结果中的数据列表字段名
- idField[string]('uuid'):查询结果中数据列表的id字段名
- extraQuery[Record<string, any>]({}):查询列表的额外参数，会与查询参数合并
- serialNumber[boolean](false):是否显示序号列
- checkable[boolean](false):是否显示复选框列
- checkDisabled[(row: Record<string, any>) => boolean](false):复选框是否禁用的判断方法，接受当前行数据，返回布尔值
- checked[string[] | number[]]([]):复选框选中的行的id数组
- rowKey[(row: TInfo) => string | number](row => row[rowKeyField|'uuid']):行的key的生成方法，接受当前行数据，返回字符串或数字,不复杂的情况下直接设置rowKeyField
- rowKeyField[string]('uuid'):行的key的字段名
- prefixAction[(row: TInfo | Record<string, any>) => VNode](undefined):默认操作列前面的操作按钮，接受当前行数据，返回VNode
- suffixAction[(row: TInfo | Record<string, any>) => VNode](undefined):默认操作列后面的操作按钮，接受当前行数据，返回VNode
- actionWidth[number]('auto'):操作列的宽度(px)
- choosen[string | number]():当前操作选中的行的id(编辑、详情和删除操作)
- cols[number](1):新增、编辑、详情时显示的列数；
- create[Function](undefined):新增方法，接受新增的数据表单，**未设置时顶部新增按钮不会显示**
- queryDetail[Function](undefined):查询详情方法，接受当前行数据，返回详情数据，**未设置时详情按钮不会显示**
- edit[Function](undefined):编辑方法，接受编辑的行数据表单，**未设置时编辑按钮不会显示**
- delete[Function](undefined):删除方法，接受删除的行数据，**未设置时删除按钮不会显示**
- hideCreate[boolean](false):是否隐藏新增按钮
- hideColumnEdit[boolean](false):是否隐藏列编辑按钮
- editable[(row: TInfo) => boolean](false):是否可编辑的判断方法，接受当前行数据，返回布尔值
- hideColumnInfo[boolean](false):是否隐藏列信息按钮
- infoable[(row: TInfo) => boolean](false):是否可查看详情的判断方法，接受当前行数据，返回布尔值
- hideColumnDelete[boolean](false):是否隐藏列删除按钮
- deletable[(row: TInfo) => boolean](false):是否可删除的判断方法，接受当前行数据，返回布尔值
- hideAction[boolean](false):是否隐藏整个操作列

:::

### 表格配置文件

`NpCurdTableHeader`,`props.header`的类型,本组件的配置类型

#### 基础配置

基础部分的配置,`TForm`为列表接口返回的数据类型,`TInfo`为详情接口返回的数据类型

- `info`部分指的是在组件中显示的部分，包括表格内的显示，详情的显示；
- `form`部分指的是在组件中编辑的部分，包括表格内的编辑，新增的编辑，详情的编辑以及查询时的form部分；

:::api

- *title[string](-):列标题,在表格列头显示
- *key[ keyof TForm | string](-):列的字段名,用于在查询结果中取值
- infoRender[(info: TInfo) => VNode | string | number](-):渲染详情的默认方法，渲染详情的时候如果没有单独配置，则使用此方法渲染
- formRender[(form: TForm) => VNode | string | number](-):渲染表单的默认方法，渲染表单的时候如果没有单独配置，则使用此方法渲染
- default[any](undefined):默认值，用于新增时的表单默认值
- defaultConfig[NCurdTableHeaderRenderOptions< TForm, TInfo >](-):当显示和编辑都为同义字段，且显示/编辑的逻辑一样，可以只编辑此配置,后续下面的配置未设置时会使用此配置
- column[NCurdTableHeaderColumn< TForm, TInfo>](-):表格中显示的配置
- query[NCurdTableHeaderQuery< TForm >](-):查询时的配置
- create[NCurdTableHeaderCreate< TForm >](-):新增时的配置
- edit[NCurdTableHeaderEdit< TForm >](-):编辑时的配置
- info[NCurdTableHeaderInfo< TInfo >](-):详情时的配置

:::

#### 渲染配置

渲染的配置，用于配置当前字段的显示和编辑的逻辑，单个配置在显示和编辑时的渲染方式已经预先配置好，如果需要自定义渲染方式，可以在设置时使用类型`custom`，并在`render`属性中配置自定义渲染方法

当前字段类型有(`NCurdTableHeaderType`):

| 类型        | 说明                                                          |
| ----------- | ------------------------------------------------------------- |
| text        | 文本                                                          |
| textarea    | 多行文本                                                      |
| password    | 密码                                                          |
| number      | 数字                                                          |
| select      | 下拉框                                                        |
| multSelect  | 多选下拉框                                                    |
| asyncSelect | 异步选择(需引入 [AsyncSelect](/components/async-select.html)) |
| radio       | 单选框                                                        |
| date        | 日期                                                          |
| datetime    | 日期时间                                                      |
| time        | 时间                                                          |
| upload      | 上传                                                          |
| custom      | 自定义渲染组件                                                |



##### 渲染基础配置

:::api

- title[string](-):字段标题，用于表格表头，表单label
- show[boolean](true):是否展示该字段(即使不展示，该字段也会在query,create,edit表单中存在)
- active[(row: TForm, info?: TInfo) => boolean](-):根据数据判断是否在表单中展示该字段，为false时，不会渲染，在最终提交表单时，也不会提交该字段
- disabled[(row: TForm, info?: TInfo) => boolean](-):根据数据判断是否禁用该字段，为true时，不可编辑
- type[NCurdTableHeaderRenderType]('text'):字段展示和编辑的类型，用于表单的渲染
- config[Record<string,any>](undefined):字段展示和编辑的配置，根据不同的 `type` 配置不同，用于表单的渲染，更多具体配置见下表
- render[(row: TForm, info?: TInfo) => VNode | string | number](-):字段展示和编辑的自定义渲染方法，当字段 `type` 为 `custom` 时，用于表单的渲染
- default[any](undefined):默认值，用于新增时的表单默认值
- required[boolean](false):简单根据是否填写/选择判断是否必填，用于表单的渲染，复杂判断条件使用 `rules` 属性
- rules[Record<string,any>[]](undefined):校验规则，当判断规则比较复杂时覆盖 `required` 属性，用于表单的渲染

:::


##### 渲染类型配置

根据[渲染类型](#渲染配置)的不同(`type`)，进行相应的配置,下方列出的为 `type` 为特定值时，`config` 的配置

###### 字符类型

> type 为'text' | 'textarea' | 'password' | 'number'

::: api

- prefix[() => VNode](-):前缀，在显示和编辑时会显示在前面，一般用于显示单位
- suffix[() => VNode](-):后缀，在显示和编辑时会显示在后面，一般用于显示单位，状态或功能按钮

:::

###### 选择类型

> type 为'select' | 'multSelect'

::: api

- options[Array<SelectOption | SelectGroupOption>](-):下拉框的选项，格式参考Naive UI 的 Select - options
- labelField[string]('label'):下拉框选项的label字段名
- valueField[string]('value'):下拉框选项的value字段名

:::

###### 异步选择类型

> type 为'asyncSelect'
>
> 需引入 [AsyncSelect](/components/async-select.html) , config配置参考[AsyncSelect props](/components/async-select.html#api)

###### 单选类型

> type 为'radio'

同[选择类型](#选择类型)

###### 日期类型

> type 为'date' | 'datetime'

::: api

- *format[string](-):日期格式(见[🔗date-fns format 文档](https://date-fns.org/v2.23.0/docs/format))
- range[boolean](false):是否为范围选择
- startField[string]('start'):范围选择的开始字段名
- endField[string]('end'):范围选择的结束字段名

:::

###### 时间类型

> type 为'time'

:::api

- *format[string](-):时间格式(见[🔗date-fns format 文档](https://date-fns.org/v2.23.0/docs/format))
- range[boolean](false):是否为范围选择

:::


### Method

| 方法名     | 说明                     | 参数 |
| ---------- | ------------------------ | ---- |
| resetQuery | 重置查询，恢复到默认状态 | -    |
| queryData  | 基于当前查询刷新数据     | -    |
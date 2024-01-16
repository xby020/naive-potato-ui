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

### Method

| 方法名     | 说明                     | 参数 |
| ---------- | ------------------------ | ---- |
| resetQuery | 重置查询，恢复到默认状态 | -    |
| queryData  | 基于当前查询刷新数据     | -    |
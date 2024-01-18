---
layout: doc
layoutClass: m-nav-layout
---

# 异步选择 Async Select

## 演示

### 基础用法
:::demo

[基础表格](../demo/asyncSelect//AsyncSelect1.vue)

```markdown
> query方法可以复用`CurdTable`中的`query`方法，将分页表格接口转换为异步选择接口

```

:::

### 自定义返回值类型
:::demo

[基础表格](../demo/asyncSelect//AsyncSelect2.vue)

```markdown
> 如果返回值的`key`和`value`不是`label`和`value`，可以通过`labelField`和`valueField`来指定

```
:::

### 多选
:::demo

[基础表格](../demo/asyncSelect//AsyncSelect3.vue)

```markdown
> 通过`multiple`属性来指定是否多选

```
:::

## API

### Props

:::api

- *query[(options: Record<string, any>) => Promise<count:number,items:{[labelField]:string,[valueField]:any}[]>](-):查询方法，接受参数对象，返回查询后的标签组。**返回结果需包含条目数量`count`和条目数组`items`。**
- value[string | string[]](-):当前选中的值
- labelField[string]('label'):返回条目标签字段名
- valueField[string]('value'):返回条目值字段名
- queryField[string]('name'):输入查询字段名
- placeholder[string]('请选择'):输入框占位符
- disabled[boolean](false):是否禁用
- multiple[boolean](false):是否多选

:::

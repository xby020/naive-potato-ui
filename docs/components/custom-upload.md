---
layout: doc
layoutClass: m-nav-layout
---

# Custom Upload 自定义上传

## 演示

:::demo

[基础上传](../demo/customUpload/CustomUpload1.vue)

```markdown
> 包含增删查改,即`curd`所有功能的表格
```

:::

## API

### Props

:::api

- *value[UploadFileInfo[]](-):当前上传的文件列表
- label[string](''):上传按钮的文字
- accept[string](''):接受上传的文件类型
- action[string](''):上传的地址
- headers[Record<string, string>]({}):上传的请求头部
- extraData[Record<string, string>]({}):上传的额外参数
- disabled[boolean](false):是否禁用
- type['text' | 'image' | 'image-card'](text):上传按钮的类型
- max[number](-):最大上传数量
- multiple[boolean](-):是否支持多选文件

:::
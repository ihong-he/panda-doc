---
outline: deep
---

# useTable 表格 Hook 开发文档

## 1. 概述

`useTable` 是一个 Vue 3 组合式 API Hook，用于快速构建带有以下功能的表格页面：

- 表格列配置管理
- 异步数据请求与加载状态
- 分页处理（自动回调上一页）
- Checkbox 多选/单选功能
- 表格排序功能

---

## 2. 参数配置 (Props)

```javascript
useTable({
  tableRef,           // 【必填】表格组件的 ref
  request,            // 【必填】接口请求函数
  tableConfig,        // 【必填】表格列配置（数组）
  params,             // 请求默认参数
  callback,           // 数据处理回调
  setTotal,           // 设置总数据条数的函数
  dataId = 'id',      // 数据唯一标识字段，默认 'id'
  init = true,        // 是否初始化时自动请求，默认 true
  sortConfigData,     // 排序配置对象
  setFormItem,         // 设置表单项的函数（用于排序）
  submit,             // 提交/刷新函数
  sortName,           // 排序字段前缀，用于后端多表查询
  noLine = false,     // 是否不转换驼峰为下划线
  pageForm,           // 分页表单 ref
  pageParamsName,     // 分页参数名配置 { pageNum: 'pageNum', pageSize: 'pageSize' }
  successCallBack,    // 请求成功回调
  errorCallBack,      // 请求失败回调
})
```

### 参数详细说明

| 参数              | 类型     | 必填 | 说明                                                         |
| ----------------- | -------- | ---- | ------------------------------------------------------------ |
| `tableRef`        | Ref      | ✅    | 表格组件实例，通过 `ref(null)` 创建                          |
| `request`         | Function | ✅    | 接口请求函数，通常是 API 方法                                |
| `tableConfig`     | Array    | ✅    | 表格列配置数组                                               |
| `params`          | Object   | -    | 默认请求参数                                                 |
| `setTotal`        | Function | -    | 设置总条数的回调，接收 `total` 参数                          |
| `dataId`          | String   | -    | 数据唯一标识，默认 `'id'`，用于 checkbox 识别                |
| `init`            | Boolean  | -    | 是否初始化时自动请求，默认 `true`                            |
| `sortConfigData`  | Object   | -    | 排序配置：`{ remote: true/false, defaultSort: {...}, sortChange: fn }` |
| `setFormItem`     | Function | -    | 设置表单项的函数，用于排序参数                               |
| `submit`          | Function | -    | 提交/刷新函数，排序变化时触发                                |
| `sortName`        | String   | -    | 排序字段前缀，如 `'user.name'`                               |
| `noLine`          | Boolean  | -    | `true` 时不转换驼峰为下划线                                  |
| `pageForm`        | Ref      | -    | 分页表单 ref                                                 |
| `pageParamsName`  | Object   | -    | 分页参数名，如 `{ pageNum: 'pageNum', pageSize: 'pageSize' }` |
| `successCallBack` | Function | -    | 请求成功后的回调，接收响应数据                               |
| `errorCallBack`   | Function | -    | 请求失败后的回调                                             |

---

## 3. 返回值 (Returns)

```javascript
const {
  loading,           // 加载状态 (ref)
  checkLoading,     // 手动控制 loading 的函数
  doResult,         // 手动触发请求的方法
  tableColumns,     // 表格列配置 (ref，可动态修改)
  setTableColumns,  // 动态设置列配置的方法
  setTableConfigs,  // 批量设置表格配置
  tableData,        // 表格数据 (ref)
  checkedRecord,    // 选中行的数据数组 (ref)
  onCheckboxChange,  // checkbox 变化回调
  radioChange,      // radio 变化回调
  clearCheckedRecord, // 清空选中记录
  sortConfig,       // 排序配置对象
  setRequest,       // 动态修改请求函数
} = useTable({ ... })
```

### 返回值详细说明

| 返回值               | 类型           | 说明                                                         |
| -------------------- | -------------- | ------------------------------------------------------------ |
| `loading`            | Ref\<boolean\> | 表格加载状态，`true` 表示加载中                              |
| `checkLoading`       | Function       | 手动控制 loading：`checkLoading(true)` 开启，`checkLoading(false)` 关闭 |
| `doResult`           | Function       | 手动触发请求，接收搜索参数对象                               |
| `tableColumns`       | Ref\<Array\>   | 表格列配置，可响应式修改                                     |
| `setTableColumns`    | Function       | 动态修改列属性：`setTableColumns(field, propName, value)`    |
| `setTableConfigs`    | Function       | 批量设置列配置：`setTableConfigs(configArray)`               |
| `tableData`          | Ref\<Array\>   | 表格数据源                                                   |
| `checkedRecord`      | Ref\<Array\>   | 当前所有选中的行数据                                         |
| `onCheckboxChange`   | Function       | checkbox 变化事件回调                                        |
| `radioChange`        | Function       | radio 变化事件回调                                           |
| `clearCheckedRecord` | Function       | 清空所有选中行                                               |
| `sortConfig`         | Object         | 排序配置，传递给表格组件的 `sort-config` 属性                |
| `setRequest`         | Function       | 动态修改请求函数                                             |

---

## 4. 使用示例

### 基础用法

```vue
<template>
  <hj-table
    ref="tableRef"
    :loading="loading"
    :columns="tableColumns"
    :data="tableData"
    :sort-config="sortConfig"
    @checkbox-change="onCheckboxChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import useTable from '@/hooks/useTable'
import { getUserList } from '@/api/user'

const tableRef = ref(null)

const { loading, tableColumns, tableData, doResult } = useTable({
  tableRef,
  request: getUserList,
  tableConfig: [
    { type: 'checkbox', fixed: 'left' },
    { field: 'name', title: '姓名' },
    { field: 'age', title: '年龄' },
    { field: 'action', title: '操作', fixed: 'right' }
  ],
  params: { status: 1 },
  setTotal: (total) => console.log('总数:', total)
})

// 手动刷新
const handleRefresh = () => {
  doResult({ pageNum: 1, pageSize: 10 })
}
</script>
```

### 分页 + 排序完整示例

```vue
<template>
  <div>
    <hj-table
      ref="tableRef"
      :loading="loading"
      :columns="tableColumns"
      :data="tableData"
      :sort-config="sortConfig"
      @checkbox-change="onCheckboxChange"
      @radio-change="radioChange"
    />
    
    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="pageForm.pageNum"
      v-model:page-size="pageForm.pageSize"
      :total="total"
      @current-change="handlePageChange"
    />
    
    <!-- 选中的数据 -->
    <div>已选中: {{ checkedRecord.length }} 条</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import useTable from '@/hooks/useTable'
import { getUserList } from '@/api/user'

const tableRef = ref(null)
const total = ref(0)

// 分页表单
const pageForm = reactive({
  pageNum: 1,
  pageSize: 10
})

// 排序相关
const setFormItem = (key, val) => {
  pageForm[key] = val
}

const { 
  loading, 
  tableColumns, 
  tableData, 
  checkedRecord,
  onCheckboxChange,
  radioChange,
  clearCheckedRecord,
  doResult,
  sortConfig
} = useTable({
  tableRef,
  request: getUserList,
  tableConfig: [
    { type: 'checkbox', fixed: 'left' },
    { type: 'radio', fixed: 'left' },
    { field: 'name', title: '姓名', sortable: true },
    { field: 'age', title: '年龄', sortable: true },
    { field: 'status', title: '状态' }
  ],
  tableConfig: tableConfig,
  params: {},
  setTotal: (val) => total.value = val,
  dataId: 'id',
  setFormItem,
  submit: () => doResult(pageForm),
  sortName: 'user',
  pageForm,
  pageParamsName: { pageNum: 'pageNum', pageSize: 'pageSize' }
})

// 分页变化
const handlePageChange = (page) => {
  pageForm.pageNum = page
  doResult(pageForm)
}

// 清空选择
const handleClear = () => {
  clearCheckedRecord()
}
</script>
```

### 动态修改列配置

```javascript
const { setTableColumns, tableColumns } = useTable({ ... })

// 隐藏某列
setTableColumns('name', 'visible', false)

// 显示某列
setTableColumns('name', 'visible', true)

// 禁用某列
setTableColumns('age', 'disabled', true)

// 批量修改
setTableConfigs([
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80 }
])
```

---

## 5. 表格列配置说明

表格列配置支持以下属性：

```javascript
const columns = [
  { type: 'checkbox', fixed: 'left' },     // 复选框列
  { type: 'radio', fixed: 'left' },        // 单选列
  { field: 'name', title: '姓名' },        // 普通列
  { field: 'action', title: '操作', fixed: 'right' }  // 操作列（默认固定右侧）
]
```

### 自动处理逻辑

1. **`type: 'checkbox'`** - 自动固定在左侧（`fixed: 'left'`）
2. **`field: 'action'`** - 自动固定在右侧（`fixed: 'right'`）
3. 支持响应式修改 - 修改 `tableColumns` 后自动更新表格

---

## 6. 父子级联 checkbox（高级用法）

该 Hook 支持父子数据级联勾选功能：

```javascript
const { onCheckboxChange } = useTable({
  tableRef,
  request: getList,
  tableConfig: columns,
  // 需要配置级联字段
  // relevanceField: 是否有子级的字段名
  // parentField: 父级关联字段
  // childField: 子级关联字段
})

// 在表格组件中绑定事件
<template #checkbox="{ row, data, checked }">
  <hj-checkbox
    :checked="checked"
    @change="onCheckboxChange({
      row,
      data,
      checked,
      relevanceField: 'children',
      parentField: 'id',
      childField: 'parentId'
    })"
  />
</template>
```

---

## 7. 注意事项

1. **tableRef 必须传入** - 用于操作表格内部方法（如 `setCheckboxRow`）
2. **dataId 建议指定** - 如果数据中 ID 字段不是 `id`，需显式传入
3. **排序字段转换** - 默认会将驼峰转为下划线（如 `userName` → `user_name`），设置 `noLine: true` 可禁用
4. **全选逻辑** - `onCheckboxAll` 仅处理当前页数据的全选/取消全选
5. **分页自动回调** - 当数据为空且不是第一页时，自动请求上一页
6. **成功/失败回调** - 都会自动清空 `checkedRecord` 的选中状态

---

## 8. 常见问题

**Q: 如何获取选中的数据？**
> A: 通过 `checkedRecord.value` 获取当前所有选中的行数据

**Q: 如何手动触发请求？**
> A: 调用 `doResult(params)` 方法，传入新的搜索参数

**Q: 如何动态隐藏/显示列？**
> A: 使用 `setTableColumns(field, 'visible', false/true)`

**Q: 如何清空选中状态？**
> A: 调用 `clearCheckedRecord()` 方法

**Q: 请求函数如何动态修改？**
> A: 使用 `setRequest(newRequest)` 方法

---

这份文档能帮助团队成员快速上手使用 `useTable` hooks。
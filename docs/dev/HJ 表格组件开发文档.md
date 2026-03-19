---
outline: deep
---

# HJ 表格组件开发文档

## 一、组件概述

`@/components/hj` 是一套基于 **vxe-grid** 封装的 Vue 3 表格组件库，包含以下组件：

| 组件         | 说明                                         |
| ------------ | -------------------------------------------- |
| `Table`      | 基础表格组件，支持分页、排序、列配置、导出等 |
| `EditTable`  | 可编辑表格组件，支持单元格编辑               |
| `Form`       | 表单组件                                     |
| `Modal`      | 弹窗组件                                     |
| `Pagination` | 分页组件                                     |
| `Button`     | 按钮组件                                     |

---

## 二、快速开始

### 1. 引入组件

```javascript
import { Table, EditTable, Pagination, Button } from '@/components/hj'
```

### 2. 基本使用示例

```vue
<template>
  <Table
    :columns="columns"
    :dataSource="tableData"
    :loading="loading"
  />
</template>

<script setup>
import { ref } from 'vue'
import { Table } from '@/components/hj'

const columns = [
  { type: 'seq', title: '序号', width: 50 },
  { field: 'name', title: '名称', minWidth: 120 },
  { field: 'status', title: '状态', width: 100 }
]

const tableData = ref([
  { name: '测试数据', status: '启用' }
])

const loading = ref(false)
</script>
```

---

## 三、Table 组件 API

### 3.1 Props 属性

| 属性             | 类型              | 默认值      | 说明                             |
| ---------------- | ----------------- | ----------- | -------------------------------- |
| `columns`        | `Array`           | `[]`        | **必填** 表格列配置              |
| `dataSource`     | `Array`           | `[]`        | **必填** 表格数据                |
| `loading`        | `Boolean`         | `false`     | 加载状态                         |
| `name`           | `String`          | `''`        | 表格唯一标识（用于列配置持久化） |
| `isAutoHeight`   | `Boolean`         | `false`     | 是否自动高度（适应窗口）         |
| `height`         | `Number`          | -           | 表格固定高度                     |
| `minHeight`      | `Number`          | -           | 表格最小高度                     |
| `showHeader`     | `Boolean`         | `true`      | 是否显示表头                     |
| `showFooter`     | `Boolean`         | `false`     | 是否显示底部汇总行               |
| `showOverflow`   | `Boolean/String`  | `'tooltip'` | 单元格溢出处理                   |
| `showConfigure`  | `Boolean`         | `true`      | 是否显示列配置按钮               |
| `showHelp`       | `Boolean`         | `true`      | 是否显示帮助链接                 |
| `exportFn`       | `Function/String` | -           | 导出函数                         |
| `sortConfig`     | `Object`          | -           | 排序配置                         |
| `treeConfig`     | `Object`          | -           | 树形表格配置                     |
| `checkboxConfig` | `Object`          | -           | 复选框配置                       |
| `expandConfig`   | `Object`          | -           | 展开行配置                       |

### 3.2 列配置 (columns)

列配置是表格的核心，每个列对象支持以下属性：

```javascript
const columns = [
  // 序号列
  { type: 'seq', title: '序号', width: 50 },
  
  // 复选框列
  { type: 'checkbox', width: 50 },
  
  // 单选框列
  { type: 'radio', width: 50 },
  
  // 普通列
  {
    field: 'name',           // 字段名（对应数据 key）
    title: '名称',            // 列标题
    minWidth: 120,           // 最小宽度
    width: 200,              // 固定宽度
    align: 'center',         // 对齐方式: left/center/right
    fixed: 'left',           // 固定列: left/right
    sortable: true,         // 是否可排序
    show: true,              // 是否显示（用于列配置）
    
    // 自定义渲染
    slots: {
      default: 'nameSlot',   // 单元格内容插槽
      header: 'nameHeader'   // 表头插槽
    },
    
    // 格式化函数
    formatter: ({ cellValue, row, column }) => {
      return cellValue ? formatValue(cellValue) : '-'
    },
    
    // 分组表头（多层嵌套）
    children: [
      { field: 'child1', title: '子列1' },
      { field: 'child2', title: '子列2' }
    ]
  },
  
  // 操作列
  {
    field: 'action',
    title: '操作',
    width: 120,
    fixed: 'right'
  }
]
```

#### 插槽使用示例

```vue
<template>
  <Table :columns="columns" :dataSource="data">
    <!-- 自定义单元格 -->
    <template #name="{ row }">
      <span class="text-primary">{{ row.name }}</span>
    </template>
    
    <!-- 自定义表头 -->
    <template #nameHeader>
      <span>自定义表头</span>
    </template>
  </Table>
</template>
```

### 3.3 事件 (Emits)

| 事件名              | 说明           | 回调参数                    |
| ------------------- | -------------- | --------------------------- |
| `checkbox-change`   | 复选框变化     | `{ records, checked, ... }` |
| `checkbox-all`      | 全选/取消全选  | `{ records, checked }`      |
| `radio-change`      | 单选框变化     | `{ row, newValue }`         |
| `scroll`            | 表格滚动       | 滚动事件对象                |
| `getCurrentColumns` | 获取当前列配置 | 列配置数组                  |

### 3.4 暴露方法 (Expose)

通过 `ref` 调用：

```javascript
const tableRef = ref()

// 方法
tableRef.value.setCheckboxRow(rows, checked)    // 设置复选框
tableRef.value.setAllCheckboxRow(checked)       // 全选/取消全选
tableRef.value.setAllTreeExpand(val)            // 展开/折叠所有树节点
tableRef.value.setTreeExpand(row, expanded)     // 展开/折叠指定树节点
tableRef.value.updateFooter()                    // 更新底部汇总
tableRef.value.calculateHeight()                 // 重新计算高度
tableRef.value.getCurrentColumns()              // 获取当前列配置
```

---

## 四、useTable Hook

`useTable` 封装了表格的常用逻辑，推荐配合组件使用。

### 4.1 基本用法

```javascript
import useTable from '@/hooks/useTable'

const {
  loading,           // 加载状态
  tableData,          // 表格数据
  tableColumns,       // 表格列配置
  checkedRecord,      // 选中的行数据
  onCheckboxChange,  // 复选框变化处理
  radioChange,        // 单选框变化处理
  clearCheckedRecord,// 清空选中
  sortConfig,        // 排序配置
  doResult           // 执行查询
} = useTable({
  tableRef,           // 表格组件 ref
  request,           // 数据请求函数
  tableConfig,       // 表格列配置
  params,            // 请求参数
  callback: (res) => {
    // 请求成功后的回调
  },
  setTotal: (total) => {
    // 设置总数（用于分页）
  }
})
```

---

## 五、EditTable 可编辑表格

### 5.1 基本用法

```vue
<template>
  <hj-EditTable
    ref="editTableRef"
    :columns="editColumns"
    :dataSource="editData"
    @changeInput="handleInputChange"
    @changeSelect="handleSelectChange"
    @addRow="handleAddRow"
  />
</template>
```

### 5.2 编辑列配置

```javascript
const editColumns = [
  {
    field: 'name',
    title: '名称',
    edit: true,  // 标记为可编辑列
    props: {
      type: 'input',           // 输入框
      // 或 type: 'select'      下拉框
      // 或 type: 'switch'      开关
      placeholder: '请输入名称',
      maxLength: 50,
      disabled: false,
      rules: [{ required: true, message: '不能为空' }]
    }
  },
  {
    field: 'status',
    title: '状态',
    edit: true,
    props: {
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ]
    }
  },
  // 自定义插槽编辑
  {
    field: 'custom',
    title: '自定义',
    edit: true,
    selfSlot: true,  // 使用自定义插槽
    slots: {
      default: 'customEdit'
    }
  }
]
```

### 5.3 编辑事件

| 事件名              | 说明       |
| ------------------- | ---------- |
| `changeInput`       | 输入框变化 |
| `changeSelect`      | 下拉框变化 |
| `addRow`            | 添加行     |
| `update:dataSource` | 数据源更新 |

---

## 六、实战示例

### 6.1 完整表格示例

```vue
<template>
  <div>
    <!-- 表格工具栏 -->
    <template #topAction>
      <Button type="primary" @click="handleSearch">查询</Button>
      <Button @click="handleReset">重置</Button>
    </template>
    
    <!-- 表格 -->
    <Table
      ref="tableRef"
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :name="'myTable'"
      :sortConfig="sortConfig"
      :isAutoHeight="true"
      @checkbox-change="handleCheckboxChange"
    >
      <!-- 自定义操作列 -->
      <template #action="{ row }">
        <Button type="link" @click="handleEdit(row)">编辑</Button>
        <Button type="link" @click="handleDelete(row)">删除</Button>
      </template>
    </Table>
    
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        v-model:current="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="total"
        @on-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Table, Button, Pagination } from '@/components/hj'
import { getList } from '@/api'

const tableRef = ref()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)

const columns = [
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'seq', title: '序号', width: 50 },
  { field: 'name', title: '名称', minWidth: 120 },
  { field: 'status', title: '状态', width: 100 },
  { field: 'action', title: '操作', width: 150, fixed: 'right' }
]

const pagination = reactive({
  pageNum: 1,
  pageSize: 10
})

const sortConfig = {
  trigger: 'default',
  remote: true,
  sortChange: ({ field, order }) => {
    console.log('排序字段:', field, '排序方式:', order)
  }
}

// 查询
const handleSearch = async () => {
  loading.value = true
  try {
    const res = await getList(pagination)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 分页变化
const handlePageChange = () => {
  handleSearch()
}

// 选中变化
const handleCheckboxChange = ({ records }) => {
  console.log('选中数据:', records)
}

handleSearch()
</script>
```

---

## 七、注意事项

1. **列配置持久化**：设置 `name` 属性后，用户调整的列配置会自动保存到 localStorage
2. **自动高度**：启用 `isAutoHeight` 后，表格会自动计算适应窗口高度
3. **导出功能**：配置 `exportFn` 即可启用导出，支持本地导出和接口导出
4. **插槽命名**：动态插槽使用 `v-slot:[${item}]` 语法，注意不要遗漏冒号

---

这份文档涵盖了 HJ 表格组件库的核心使用方法。
---
outline: [1, 3]
---

# 博欣信息管理系统（ERP系统）

::: info 项目概述
博欣信息管理系统（ERP系统）基于vue3+vite构建，包含PC端和移动端，集成制造研发类企业日常工作管理，包含进销存、产品管理、物料管理、生产制造等模块，快速提供决策信息，提升企业的营运绩效与快速反应能力。项目覆盖从客户订单到产品交付的全流程管理，支持多部门协作，实现企业数字化转型。
:::

::: tip 项目规模

- **开发周期**：12个月
- **团队规模**：5人（前端2人，后端3人）
- **代码量**：前端约20万行代码
- **用户规模**：支持100+用户同时在线使用
  :::

## 一、项目技术

### 核心技术栈

**PC端**：Vue3 + Vite + Pinia + Vue-Router + Element Plus + Axios + TypeScript  
**移动端**：UniApp + uView UI + Vue3  
**可视化**：ECharts + LogicFlow  
**其他技术**：kkFileView文件预览、自定义组件库

### 技术架构

- **构建工具**：Vite（构建速度提升50%+）
- **状态管理**：Pinia（替代Vuex，支持TypeScript）
- **UI组件库**：Element Plus PC端 + uView移动端
- **数据可视化**：ECharts图表库 + LogicFlow流程图
- **工程化**：ESLint + Prettier + Husky + Git Hooks

## 二、我的工作

### 1. 前端架构设计与规划

- **整体架构**：采用Vue3+Vite+TypeScript技术栈，实现前后端分离架构
- **路由设计**：基于Vue Router设计动态路由系统，支持权限控制的路由守卫
- **模块拆分**：按业务功能划分模块，实现组件化和模块化开发
- **状态管理**：使用Pinia设计全局状态管理方案，模块化管理应用状态

### 2. 核心业务模块开发

- **订单管理系统**：实现从客户下单到生产计划的全流程管理，支持订单状态跟踪
- **BOM管理系统**：处理复杂的产品物料清单，支持多层级BOM展开和版本控制
- **库存管理系统**：实现入库、出库、盘点等操作，支持多仓库管理
- **生产管理**：包含工单管理、进度跟踪、质量控制等功能
- **用户管理**：实现用户信息维护、角色分配、权限控制等

### 3. 权限管理系统开发

- **菜单权限**：基于角色的动态菜单控制，支持精细化权限配置
- **数据权限**：实现列级（字段级）数据权限控制
- **操作权限**：控制用户对特定功能的访问权限
- **权限验证**：前端路由守卫和API请求拦截器双重验证

### 4. 移动端开发与适配

- **跨端开发**：使用UniApp框架，一套代码适配iOS、Android、H5
- **功能迁移**：将PC端核心功能适配移动端，优化移动端用户体验
- **性能优化**：针对移动端网络环境进行图片压缩、懒加载等优化
- **离线支持**：实现关键数据的本地缓存和离线操作


## 三、项目难点

### （一）细粒度权限管理系统

**问题描述**：企业级应用需要复杂的权限控制，包括菜单权限、按钮操作权限、字段权限多维度权限管理。

该项目采用 **RBAC（Role-Based Access Control）** 模型，实现机制如下：

**权限数据结构设计**

```json
menus: [
  {
    "id": 160,
    "name": "首页",
    "url": "/home",          // 菜单路由路径
    "parentId": 0,           // 父级菜单ID，0表示根菜单
    "icon": "el-icon-s-home",
    "enable": 1,             // 菜单状态：1-启用，0-禁用
    "linkType": 0,           // 链接类型：0-内部路由，1-外部链接
    "tableName": "home",     // 对应的数据表标识
    "permission": ["Search", "Edit", "Delete"]  // 当前页面的按钮权限列表
  },
  ...
]
```

**菜单权限控制**

1. **权限获取**：用户登录成功后，调用 `menus` 接口获取当前用户可访问的菜单树及对应页面的按钮权限数据
2. **状态管理**：将权限数据存储到 Pinia Store 中，每次刷新时重新拉取权限，确保数据实时性
3. **菜单渲染**：基于菜单树数据动态渲染侧边栏导航，仅展示用户有权限访问的菜单项
4. **权限验证**：通过 Vue Router 的 `beforeEach` 全局守卫和API请求拦截器双重验证，拦截无权限的路由访问

**按钮级权限控制**

按钮级权限控制是在菜单权限的基础上，进一步控制页面内具体操作按钮的显示和执行权限。

**核心原理**：

1. **权限获取**：用户登录后，后端返回的菜单数据中包含每个页面拥有的按钮权限列表（如 `["Search", "Edit", "Delete"]`）
2. **权限对比**：在页面中，通过自定义指令`v-permission`或函数检查当前按钮的权限标识是否在权限列表中
3. **UI控制**：无权限时自动隐藏按钮，避免用户误操作
4. **双重验证**：前端隐藏按钮 + 后端再次校验，确保安全性

**代码实现**：

::: code-group

```js [1. 创建权限检查函数 - src/utils/permission.js]
import { useUserStore } from '@/stores/user'

/**
 * 检查用户是否拥有指定权限
 * @param {string} permission - 权限标识，如 'Edit'、'Delete'
 * @returns {boolean} - 是否有权限
 */
export function hasPermission(permission) {
  const userStore = useUserStore()
  const currentRouteName = userStore.currentRoute?.name
  if (!currentRouteName) return false

  // 从菜单数据中找到当前页面的权限列表
  const currentMenu = userStore.menus.find(
    menu => menu.url === `/${currentRouteName}` || menu.name === currentRouteName
  )

  if (!currentMenu || !currentMenu.permission) return false

  // 检查权限是否在列表中
  return currentMenu.permission.includes(permission)
}
```

```js [2. 创建自定义指令 - src/directives/permission.js]
import { hasPermission } from '@/utils/permission'

/**
 * v-permission 指令使用示例：
 * <el-button v-permission="'Edit'">编辑</el-button>
 * <el-button v-permission="['Edit', 'Delete']">删除</el-button>
 */
export default {
  mounted(el, binding) {
    const { value } = binding
    let hasAuth = false

    // 支持单个权限字符串或权限数组
    if (Array.isArray(value)) {
      // 数组：只要有其中一个权限即可
      hasAuth = value.some(permission => hasPermission(permission))
    } else {
      // 字符串：必须有该权限
      hasAuth = hasPermission(value)
    }

    // 无权限时移除元素
    if (!hasAuth) {
      el.parentNode?.removeChild(el)
    }
  },

  // 权限变化时重新检查（如切换用户、刷新权限）
  updated(el, binding) {
    const { value } = binding
    let hasAuth = false

    if (Array.isArray(value)) {
      hasAuth = value.some(permission => hasPermission(permission))
    } else {
      hasAuth = hasPermission(value)
    }

    if (!hasAuth && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
}
```

```js [3. 全局注册指令 - src/main.js]
import { createApp } from 'vue'
import permission from '@/directives/permission'

const app = createApp(App)

// 注册全局权限指令
app.directive('permission', permission)

app.mount('#app')
```

```vue [4. 在页面中使用 - src/views/user/index.vue]
<template>
  <div class="user-list">
    <!-- 页面操作按钮 -->
    <el-button
      type="primary"
      v-permission="'Add'"
      @click="handleAdd"
    >
      新增用户
    </el-button>

    <el-button
      v-permission="'Export'"
      @click="handleExport"
    >
      导出数据
    </el-button>

    <!-- 表格行内操作按钮 -->
    <el-table :data="userList">
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            v-permission="'Edit'"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>

          <el-button
            link
            type="danger"
            v-permission="'Delete'"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userList = ref([])

// 这些函数会在有权限时才能触发
const handleAdd = () => {
  ElMessage.success('打开新增弹窗')
}

const handleEdit = (row) => {
  ElMessage.success(`编辑用户：${row.username}`)
}

const handleDelete = (row) => {
  ElMessage.warning(`删除用户：${row.username}`)
}

const handleExport = () => {
  ElMessage.success('导出数据中...')
}
</script>
```

```vue [5. 函数式使用（不推荐用于隐藏，用于逻辑判断）]
<template>
  <div>
    <!-- 使用函数判断权限 -->
    <el-button
      v-if="hasPermission('Edit')"
      @click="handleEdit"
    >
      编辑
    </el-button>

    <!-- 组合多个权限判断 -->
    <el-button
      v-if="hasPermission('Edit') || hasPermission('Audit')"
      @click="handleAudit"
    >
      审核通过
    </el-button>
  </div>
</template>

<script setup>
import { hasPermission } from '@/utils/permission'

const handleEdit = () => {
  // 编辑逻辑
}

const handleAudit = () => {
  // 审核逻辑
}
</script>
```
:::

**实现要点**：

- **指令优先**：推荐使用 `v-permission` 指令，代码简洁且自动处理移除逻辑
- **后端兜底**：前端隐藏按钮只是视觉优化，后端必须再次校验权限，防止恶意请求
- **权限设计**：权限标识要清晰易懂，如 `Add`、`Edit`、`Delete`、`Export`、`Audit` 等
- **性能考虑**：权限检查基于内存中的数据，无需额外请求，性能影响极小

**字段权限控制**

**问题描述**：不同角色用户对表格列（字段）的访问权限不同，需要实现列级别的权限控制，如普通用户只能查看部分字段，管理员可以查看所有字段。

**解决方案**：
- **设置字段权限**：在字段权限页面中设置权限，可以根据角色设置某一个表的字段权限（是否显示、是否只读）
- **字段权限控制**：在页面中，调用接口获取当前用户的字段权限配置，根据权限过滤表格列和表单字段配置

**代码实现**：

::: code-group

```js [1. 字段权限工具 - src/utils/fieldPermission.js]
import { useUserStore } from '@/stores/user'

// 字段权限类型
export const FIELD_PERMISSION = {
  VISIBLE: 'visible',    // 可见
  HIDDEN: 'hidden',      // 隐藏
  READONLY: 'readonly'   // 只读
}

/**
 * 获取当前用户对指定表的字段权限配置
 * @param {string} tableName - 表名
 * @returns {Object} 字段权限映射 { fieldName: 'visible' | 'hidden' | 'readonly' }
 */
export const getFieldPermissions = (tableName) => {
  const userStore = useUserStore()
  const roleCode = userStore.userInfo?.roleCode
  
  // 从权限配置中获取该角色对该表的字段权限
  const fieldPermissions = userStore.permissionConfig?.[roleCode]?.[tableName]?.fields || {}
  
  return fieldPermissions
}

/**
 * 检查字段是否可见
 * @param {string} tableName - 表名
 * @param {string} fieldName - 字段名
 * @returns {boolean}
 */
export const isFieldVisible = (tableName, fieldName) => {
  const permissions = getFieldPermissions(tableName)
  const permission = permissions[fieldName]
  
  // 未配置默认可见
  if (!permission) return true
  
  return permission !== FIELD_PERMISSION.HIDDEN
}

/**
 * 检查字段是否只读
 * @param {string} tableName - 表名
 * @param {string} fieldName - 字段名
 * @returns {boolean}
 */
export const isFieldReadonly = (tableName, fieldName) => {
  const permissions = getFieldPermissions(tableName)
  return permissions[fieldName] === FIELD_PERMISSION.READONLY
}

/**
 * 根据权限过滤表格列配置
 * @param {string} tableName - 表名
 * @param {Array} columns - 原始列配置
 * @returns {Array} 过滤后的列配置
 */
export const filterColumnsByPermission = (tableName, columns) => {
  return columns.filter(column => {
    // 没有配置字段名的列默认显示（如操作列）
    if (!column.prop) return true
    
    return isFieldVisible(tableName, column.prop)
  })
}

/**
 * 根据权限过滤表单字段配置
 * @param {string} tableName - 表名
 * @param {Array} fields - 原始字段配置
 * @returns {Array} 过滤并处理后的字段配置
 */
export const filterFormFieldsByPermission = (tableName, fields) => {
  return fields
    .filter(field => isFieldVisible(tableName, field.prop))
    .map(field => ({
      ...field,
      disabled: field.disabled || isFieldReadonly(tableName, field.prop)
    }))
}
```

```vue [2. 动态表格列 - src/components/PermissionTable.vue]
<template>
  <el-table
    :data="tableData"
    v-loading="loading"
    border
    stripe
  >
    <!-- 动态渲染列 -->
    <el-table-column
      v-for="column in visibleColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :align="column.align || 'left'"
      :fixed="column.fixed"
      :sortable="column.sortable"
    >
      <template #default="{ row }" v-if="column.slot">
        <slot :name="column.slot" :row="row" :column="column">
          {{ row[column.prop] }}
        </slot>
      </template>
    </el-table-column>

    <!-- 操作列始终显示 -->
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }">
        <slot name="operation" :row="row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { computed } from 'vue'
import { filterColumnsByPermission } from '@/utils/fieldPermission'

const props = defineProps({
  tableName: {
    type: String,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  tableData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// 根据权限过滤列
const visibleColumns = computed(() => {
  return filterColumnsByPermission(props.tableName, props.columns)
})
</script>
```

```vue [3. 动态表单字段 - src/components/PermissionForm.vue]
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-width="labelWidth"
  >
    <el-row :gutter="20">
      <el-col
        v-for="field in visibleFields"
        :key="field.prop"
        :span="field.span || 12"
      >
        <el-form-item
          :label="field.label"
          :prop="field.prop"
        >
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            clearable
          />
          
          <!-- 选择器 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          
          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            :type="field.dateType || 'date'"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            style="width: 100%"
          />
          
          <!-- 数字输入框 -->
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="formData[field.prop]"
            :min="field.min"
            :max="field.max"
            :disabled="field.disabled"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { filterFormFieldsByPermission } from '@/utils/fieldPermission'

const props = defineProps({
  tableName: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  },
  labelWidth: {
    type: String,
    default: '100px'
  }
})

const emit = defineEmits(['update:modelValue'])

const formRef = ref(null)
const formData = ref({ ...props.modelValue })

// 根据权限过滤字段并处理只读状态
const visibleFields = computed(() => {
  return filterFormFieldsByPermission(props.tableName, props.fields)
})

// 根据可见字段生成校验规则
const formRules = computed(() => {
  const rules = {}
  props.fields.forEach(field => {
    if (field.rules && isFieldVisible(props.tableName, field.prop)) {
      rules[field.prop] = field.rules
    }
  })
  return rules
})

// 同步表单数据
watch(formData, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

watch(() => props.modelValue, (val) => {
  formData.value = { ...val }
}, { deep: true })

// 暴露验证方法
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields()
})
</script>
```

```vue [4. 页面使用示例 - src/views/material/index.vue]
<template>
  <div class="material-page">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="物料编码">
          <el-input v-model="searchForm.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <PermissionTable
        table-name="material"
        :columns="tableColumns"
        :table-data="tableData"
        :loading="loading"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #operation="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </PermissionTable>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑物料"
      width="600px"
    >
      <PermissionForm
        ref="formRef"
        table-name="material"
        :fields="formFields"
        v-model="formData"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PermissionTable from '@/components/PermissionTable.vue'
import PermissionForm from '@/components/PermissionForm.vue'

// 表格列配置（完整配置，组件会根据权限自动过滤）
const tableColumns = [
  { prop: 'code', label: '物料编码', width: 150, fixed: 'left' },
  { prop: 'name', label: '物料名称', minWidth: 200 },
  { prop: 'spec', label: '规格型号', width: 150 },
  { prop: 'unit', label: '单位', width: 80, align: 'center' },
  { prop: 'price', label: '单价', width: 100, align: 'right' },
  { prop: 'stock', label: '库存', width: 100, align: 'right' },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', width: 180 }
]

// 表单字段配置
const formFields = [
  { prop: 'code', label: '物料编码', type: 'input', span: 12 },
  { prop: 'name', label: '物料名称', type: 'input', span: 12 },
  { prop: 'spec', label: '规格型号', type: 'input', span: 12 },
  { prop: 'unit', label: '单位', type: 'select', span: 12, options: [] },
  { prop: 'price', label: '单价', type: 'number', span: 12, min: 0 },
  { prop: 'stock', label: '库存', type: 'number', span: 12, min: 0 },
  { prop: 'supplier', label: '供应商', type: 'select', span: 24, options: [] }
]

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

const searchForm = reactive({
  code: ''
})

const formData = ref({})

// 不同角色看到不同的列：
// - 普通用户：code, name, spec, unit, status
// - 采购员：code, name, spec, unit, price, supplier, status
// - 管理员：全部字段

const handleSearch = () => {
  // 查询逻辑
}

const handleReset = () => {
  searchForm.code = ''
}

const handleEdit = (row) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  // 删除逻辑
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    // 提交逻辑
    ElMessage.success('保存成功')
    dialogVisible.value = false
  }
}
</script>
```
:::

**效果**：支持10+角色类型，100+权限点，权限验证响应时间<10ms。

### （二）大数据量表格渲染卡顿

**问题描述**：BOM树数据量可能达到数万条记录，传统表格渲染会导致页面严重卡顿，甚至浏览器崩溃。

**解决方案**：

- 采用`el-table-v2`虚拟化表格组件，只渲染可视区域内的DOM元素
- 添加`loading`状态和骨架屏，提升用户体验

**代码实现**：

::: code-group

```vue
<template>
  <div class="bom-table-container">
    <!-- 虚拟表格组件 -->
    <el-table-v2
      :columns="columns"
      :data="tableData"
      :width="tableWidth"
      :height="tableHeight"
      :row-height="rowHeight"
      :estimated-row-height="estimatedRowHeight"
      fixed
      :fixed-columns="fixedColumns"
      :scrollbar-always-on="true"
    >
      <!-- 自定义单元格渲染 -->
      <template #default="{ rowData, columnIndex }">
        <slot name="cell" :row="rowData" :column="columns[columnIndex]">
          {{ rowData[columns[columnIndex].key] }}
        </slot>
      </template>
    </el-table-v2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-mask">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 数据统计 -->
    <div class="table-footer">
      <span>共 {{ total }} 条数据</span>
    </div>
  </div>
</template>
```

```js
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBOMList } from '@/api/bom'

// 响应式数据
const tableData = ref([])        // 表格数据源（可能上万条）
const loading = ref(true)        // 加载状态
const total = ref(0)             // 总数据量

// 表格配置
const tableWidth = ref(1200)     // 表格宽度
const tableHeight = ref(600)     // 表格高度
const rowHeight = 50             // 固定行高
const estimatedRowHeight = 50    // 预估行高（用于动态高度场景）

// 列配置
const columns = ref([
  { key: 'code', title: '物料编码', width: 150, fixed: 'left' },
  { key: 'name', title: '物料名称', width: 200 },
  { key: 'version', title: '版本', width: 100, align: 'center' },
  { key: 'quantity', title: '数量', width: 100, align: 'right' },
  { key: 'unit', title: '单位', width: 80, align: 'center' }
])

const fixedColumns = ref(1)      // 左侧固定列数

/**
 * 加载BOM数据
 * 虚拟滚动允许一次性加载所有数据，但只渲染可视区域
 */
const loadBOMData = async () => {
  loading.value = true
  try {
    const { data } = await getBOMList()
    tableData.value = data.list || []   // 可能上万条数据
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBOMData()
})
</script>
```

```css
<style scoped>
.bom-table-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #ebeef5;
}
</style>
```
:::

**实现原理**

虚拟滚动核心思想：只渲染可视区域内的DOM元素，其他数据行用空白占位符替代。

**关键步骤**：

**步骤1：计算可视区域能容纳的行数**

根据容器高度和每行高度，计算当前屏幕能显示多少行数据。

```javascript
// 容器高度 600px，行高 50px，缓冲区 5 行
const containerHeight = 600
const rowHeight = 50
const bufferCount = 5 // 防止滚动时出现白屏

// 可视区域行数 = 向上取整(600 / 50) = 12行
const visibleCount = Math.ceil(containerHeight / rowHeight)
```

**步骤2：计算起始索引**

根据滚动偏移量`scrollTop`，计算当前应该从哪一行开始渲染。

```javascript
// 滚动偏移量 250px
const scrollTop = 250

// 起始索引 = 向下取整(250 / 50) = 第5行
const startIndex = Math.floor(scrollTop / rowHeight)
```

**步骤3：计算结束索引**

起始索引 + 可视行数 + 缓冲区，确保滚动流畅。

```javascript
// 结束索引 = 5 + 12 + 5 = 第22行
const endIndex = startIndex + visibleCount + bufferCount
```

**步骤4：渲染策略**

只渲染指定区间内的数据，上下方用空白占位，确保滚动条高度和位置正确。

```javascript
// 渲染数据区间 [5, 22]
const visibleData = tableData.slice(startIndex, endIndex)

// 上方空白高度 = 5 * 50 = 250px
const paddingTop = startIndex * rowHeight

// 下方空白高度 = (总行数1000 - 22) * 50 = 48900px
const paddingBottom = (tableData.length - endIndex) * rowHeight
```

**步骤5：滚动事件监听**

监听滚动事件，实时更新索引，重新渲染可视数据。

```javascript
const handleScroll = (e) => {
  const scrollTop = e.target.scrollTop
  const newStartIndex = Math.floor(scrollTop / rowHeight)

  // 索引变化才更新
  if (newStartIndex !== startIndex.value) {
    startIndex.value = newStartIndex
    endIndex.value = startIndex.value + visibleCount + bufferCount
  }
}
```

**效果**：支持10万+数据流畅渲染，首次加载时间从8秒优化至1.5秒。

### （三）图纸大文件上传

**问题描述**：工程图纸文件通常较大（100MB-2GB），传统上传方式容易出现超时、失败等问题，网络中断需要重新上传。

**解决方案**：

采用**分片上传 + 断点续传 + 秒传**三重策略：

#### 核心流程

```
选择文件 → 计算文件Hash → 秒传检查 → 获取已上传分片 → 并发上传剩余分片 → 通知服务端合并
```

#### 技术要点与接口调用

**1. 文件分片**

使用 `slice()` 方法将大文件切分为固定大小的片段（如5MB），分片大小需权衡：
- 太小：请求次数多，HTTP开销大
- 太大：单个分片上传失败代价高

```javascript
// File 继承自 Blob，file.slice 即 Blob.slice 方法
const chunk = this.file.slice(start, end)  // 零拷贝，不加载到内存
```

**2. 秒传优化**

上传前计算文件唯一标识（MD5/SparkMD5），调用后端检查接口：
- **处理逻辑**：
  - `exists: true`：服务器已存在相同文件，直接返回成功
  - `exists: false`：文件不存在，继续后续上传流程

**性能优化**：大文件计算完整MD5耗时过长，采用**抽样Hash**策略（取首尾各2MB内容计算），牺牲少量准确性换取速度。

**3. 断点续传**

- **接口调用**：`POST /api/upload/uploaded`
- **请求参数**：`{ hash: "文件唯一标识" }`
- **返回结果**：`{ uploaded: [已上传分片索引数组] }`
- **处理逻辑**：
  - 上传前查询服务器已接收的分片列表
  - 只上传未完成的分片（排除 `uploaded` 数组中的索引）
  - 网络中断后重新触发上传，自动跳过已完成分片

**4. 并发控制**

可以同时发起多个分片请求提升速度，但需控制并发数（通常3-5个）：
- 避免占用过多带宽影响其他业务
- 避免服务器压力过大

**5. 分片合并**

所有分片上传完成后，通知服务端进行合并：

- **接口调用**：`POST /api/upload/merge`
- **请求参数**：
  ```json
  {
    "fileHash": "文件唯一标识",
    "fileName": "原始文件名",
    "totalChunks": "总分片数"
  }
  ```
- **后端处理**：将临时分片文件按顺序合并为完整文件

**6. 进度反馈**

监听各分片上传进度，实时计算总进度并展示给用户

**代码实现**：

::: details 点击查看代码
```javascript
class FileUploader {
  constructor(options) {
    this.chunkSize = options.chunkSize || 5 * 1024 * 1024 // 5MB/片
    this.file = options.file
    this.uploadedChunks = new Set() // 已上传分片索引
  }

  // 1. 计算文件唯一标识（用于秒传判断）
  async calculateHash() {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.onload = (e) => {
        spark.append(e.target.result)
        resolve(spark.end())
      }
      // 只读取首尾部分计算hash，提升大文件性能
      const chunk = this.file.slice(0, 2 * 1024 * 1024)
      reader.readAsArrayBuffer(chunk)
    })
  }

  // 2. 文件分片
  createFileChunks() {
    const chunks = []
    let cur = 0
    let index = 0
    while (cur < this.file.size) {
      chunks.push({
        index: index++,
        chunk: this.file.slice(cur, cur + this.chunkSize)
      })
      cur += this.chunkSize
    }
    return chunks
  }

  // 3. 上传单个分片
  async uploadChunk({ index, chunk }) {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('index', index)
    formData.append('fileHash', this.fileHash)
    formData.append('fileName', this.file.name)

    await axios.post('/api/upload/chunk', formData)
    this.uploadedChunks.add(index)
  }

  // 4. 主上传流程
  async upload() {
    // 秒传检查
    this.fileHash = await this.calculateHash()
    const { exists } = await axios.post('/api/upload/check', { hash: this.fileHash })
    if (exists) {
      return console.log('秒传成功：文件已存在')
    }

    // 获取已上传分片（断点续传）
    const { uploaded } = await axios.post('/api/upload/uploaded', { hash: this.fileHash })
    this.uploadedChunks = new Set(uploaded)

    // 并发上传分片（控制并发数为3）
    const chunks = this.createFileChunks().filter(c => !this.uploadedChunks.has(c.index))
    await this.concurrentUpload(chunks, 3)

    // 通知服务器合并分片
    await axios.post('/api/upload/merge', {
      fileHash: this.fileHash,
      fileName: this.file.name,
      totalChunks: chunks.length
    })
    console.log('上传完成')
  }

  // 并发控制
  async concurrentUpload(chunks, limit) {
    const queue = [...chunks]
    const executing = new Set()
    while (queue.length || executing.size) {
      if (queue.length && executing.size < limit) {
        const task = this.uploadChunk(queue.shift())
        executing.add(task)
        task.finally(() => executing.delete(task))
      }
      await Promise.race(executing)
    }
  }
}
```
:::



**效果**：支持2GB+文件上传，上传成功率提升至98%，网络中断后可续传。

### （四）图纸大文件预览

**问题描述**：工程图纸格式多样（DWG、DXF、PDF等），需要实现在线预览功能，且要考虑大文件的预览性能。

#### 实现原理

[kkFileView](https://kkview.cn/zh-cn/docs/home.html) 是一个开源的在线文件预览解决方案，支持 Office、PDF、图片、文本、压缩包等多种格式。其核心原理是**服务端转换 + 前端嵌入**：

1. **服务端转换**：kkFileView 服务接收文件 URL，在服务端将原始文件（如 .docx、.xlsx、.pdf）转换为 HTML 格式的预览页面。
2. **前端嵌入**：前端通过 `<iframe>` 嵌入 kkFileView 生成的预览页面，实现“无插件”在线预览。
3. **大文件处理优势**：
   - **减轻浏览器负担**：文件解析和渲染由服务端完成，浏览器仅展示静态 HTML，避免内存溢出。
   - **格式统一**：所有格式统一输出为 HTML，前端无需适配不同格式的预览组件。
   - **跨域支持**：通过 URL 参数传递文件地址，kkFileView 服务可代理访问不同域的文件。

#### 二、代码实现

::: code-group [预览文件]

```vue [模板]
<template>
  <!-- 文件预览弹窗 -->
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    :width="!$isMobile() ? '55%' : '85%'"
    :fullscreen="isFullscreen"
    class="preview-dialog"
  >
    <!-- 自定义标题栏（含全屏/关闭按钮） -->
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <div :id="titleId" :class="titleClass">文件查看</div>
        <div>
          <el-icon class="el-icon--fullscreen" @click.stop="handleFullScreen">
            <FullScreen />
          </el-icon>
          <el-icon class="el-icon--close" @click="close" :size="16">
            <Close />
          </el-icon>
        </div>
      </div>
    </template>

    <!-- 核心：iframe 嵌入 kkFileView 预览页面 -->
    <iframe
      :src="fileUrl"
      width="100%"
      :style="{ height: !isFullscreen ? '60vh' : '85vh' }"
    ></iframe>

    <!-- 底部操作按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="downFile" type="primary">下载</el-button>
        <el-button @click="dialogVisible = false" type="warning">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
```


```vue [逻辑]
<script>
export default {
  data() {
    return {
      isFullscreen: false,      // 全屏状态
      dialogVisible: false,     // 弹窗显示控制
      fileUrl: '',              // iframe 的 src（kkFileView 预览地址）
      filePrevUrl: '',          // 原始文件下载地址
      // ... 其他数据
    };
  },
  methods: {
    // 切换全屏
    handleFullScreen() {
      this.isFullscreen = !this.isFullscreen;
    },

    // 下载原始文件
    downFile() {
      window.open(this.filePrevUrl);
    },

    // 核心：预览文件方法
    previewFile(file) {
      // 1. 构建文件访问 URL（根据上传响应或已有数据）
      let url = file.url;
      
      // 2. 保存原始文件地址（用于下载）
      this.filePrevUrl = url;

      // 3. 构建 kkFileView 预览地址（关键步骤）
      //    a) 对文件 URL 进行编码（防止特殊字符问题）
      //    b) 使用 Base64 编码
      //    c) 拼接到 kkFileView 服务地址
      const kkFileViewBase = 'http://150.158.175.93:8012/onlinePreview';
      const encodedUrl = btoa(unescape(encodeURIComponent(url + '?name=' + file.name)));
      this.fileUrl = `${kkFileViewBase}?url=${encodedUrl}`;

      // 4. 显示预览弹窗
      this.dialogVisible = true;
    },
  },
};
</script>
```


```vue [样式]
<style lang="less" scoped>
.preview-dialog {
  height: 500px;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;

  .el-icon--fullscreen {
    margin-right: 15px;
    cursor: pointer;
    color: #919399;
  }

  .el-icon--close {
    cursor: pointer;
    color: #919399;
  }
}
</style>
```
:::

#### 三、其他方案

- 前端纯组件方案 (PDF.js + Docx.js) - 完全前端渲染,但格式支持有限
- WPS 在线预览 - 商业服务,格式兼容性好


此方案已在生产环境稳定运行，单文件支持 500MB+ 的 Office 文档预览，响应时间在 3-5 秒（取决于文件大小和服务器性能）。

### （五）工序及工艺流程可视化

**问题描述**：生产工艺流程复杂，工艺流程由工序组成，需要可视化编辑和管理。支持工序节点拖拽、连线、属性配置等操作。

**解决方案**：

使用 **LogicFlow** /ˈlɒdʒɪk/ 流程图实现工序及工艺流程的可视化编辑。LogicFlow 是一款流程图编辑框架，它提供了一系列内置的节点和连接方式，同时支持自定义节点，非常适合构建复杂的流程编辑器。

**核心思路**：
- **流程建模**：将每个工序抽象为流程图中的一个节点，工序之间的流转关系抽象为连线
- **可视化编辑**：提供拖拽画布、节点拖拽、连线创建等交互功能
- **数据持久化**：将画布上的图形数据转换为JSON格式存储到后端
- **自定义节点**：根据业务需求自定义工序节点的外观和属性

**技术选型理由**：
- **功能完整**：LogicFlow 提供了完整的流程图编辑能力，包括拖拽、缩放、对齐、网格等
- **扩展性强**：支持自定义节点、连线、属性面板等，可以完全满足业务需求
- **性能优秀**：基于 SVG 渲染，支持 50+ 节点的复杂流程，操作响应时间 <100ms
- **文档完善**：官方文档清晰，社区活跃，易于上手

**实现步骤**：

::: details 1. 安装和初始化

```bash
npm install @logicflow/core @logicflow/extension
```

```vue [初始化流程图]
<template>
  <div class="process-container">
    <div ref="lfContainer" class="lf-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import LogicFlow from '@logicflow/core';
import '@logicflow/core/dist/style/index.css';
import { DndPanel, SelectionSelect } from '@logicflow/extension';
import '@logicflow/extension/lib/style/index.css';

const lfContainer = ref(null);
let lf = null;

onMounted(() => {
  // 1. 初始化 LogicFlow 实例
  lf = new LogicFlow({
    container: lfContainer.value,
    width: 1200,
    height: 800,
    background: {
      backgroundImage: 'grid',
      gridColor: '#ababab',
      gridGap: 10,
    },
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
      config: {
        color: '#ababab',
        thickness: 1,
      },
    },
  });

  // 2. 注册插件
  lf.use(DndPanel);
  lf.use(SelectionSelect);

  // 3. 渲染流程图
  lf.render(data);
});
</script>

<style scoped>
.lf-container {
  width: 100%;
  height: 800px;
  border: 1px solid #ddd;
}
</style>
```
:::

::: details 2. 自定义工序节点

```javascript
// registerProcessNode.js - 自定义工序节点
import { RectNode, RectNodeModel, h } from '@logicflow/core';

// 自定义工序节点模型
class ProcessNodeModel extends RectNodeModel {
  initNodeData(data) {
    super.initNodeData(data);
    this.width = 180;
    this.height = 60;
    this.radius = 8;
    this.text.editable = true; // 允许编辑节点文本
    // 自定义属性
    this.properties = {
      processCode: '',    // 工序编码
      processName: '',    // 工序名称
      duration: 0,        // 工时
      equipment: '',      // 设备
      operator: '',       // 操作员
      status: 'pending',  // 状态
    };
  }

  // 定义连接规则
  isAllowConnected(sourceNode, targetNode) {
    // 避免节点自连接
    if (sourceNode.id === targetNode.id) return false;
    // 避免重复连接
    const edges = this.incoming.edges.concat(this.outgoing.edges);
    const hasConnected = edges.some(
      edge => edge.sourceNodeId === sourceNode.id && edge.targetNodeId === targetNode.id
    );
    return !hasConnected;
  }
}

// 自定义工序节点视图
class ProcessNode extends RectNode {
  getShape() {
    const { model } = this.props;
    const { x, y, width, height, properties } = model;
    const { status } = properties;

    // 根据状态设置节点颜色
    const colorMap = {
      pending: '#909399',    // 待处理
      processing: '#409EFF', // 进行中
      completed: '#67C23A',  // 已完成
      error: '#F56C6C',      // 异常
    };
    const fill = colorMap[status] || '#909399';

    return h('g', {}, [
      // 矩形背景
      h('rect', {
        x: x - width / 2,
        y: y - height / 2,
        rx: 8,
        ry: 8,
        width,
        height,
        fill,
        stroke: '#333',
        strokeWidth: 2,
      }),
      // 工序名称
      h('text', {
        x: x,
        y: y,
        fill: '#fff',
        fontSize: 14,
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      }, model.getText().value),
    ]);
  }
}

// 注册自定义节点
export default {
  type: 'process-node',
  view: ProcessNode,
  model: ProcessNodeModel,
};
```
:::

::: details 3. 创建左侧拖拽面板

```vue [ProcessDesigner.vue]
<template>
  <div class="process-designer">
    <!-- 左侧组件面板 -->
    <div class="component-panel">
      <div class="panel-title">工序节点</div>
      <div
        v-for="node in nodeTypes"
        :key="node.type"
        class="node-item"
        :draggable="true"
        @dragstart="handleDragStart($event, node)"
      >
        <div class="node-icon" :style="{ background: node.color }">
          {{ node.label.charAt(0) }}
        </div>
        <span class="node-label">{{ node.label }}</span>
      </div>
    </div>

    <!-- 中间画布区域 -->
    <div class="canvas-container">
      <div ref="lfContainer" class="lf-canvas"></div>
    </div>

    <!-- 右侧属性面板 -->
    <div class="property-panel" v-if="selectedNode">
      <div class="panel-title">属性配置</div>
      <el-form :model="selectedNode.properties" label-width="80px">
        <el-form-item label="工序编码">
          <el-input v-model="selectedNode.properties.processCode" />
        </el-form-item>
        <el-form-item label="工序名称">
          <el-input v-model="selectedNode.properties.processName" />
        </el-form-item>
        <el-form-item label="工时(分钟)">
          <el-input-number v-model="selectedNode.properties.duration" :min="0" />
        </el-form-item>
        <el-form-item label="设备">
          <el-select v-model="selectedNode.properties.equipment">
            <el-option label="设备A" value="A" />
            <el-option label="设备B" value="B" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="selectedNode.properties.status">
            <el-option label="待处理" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveProperties">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LogicFlow from '@logicflow/core';
import ProcessNode from './registerProcessNode';
import { DndPanel, SelectionSelect } from '@logicflow/extension';

// 可拖拽的节点类型
const nodeTypes = [
  { type: 'process-node', label: '普通工序', color: '#409EFF' },
  { type: 'process-node', label: '质检工序', color: '#E6A23C' },
  { type: 'process-node', label: '包装工序', color: '#67C23A' },
];

const lfContainer = ref(null);
const selectedNode = ref(null);
let lf = null;

onMounted(() => {
  // 初始化 LogicFlow
  lf = new LogicFlow({
    container: lfContainer.value,
    width: 1000,
    height: 800,
    grid: {
      size: 10,
      visible: true,
      type: 'dot',
    },
  });

  // 注册自定义节点
  lf.register(ProcessNode);

  // 注册插件
  lf.use(DndPanel);
  lf.use(SelectionSelect);

  // 监听拖放事件
  lf.on('node:drop', ({ data }) => {
    console.log('节点拖放:', data);
  });

  // 监听节点选择事件
  lf.on('node:click', ({ data }) => {
    selectedNode.value = data;
  });

  // 监听画布点击事件（取消选择）
  lf.on('blank:click', () => {
    selectedNode.value = null;
  });

  // 渲染流程图
  lf.render({
    nodes: [],
    edges: [],
  });
});

// 开始拖拽
const handleDragStart = (e, node) => {
  e.dataTransfer.setData('node-data', JSON.stringify(node));
};

// 保存属性
const saveProperties = () => {
  if (selectedNode.value) {
    lf.setNodeDataById(selectedNode.value.id, selectedNode.value);
  }
};
</script>

<style scoped>
.process-designer {
  display: flex;
  height: 100vh;
}

.component-panel {
  width: 200px;
  background: #f5f7fa;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.node-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  cursor: move;
}

.node-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
}

.canvas-container {
  flex: 1;
  background: #fff;
}

.property-panel {
  width: 300px;
  background: #f5f7fa;
  border-left: 1px solid #ddd;
  padding: 15px;
}
</style>
```
:::

::: details 4. 数据保存与加载

```javascript
// 保存流程图数据
const saveProcessFlow = async () => {
  // 1. 获取画布数据
  const graphData = lf.getGraphData();

  // 2. 格式化数据（根据后端接口要求）
  const processData = {
    flowId: generateId(),
    flowName: '工艺流程001',
    nodes: graphData.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: { x: node.x, y: node.y },
      properties: node.properties,
    })),
    edges: graphData.edges.map(edge => ({
      id: edge.id,
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      properties: edge.properties,
    })),
  };

  // 3. 发送到后端
  try {
    await axios.post('/api/process-flow/save', processData);
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

// 加载流程图数据
const loadProcessFlow = async (flowId) => {
  try {
    const response = await axios.get(`/api/process-flow/${flowId}`);
    const processData = response.data;

    // 转换为 LogicFlow 需要的格式
    const graphData = {
      nodes: processData.nodes.map(node => ({
        id: node.id,
        type: node.type,
        x: node.position.x,
        y: node.position.y,
        properties: node.properties,
      })),
      edges: processData.edges.map(edge => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        properties: edge.properties,
      })),
    };

    // 渲染到画布
    lf.render(graphData);
  } catch (error) {
    ElMessage.error('加载失败');
  }
};
```
:::

::: details 5. 辅助功能实现

```javascript
// 1. 缩放画布
const handleZoom = (type) => {
  if (type === 'in') {
    lf.zoom(true);
  } else if (type === 'out') {
    lf.zoom(false);
  } else {
    lf.resetZoom(); // 重置缩放
  }
};

// 2. 撤销/重做
const undo = () => lf.history.undo();
const redo = () => lf.history.redo();

// 3. 删除选中节点
const deleteSelected = () => {
  const selectedElements = lf.getSelectElements(true);
  lf.clearSelectElements();
  selectedElements.edges.forEach(edge => lf.deleteEdge(edge.id));
  selectedElements.nodes.forEach(node => lf.deleteNode(node.id));
};

// 4. 自动布局（使用 Dagre）
import { DagreLayout } from '@logicflow/extension';

const autoLayout = () => {
  lf.use(DagreLayout);
  lf.extension.dagreLayout.doLayout();
};

// 5. 导出图片
const exportImage = () => {
  lf.getSnapshot(); // 导出为图片
};

// 6. 键盘快捷键
document.addEventListener('keydown', (e) => {
  if (e.key === 'Delete') {
    deleteSelected();
  } else if (e.ctrlKey && e.key === 'z') {
    undo();
  } else if (e.ctrlKey && e.key === 'y') {
    redo();
  }
});
```
:::

::: details 6. 后端数据结构设计

```json
{
  "flowId": "PF-20240228001",
  "flowName": "产品A生产工艺流程",
  "version": 1,
  "nodes": [
    {
      "id": "node_001",
      "type": "process-node",
      "position": { "x": 100, "y": 100 },
      "properties": {
        "processCode": "P001",
        "processName": "原材料准备",
        "duration": 30,
        "equipment": "设备A",
        "operator": "张三",
        "status": "completed"
      }
    },
    {
      "id": "node_002",
      "type": "process-node",
      "position": { "x": 300, "y": 100 },
      "properties": {
        "processCode": "P002",
        "processName": "粗加工",
        "duration": 60,
        "equipment": "设备B",
        "operator": "李四",
        "status": "processing"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_001",
      "source": "node_001",
      "target": "node_002",
      "properties": {
        "condition": "质检合格",
        "label": "流转"
      }
    }
  ]
}
```
:::

**效果**：支持50+工序节点的复杂流程设计，操作响应时间<100ms。

## 四、项目介绍

我参与的是**博欣信息管理系统（ERP系统）**的开发，这是一个面向制造研发类企业的企业级管理系统。

### 项目背景

这家企业在日常工作中存在很多痛点：进销存、产品物料、生产制造等各个环节分散管理，信息不流通，效率低下。我们的目标就是把这些环节整合到一个系统中，让企业从客户下单到产品交付的全流程都能在线管理，实现数字化转型。

### 我做了什么

在整个项目中，我主要负责**前端开发**，具体做了以下几方面工作：

**1. 核心业务模块开发**

我实现了订单管理、BOM物料清单、库存管理、生产管理这些核心模块。比如BOM系统，它要处理复杂的产品物料清单，支持多层级展开，这是制造企业最核心的功能之一。

**2. 权限管理系统**

这是企业系统最关键的部分。我设计了一套细粒度的权限控制，包括：
- **菜单权限**：不同角色看到的菜单不同
- **按钮权限**：比如普通员工只有"查看"按钮，管理员才有"删除"按钮
- **字段权限**：不同岗位的人看到的表格列也不一样

我用RBAC（基于角色的访问控制）模型来实现这些，支持10多种角色类型，100多个权限点。

**3. 性能优化**

在开发过程中遇到了一些性能问题，比如BOM树的数据量可能达到几万条，用传统表格渲染会卡死浏览器。我用了**虚拟滚动**技术，只渲染屏幕上可见的行，这样即使10万条数据也能流畅滚动，加载时间从8秒优化到1.5秒。

**4. 大文件处理**

工程图纸文件都很大，从100MB到2GB不等。我实现了**分片上传 + 断点续传 + 秒传**：把大文件切成小片上传，支持断网后继续上传，如果服务器已经存过相同文件就秒传。这样上传成功率提升到98%。

对于图纸预览，我集成了kkFileView，在服务端把文件转换成HTML，前端用iframe嵌入，这样浏览器不用处理大文件，预览很流畅。

**5. 移动端开发**

用UniApp做了移动端，一套代码适配iOS、Android和H5，让员工在手机上也能处理工作。

### 技术栈

- **PC端**：Vue3 + Vite + Pinia + Element Plus + TypeScript
- **移动端**：UniApp + Vue3
- **可视化**：ECharts图表 + LogicFlow流程图

### 项目收获

这个项目让我深入理解了企业级应用的开发，特别是权限管理、性能优化、大文件处理这些核心技术。也学会了如何在团队中协作，如何和后端配合设计接口。





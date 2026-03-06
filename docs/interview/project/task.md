---
outline: deep
---

# 博欣项目管理系统

::: info 项目概述
博欣项目管理系统是一个基于React和Vite构建的项目管理系统，集成了项目管理、任务管理和日报管理等功能，通过Ant Design实现UI组件化，并采用Redux Toolkit进行状态管理，具备高性能和模块化设计的特点。
:::

::: tip 项目规模
- **开发周期**：3个月
- **团队规模**：4人（前端2人，后端2人）
- **代码量**：前端约5万行代码
- **用户规模**：支持300+用户同时在线使用
:::

## 一、项目技术

### 核心技术栈
**前端技术**：React + Vite + Redux Toolkit + React Router + Ant Design + Axios + SCSS  
**状态管理**：Redux Toolkit + RTK Query  
**可视化**：ECharts  
**其他技术**：React-Hook-Form表单管理、自定义Hooks


## 二、我的工作

### 1. 前端架构设计与规划
- **整体架构**：采用React+Vite+Redux Toolkit技术栈，实现组件化和模块化开发
- **路由设计**：基于React Router设计嵌套路由系统，支持权限控制和懒加载
- **状态管理**：使用Redux Toolkit设计全局状态管理方案，包含用户状态、项目状态等
- **组件设计**：基于Ant Design设计可复用业务组件，提升开发效率

### 2. 核心业务模块开发
- **项目管理模块**：实现项目创建、编辑、状态跟踪，支持甘特图展示项目进度
- **任务管理模块**：实现任务分配、状态流转、优先级管理，支持看板和列表视图切换
- **日报管理模块**：实现日报编写、提交，集成ECharts统计报表展示工作数据
- **用户权限管理**：实现用户信息维护、角色分配、权限矩阵管理等

### 3. 数据可视化与报表系统
- **统计图表**：使用ECharts实现项目进度、任务完成率、工时统计等多维度图表
- **实时仪表盘**：开发项目概览仪表盘，实时展示关键指标和预警信息
- **报表导出**：支持PDF、Excel格式的报表导出功能
- **数据筛选**：实现多维度数据筛选和自定义报表生成


### 4. 性能优化与工程化
- **代码分割**：使用React.lazy和Suspense实现路由级代码分割
- **组件优化**：使用React.memo、useCallback、useMemo优化组件渲染性能
- **打包优化**：通过Vite的优化配置减少打包体积，提升加载速度
- **开发体验**：配置热更新、代码提示、自动格式化等开发工具

## 三、项目难点

### 1. 解决多人同时编辑的数据冲突问题

**问题描述**：项目管理系统支持多人同时对同一个项目进行编辑（例如任务拆解、进度更新等），这就要求系统必须具备实时协作能力。

**解决方案**：

采用**乐观更新 + 版本号冲突检测**的方案，让用户体验流畅的同时保证数据一致性。

**实现思路**：

1. **前端层面**：用户编辑数据时，先本地更新（乐观更新），界面立即响应；同时发请求到后端
2. **后端层面**：收到请求后，对比版本号。版本一致则更新成功；版本不一致则返回409冲突错误
3. **错误处理**：前端收到409错误，说明数据已被他人修改，提示用户并回滚本地更新

**关键实现**：

::: code-group

```javascript [前端：乐观更新Hook]
// 1. 封装乐观更新的 Hook
function useOptimisticUpdate() {
  const [pendingUpdates, setPendingUpdates] = useState({}) // 记录待提交的更新

  // 乐观更新：先更新本地数据，再提交到服务器
  const updateWithOptimism = async (dataId, newData) => {
    const currentData = store.getState().data.items[dataId]
    const oldVersion = currentData.version

    // 1. 先乐观更新本地数据（更新界面）
    store.dispatch({
      type: 'data/optimisticUpdate',
      payload: { id: dataId, data: newData }
    })

    // 2. 提交到服务器（带上版本号）
    try {
      await axios.put(`/api/data/${dataId}`, {
        ...newData,
        version: oldVersion  // 发送当前版本号
      })
      // 成功：清除待提交记录
      setPendingUpdates(prev => {
        const next = { ...prev }
        delete next[dataId]
        return next
      })
    } catch (error) {
      // 3. 失败：回滚本地数据
      if (error.response?.status === 409) {
        // 版本冲突：需要重新获取最新数据
        message.warning('数据已被他人修改，请刷新后重试')
        store.dispatch({ type: 'data/refetch', payload: { id: dataId } })
      } else {
        // 其他错误：回滚到原数据
        store.dispatch({
          type: 'data/rollback',
          payload: { id: dataId, data: currentData }
        })
      }
    }
  }

  return { updateWithOptimism }
}
```

```javascript [Redux Slice：状态管理]
// 2. Redux Toolkit 数据处理
import { createSlice } from '@reduxjs/toolkit'

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    items: {},      // 正式数据
    optimistic: {}  // 乐观更新的临时数据
  },
  reducers: {
    // 乐观更新：先存到临时区
    optimisticUpdate: (state, action) => {
      const { id, data } = action.payload
      state.optimistic[id] = { ...state.items[id], ...data }
    },
    // 提交成功：临时数据转正
    updateSuccess: (state, action) => {
      const { id, data } = action.payload
      state.items[id] = data
      delete state.optimistic[id]
    },
    // 回滚：清除临时数据
    rollback: (state, action) => {
      const { id } = action.payload
      delete state.optimistic[id]
    },
    // 获取最新数据
    refetchSuccess: (state, action) => {
      const { id, data } = action.payload
      state.items[id] = data
      delete state.optimistic[id]
    }
  }
})

// 选择器：优先返回乐观更新数据（让用户看到自己刚做的修改）
export const selectDataWithOptimism = (state, id) => {
  return state.data.optimistic[id] || state.data.items[id]
}
```

```javascript [后端：版本号冲突检测]
// 3. 后端版本号冲突检测逻辑（Node.js示例）
async function updateData(req, res) {
  const { id, ...data } = req.body
  const { version } = req.body

  // 查询数据库中的最新数据
  const currentData = await db.findById(id)

  // 核心逻辑：对比版本号
  if (currentData.version !== version) {
    // 版本冲突：返回409状态码
    return res.status(409).json({
      error: '数据冲突',
      message: '数据已被他人修改，请刷新后重试',
      latestData: currentData // 返回最新数据供前端使用
    })
  }

  // 版本一致：更新数据并递增版本号
  const updatedData = await db.update(id, {
    ...data,
    version: currentData.version + 1  // 版本号+1
  })

  return res.json(updatedData)
}
```

```javascript [组件使用示例]
// 4. 在任务编辑组件中使用
function TaskEditForm({ taskId }) {
  // 获取数据（优先取乐观更新数据）
  const task = useSelector(state => selectDataWithOptimism(state, taskId))
  const { updateWithOptimism } = useOptimisticUpdate()

  const handleSave = async (values) => {
    await updateWithOptimism(taskId, values)
    // 用户点击保存后，界面立即更新（乐观更新）
    // 如果有冲突，会自动提示并处理
  }

  return (
    <Form initialValues={task} onFinish={handleSave}>
      <Form.Item name="title" label="任务标题">
        <Input />
      </Form.Item>
      <Form.Item name="status" label="任务状态">
        <Select>...</Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">保存</Button>
    </Form>
  )
}
```

:::

**方案优势**：
- **体验好**：用户操作后界面立即响应，无需等待网络请求
- **实现简单**：比WebSocket实时同步方案简单，适合中小项目
- **数据安全**：版本号机制确保不会静默覆盖他人修改

---

### 2. 表单的字段权限控制

**问题描述**：项目需要根据用户对应的角色权限，对表单的字段进行权限控制，比如某个用户只能查看某些字段，某个用户只能修改某些字段。

**解决方案**：
- **设置字段权限**：在字段权限页面中设置权限，可以根据角色设置某一个表的字段权限
- **字段权限控制**：根据配置的字段权限，动态生成表单字段，并控制字段的显示和隐藏

**关键实现**：

::: code-group

```javascript [字段权限配置]
// 1. 字段权限配置数据结构 - 后端返回的权限配置
// 示例：管理员可以看到所有字段，普通用户只能看到部分字段
const fieldPermissions = {
  // 表名：任务表
  'task': {
    'admin': {            // 管理员角色
      'title': 'edit',     // 标题字段：可编辑
      'status': 'edit',   // 状态字段：可编辑
      'assignee': 'edit', // 负责人：可编辑
      'deadline': 'view',  // 截止日期：只能查看
      'salary': 'hidden'   // 薪资：隐藏
    },
    'user': {             // 普通用户角色
      'title': 'view',    // 标题字段：只能查看
      'status': 'hidden', // 状态字段：隐藏
      'assignee': 'view', // 负责人：只能查看
      'deadline': 'hidden',
      'salary': 'hidden'
    }
  }
}
```

```javascript [封装权限判断 Hook]
// 2. 封装权限判断 Hook - 判断用户对某字段的权限
import { useSelector } from 'react-redux'

function useFieldPermission(tableName, fieldName) {
  const userRole = useSelector(state => state.user.role)  // 获取当前用户角色
  
  // 获取该字段在当前角色下的权限：edit/view/hidden
  const permission = fieldPermissions[tableName]?.[userRole]?.[fieldName] || 'hidden'
  
  return {
    canEdit: permission === 'edit',    // 是否可编辑
    canView: permission !== 'hidden',  // 是否可查看
    isHidden: permission === 'hidden'   // 是否隐藏
  }
}
```

```javascript [动态生成表单字段]
// 3. 动态生成表单字段 - 更通用的实现方式
function DynamicPermissionForm({ tableName, initialValues }) {
  // 定义所有字段配置
  const allFields = [
    { name: 'title', label: '任务标题', component: 'input' },
    { name: 'status', label: '任务状态', component: 'select' },
    { name: 'assignee', label: '负责人', component: 'userPicker' },
    { name: 'deadline', label: '截止日期', component: 'datePicker' },
    { name: 'salary', label: '薪资', component: 'inputNumber' }
  ]
  
  // 过滤出有权限的字段
  const visibleFields = allFields.filter(field => {
    const { canView } = useFieldPermission(tableName, field.name)
    return canView
  })
  
  return (
    <Form initialValues={initialValues}>
      {visibleFields.map(field => {
        const { canEdit, canView } = useFieldPermission(tableName, field.name)
        const disabled = canView && !canEdit  // 可查看但不可编辑则禁用
        
        return (
          <Form.Item key={field.name} name={field.name} label={field.label}>
            {field.component === 'input' && <Input disabled={disabled} />}
            {field.component === 'select' && <Select disabled={disabled}>...</Select>}
            {field.component === 'datePicker' && <DatePicker disabled={disabled} />}
            {/* 其他组件... */}
          </Form.Item>
        )
      })}
    </Form>
  )
}
```

:::

## 四、项目亮点

### 1. 性能优化成果
- **首屏加载时间**：通过Vite构建优化和代码分割，首屏加载时间从3.5秒优化至1.2秒
- **列表渲染性能**：虚拟滚动技术支持万级数据流畅渲染，内存占用降低65%
- **包体积优化**：通过Tree-shaking和按需加载，打包体积从1.8MB优化至800KB
- **缓存策略**：多级缓存机制使页面切换响应时间减少80%

### 2. 技术创新实践
- **状态管理模式**：Redux Toolkit + RTK Query的组合方案，简化复杂状态管理
- **组件化架构**：高度可复用的业务组件库，提升开发效率50%
- **工程化体系**：完整的ESLint、Prettier、Husky配置，保障代码质量
- **监控系统**：集成Sentry错误监控，实现线上问题的快速定位和修复


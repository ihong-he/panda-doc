---
outline: deep
---

# 博欣项目管理系统

::: info 项目概述
博欣项目管理系统是一个基于React和Vite构建的项目管理系统，集成了项目管理、任务管理和日报管理等功能，通过Ant Design实现UI组件化，并采用Redux Toolkit进行状态管理，具备高性能和模块化设计的特点。
:::

::: tip 项目规模
- **开发周期**：3个月
- **团队规模**：4人（前端1人，后端2人，UI设计1人）
- **代码量**：前端约2.5万行代码
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

### （一）使用 RTK Query 管理服务器状态

**问题描述**：项目需要从后端获取项目列表、项目详情、任务列表、任务详情等数据，并展示在页面上。使用传统的Redux管理状态时，数据获取和展示逻辑会重复Many times，导致代码冗长、维护困难。

**解决方案**：
- **RTK Query**：基于RTK Query的API请求管理，自动缓存数据，支持数据更新和错误处理
- **数据缓存**：使用RTK Query的缓存功能，自动缓存数据，提高数据获取效率
- **数据更新**：使用RTK Query的`refetchOnMountOrArgChange`功能，自动刷新数据，提升用户体验
- **错误处理**：使用RTK Query的`queryFn`参数，处理错误并返回错误信息

**关键实现**：

```javascript
// 1. 创建 API Slice - 就像定义一个"数据服务窗口"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const projectApi = createApi({
  reducerPath: 'projectApi',  // 在 Redux store 中的名字
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),  // 基础请求配置
  tagTypes: ['Project', 'Task'],  // 定义数据标签，用于缓存更新
  endpoints: (builder) => ({
    // 获取项目列表（查询接口）
    getProjects: builder.query({
      query: (params) => `/projects?page=${params.page}`,
      providesTags: ['Project']  // 标记返回的数据是 Project 类型
    }),
    // 获取项目详情
    getProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }]
    }),
    // 创建项目（修改接口）
    createProject: builder.mutation({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Project']  // 成功后自动刷新 Project 类型缓存
    })
  })
})

// 自动生成 Hook：useGetProjectsQuery, useCreateProjectMutation 等
export const { useGetProjectsQuery, useGetProjectByIdQuery, useCreateProjectMutation } = projectApi
```

```javascript
// 2. 配置 Store - 注册 API 服务
import { configureStore } from '@reduxjs/toolkit'
import { projectApi } from './projectApi'

export const store = configureStore({
  reducer: {
    [projectApi.reducerPath]: projectApi.reducer  // 添加 API reducer
  },
  middleware: (getDefault) => getDefault().concat(projectApi.middleware)  // 添加 API 中间件（处理缓存、自动刷新等）
})
```

```javascript
// 3. 在组件中使用 - 一行代码搞定数据获取
function ProjectList() {
  // data: 返回的数据, isLoading: 加载状态, error: 错误信息, refetch: 手动刷新
  const { data: projects, isLoading, error, refetch } = useGetProjectsQuery({ page: 1 })

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败，<button onClick={refetch}>点击重试</button></div>

  return (
    <div>
      {projects?.map(project => (
        <ProjectCard key={project.id} data={project} />
      ))}
    </div>
  )
}
```

**核心优势**：
- **无需写 useEffect**：RTK Query 自动处理数据获取
- **自动缓存**：相同参数的请求不会重复发送
- **自动刷新**：组件卸载后重新挂载，自动判断是否需要更新数据
- **自动生成 Hook**：通过 API 定义自动生成对应的 React Hook

---

### （二）表单的字段权限控制

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


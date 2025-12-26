# 博欣信息管理系统（ERP系统）

::: info 项目概述
博欣信息管理系统（ERP系统）基于vue3+vite构建，包含PC端和移动端，集成制造研发类企业日常工作管理，包含进销存、产品管理、物料管理、生产制造等模块，快速提供决策信息，提升企业的营运绩效与快速反应能力。项目覆盖从客户订单到产品交付的全流程管理，支持多部门协作，实现企业数字化转型。
:::

::: tip 项目规模
- **开发周期**：8个月
- **团队规模**：6人（前端3人，后端3人）
- **代码量**：前端约3万行代码
- **用户规模**：支持500+用户同时在线使用
:::


## 一、项目技术

### 核心技术栈
**PC端**：Vue3 + Vite + Pinia + Vue-Router + Element Plus + Axios + TypeScript  
**移动端**：UniApp + uView UI + Vue3  
**可视化**：ECharts + LogicFlow  
**其他技术**：SignalR消息推送、kkFileView文件预览、自定义组件库

### 技术架构
- **构建工具**：Vite（构建速度提升50%+）
- **状态管理**：Pinia（替代Vuex，支持TypeScript）
- **UI组件库**：Element Plus PC端 + uView移动端
- **数据可视化**：ECharts图表库 + LogicFlow流程图
- **实时通信**：SignalR实现消息推送和实时数据更新
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
- **数据权限**：实现行级和列级数据权限控制
- **操作权限**：控制用户对特定功能的访问权限
- **权限验证**：前端路由守卫和API请求拦截器双重验证

### 4. 移动端开发与适配
- **跨端开发**：使用UniApp框架，一套代码适配iOS、Android、H5
- **功能迁移**：将PC端核心功能适配移动端，优化移动端用户体验
- **性能优化**：针对移动端网络环境进行图片压缩、懒加载等优化
- **离线支持**：实现关键数据的本地缓存和离线操作

### 5. 项目部署与维护
- **CI/CD部署**：搭建自动化部署流程，支持多环境部署
- **性能优化**：通过代码分割、懒加载等技术提升应用性能
- **Bug修复**：快速定位和修复线上问题，保障系统稳定性
- **用户体验优化**：根据用户反馈持续改进界面交互和操作流程

## 三、项目难点

### （一）大数据量表格渲染卡顿

**问题描述**：BOM树数据量可能达到数万条记录，传统表格渲染会导致页面严重卡顿，甚至浏览器崩溃。

**解决方案**：
- 采用`el-table-v2`虚拟滚动技术，只渲染可视区域内的DOM元素
- 实现数据分页加载和懒加载，减少初始渲染压力
- 优化数据结构，使用扁平化数据配合前端树形展开逻辑
- 添加loading状态和骨架屏，提升用户体验

**技术实现**：
```javascript
// 虚拟表格配置
const columns = ref([])
const tableData = computed(() => {
  return virtualStore.processData(rawData.value)
})

// 懒加载实现
const loadMoreData = async (startIndex, endIndex) => {
  const data = await api.getBOMData({ startIndex, endIndex })
  virtualStore.appendData(data)
}
```

**效果**：支持10万+数据流畅渲染，首次加载时间从8秒优化至1.5秒。

### （二）图纸大文件上传

**问题描述**：工程图纸文件通常较大（100MB-2GB），传统上传方式容易出现超时、失败等问题，网络中断需要重新上传。

**解决方案**：
- **文件切片**：将大文件分割为5MB的切片，并发上传
- **断点续传**：记录已上传切片信息，支持中断后继续上传
- **秒传功能**：通过文件MD5值判断文件是否已存在，避免重复上传
- **进度显示**：实时显示上传进度和速度，提升用户体验

**技术实现**：
```javascript
// 文件切片上传
const uploadChunk = async (chunk, index, fileId) => {
  const formData = new FormData()
  formData.append('chunk', chunk)
  formData.append('index', index)
  formData.append('fileId', fileId)
  
  return await request.post('/api/upload/chunk', formData)
}

// 断点续传检查
const checkUploadStatus = async (fileId) => {
  const uploadedChunks = await request.get(`/api/upload/status/${fileId}`)
  return uploadedChunks.data
}
```

**效果**：支持2GB+文件上传，上传成功率提升至98%，网络中断后可续传。

### （三）图纸大文件预览

**问题描述**：工程图纸格式多样（DWG、DXF、PDF等），需要实现在线预览功能，且要考虑大文件的预览性能。

**解决方案**：
- **kkFileView集成**：使用开源的kkFileView实现多种文件格式在线预览
- **预览优化**：对大文件进行压缩处理，生成预览缩略图
- **缓存机制**：实现预览文件缓存，避免重复转换
- **安全控制**：添加预览权限控制和水印保护

**技术实现**：
```javascript
// 文件预览组件
const PreviewComponent = {
  setup() {
    const previewUrl = computed(() => {
      return `${KKFILEVIEW_URL}/onlinePreview?url=${encodeURIComponent(fileUrl)}`
    })
    
    return { previewUrl }
  }
}
```

**效果**：支持20+种文件格式预览，预览加载时间控制在3秒内。

### （四）工序及工艺流程可视化

**问题描述**：生产工艺流程复杂，需要可视化编辑和管理，支持工序节点拖拽、连线、属性配置等操作。

**解决方案**：
- **LogicFlow集成**：使用滴滴开源的LogicFlow流程图引擎
- **自定义节点**：开发符合业务需求的工序节点类型
- **数据序列化**：将流程图转换为JSON格式存储和传输
- **实时协作**：基于SignalR实现多人实时编辑

**技术实现**：
```javascript
// 初始化LogicFlow
const lf = new LogicFlow({
  container: document.querySelector('#container'),
  grid: true,
  background: {
    backgroundImage: 'url(grid.svg)'
  }
})

// 自定义工序节点
lf.register('process-node', {
  draw: (x, y, width, height, model) => {
    // 绘制自定义工序节点样式
  },
  getAnchorPoints: () => {
    return [[0, 0.5], [1, 0.5]] // 左右锚点
  }
})
```

**效果**：支持50+工序节点的复杂流程设计，操作响应时间<100ms。

### （五）细粒度权限管理系统

**问题描述**：企业级应用需要复杂的权限控制，包括菜单权限、操作权限、数据权限等多维度权限管理。

**解决方案**：
- **RBAC模型**：基于角色的访问控制模型，支持角色继承
- **动态权限**：运行时权限验证，支持权限动态变更
- **前端控制**：路由级别和组件级别的权限控制
- **数据过滤**：根据用户权限过滤显示数据

**技术实现**：
```javascript
// 权限守卫
router.beforeEach((to, from, next) => {
  const hasPermission = checkPermission(to.meta.permission)
  if (hasPermission) {
    next()
  } else {
    next('/403')
  }
})

// 自定义指令控制元素权限
const vPermission = {
  mounted(el, binding) {
    const { value } = binding
    const hasPermission = checkPermission(value)
    if (!hasPermission) {
      el.style.display = 'none'
    }
  }
}
```

**效果**：支持10+角色类型，100+权限点，权限验证响应时间<10ms。


## 四、项目亮点

### 1. 性能优化成果
- **首屏加载时间**：通过Vite构建优化和代码分割，首屏加载时间从4.2秒优化至1.8秒
- **内存使用**：虚拟列表技术减少DOM节点，内存占用降低60%
- **包体积**：通过Tree-shaking和按需加载，打包体积从2.3MB优化至1.1MB

### 2. 技术创新
- **跨端一致性**：PC端和移动端保持90%代码复用，降低维护成本
- **实时数据同步**：基于SignalR实现毫秒级数据更新，提升协作效率
- **可视化编辑**：LogicFlow流程图引擎，提供直观的工艺流程设计体验

### 3. 工程化实践
- **TypeScript全覆盖**：提升代码质量和开发效率，减少运行时错误
- **自动化测试**：单元测试覆盖率85%+，保障代码质量
- **CI/CD流程**：实现自动化构建、测试、部署，提升交付效率

### 4. 用户体验提升
- **响应式设计**：完美适配PC、平板、手机多端设备
- **离线支持**：关键功能支持离线操作，提升使用体验
- **无障碍访问**：支持键盘导航和屏幕阅读器，符合Web标准

## 五、项目成果与反思

### 项目成果
- **业务价值**：提升企业管理效率30%，减少人工错误70%
- **用户反馈**：用户满意度达到95%，被客户评为年度最佳数字化转型项目
- **技术沉淀**：形成可复用的组件库和开发规范

### 个人成长
- **技术能力**：深入掌握Vue3生态，提升大型项目架构设计能力
- **项目管理**：学会多团队协作，提升需求分析和问题解决能力
- **业务理解**：深入了解制造业业务流程，具备行业解决方案能力

### 改进方向
- **监控完善**：需要更完善的前端监控和错误追踪体系
- **文档建设**：技术文档和业务文档需要更加系统和完整
- **性能优化**：还有进一步优化的空间，特别是移动端性能




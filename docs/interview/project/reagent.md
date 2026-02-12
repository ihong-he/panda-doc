---
outline: deep
---
# 智能试剂管理系统

::: info 项目概述
智能试剂管理系统旨在优化医院内部试剂物资的管理流程，从物料采购到库存管理再到院内使用，覆盖全生命周期的操作。系统基于桌面端开发，支持人脸识别登录，具备实时数据监控和智能分析功能，为医院提供安全、高效、智能的试剂管理解决方案。
:::

::: tip 项目规模
- **开发周期**：12个月
- **团队规模**：4人（前端1人，后端2人，UI设计1人）
- **代码量**：前端约2万行代码
- **应用场景**：覆盖医院检验科、病理科等10+科室
:::

## 一、项目技术

### 核心技术栈
**桌面端**：Electron + Vue3 + Vite + TypeScript  
**状态管理**：Pinia  
**UI组件库**：Element Plus  
**数据可视化**：ECharts  
**实时通信**：SignalR  
**其他技术**：Axios、Vue Router、WebRTC

### Electron架构特点
- **进程分离**：主进程和渲染进程分离，保证应用安全性
- **原生集成**：调用系统摄像头、文件系统等原生API
- **跨平台**：一套代码支持Windows、macOS、Linux
- **自动更新**：支持应用自动更新机制

## 二、我的工作

### 1. 前端架构设计与搭建
- **Electron架构**：设计主进程和渲染进程通信方案，实现安全的进程间通信
- **Vue3工程化**：搭建基于Vite的现代化前端工程化体系，配置TypeScript
- **模块化设计**：按业务功能划分模块，实现试剂管理、采购管理、仓储管理等独立模块
- **状态管理**：使用Pinia设计全局状态管理，管理用户信息、试剂数据、采购状态等

### 2. 核心业务模块开发
- **试剂管理模块**：实现试剂信息维护、库存监控、有效期管理、试剂分类等功能
- **请领管理模块**：开发试剂申请、审批流程、领用记录、状态跟踪等完整流程
- **采购管理模块**：实现采购计划制定、供应商选择、采购订单跟踪等功能
- **仓储管理模块**：开发入库出库操作、库存盘点、仓储位置管理、预警提醒等功能
- **供应商管理模块**：实现供应商信息维护、资质管理、评价体系、合同管理等功能

### 3. 人脸识别登录系统
- **摄像头集成**：基于WebRTC调用摄像头，实现实时视频流显示
- **人脸检测**：集成人脸识别API，实现人脸位置检测和特征提取
- **身份验证**：调用后端识别接口，实现人脸比对和用户身份验证

### 4. 数据可视化大屏
- **大屏设计**：基于ECharts设计医院试剂管理可视化大屏
- **实时数据**：使用SignalR实现数据实时更新，展示库存状态、使用趋势等
- **多维度分析**：实现按科室、按时间、按试剂类型的多维度数据分析
- **预警监控**：开发库存预警、过期预警、异常使用监控等功能


## 三、项目难点

### （一）主进程和渲染进程通信

**问题描述**：[Electron应用](/note/electron.html) 需要处理主进程和渲染进程的通信，同时要确保安全性和性能，传统Web开发经验难以直接适用。

**应用场景**：系统需要调用摄像头进行人脸识别登录、访问本地文件系统进行试剂数据导出、控制窗口行为等原生功能，这些操作都需要主进程与渲染进程之间的安全通信。

**解决方案**：
- **进程分离**：主进程负责窗口管理和API调用，渲染进程专注UI展示
- **IPC通信**：使用IPC（进程间通信）实现安全的数据传递
- **安全策略**：禁用Node.js集成，使用contextBridge安全暴露API
- **性能优化**：合理管理进程生命周期，避免内存泄漏

**技术实现**：
```javascript
// 主进程设置
const { app, BrowserWindow, ipcMain } = require('electron')

// 安全的窗口创建
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
}

// 安全的API暴露
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  camera: {
    start: () => ipcRenderer.invoke('camera:start'),
    stop: () => ipcRenderer.invoke('camera:stop')
  }
})
```

**效果**：确保应用安全性，提升桌面应用性能，支持跨平台部署。

### （二）人脸识别登录系统

**问题描述**：

**解决方案**：

1. **启动摄像头**
   - 点击"启动摄像头"按钮调用 `startCamera()` 函数
   - 请求用户媒体设备权限，设置视频约束参数
   - 将视频流绑定到 `<video>` 元素并显示摄像头画面

2. **捕获并识别**
   - 用户将面部对准摄像头框内
   - 点击"人脸识别"按钮调用 `captureAndRecognize()` 函数
   - 将当前视频帧绘制到 Canvas 上
   - 将 Canvas 内容转换为 base64 格式的 JPEG 图像

3. **人脸检测**
   - 调用 `/api/User/RecognizeFace` API 检测图像中的人脸
   - 如果未检测到人脸，显示"未识别到人脸，请重试"

4. **人脸验证**
   - 检测成功后调用 `/api/User/GetUserBySwipFace` API 进行身份验证
   - 将人脸特征与数据库中的用户信息进行比对
   - 验证失败显示"人脸验证失败，请重试"

5. **登录成功**
   - 验证成功后显示"人脸识别成功"提示
   - 将用户信息存储到 Pinia store
   - 自动跳转到数据视图页面 (`/dataview`)

6. **资源清理**
   - 组件卸载时自动关闭摄像头
   - 清理媒体流资源，释放设备权限

**技术实现**：

<details>
<summary>查看完整代码</summary>

```javascript
// 启动摄像头
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    })
    
    videoElement.srcObject = stream
    return stream
  } catch (error) {
    console.error('摄像头启动失败:', error)
    throw new Error('无法访问摄像头，请检查权限设置')
  }
}

// 人脸识别完整流程
const captureAndRecognize = async () => {
  // 1. 捕获当前帧到Canvas
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoElement, 0, 0)
  
  const imageData = canvas.toDataURL('image/jpeg', 0.8)
  
  // 2. 人脸检测
  const faceDetection = await api.post('/api/User/RecognizeFace', {
    image: imageData
  })
  
  if (!faceDetection.data.hasFace) {
    throw new Error('未识别到人脸，请重试')
  }
  
  // 3. 人脸验证
  const recognizeResult = await api.post('/api/User/GetUserBySwipFace', {
    image: imageData
  })
  
  if (!recognizeResult.data.success) {
    throw new Error('人脸验证失败，请重试')
  }
  
  // 4. 登录成功处理
  store.commit('setUserInfo', recognizeResult.data.userInfo)
  router.push('/dataview')
  
  return recognizeResult.data.userInfo
}
```
</details>

**效果**：人脸识别成功率达到95%，完整登录流程控制在3秒内，用户体验流畅。

### （三）基于SignalR的实时数据推送

**问题描述**：试剂管理大屏需要实时显示库存变化、试剂使用情况等数据，传统轮询方式效率低且延迟高。

**解决方案**：
- **SignalR集成**：使用SignalR建立WebSocket连接，实现服务端主动推送
- **数据缓存**：客户端缓存历史数据，减少重复请求
- **连接管理**：实现自动重连机制，保证连接稳定性
- **数据同步**：多客户端数据实时同步，确保数据一致性

**技术实现**：
```javascript
// SignalR连接管理
import * as signalR from '@microsoft/signalr'

class SignalRService {
  constructor() {
    this.connection = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }
  
  async startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/reagent')
      .withAutomaticReconnect()
      .build()
    
    // 监听数据更新
    this.connection.on('StockUpdate', (data) => {
      this.handleStockUpdate(data)
    })
    
    this.connection.on('AlertNotification', (alert) => {
      this.handleAlert(alert)
    })
    
    try {
      await this.connection.start()
      console.log('SignalR连接成功')
    } catch (error) {
      console.error('SignalR连接失败:', error)
      this.handleReconnect()
    }
  }
  
  handleStockUpdate(data) {
    // 更新大屏数据
    store.dispatch('updateStockData', data)
    // 触发图表更新
    eventBus.emit('updateChart', data)
  }
}
```

**效果**：数据延迟控制在100ms内，支持多客户端实时同步，连接稳定性达到99.5%。

### （四）Electron应用优化

**问题描述**：桌面端应用启动速度慢、内存占用高，用户体验不友好。

**解决方案**：
- **代码分割**：使用Vite的代码分割功能，按路由和组件动态加载，减少首屏加载时间
- **资源优化**：压缩图片、字体等静态资源，使用CDN加速资源加载
- **懒加载**：对非核心模块和大数据列表实现懒加载和虚拟滚动
- **进程管理**：优化Electron主进程和渲染进程的资源使用，及时清理无用资源
- **缓存策略**：使用localStorage和IndexedDB缓存常用数据，减少网络请求
- **打包优化**：使用electron-builder进行打包优化，减小安装包体积

**技术实现**：
```javascript
// 路由懒加载
const routes = [
  {
    path: '/reagent',
    component: () => import('@/views/Reagent.vue')
  },
  {
    path: '/procurement',
    component: () => import('@/views/Procurement.vue')
  }
]

// 虚拟滚动组件
import { VirtualList } from '@vueuse/components'

// 主进程优化
app.whenReady().then(() => {
  // 预加载常用资源
  const mainWindow = createWindow()
  mainWindow.webContents.session.clearCache()
})

// 打包配置优化
export default {
  compression: 'maximum',
  files: [
    'dist/**/*',
    'package.json'
  ],
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true
  }
}
```

**效果**：应用启动时间从8秒优化至3秒，内存占用降低40%，安装包体积减小35%。



## 四、项目亮点

### 1. 技术创新点
- **桌面端创新**：基于Electron实现桌面端应用，提供比Web应用更稳定、更安全的用户体验
- **生物识别登录**：集成人脸识别技术，实现无接触快速登录，提升医院信息安全等级
- **实时数据大屏**：基于SignalR和ECharts构建的实时监控大屏，提供直观的数据可视化
- **智能化管理**：通过数据分析和智能预警，实现试剂库存的智能化管理

### 2. 性能优化成果
- **启动速度**：通过Electron优化和代码分割，应用启动时间从8秒优化至3秒
- **内存管理**：优化Electron内存使用，长期运行内存增长控制在5%以内
- **响应性能**：虚拟滚动和懒加载技术，大数据列表响应时间<100ms
- **网络优化**：SignalR连接优化，数据推送延迟控制在100ms内

### 3. 用户体验提升
- **操作便捷性**：人脸识别登录，3秒内完成身份验证
- **界面美观性**：基于Element Plus的现代化UI设计，符合医疗行业审美
- **交互友好性**：完善的错误提示和操作引导，降低学习成本
- **数据可视化**：直观的图表和大屏展示，便于管理层决策

### 4. 工程化实践
- **TypeScript全覆盖**：提升代码质量，减少运行时错误
- **模块化架构**：清晰的模块划分，便于团队协作和维护
- **自动化测试**：关键功能单元测试覆盖，保障系统稳定性
- **代码规范**：ESLint + Prettier统一代码风格，提升代码质量

## 五、项目成果与反思

### 项目成果
- **业务价值**：提升医院试剂管理效率50%，降低人工错误率80%
- **成本节约**：通过智能库存管理，减少试剂浪费30%，年节约成本约50万元
- **用户反馈**：医护人员满意度达到92%，系统稳定性获得高度认可
- **技术沉淀**：形成可复用的Electron桌面端开发框架和组件库

### 个人成长
- **技术能力**：深入掌握Electron桌面端开发，提升前端架构设计能力
- **问题解决**：学会了处理复杂业务场景下的技术难题
- **项目管理**：参与了完整的项目生命周期，提升了需求分析和项目把控能力
- **行业认知**：深入了解医疗行业业务流程和合规要求

### 改进方向
- **移动端适配**：考虑开发移动端应用，支持移动办公场景
- **AI能力增强**：集成更多AI功能，如智能推荐、预测分析等
- **系统监控**：完善前端监控体系，及时发现和解决问题
- **用户体验**：持续收集用户反馈，优化操作流程和界面设计
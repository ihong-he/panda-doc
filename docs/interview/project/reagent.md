---
outline: deep
---
# 智能试剂管理系统

::: info 项目概述
智能试剂管理系统旨在优化医院内部试剂物资的管理流程，从物料采购到库存管理再到院内使用，覆盖全生命周期的操作。系统基于桌面端开发，支持人脸识别登录，具备实时数据监控和智能分析功能，为医院提供安全、高效、智能的试剂管理解决方案。
:::

::: tip 项目规模
- **开发周期**：6个月
- **团队规模**：4人（前端1人，后端2人，UI设计1人）
- **代码量**：前端约10万行代码
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

**应用场景**：
- **人脸识别登录**：渲染进程需要调用系统摄像头采集人脸图像，通过主进程调用原生API控制设备
- **文件系统操作**：试剂信息导入导出、库存报表生成等需要主进程访问文件系统
- **系统通知推送**：库存预警、过期提醒等需要主进程调用系统原生通知
- **窗口管理**：多窗口数据同步、窗口最小化托盘等功能需要进程间协调

**解决方案**：
- **安全隔离**：禁用Node.js集成，启用上下文隔离，防止渲染进程直接访问Node.js API
- **暴露接口**：在`preload.js`中，使用`contextBridge`安全暴露有限的API接口
- **IPC通信**：使用`ipcRenderer.invoke`和`ipcMain.handle`实现异步双向通信，避免同步阻塞
- **API封装**：按业务模块封装API（如camera、file、notification），提供类型安全的接口定义


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
      nodeIntegration: false, // 禁用Node.js集成，防止渲染进程直接访问Node API
      contextIsolation: true, // 启用上下文隔离，隔离预加载脚本与渲染进程的全局作用域
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

**问题描述**：医院检验科、病理科等科室需要快速、安全地登录系统，传统密码登录方式存在以下问题：密码容易遗忘或泄露、输入密码耗时、不符合医院无接触操作要求。需要实现基于人脸识别的快速登录系统，既保证安全性又提升用户体验。

**解决方案**：
- **摄像头调用**：通过`navigator.mediaDevices.getUserMedia` 浏览器API调用设备摄像头，获取实时视频流
- **人脸检测**：集成face-api.js库，加载TinyFaceDetector模型实现前端实时人脸检测
- **特征提取**：使用FaceLandmark68Net模型提取人脸关键点特征，确保人脸清晰度达标
- **身份验证**：截取视频帧转换为Base64图像，调用后端API进行人脸特征比对
- **登录流程**：验证通过后自动获取用户Token完成登录，失败则提示重新尝试

**技术实现**：

```vue
<!-- 人脸识别登录组件 -->
<template>
  <div class="face-login">
    <video ref="video" autoplay playsinline muted></video>
    <canvas ref="canvas" style="display: none"></canvas>
    <div class="status">{{ status }}</div>
    <el-button @click="startLogin" :disabled="isLoading">
      {{ isLoading ? '识别中...' : '开始人脸识别' }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as faceapi from 'face-api.js'
import { ElMessage } from 'element-plus'

const video = ref(null)
const canvas = ref(null)
const status = ref('准备就绪')
const isLoading = ref(false)
let stream = null

// 初始化人脸识别模型
const initFaceApi = async () => {
  try {
    // 加载人脸检测和识别模型
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    status.value = '模型加载完成'
  } catch (error) {
    status.value = '模型加载失败'
    console.error('模型加载失败:', error)
  }
}

// 启动摄像头
const startCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    })
    video.value.srcObject = stream
    status.value = '摄像头已启动，请对准摄像头'
  } catch (error) {
    status.value = '摄像头启动失败'
    ElMessage.error('无法访问摄像头，请检查权限设置')
  }
}

// 开始人脸识别
const startLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true
  status.value = '正在识别...'

  try {
    // 检测人脸
    const detections = await faceapi
      .detectAllFaces(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()

    if (detections.length === 0) {
      status.value = '未检测到人脸，请调整位置'
      ElMessage.warning('未检测到人脸，请正对摄像头')
      isLoading.value = false
      return
    }

    if (detections.length > 1) {
      status.value = '检测到多个人脸，请保持单人'
      ElMessage.warning('请确保只有一人在镜头前')
      isLoading.value = false
      return
    }

    // 截取人脸图像
    const faceImage = captureFace(detections[0])

    // 发送到后端验证
    const result = await verifyFace(faceImage)

    if (result.success) {
      status.value = '识别成功，正在登录...'
      ElMessage.success('登录成功')
      // 执行登录逻辑
      setTimeout(() => {
        window.location.href = '/home'
      }, 500)
    } else {
      status.value = '识别失败，请重试'
      ElMessage.error('人脸识别失败，请重试')
    }
  } catch (error) {
    status.value = '识别出错，请重试'
    console.error('人脸识别错误:', error)
    ElMessage.error('识别出错，请重试')
  } finally {
    isLoading.value = false
  }
}

// 截取人脸图像
const captureFace = (detection) => {
  const canvasEl = canvas.value
  const ctx = canvasEl.getContext('2d')
  const box = detection.detection.box

  // 设置canvas尺寸
  canvasEl.width = box.width
  canvasEl.height = box.height

  // 绘制人脸区域
  ctx.drawImage(
    video.value,
    box.x, box.y, box.width, box.height,
    0, 0, box.width, box.height
  )

  // 转换为Base64
  return canvasEl.toDataURL('image/jpeg', 0.8)
}

// 后端验证
const verifyFace = async (faceImage) => {
  try {
    const response = await fetch('/api/face/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ faceImage })
    })
    return await response.json()
  } catch (error) {
    console.error('验证请求失败:', error)
    return { success: false }
  }
}

// 清理资源
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
}

onMounted(() => {
  initFaceApi()
  startCamera()
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.face-login {
  text-align: center;
  padding: 20px;
}

video {
  width: 400px;
  height: 300px;
  border: 2px solid #409eff;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status {
  margin: 15px 0;
  font-size: 16px;
  color: #606266;
}
</style>
```

**技术要点**：

1. **WebRTC摄像头调用**：使用`navigator.mediaDevices.getUserMedia`获取视频流，这是浏览器原生API，无需额外依赖

2. **face-api.js人脸识别**：轻量级前端人脸识别库，基于TensorFlow.js，支持人脸检测、特征提取、表情识别等

3. **前端人脸处理**：在前端完成人脸检测和图像裁剪，减少网络传输数据量

4. **后端身份验证**：前端只负责图像采集，实际的身份比对在后端完成，保证安全性

5. **用户体验优化**：
   - 实时视频流反馈
   - 自动人脸检测提示
   - 错误处理和重试机制
   - Loading状态管理

**效果**：人脸识别成功率达到95%，完整登录流程控制在3秒内，用户体验流畅。

### （三）基于SignalR的实时数据推送

**问题描述**：试剂管理大屏需要实时显示库存变化、试剂使用情况等数据，传统轮询方式效率低且延迟高。

**技术选型**：SignalR是微软推出的实时通信库，支持WebSocket、Server-Sent Events等多种传输协议，能够实现服务端向客户端的主动推送。相比传统轮询，SignalR具有连接持久、低延迟、自动重连等优势，非常适合实时数据推送场景。

**实现步骤**：

1. **初始化连接**：创建SignalR连接实例，指定服务器Hub地址，配置自动重连策略
2. **注册事件监听**：订阅服务端推送的事件（如StockUpdate库存更新、AlertNotification告警通知），绑定回调处理函数
3. **启动连接**：调用start方法建立WebSocket长连接，连接失败时触发重连逻辑
4. **数据响应处理**：收到推送数据后，更新状态并触发图表刷新，实现界面实时更新

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

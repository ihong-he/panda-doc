---
outline: deep
---

::: tip 提示
本文档用来记录一些前端项目（Vue技术栈）相关的问题
:::

## 一、项目问题

### 1、Vue 项目首屏渲染慢

#### 问题分析
首屏渲染慢是Vue项目中常见的性能问题，主要原因包括：
- 打包体积过大
- 资源加载过多
- 组件渲染复杂度高
- 网络请求阻塞

#### 解决方案

**1. 路由懒加载**
```javascript
// router/index.js
const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]
```

**2. 组件按需加载**
```javascript
// 使用defineAsyncComponent
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

**3. 资源优化**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          utils: ['lodash', 'axios', 'dayjs']
        }
      }
    }
  }
}
```

**4. 骨架屏**
```vue
<template>
  <div v-if="loading" class="skeleton">
    <div class="skeleton-item"></div>
    <div class="skeleton-item"></div>
  </div>
  <div v-else>
    <!-- 实际内容 -->
  </div>
</template>
```

### 2、实现大文件上传

#### 实现思路
将大文件分割成多个小块，分别上传，最后合并

#### 代码实现

**1. 文件分片**
```javascript
function createFileChunk(file, chunkSize = 2 * 1024 * 1024) {
  const chunks = []
  let cur = 0
  // 循环切片，直到文件末尾
  while (cur < file.size) {
    // 使用slice方法切割文件，不改变原文件
    chunks.push(file.slice(cur, cur + chunkSize))
    // 移动指针到下一个切片位置
    cur += chunkSize
  }
  return chunks
}
// 说明：将大文件分割成固定大小的小块（默认2MB），便于并发上传
```

**2. 上传逻辑**
```javascript
async function uploadChunks(chunks, fileHash) {
  // 为每个分片创建上传请求
  const requests = chunks.map((chunk, index) => {
    const formData = new FormData()
    formData.append('chunk', chunk) // 文件分片数据
    formData.append('hash', fileHash) // 整个文件的唯一标识
    formData.append('chunkIndex', index) // 分片索引
    
    return axios.post('/api/upload', formData, {
      // 监听单个分片的上传进度
      onUploadProgress: (progressEvent) => {
        // 计算当前分片上传进度在整体中的占比
        const percent = Math.round(
          ((progressEvent.loaded / progressEvent.total) * 100) / chunks.length
        )
        updateProgress(index, percent)
      }
    })
  })
  
  // 并发上传所有分片
  await Promise.all(requests)
  
  // 所有分片上传完成后，通知服务器合并文件
  await axios.post('/api/merge', {
    fileHash, // 文件哈希值，用于找到对应的分片
    fileName: file.name, // 原始文件名
    chunkCount: chunks.length // 分片总数
  })
}
// 说明：并发上传所有分片，提高上传效率，最后通知后端合并
```

### 3、大文件断点续传

#### 实现原理
记录已上传的分片，重新上传时只上传未完成的分片

#### 代码实现

**1. 获取已上传分片**
```javascript
async function getUploadedChunks(fileHash) {
  const response = await axios.get(`/api/uploaded?hash=${fileHash}`)
  return response.data.uploadedChunks || []
}
```

**2. 断点续传逻辑**
```javascript
async function resumeUpload(file, uploadedChunks = []) {
  const fileHash = await calculateFileHash(file)
  const chunks = createFileChunk(file)
  
  // 过滤出未上传的分片
  const unUploadedChunks = chunks.filter((chunk, index) => 
    !uploadedChunks.includes(index)
  )
  
  await uploadChunks(unUploadedChunks, fileHash)
}
```

**3. 计算文件哈希**
```javascript
async function calculateFileHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      // 使用SparkMD5库计算文件的MD5哈希值
      const spark = new SparkMD5.ArrayBuffer()
      spark.append(e.target.result) // 添加文件内容
      resolve(spark.end()) // 获取最终的哈希值
    }
    reader.readAsArrayBuffer(file) // 以ArrayBuffer格式读取文件
  })
}
// 说明：计算文件唯一标识，用于断点续传时判断是否是同一个文件
```

### 4、统一封装网络请求

#### 封装思路
基于axios封装统一的HTTP客户端，包含请求/响应拦截、错误处理、取消请求等

#### 代码实现

**1. 基础封装**
```javascript
// utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器 - 在发送请求前统一处理
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果用户已登录，在请求头中添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    // 请求配置错误处理
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理响应数据
service.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data
    
    if (code === 200) {
      // 请求成功，直接返回数据
      return data
    } else {
      // 业务错误，显示错误信息
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // HTTP错误处理
    if (error.response?.status === 401) {
      // 401未授权，清除token并跳转登录页
      const userStore = useUserStore()
      userStore.logout()
      window.location.href = '/login'
    }
    
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default service
```

**2. API模块化**
```javascript
// api/user.js
import request from '@/utils/request'

export const userApi = {
  login(data) {
    return request.post('/auth/login', data)
  },
  
  getUserInfo() {
    return request.get('/user/info')
  },
  
  updateProfile(data) {
    return request.put('/user/profile', data)
  }
}
```

### 5、菜单权限设计，精确到按钮级别

#### 设计思路
基于RBAC模型，通过后端返回权限数据，前端动态控制路由和按钮显示

#### 实现方案

**1. 权限数据结构**
```javascript
// 后端返回的权限数据
const permissions = [
  {
    id: 1,
    name: '用户管理',
    path: '/user',
    children: [
      {
        id: 11,
        name: '用户列表',
        path: '/user/list',
        buttons: ['add', 'edit', 'delete']
      }
    ]
  }
]
```

**2. 路由权限控制**
```javascript
// router/permission.js
import { useUserStore } from '@/stores/user'

export function setupPermission(router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    
    if (!userStore.token && to.path !== '/login') {
      next('/login')
      return
    }
    
    if (to.meta.requiresAuth && !userStore.hasPermission(to.meta.permission)) {
      next('/403')
      return
    }
    
    next()
  })
}
```

**3. 按钮权限指令**
```javascript
// directives/permission.js
import { useUserStore } from '@/stores/user'

export const permission = {
  // 指令绑定到元素时执行
  mounted(el, binding) {
    const userStore = useUserStore()
    const { value } = binding // 获取指令绑定的权限值
    
    // 检查用户是否有该按钮的权限
    if (!userStore.hasButtonPermission(value)) {
      // 没有权限则移除该元素
      el.parentNode?.removeChild(el)
    }
  }
}

// 使用 - 在模板中使用v-permission指令
<el-button v-permission="'user:add'">新增用户</el-button>
// 说明：通过自定义指令实现按钮级权限控制，无权限按钮直接从DOM中移除
```

### 6、处理百万条数据渲染

#### 解决方案
使用虚拟滚动技术，只渲染可视区域的数据

#### 代码实现

**1. 虚拟滚动组件**
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll" ref="container">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div v-for="item in visibleData" :key="item.id" class="list-item">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'

export default {
  props: {
    items: Array,
    itemHeight: {
      type: Number,
      default: 50
    },
    visibleCount: {
      type: Number,
      default: 20
    }
  },
  
  setup(props) {
    const container = ref(null) // 容器引用
    const startIndex = ref(0) // 当前渲染起始索引
    
    // 计算总高度（用于撑开滚动区域）
    const totalHeight = computed(() => props.items.length * props.itemHeight)
    // 计算结束索引，不超过数据总数
    const endIndex = computed(() => Math.min(startIndex.value + props.visibleCount, props.items.length))
    // 计算当前可见的数据
    const visibleData = computed(() => props.items.slice(startIndex.value, endIndex.value))
    // 计算偏移量（用于定位可见区域）
    const offset = computed(() => startIndex.value * props.itemHeight)
    
    // 处理滚动事件
    const handleScroll = () => {
      const scrollTop = container.value.scrollTop
      // 根据滚动位置计算起始索引
      startIndex.value = Math.floor(scrollTop / props.itemHeight)
    }
    
    return {
      container,
      totalHeight,
      visibleData,
      offset,
      handleScroll
    }
  }
  // 说明：虚拟滚动核心逻辑，只渲染可视区域内的数据，极大提升性能
}
</script>
```

**2. Web Worker处理数据**
```javascript
// worker.js - 独立线程处理大数据
self.onmessage = function(e) {
  const { data } = e
  const processedData = data.map(item => {
    // 在Worker线程中进行复杂的数据处理，不阻塞主线程
    return {
      ...item,
      processed: true
    }
  })
  // 处理完成后将数据发送回主线程
  self.postMessage(processedData)
}

// 在主线程中使用Worker
const worker = new Worker('./worker.js')
worker.postMessage(largeData) // 发送大数据到Worker处理
worker.onmessage = (e) => {
  this.items = e.data // 接收处理后的数据
}
// 说明：使用Web Worker在后台线程处理大数据，避免阻塞UI渲染
```

### 7、限制一个账号只能在一处登录

#### 实现方案
使用JWT + Redis存储token，每次登录验证token有效性

#### 后端实现思路

**1. Redis存储token**
```javascript
// 登录时
async function login(username, password) {
  const user = await User.findOne({ username })
  const token = jwt.sign({ userId: user._id }, secret)
  
  // 将token存储到Redis，键格式为token:用户ID，过期时间24小时
  await redis.setex(`token:${user._id}`, 24 * 60 * 60, token)
  
  return token
}

// 验证token中间件
async function verifyToken(req, res, next) {
  const token = req.headers.authorization
  const decoded = jwt.verify(token, secret) // 解析JWT获取用户ID
  
  // 从Redis中获取存储的token
  const storedToken = await redis.get(`token:${decoded.userId}`)
  
  // 如果Redis中没有token或者token不匹配，说明账号在其他地方登录
  if (!storedToken || storedToken !== token) {
    return res.status(401).json({ message: '账号在其他地方登录' })
  }
  
  next() // 验证通过，继续执行
}
// 说明：通过Redis存储最新token，确保同一账号只能在一个地方有效登录
```

**2. 前端监听**
```javascript
// 定期检查token状态
setInterval(async () => {
  try {
    await axios.get('/api/verify')
  } catch (error) {
    if (error.response?.status === 401) {
      ElMessage.warning('账号在其他地方登录')
      logout()
    }
  }
}, 30000)
```

### 8、实现检测功能更新

#### 实现方案
轮询版本号或WebSocket实时推送更新

#### 代码实现

**1. 版本检测**
```javascript
// utils/version-check.js
const VERSION_KEY = 'app_version'

export async function checkVersion() {
  try {
    const response = await fetch('/version.json')
    const { version } = await response.json()
    const currentVersion = localStorage.getItem(VERSION_KEY)
    
    if (currentVersion && currentVersion !== version) {
      // 有新版本
      showUpdateNotification(version)
    }
    
    localStorage.setItem(VERSION_KEY, version)
  } catch (error) {
    console.error('版本检测失败', error)
  }
}

function showUpdateNotification(version) {
  ElNotification({
    title: '发现新版本',
    message: `当前版本有更新，点击刷新页面`,
    duration: 0,
    onClick: () => {
      window.location.reload()
    }
  })
}
```

**2. WebSocket实时更新**
```javascript
// utils/websocket.js
export class WebSocketManager {
  constructor(url) {
    this.url = url
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }
  
  connect() {
    this.ws = new WebSocket(this.url)
    
    this.ws.onopen = () => {
      console.log('WebSocket连接成功')
      this.reconnectAttempts = 0
    }
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'UPDATE_AVAILABLE') {
        this.handleUpdate(data.payload)
      }
    }
    
    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++
          this.connect()
        }, 3000)
      }
    }
  }
  
  handleUpdate(payload) {
    showUpdateNotification(payload.version)
  }
}
```

### 9、echarts实现地图下钻

#### 实现思路
监听地图点击事件，根据点击区域加载下级地图数据

#### 代码实现

**1. 地图组件**
```vue
<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

export default {
  setup() {
    const chartRef = ref(null)
    const chartInstance = ref(null)
    const currentLevel = ref('china')
    const currentName = ref('中国')
    
    const geoData = {
      china: 'china.json',
      province: 'province',
      city: 'city'
    }
    
    const initChart = async () => {
      chartInstance.value = echarts.init(chartRef.value)
      
      await loadMapData(currentLevel.value)
      
      const option = getChartOption(currentLevel.value)
      chartInstance.value.setOption(option)
      
      chartInstance.value.on('click', handleMapClick)
    }
    
    const loadMapData = async (level) => {
      const mapJson = await fetch(`/maps/${geoData[level]}`).then(res => res.json())
      echarts.registerMap(currentName.value, mapJson)
    }
    
    const handleMapClick = async (params) => {
      if (currentLevel.value === 'china') {
        // 省份点击 - 从中国地图下钻到省级
        currentLevel.value = 'province'
        currentName.value = params.name // 获取点击的省份名称
        await loadMapData('province') // 加载省份地图数据
      } else if (currentLevel.value === 'province') {
        // 市级点击 - 从省级地图下钻到市级
        currentLevel.value = 'city'
        currentName.value = params.name // 获取点击的城市名称
        await loadMapData('city') // 加载城市地图数据
      }
      
      updateChart() // 更新图表显示
    }
    
    const getChartOption = (level) => {
      return {
        title: {
          text: currentName.value
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        visualMap: {
          min: 0,
          max: 1000,
          text: ['高', '低'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#e0f3f8', '#006837']
          }
        },
        series: [
          {
            name: '数据',
            type: 'map',
            map: currentName.value,
            roam: true,
            label: {
              show: true
            },
            data: generateRandomData()
          }
        ]
      }
    }
    
    const updateChart = () => {
      const option = getChartOption(currentLevel.value)
      chartInstance.value.setOption(option)
    }
    
    const generateRandomData = () => {
      // 生成随机数据
      return []
    }
    
    onMounted(() => {
      initChart()
    })
    
    return {
      chartRef
    }
  }
}
</script>
```

**2. 面包屑导航**
```vue
<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item 
        v-for="(item, index) in breadcrumbList" 
        :key="index"
        @click="handleBreadcrumbClick(item, index)"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup(props, { emit }) {
    const breadcrumbList = ref([
      { name: '中国', level: 'china' }
    ])
    
    const handleBreadcrumbClick = (item, index) => {
      // 如果点击的是当前最后一级，不处理
      if (index === breadcrumbList.value.length - 1) return
      
      // 截取到点击的层级，后面的层级会被移除
      breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
      // 通知父组件切换地图层级
      emit('level-change', item.level, item.name)
    }
    
    const addBreadcrumb = (name, level) => {
      // 添加新的面包屑项
      breadcrumbList.value.push({ name, level })
    }
    
    return {
      breadcrumbList,
      handleBreadcrumbClick,
      addBreadcrumb
    }
  }
}
</script>
```

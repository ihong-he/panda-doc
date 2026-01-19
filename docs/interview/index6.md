---
outline: deep
---

# 🚀 React & Electron 面试核心指南

::: tip 📚 面试小贴士
本文档涵盖React和Electron的核心知识点，帮你快速掌握企业面试重点！重点理解概念原理，结合代码实例加深记忆。
:::

## 📑 目录表
[[toc]]

## ⚛️ 一、React

### 1、JSX是什么？

::: info 💡 核心概念
JSX是JavaScript XML的缩写，是React提供的一种语法扩展，允许在JavaScript代码中编写类似HTML的标记。
:::

**核心特性：**
- 语法糖：最终会被编译为`React.createElement()`调用
- 类型安全：编译时检查标签是否正确闭合
- 表达能力强：可以在{}中嵌入任意JavaScript表达式

**示例：**
```jsx
const element = <h1>Hello, {name}!</h1>;
```

::: warning ⚠️ 注意事项
- 必须返回单个根元素
- 所有标签必须闭合
- 使用className代替class
- 事件处理使用驼峰命名法
:::

### 2、React和Vue的区别？

::: danger 🔥 高频考点
这是前端面试必考题，需要从多个维度进行全面对比！
:::

**🏗️ 设计理念：**
- **React**：函数式编程思想，一切皆组件，更灵活自由
- **Vue**：渐进式框架，提供更多约定和最佳实践，更易上手

**✍️ 语法差异：**
- **React**：使用JSX语法，JavaScript中写HTML
- **Vue**：使用模板语法，HTML中写JavaScript（指令如v-if、v-for）

**🔄 状态管理：**
- **React**：useState、useReducer hooks，需要额外库（Redux等）管理复杂状态
- **Vue**：响应式数据绑定，computed、watch，内置Vuex/Pinia状态管理

::: code-group

```jsx [React函数组件]
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

```vue [Vue单文件组件]
<template>
  <button @click="handleClick">{{ text }}</button>
</template>

<script>
export default {
  props: ['text'],
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>
```

:::

**📈 学习曲线：**
- **React**：需要掌握JSX、hooks、状态管理库等概念
- **Vue**：模板语法更接近HTML，文档完善，学习曲线更平缓

**🌍 生态系统：**
- **React**：Facebook维护，生态庞大，第三方库丰富
- **Vue**：尤雨溪创建，官方生态完整（Vue Router、Vuex等）

**⚡ 性能：**
- 两者性能相近，都采用虚拟DOM
- Vue在模板编译时优化更多，React依赖开发者优化

**🎯 适用场景：**
- **React**：大型复杂应用、需要高度定制化的项目
- **Vue**：中小型项目、快速开发、团队技术水平参差不齐

::: tip 💬 面试要点
重点对比设计理念、语法差异、状态管理和学习曲线，能体现你对两大框架的深入理解！
:::
### 3、什么是虚拟DOM？它有什么优势？

::: info 🧠 核心原理
虚拟DOM是React在内存中维护的一个轻量级的JavaScript对象，它是对真实DOM的抽象表示。
:::

**🔄 工作流程：**
1. 状态变化时，React创建新的虚拟DOM树
2. 比较新旧虚拟DOM树（Diff算法）
3. 计算出最小化的DOM操作
4. 批量更新真实DOM

**✨ 优势：**
- 性能优化：减少直接操作DOM的次数
- 跨平台：可以渲染到不同平台（Web、Native等）
- 开发体验：无需手动操作DOM，专注于数据状态

> 💡 **一句话总结**：虚拟DOM就像内存中的"草稿纸"，先在草稿上改好了，再一次性更新到真实DOM上，避免频繁操作DOM的性能问题。

### 4、React组件有哪些类型？

::: tip 📦 组件类型
React主要分为函数组件和类组件两种，现在推荐使用函数组件 + Hooks。
:::

**✅ 函数组件（推荐）：**
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**📚 类组件（了解即可）：**
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

---

### 5、什么是React Hooks？常用的Hooks有哪些？

::: warning 🎣 核心特性
Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性，让函数组件拥有类组件的能力！
:::

**🔥 常用Hooks：**
- `useState`：管理组件状态
- `useEffect`：处理副作用（生命周期）
- `useContext`：访问Context
- `useReducer`：复杂状态管理
- `useMemo`：缓存计算结果
- `useCallback`：缓存函数

---

### 6、useState和useEffect的作用是什么？

**📊 useState（状态管理）：**
```jsx
const [count, setCount] = useState(0);
// count: 当前状态值
// setCount: 更新状态的函数
```

**⚡ useEffect（副作用处理）：**
```jsx
useEffect(() => {
  // 副作用逻辑
  document.title = `Count: ${count}`;
  
  return () => {
    // 清理函数（可选）
  };
}, [count]); // 依赖数组
```

::: tip 💬 记忆技巧
- **useState**：组件的"记忆"，用来记住数据
- **useEffect**：组件的"行动"，用来做副作用操作
:::

### 7、React中的key属性有什么作用？

::: warning 🔑 重要概念
key属性帮助React识别哪些元素发生了变化，在列表渲染中尤为重要，直接影响性能！
:::

**🎯 key的作用：**
- 提高Diff算法效率
- 避免不必要的重新渲染
- 保持组件状态

**✅ 正确用法：**
```jsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

::: danger ⚠️ 常见错误
- 不要使用数组索引作为key（可能导致性能问题）
- 不要使用随机数作为key（会导致不必要的重新渲染）
- key应该在兄弟元素中保持唯一
:::

---

### 8、什么是受控组件和非受控组件？

**🎮 受控组件**：表单数据由React组件管理
```jsx
<input value={value} onChange={handleChange} />
```

**🔓 非受控组件**：表单数据由DOM自身管理
```jsx
<input ref={inputRef} defaultValue="初始值" />
```

> 💡 **选择建议**：推荐使用受控组件，因为状态完全由React控制，更容易调试和维护。

---

### 9、React组件通信方式有哪些？

::: danger 📚 核心考点
组件通信是React开发的必备技能，必须掌握多种通信方案！
:::

**📡 1. 父子通信（props + 回调）：**

最基础的通信方式，父组件通过props向下传递数据，子组件通过回调函数向上传递数据。

```jsx
// 父组件
function Parent() {
  const [message, setMessage] = useState('');
  return <Child message={message} setMessage={setMessage} />;
}

// 子组件
function Child({ message, setMessage }) {
  return (
    <input 
      value={message} 
      onChange={(e) => setMessage(e.target.value)} 
    />
  );
}
```

**🌉 2. 跨层级通信（Context）：**

解决props drilling（属性钻取）问题，适合全局状态管理（主题、语言等）。

```jsx
// 创建Context
const ThemeContext = createContext();

// 提供者
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 消费者
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme('dark')}>{theme}</button>;
}
```

::: tip 💬 通信选择
- **父子通信**：props + 回调
- **跨层级通信**：Context API
- **复杂状态管理**：Redux、Zustand等状态管理库
:::

### 10、什么是Redux？它的工作原理是什么？

::: info 📦 状态管理
Redux是JavaScript应用程序的状态管理容器，提供可预测的状态管理，适合大型复杂应用。
:::

**🏗️ 核心概念：**
- **Store（仓库）**：存储应用状态的唯一对象
- **Action（动作）**：描述状态变化的普通对象
- **Reducer（归约器）**：纯函数，根据action返回新状态
- **Dispatch（分发）**：发送action到store的方法

**🔄 工作流程：**
1. 用户操作触发Action
2. Store接收Action，通过Dispatch分发
3. Reducer处理Action，返回新状态
4. Store更新状态，组件重新渲染

**📝 传统Redux示例：**
```javascript
// 定义Action类型
const ADD_TODO = 'ADD_TODO';

// 创建Action
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: text
});

// 创建Reducer
const todoReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, { id: Date.now(), text: action.payload }];
    default:
      return state;
  }
};

// 创建Store
import { createStore } from 'redux';
const store = createStore(todoReducer);

// 分发Action
store.dispatch(addTodo('学习Redux'));
```

::: tip 🚀 Redux Toolkit（推荐）
现在推荐使用Redux Toolkit，代码更简洁，功能更强大！
:::

**⚡ Redux Toolkit（现代用法）：**
```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload });
    }
  }
});

const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
});

// React组件中使用
import { useSelector, useDispatch } from 'react-redux';

function TodoList() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  
  return (
    <button onClick={() => dispatch(todoSlice.actions.addTodo('新任务'))}>
      添加任务
    </button>
  );
}
```

**✨ 优势：**
- 状态集中管理，便于调试
- 状态变化可预测、可追踪
- 支持时间旅行调试
- 适用于大型复杂应用


## ⚡ 二、Electron

### 1、什么是Electron？它的核心架构是什么？

::: info 💡 核心概念
Electron是一个使用JavaScript、HTML和CSS构建跨平台桌面应用程序的开源框架，它允许前端开发者使用Web技术开发桌面应用。
:::

**🏗️ 核心架构（多进程模型）：**

Electron采用了多进程架构，主要由两个核心进程组成：

| 进程类型 | 作用 | 特点 |
|---------|------|------|
| **主进程** | 管理应用生命周期、创建渲染进程、处理系统级API | 每个应用只有一个主进程，可以使用Node.js所有API |
| **渲染进程** | 负责渲染Web页面，运行前端代码 | 每个窗口对应一个渲染进程，运行在沙箱环境中 |

**🔄 进程间通信（IPC）：**
- **主进程 → 渲染进程**：通过`webContents.send()`发送消息
- **渲染进程 → 主进程**：通过`ipcRenderer.send()`发送消息
- **双向通信**：使用`ipcMain`和`ipcRenderer`

::: tip 💬 理解要点
可以把Electron想象成"浏览器壳"包装了你的Web应用，主进程是操作系统和Web应用之间的桥梁！
:::

---

### 2、Electron和Vue/Vite如何集成？

::: danger 🔥 高频考点
这是Vue技术栈开发者必问的问题，需要掌握完整的集成流程！
:::

**🚀 手动集成Vite + Electron：**

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // Electron需要相对路径
  build: {
    outDir: 'dist'
  }
})
```

```javascript
// electron/main.js（主进程入口）
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程使用Node.js
      contextIsolation: false // 关闭上下文隔离
    }
  })

  // 开发环境加载Vite开发服务器，生产环境加载打包后的文件
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)
```

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "electron .",
    "electron:build": "electron-builder"
  }
}
```

::: tip 💬 面试要点
关键点：`nodeIntegration: true`允许在Vue组件中使用Node.js API，`contextIsolation: false`关闭隔离以便直接使用Electron API。
:::

---

### 3、主进程和渲染进程如何通信？（IPC）

::: warning 📡 核心考点
进程间通信是Electron最重要的话题，必须掌握双向通信的各种场景！
:::

**🎯 渲染进程 → 主进程（单向通信）：**

```javascript
// electron/preload.js（预加载脚本）
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  sendNotification: (title, body) => ipcRenderer.send('show-notification', title, body)
})

// electron/main.js（主进程）
const { ipcMain } = require('electron')

ipcMain.handle('read-file', async (event, filePath) => {
  const fs = require('fs').promises
  return await fs.readFile(filePath, 'utf-8')
})

ipcMain.on('show-notification', (event, title, body) => {
  const { Notification } = require('electron')
  new Notification({ title, body }).show()
})

// Vue组件中使用
// const handleReadFile = async () => {
//   const content = await window.electronAPI.readFile('./data.txt')
//   console.log(content)
// }
```

**🔄 主进程 → 渲染进程（单向通信）：**

```javascript
// electron/main.js（主进程）
// 发送消息到特定窗口
win.webContents.send('update-data', { count: 100 })

// electron/preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateData: (callback) => ipcRenderer.on('update-data', callback)
})

// Vue组件中监听
import { onMounted } from 'vue'

onMounted(() => {
  window.electronAPI.onUpdateData((event, data) => {
    console.log('收到更新:', data.count)
  })
})
```

**💡 双向通信（invoke/handle模式）：**

```javascript
// 主进程
ipcMain.handle('get-system-info', async () => {
  return {
    platform: process.platform,
    version: process.version,
    arch: process.arch
  }
})

// 渲染进程
const systemInfo = await window.electronAPI.getSystemInfo()
```

---

### 4、Electron中的安全注意事项有哪些？

::: danger ⚠️ 安全重点
Electron安全是面试高频考点，必须了解常见的安全风险和防护措施！
:::

**🛡️ 关键安全配置：**

| 配置项 | 作用 | 推荐值 |
|-------|------|--------|
| `nodeIntegration` | 是否允许在渲染进程使用Node.js API | `false` |
| `contextIsolation` | 是否启用上下文隔离 | `true` |
| `enableRemoteModule` | 是否启用remote模块 | `false` |
| `sandbox` | 是否启用沙箱模式 | `true` |

**✅ 安全最佳实践：**

```javascript
// electron/main.js
function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,        // 禁用Node集成
      contextIsolation: true,         // 启用上下文隔离
      sandbox: true,                  // 启用沙箱
      preload: path.join(__dirname, 'preload.js') // 使用预加载脚本
    }
  })
}

// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron')

// 通过contextBridge安全暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (path) => ipcRenderer.invoke('read-file', path)
})

// Vue组件中只能访问暴露的API
const content = await window.electronAPI.readFile('./file.txt')
```

**⚠️ 常见安全风险：**
1. **XSS攻击**：不要直接渲染用户提供的内容
2. **原型污染**：谨慎使用JSON.parse
3. **远程代码执行**：不要`eval`用户输入

::: tip 💬 面试要点
重点记住：`contextIsolation: true` + `preload.js` + `contextBridge`是安全通信的黄金组合！
:::

---

### 5、Electron应用如何打包和发布？

::: info 📦 发布流程
使用electron-builder可以将Electron应用打包成安装包，支持Windows、macOS、Linux多平台。
:::

**🚀 配置electron-builder：**

```json
// package.json
{
  "name": "my-electron-app",
  "version": "1.0.0",
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "dist": "npm run build && electron-builder",
    "dist:win": "npm run build && electron-builder --win",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:linux": "npm run build && electron-builder --linux"
  },
  "build": {
    "appId": "com.example.myapp",
    "productName": "我的应用",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "package.json"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": "AppImage",
      "icon": "build/icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

**📋 打包命令：**

```bash
# 打包所有平台
npm run dist

# 仅打包Windows
npm run dist:win

# 仅打包macOS
npm run dist:mac

# 仅打包Linux
npm run dist:linux
```

::: tip 💬 面试要点
关键配置：`files`指定要打包的文件，`target`指定打包格式（Windows用nsis，macOS用dmg，Linux用AppImage）。
:::

---

### 6、Electron常见问题及解决方案？

::: danger 🐛 面试高频
了解Electron常见问题及解决方案，体现实际项目经验！
:::

**❓ 常见问题清单：**

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| **应用白屏** | 资源加载失败 | 检查文件路径、确认devtools报错 |
| **热更新失效** | Vite配置问题 | 检查`base: './'`配置 |
| **Node.js API不可用** | nodeIntegration: false | 使用preload + contextBridge |
| **内存泄漏** | 事件监听未清理 | 组件销毁时移除监听器 |
| **窗口闪烁** | 窗口初始化问题 | 使用`show: false`，加载完成后再显示 |
| **打包体积过大** | 未开启Tree Shaking | 配置生产构建、排除依赖 |

**✅ 解决方案示例：**

```javascript
// 问题1：窗口闪烁解决方案
const win = new BrowserWindow({
  show: false, // 先不显示窗口
  width: 1200,
  height: 800
})

// 等页面加载完成再显示
win.once('ready-to-show', () => {
  win.show()
})

// 问题2：内存泄漏解决方案
import { onUnmounted } from 'vue'

const cleanup = () => {
  window.electronAPI.removeListener('update-data', handleUpdate)
}

onUnmounted(cleanup)

// 问题3：热更新失效解决方案
// vite.config.js
export default defineConfig({
  base: './', // 重要：使用相对路径
  server: {
    port: 5173,
    strictPort: true
  }
})
```

::: tip 💬 面试技巧
回答问题时，结合具体项目场景描述问题及其解决过程，更能体现实战经验！
:::
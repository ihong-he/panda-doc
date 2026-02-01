---
outline: deep
---

# 🚀 React & Electron & 鸿蒙

::: tip 📚 面试小贴士
本文档涵盖React、Electron和鸿蒙的核心知识点，帮你快速掌握企业面试重点！重点理解概念原理，结合代码实例加深记忆。
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

- **React**：Hooks（useState/useReducer），复杂状态需第三方库（Redux/Zustand）
- **Vue**：响应式数据（data/ref）+ computed/watch，官方提供Vuex/Pinia

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

函数组件是纯 JavaScript 函数，接收 props 作为参数并返回 JSX 元素。配合 Hooks 使用，可管理状态和副作用。

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 使用 Hooks 的函数组件
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = count;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**📚 类组件（了解即可）：**

类组件是通过 ES6 class 定义的组件，继承自 `React.Component`，必须实现 `render()` 方法。

**使用场景：**
- 老项目维护（React 16.8 之前的代码）
- 需要使用 Error Boundaries（错误边界）
- 某些特殊场景需要生命周期方法

```jsx
class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**🔄 两者对比：**

| 特性 | 函数组件 | 类组件 |
|------|---------|--------|
| 语法 | 简洁，无 this | 冗长，需处理 this |
| Hooks 支持 | ✅ 完整支持 | ❌ 不支持 |
| 性能 | 更优（避免类实例化开销） | 相对较低 |
| 学习曲线 | 平缓 | 陡峭（需理解面向对象） |
| 推荐度 | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

### 5、什么是React Hooks？常用的Hooks有哪些？

::: warning 🎣 核心特性
Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性，让函数组件拥有类组件的能力！
:::

**🔥 常用Hooks：**

- **`useState`**：用于组件的内部状态管理
  - 返回状态值和更新函数的数组
  - 状态更新会触发组件重新渲染
```jsx
const [count, setCount] = useState(0);
setCount(prev => prev + 1);  // 函数式更新（推荐）
```

- **`useEffect`**：处理副作用操作（数据请求、订阅、DOM操作等）
  - 通过依赖数组控制执行时机
  - 返回清理函数用于取消订阅等
```jsx
useEffect(() => {
  fetchData();
  return () => cleanup();
}, [count]);  // count 变化时执行
```

- **`useContext`**：在不层层传递 props 的情况下访问 Context 值
  - 接收 Context 对象作为参数
  - 用于跨组件共享数据，如：主题、语言、个人信息、全局配置等

```jsx
const ThemeContext = React.createContext('light');
const theme = useContext(ThemeContext);
```

- **`useReducer`**：适用于复杂状态逻辑的场景
  - 类似 Redux 的状态管理模式
  - 通过 dispatch 派发 action 来更新状态
  - 适合多状态值关联更新的情况
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment' });
```

- **`useMemo`**：缓存计算结果，避免每次渲染都重新计算
  - 只有依赖项变化时才重新计算
  - 用于优化昂贵的计算操作
```jsx
const result = useMemo(() => a * b, [a, b]);
```

### 6、React中的key属性有什么作用？

::: warning ⚠️ 性能关键
key的作用直接影响React的diff算法性能，必须理解！
:::

💬 **一句话总结**：

**key的主要作用是帮助React（在虚拟DOM diff时）准确识别元素，提高渲染性能。**

如果不加`key`，React默认用数组下标作为标识，当数组元素位置变化时，可能会复用错误的DOM元素，导致状态错乱。

使用`key`时，建议用数据的唯一标识符（如id），不要用下标或随机数。

::: tip 💬 面试回答技巧
1. key帮助React识别元素身份
2. 避免不必要的DOM创建和销毁
3. 提高diff算法性能
:::


### 7、什么是受控组件和非受控组件？

**🎮 受控组件**：表单数据由React组件管理

```jsx
function ControlledForm() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

**🔓 非受控组件**：表单数据由DOM自身管理

```jsx
function UncontrolledForm() {
  const inputRef = useRef(null);

  const getValue = () => {
    console.log(inputRef.current.value);
  };

  return (
    <>
      <input ref={inputRef} defaultValue="初始值" />
      <button onClick={getValue}>获取值</button>
    </>
  );
}
```

> 💡 **选择建议**：推荐使用受控组件，因为状态完全由React控制，更容易调试和维护。

### 8、React组件通信方式有哪些？

::: danger 📚 核心考点
组件通信是React开发的必备技能，必须掌握多种通信方案！
:::

**📡 1. 父子通信（props + 回调）：**

> 最基础的通信方式，父组件通过props向下传递数据，子组件通过回调函数向上传递数据。

**🔽 父传子（单向数据流）：**
1. **父组件**：在子组件标签上绑定属性传递数据
2. **子组件**：通过函数参数 `props` 接收数据

**🔼 子传父（回调函数）：**
1. **父组件**：定义事件处理函数，并通过props传递给子组件
2. **子组件**：调用回调函数，将数据作为参数传递

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

**实现步骤：**
1. **创建Context** - 使用 `createContext()` 创建上下文对象
2. **提供数据** - 通过 `<Context.Provider>` 包裹根组件，通过 `value` 属性传递数据
3. **消费数据** - 在任意后代组件中使用 `useContext(Context)` 获取数据

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

### 9、什么是Redux？它的工作原理是什么？

::: info 📦 状态管理
Redux是JavaScript应用程序的状态管理容器，提供可预测的状态管理，适合大型复杂应用。
:::

**💡 核心概念：**

Redux 是一个单向数据流的状态管理库，三大核心原则：
- **单一数据源**：整个应用只有一个 Store
- **状态只读**：不能直接修改 state，必须通过 action
- **纯函数修改**：使用纯函数 reducer 返回新 state

**🔄 工作原理（数据流）：**

```
UI组件 → dispatch(action) → Reducer → 更新State → 通知订阅者 → UI重新渲染
```

**核心概念：**

| 概念 | 作用 |
|------|------|
| **State** | 存储应用的状态数据（只读） |
| **Action** | 描述发生什么事情的对象（如 `{ type: 'ADD_TODO', payload: 'xxx' }`） |
| **Reducer** | 纯函数，根据 action 返回新 state |
| **Store** | 保存 state、提供方法（dispatch、subscribe、getState） |

**⚡ 快速理解：**

> Redux = 1个Store + 纯函数Reducer + 单向数据流
>
> **口诀**：改状态必须发action，reducer接收算出新state，store统一管理，组件订阅更新

**🎯 优点：**
- 状态可预测、易调试（Redux DevTools）
- 适合多组件共享状态
- 便于测试

**⚠️ 缺点：**
- 代码冗余（样板代码多）
- 简单应用可能过度设计

**💡 替代方案：** Zustand、Jotai、Recoil、Context API




### 10、Next.js技术是什么

::: info 💡 核心概念
Next.js 是基于 React 的服务端渲染（SSR）框架，提供开箱即用的功能，帮助开发者快速构建高性能的 Web 应用。
:::

**🏗️ Next.js 的核心特性：**

- **服务端渲染（SSR）**：页面在服务器端渲染成 HTML，发送给客户端，提升首屏加载速度和 SEO
- **静态站点生成（SSG）**：在构建时生成静态 HTML，适合内容不频繁变化的页面
- **API 路由**：可以在 Next.js 中直接编写后端 API 接口，无需额外的后端服务器
- **文件系统路由**：基于 `pages` 或 `app` 目录的文件结构自动生成路由
- **自动代码分割**：每个页面自动分割，只加载当前页面需要的代码
- **图片优化**：内置 Image 组件，自动优化图片格式和尺寸

**📋 渲染模式对比：**

| 模式 | 渲染时机 | 适用场景 | SEO 效果 |
|------|---------|---------|---------|
| **SSR** | 每次请求时渲染 | 动态内容、个性化页面 | ⭐⭐⭐⭐⭐ |
| **SSG** | 构建时渲染 | 博客、文档、营销页面 | ⭐⭐⭐⭐⭐ |
| **ISR** | 定时重新生成 | 新闻、电商列表 | ⭐⭐⭐⭐ |
| **CSR** | 客户端渲染 | 管理后台、交互密集页面 | ⭐⭐ |

> 💡 **面试总结**：Next.js = React + SSR/SSG + 路由 + API 路由，提供了生产环境所需的一切，特别适合需要 SEO 和高性能的应用。

---

### 11、SSR/SSG基本原理？

::: danger 🎯 高频考点
SSR 和 SSG 是前端性能优化的核心方案，必须理解它们的工作原理和区别！
:::

**🔄 SSR（服务端渲染）原理：**

SSR 是在服务器端将 React 组件渲染成完整的 HTML，然后发送给浏览器。

```
用户请求 → 服务器获取数据 → 服务器渲染HTML → 返回HTML → 浏览器显示 → React接管交互
```

**工作流程：**
1. 用户访问页面
2. 服务器接收请求，获取所需数据（数据库、API等）
3. 服务器在内存中执行 React 代码，生成完整的 HTML
4. 将 HTML 发送给浏览器，用户快速看到页面内容
5. 浏览器加载 JavaScript，React 激活（hydration），添加交互功能

**✅ SSR 优势：**
- 首屏加载快：直接返回完整 HTML，无需等待 JS 下载执行
- SEO 友好：搜索引擎爬虫可以直接抓取页面内容
- 更适合动态内容：每次请求都可以获取最新数据

**📦 SSG（静态站点生成）原理：**

SSG 是在构建阶段（build time）预先生成静态 HTML 文件。

```
构建时 → 获取数据 → 预渲染HTML → 生成静态文件 → 用户请求 → 直接返回HTML
```

**工作流程：**
1. 开发者在构建时指定数据来源
2. 构建过程中，Next.js 获取数据并渲染每个页面
3. 生成静态 HTML 文件（如 `about.html`）
4. 用户访问时，CDN 或服务器直接返回静态文件
5. React 激活后添加交互

**✅ SSG 优势：**
- 性能最佳：直接返回静态文件，无需服务器渲染
- 成本低：可用 CDN 托管，无需服务器
- 安全性高：无数据库查询，减少攻击面

**🔄 ISR（增量静态再生成）：**

结合 SSR 和 SSG 的优点，在用户请求时按需更新页面。

```javascript
// Next.js 示例
export async function getStaticProps() {
  const data = await fetchAPI();
  return {
    props: { data },
    revalidate: 60, // 60秒后重新生成
  };
}
```

::: tip 💬 面试回答要点
1. SSR：每次请求渲染，适合动态内容，SEO 好
2. SSG：构建时渲染，适合静态内容，性能最佳
3. ISR：定时更新，平衡两者优点
:::

---

### 12、数据请求管理方案(SWR/ReactQuery)？

::: info 📡 数据管理
SWR 和 React Query 是专门用于管理服务器状态的数据请求库，提供了缓存、自动重试、数据同步等功能。
:::

**🎯 为什么需要数据请求管理？**

传统使用 `useEffect` + `fetch` 的方式存在以下问题：
- 需要手动处理加载状态、错误状态
- 没有缓存机制，重复请求浪费资源
- 难以处理数据同步和更新
- 代码冗余，容易出错

**🔄 SWR（Stale-While-Revalidate）**

由 Vercel 团队开发，核心思想是"先返回缓存数据，后台再更新"。

```javascript
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);

  if (error) return <div>加载失败</div>;
  if (isLoading) return <div>加载中...</div>;
  
  return <div>你好，{data.name}</div>;
}
```

**⚡ React Query（TanStack Query）**

功能更强大的数据管理库，提供更完善的功能和更好的开发体验。

```javascript
import { useQuery, useMutation, queryClient } from '@tanstack/react-query';

// 查询数据
function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => fetch('/api/user').then(res => res.json()),
    staleTime: 5000, // 5秒内不重新请求
  });
}

// 修改数据
function useUpdateUser() {
  return useMutation({
    mutationFn: (data) => fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()),
    onSuccess: () => {
      // 成功后自动重新获取数据
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
}
```

**📋 核心功能对比：**

| 功能 | SWR | React Query |
|------|-----|-------------|
| 数据缓存 | ✅ | ✅ |
| 自动重新请求 | ✅ | ✅ |
| 离线支持 | ✅ | ✅ |
| 分页支持 | ✅ 基础 | ✅ 完整 |
| 突变操作 | ✅ | ✅ 更强大 |
| DevTools | ❌ | ✅ |
| 学习曲线 | 低 | 中等 |

**✨ 核心优势：**

- **智能缓存**：自动缓存请求结果，避免重复请求
- **自动重试**：请求失败自动重试，提升用户体验
- **后台更新**：用户看到缓存数据的同时，后台更新最新数据
- **乐观更新**：修改数据时先更新 UI，失败时回滚
- **数据同步**：多窗口/标签页数据自动同步

> 💡 **面试总结**：SWR/React Query 解决了数据请求的通用问题，让开发者专注于业务逻辑，而不是处理 loading、error、缓存等细节。推荐使用 React Query，功能更强大，生态更完善。




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

### 2、主进程和渲染进程如何通信？（IPC）

::: warning 📡 核心考点
进程间通信是Electron最重要的话题，必须掌握双向通信的各种场景！
:::

**📖 通信原理说明：**

由于渲染进程运行在沙箱环境中，无法直接访问Node.js API和Electron API，因此需要通过预加载脚本（preload.js）作为中间桥梁进行安全的进程间通信。整个通信流程分为三个关键步骤：

1. **预加载脚本层**：使用 `contextBridge` 将 Electron 的 `ipcRenderer` API 安全地暴露给渲染进程，确保渲染进程只能访问特定的 API
2. **主进程层**：使用 `ipcMain` 监听来自渲染进程的消息（`ipcMain.handle()` 用于异步请求，`ipcMain.on()` 用于单向消息）
3. **渲染进程层**：通过 `window.electronAPI` 调用预加载脚本暴露的方法，实现与主进程的通信

这种设计既保证了安全性（防止渲染进程直接访问系统资源），又提供了灵活的通信方式。

---

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
const handleReadFile = async () => {
  const content = await window.electronAPI.readFile('./data.txt')
  console.log(content)
}
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

### 3、Electron常见问题及解决方案？

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

## 三、鸿蒙APP开发

### 1、什么是ArkTS？它与TypeScript有什么区别？

::: info 💡 核心概念
ArkTS是华为为HarmonyOS（鸿蒙系统）推出的声明式编程语言，基于TypeScript扩展而来，专为构建高性能、跨设备的鸿蒙应用而设计。
:::

**🏗️ ArkTS的核心特性：**

| 特性 | 说明 |
|------|------|
| **声明式UI** | 使用ArkUI框架，通过@Component装饰器构建组件化界面 |
| **状态管理** | 提供@State、@Prop、@Link等装饰器实现响应式数据绑定 |
| **类型安全** | 继承TypeScript的静态类型检查，编译期发现错误 |
| **性能优化** | 编译为方舟字节码，运行性能优于JavaScript |
| **跨设备** | 支持手机、平板、车机、智能穿戴等多终端适配 |

**🔄 ArkTS vs TypeScript：**

```typescript
// TypeScript 传统写法
class User {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// ArkTS 声明式组件写法
@Component
struct UserCard {
  @State user: User = new User('张三', 20)
  
  build() {
    Column() {
      Text(this.user.name)
        .fontSize(20)
      Text(`${this.user.age}岁`)
        .fontColor('#666')
    }
  }
}
```

::: tip 💬 面试要点
ArkTS = TypeScript + ArkUI声明式语法 + 鸿蒙状态管理装饰器 + 方舟运行时优化
:::

---

### 2、鸿蒙应用中的状态管理装饰器有哪些？分别是什么作用？

::: warning 🎣 高频考点
状态管理是鸿蒙开发的核心概念，必须掌握各装饰器的作用和使用场景！
:::

**📚 核心装饰器对比：**

| 装饰器 | 作用 | 数据流向 | 使用场景 |
|--------|------|----------|----------|
| **@State** | 组件内部状态 | 内部管理 | 组件私有数据 |
| **@Prop** | 父子单向同步 | 父 → 子 | 父组件传递数据给子组件 |
| **@Link** | 父子双向同步 | 父 ↔ 子 | 父子组件共享状态 |
| **@Provide/@Consume** | 跨层级共享 | 祖先 ↔ 后代 | 深层嵌套组件通信 |
| **@Observed/@ObjectLink** | 嵌套对象观察 | 内部/传递 | 复杂对象类型状态管理 |
| **@Watch** | 状态监听 | - | 监听状态变化执行回调 |

**📝 代码示例：**

```typescript
// 父组件
@Component
struct Parent {
  @State message: string = 'Hello HarmonyOS'
  @State count: number = 0

  build() {
    Column() {
      // @Prop 单向传递
      ChildProp({ title: this.message })
      
      // @Link 双向绑定
      ChildLink({ count: $count })
      
      Text(`父组件count: ${this.count}`)
    }
  }
}

// @Prop 子组件（单向）
@Component
struct ChildProp {
  @Prop title: string  // 只能读取，修改不影响父组件
  
  build() {
    Text(this.title)
  }
}

// @Link 子组件（双向）
@Component
struct ChildLink {
  @Link count: number  // 双向绑定，修改同步到父组件
  
  build() {
    Button('增加')
      .onClick(() => {
        this.count++  // 会同步修改父组件的值
      })
  }
}
```

::: danger ⚠️ 注意事项
- @State装饰的变量必须是对象类型或简单类型，不支持复杂类型的嵌套观察
- @Prop是单向同步，子组件修改不会反馈到父组件
- @Link需要用$符号传递引用（如 `$count`）
:::

---
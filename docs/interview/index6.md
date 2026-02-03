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

**💡 替代方案：** Zustand（/ˈtsuːʃtant/）、Jotai、Context API

> [!NOTE] Redux和Zustand对比
>
> - **代码量**：Redux样板代码多（action、reducer、dispatch），Zustand极简，几行代码搞定
> - **学习曲线**：Redux陡峭，需理解多个概念；Zustand平缓，几乎零学习成本
> - **适用场景**：Redux适合大型复杂应用、团队协作；Zustand适合中小型项目、快速开发
>
> **一句话总结：** Redux功能强大但复杂，适合大项目；Zustand简单高效，适合快速开发。


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

**💡 核心作用：**
解决React中服务器状态管理问题，避免使用`useEffect` + `useState`手动管理请求逻辑。

**📦 常用方案对比：**

| 方案 | 特点 | 适用场景 |
|-----|------|---------|
| **SWR** | 轻量级、自动重获取、基于策略的数据同步 | 中小型项目、Next.js生态 |
| **React Query (TanStack Query)** | 功能强大、完善的缓存管理、乐观更新 | 大型项目、复杂状态管理 |

**✨ 核心优势：**
1. **自动缓存**：相同请求只发送一次，减少服务器压力
2. **自动重试**：请求失败自动重试，提升用户体验
3. **数据同步**：窗口焦点、网络恢复时自动刷新数据
4. **防抖节流**：避免重复请求
5. **状态管理**：loading、error、data状态统一管理

**📝 基本用法：**
```javascript
// React Query 示例
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  })

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>出错了: {error.message}</div>
  return <div>{data.map(user => <p key={user.id}>{user.name}</p>)}</div>
}
```

::: tip 💬 面试要点
"使用SWR/React Query可以减少约80%的数据请求代码，让开发者专注于业务逻辑而不是手动管理loading、缓存、重试等细节。"
:::


## ⚡ 二、Electron

### 1、Electron 是什么？它有哪些特点和优势？

**💻 什么是Electron？**

Electron 是 GitHub 开源的**跨平台桌面应用开发框架**，使用 JavaScript、HTML 和 CSS 构建原生桌面应用。它将 Chromium（渲染引擎）和 Node.js（运行时）整合在一起。

**🌟 核心架构：**

<div class="arch-diagram" style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="flex: 1; padding: 15px; border: 2px solid #3b82f6; border-radius: 8px; text-align: center;">
    <h4 style="margin: 0 0 10px 0; color: #3b82f6;">渲染进程（多实例）</h4>
    <ul style="text-align: left; margin: 0; padding-left: 20px;">
      <li>Chromium 引擎</li>
      <li>Web 渲染</li>
      <li>JavaScript 执行</li>
    </ul>
  </div>
  <div style="flex: 1; padding: 15px; border: 2px solid #10b981; border-radius: 8px; text-align: center;">
    <h4 style="margin: 0 0 10px 0; color: #10b981;">主进程（单实例）</h4>
    <ul style="text-align: left; margin: 0; padding-left: 20px;">
      <li>Node.js 运行时</li>
      <li>系统 API 访问</li>
      <li>窗口管理</li>
    </ul>
  </div>
</div>

**✨ 主要特点和优势：**

| 特性 | 说明 |
|------|------|
| **跨平台** | 一套代码，同时支持 Windows、macOS、Linux |
| **Web技术栈** | 前端开发者可直接上手，学习成本低 |
| **原生能力** | 通过 Node.js 访问文件系统、数据库、硬件等 |
| **生态丰富** | npm 全生态可用，大量现成组件 |
| **热更新** | 支持应用自动更新机制 |
| **开源免费** | 完全开源，无商业授权限制 |

**🎯 代表应用：**
- VS Code、Discord、Slack、Teams、Notion、Atom

### 2、Electron的进程模型是怎样的？

**🏗️ Electron进程模型：**

Electron 采用**多进程架构**，主要包含两种进程类型：

**主进程（Main Process）**
- 数量：1个（应用启动时创建）
- 职责：创建和管理窗口、处理应用生命周期、访问 Node.js API、管理系统资源、处理原生菜单/托盘
- 能力：完整的 Node.js API

**渲染进程（Renderer Process）**
- 数量：多个（每个 BrowserWindow 窗口一个）
- 职责：渲染 Web 页面内容、运行 JavaScript 业务逻辑、处理用户交互
- 能力：Chromium 沙箱环境，受限的 API 访问
- 特性：一个窗口崩溃不影响其他窗口

**📊 主进程 vs 渲染进程对比：**

| 维度 | 主进程 | 渲染进程 |
|------|--------|----------|
| **数量** | 单例（启动时创建） | 多个（每个窗口一个） |
| **能力** | 完整 Node.js API | 受限（需要 preload 桥接） |
| **职责** | 窗口管理、原生功能、IPC 通信 | UI 渲染、业务逻辑、交互 |
| **通信** | `ipcMain` 监听消息 | `ipcRenderer` 发送消息 |
| **环境** | Node.js 运行时 | Chromium 沙箱环境 |

**🔑 核心区别总结：**

1. **主进程是大脑**：负责全局控制、系统资源访问、窗口创建
2. **渲染进程是视图**：只负责展示界面和用户交互，隔离在沙箱中
3. **安全隔离**：渲染进程不能直接访问 Node.js，需通过 IPC 安全通信
4. **多实例优势**：一个窗口崩溃不影响其他窗口，稳定性更好

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

### 1、什么是HarmonyOS？鸿蒙APP开发流程？

**📱 什么是HarmonyOS？**

HarmonyOS（鸿蒙）是华为自主研发的**分布式操作系统**，基于微内核架构，支持"一次开发，多端部署"，可在手机、平板、车机、智能穿戴等多种设备上运行。核心特性：

- **分布式架构**：多设备协同，资源共享（如手机屏幕共享给车机）
- **微内核设计**：安全性高、性能优越、低延迟
- **统一生态**：鸿蒙原生应用与Android应用兼容（过渡期）
- **方舟编译器**：ArkTS代码编译为方舟字节码，运行性能优异

---

**🚀 鸿蒙APP开发流程：**

```
1️⃣ 环境准备
   ↓
   安装 DevEco Studio（鸿蒙官方IDE）
   配置华为开发者账号

2️⃣ 创建项目
   ↓
   选择模板（Empty Ability、JS/ArkTS）
   配置项目信息（包名、应用名称）

3️⃣ 编写代码
   ↓
   使用 ArkTS + ArkUI 声明式开发
   - @Component 定义页面组件
   - @State 管理状态
   - @Builder/@Styles 复用UI

4️⃣ 调试测试
   ↓
   使用模拟器或真机调试
   查看日志和性能分析

5️⃣ 打包签名
   ↓
   生成 .hap 应用包
   配置应用签名证书

6️⃣ 上架发布
   ↓
   提交华为应用市场（AppGallery Connect）
   审核通过后发布
```

**📌 关键技术栈：**
- **语言**：ArkTS（推荐）、ArkUI（JS）
- **框架**：ArkUI 声明式UI框架
- **工具**：DevEco Studio
- **运行环境**：HarmonyOS 4.0+

### 2、什么是ArkTS？它与TypeScript有什么区别？

**什么是ArkTS**

ArkTS 是鸿蒙开发的官方语言，基于 TypeScript 扩展而来，专门为声明式 UI 开发设计。

**与TypeScript的主要区别**

| 特性 | TypeScript | ArkTS |
|------|-----------|-------|
| 装饰器 | 可选 | 必须使用 |
| 状态管理 | 需要自己实现 | 内置 @State/@Prop/@Link |
| UI 语法 | 需要框架支持 | 声明式 UI 语法原生支持 |
| 性能优化 | 依赖编译器 | 方舟运行时深度优化 |

**ArkTS 核心特性**
- 声明式 UI：`build() { ... }` 函数描述界面
- 装饰器系统：`@State`、`@Prop`、`@Link` 管理状态
- 响应式更新：状态自动触发 UI 刷新
- 方舟运行时：针对鸿蒙系统深度优化

::: tip 💬 面试要点
ArkTS = TypeScript + ArkUI声明式语法 + 鸿蒙状态管理装饰器 + 方舟运行时优化
:::

---



### 2、ArkUI 中的常用的组件有哪些？

**基础组件**
- `Text` - 文本显示组件
- `Image` - 图片显示组件
- `TextInput` - 文本输入框
- `Button` - 按钮组件

**布局容器**
- `Column` - 垂直布局容器
- `Row` - 水平布局容器
- `Stack` - 层叠布局容器
- `List` - 列表容器
- `Grid` - 网格布局容器

**导航组件**
- `Navigation` - 页面导航容器
- `Tabs` - 标签页组件
- `Navigator` - 页面跳转组件

**显示组件**
- `Scroll` - 滚动容器
- `Refresh` - 下拉刷新
- `Progress` - 进度条

**选择组件**
- `Checkbox` - 复选框
- `Radio` - 单选框
- `Toggle` - 开关
- `Slider` - 滑块

**弹窗组件**
- `AlertDialog` - 对话框
- `ActionSheet` - 操作面板
- `Picker` - 选择器

::: tip 💬 面试要点
记忆要点：基础(文本/图片/输入/按钮)、布局(行列/堆叠/列表/网格)、导航(页面/标签/跳转)、显示(滚动/刷新/进度)、选择(勾选/单选/开关/滑块)、弹窗(对话框/面板/选择器)
:::


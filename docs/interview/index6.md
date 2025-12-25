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
解决props drilling问题，适合全局状态管理（主题、语言等）。

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

---

## ⚡ 二、Electron

### 1、Electron是什么？它的主要组成部分有哪些？

::: info 🖥️ 跨平台桌面应用
Electron是一个使用Web技术（HTML、CSS、JavaScript）构建跨平台桌面应用程序的框架。
:::

**🏗️ 主要组成部分：**
- **主进程（Main Process）**：应用程序的入口点，管理应用生命周期
- **渲染进程（Renderer Process）**：显示UI的进程，每个窗口独立运行
- **预加载脚本（Preload Script）**：安全地在渲染进程中访问Node.js API

### 2、Electron的主进程和渲染进程有什么区别？

::: tip 🔄 进程架构
理解主进程和渲染进程的区别是掌握Electron的关键！
:::

| 特性 | 主进程 | 渲染进程 |
|------|--------|----------|
| **数量** | 只有一个 | 可以有多个（每个窗口一个） |
| **权限** | 完全访问Node.js API | 默认受限，需要预加载脚本 |
| **职责** | 应用生命周期、窗口管理 | 界面渲染、用户交互 |
| **通信** | 通过ipcMain接收消息 | 通过ipcRenderer发送消息 |

### 3、Electron中如何进行进程间通信（IPC）？

::: warning 📡 通信机制
IPC是Electron的核心功能，理解进程间通信是开发Electron应用的基础！
:::

**📤 渲染进程 → 主进程：**
```javascript
// 渲染进程
const { ipcRenderer } = require('electron');
ipcRenderer.send('message-to-main', data);

// 主进程
const { ipcMain } = require('electron');
ipcMain.on('message-to-main', (event, data) => {
  console.log('收到消息:', data);
});
```

**📥 主进程 → 渲染进程：**
```javascript
// 主进程
window.webContents.send('message-to-renderer', data);

// 渲染进程
ipcRenderer.on('message-to-renderer', (event, data) => {
  console.log('收到消息:', data);
});
```

### 4、什么是预加载脚本？它的作用是什么？

::: info 🔐 安全桥梁
预加载脚本是在渲染进程加载网页之前运行的脚本，用于安全地暴露API给渲染进程。
:::

**🛡️ 作用：**
- 安全地在渲染进程中暴露Node.js功能
- 避免直接暴露整个Node.js API
- 提供可控的API接口

**💻 示例：**
```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
});

// 渲染进程中使用
window.electronAPI.openFile();
```

> 💡 **安全提示**：永远不要直接暴露整个Node.js API给渲染进程，使用contextBridge按需暴露！

### 5、如何打包和分发Electron应用？

::: tip 📦 应用分发
打包是将Electron应用分发给用户的关键步骤！
:::

**🔧 常用打包工具：**
- **electron-builder**：功能丰富，支持自动更新
- **electron-packager**：简单易用
- **electron-forge**：官方推荐的脚手架工具

**📋 打包流程：**
1. 安装打包工具
2. 配置package.json中的构建脚本
3. 执行打包命令
4. 生成可执行文件

::: details 点击查看示例配置

```json
{
  "build": {
    "appId": "com.example.myapp",
    "productName": "MyApp",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "node_modules/**/*"
    ]
  },
  "scripts": {
    "dist": "electron-builder"
  }
}
```

:::



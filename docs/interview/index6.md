---
outline: deep
---
## 目录表
[[toc]]
## 一、React

### 1、React 是什么？与Vue有什么区别？

React是Facebook开发的用于构建用户界面的JavaScript库，主要用于构建单页应用。它遵循组件化、声明式的编程思想，通过虚拟DOM机制来高效地更新用户界面。

**与Vue的主要区别：**

**学习难度和上手速度：**
- **React**：学习曲线较陡，需要掌握JSX、组件生命周期、状态管理等概念，对JavaScript基础要求较高
- **Vue**：更渐进式，可以从简单页面开始，逐步引入复杂特性，模板语法更接近传统HTML，上手更快

**语法风格和开发体验：**
- **React**：使用JSX语法，把HTML写在JavaScript中，逻辑和视图紧密结合，需要熟悉JavaScript的函数式编程
- **Vue**：使用模板语法，HTML、CSS、JavaScript分离，更像传统前端开发方式，代码组织更清晰

**状态管理方案：**
- **React**：需要配合Redux、MobX或Context API进行状态管理，选择更多但配置复杂
- **Vue**：自带Vuex/Pinia状态管理库，与框架集成更好，使用更方便

**生态系统和工具链：**
- **React**：生态系统更庞大，第三方库选择丰富，但需要自己组合配置
- **Vue**：官方提供全家桶解决方案（Vue Router、Vuex、Vue CLI），开箱即用更友好

**性能表现：**
- **React**：虚拟DOM算法更成熟，diff算法优化更好，适合大型复杂应用
- **Vue**：编译时优化更好，模板编译成渲染函数，在某些场景下性能更好

**适用场景：**
- **React**：适合大型复杂项目、需要高度定制化的应用、技术团队JavaScript基础好
- **Vue**：适合中小型项目、快速原型开发、团队成员水平参差不齐的情况

**企业选择倾向：**
- 大型互联网公司（如Facebook、Netflix）更偏好React
- 传统企业和中小团队更倾向于Vue
- 两者在就业市场都很受欢迎，但React岗位相对更多

### 2、React Hooks有哪些？解决了什么问题？

**常用Hooks：**
- **useState**：管理组件状态
- **useEffect**：处理副作用（API请求、定时器等）
- **useContext**：消费Context上下文
- **useReducer**：复杂状态管理
- **useMemo**：缓存计算结果
- **useCallback**：缓存函数引用

**解决的问题：**
- 类组件中this指向问题
- 生命周期逻辑分散，难以复用
- 组件树嵌套过深（HOC地狱）
- 让函数组件也能有状态和生命周期

### 3、React中useState和useReducer的区别？

**useState：**
- 适合简单状态管理
- 语法简单直观
- 每次更新都是替换状态

**useReducer：**
- 适合复杂状态逻辑
- 通过action描述状态变化
- 支持批量更新
- 更容易测试和调试

**选择建议：**
- 状态简单且独立 → useState
- 状态复杂且有多个子值 → useReducer
- 状态更新逻辑复杂 → useReducer

### 4、useEffect的依赖项数组怎么理解？

**依赖项数组的作用：**
- 控制effect执行时机
- 空数组[]：只在组件挂载和卸载时执行一次
- 有依赖项：依赖项变化时重新执行
- 不传数组：每次渲染都执行

**常见误区：**
- 依赖项少了会导致闭包陷阱
- 依赖项多了会导致不必要的重复执行
- 对象/数组作为依赖项要注意引用相等

**最佳实践：**
- 依赖项要包含effect内部用到的所有变量
- 使用useCallback/useMemo优化依赖项
- 复杂对象可以用JSON.stringify或自定义比较函数

### 5、React中的虚拟DOM是什么？有什么优势？

**虚拟DOM概念：**
虚拟DOM就是用JavaScript对象来描述真实DOM结构，是真实DOM的抽象表示。

**工作原理：**
1. 创建虚拟DOM树
2. 状态变化时创建新虚拟DOM树
3. 通过diff算法比较新旧虚拟DOM
4. 计算最小差异，只更新需要变化的部分

**优势：**
- **性能更好**：批量更新，减少DOM操作
- **跨浏览器**：抽象了不同浏览器的DOM差异
- **开发体验**：声明式编程，代码更清晰
- **服务端渲染**：支持SSR和同构应用

**缺点：**
- 首次渲染较慢（需要构建虚拟DOM）
- 内存占用更多
- 简单应用可能过度设计

### 6、React的组件生命周期有哪些？（函数组件）

**函数组件生命周期对应：**
- **挂载阶段**：useEffect(() => {}, [])
- **更新阶段**：useEffect(() => {}, [deps])
- **卸载阶段**：useEffect(() => { return () => {} }, [])

**常见的useEffect使用模式：**
```javascript
// 模拟componentDidMount
useEffect(() => {
  // 只在挂载后执行一次
}, [])

// 模拟componentDidUpdate
useEffect(() => {
  // 依赖项变化时执行
}, [props.value])

// 模拟componentWillUnmount
useEffect(() => {
  return () => {
    // 清理定时器、取消订阅等
  }
}, [])
```

### 7、React中的状态提升是什么？什么时候使用？

**状态提升概念：**
将多个组件需要共享的状态，提升到它们最近的共同父组件中进行管理。

**使用场景：**
- 多个子组件需要共享数据
- 兄弟组件之间需要通信
- 需要统一管理相关状态

**实现步骤：**
1. 找到共同父组件
2. 将状态移到父组件
3. 通过props传递给子组件
4. 子组件通过回调函数更新状态

**优点：**
- 数据流向清晰
- 状态管理统一
- 减少组件间的耦合

**缺点：**
- 层级过深时props传递麻烦
- 可以考虑使用Context或状态管理库

### 8、React的Context API怎么使用？有什么应用场景？

**Context基本用法：**
```javascript
// 创建Context
const ThemeContext = React.createContext('light');

// Provider提供值
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// Consumer消费值
const theme = useContext(ThemeContext);
```

**应用场景：**
- **主题切换**：暗色/亮色模式
- **用户信息**：登录状态、用户资料
- **国际化**：多语言切换
- **全局配置**：API地址、环境变量

**注意事项：**
- Context值变化会导致所有消费者重新渲染
- 避免频繁变化的值使用Context
- 可以拆分多个Context避免不必要的渲染

### 9、React性能优化有哪些方法？

**渲染优化：**
- **React.memo**：纯组件，避免不必要的重新渲染
- **useMemo**：缓存计算结果
- **useCallback**：缓存函数引用
- **虚拟列表**：处理大量数据渲染

**代码优化：**
- **懒加载**：React.lazy和Suspense
- **代码分割**：减少初始包大小
- **条件渲染**：避免渲染不需要的组件
- **防抖节流**：优化频繁触发的事件

**架构优化：**
- **状态管理**：合理使用Context和状态管理库
- **组件拆分**：保持组件单一职责
- **避免在render中创建对象和函数**

### 10、React中受控组件和非受控组件的区别？

**受控组件：**
- 表单值由React状态控制
- 每次输入都会触发状态更新
- 更适合复杂的表单验证
- 示例：`<input value={value} onChange={handleChange} />`

**非受控组件：**
- 表单值由DOM自身管理
- 通过ref获取表单值
- 代码更简单，性能更好
- 示例：`<input ref={inputRef} />`

**选择建议：**
- 需要实时验证、动态表单 → 受控组件
- 简单表单、性能要求高 → 非受控组件
- 文件上传一般用非受控组件

### 10、React中的状态提升是什么？什么时候使用？

**状态提升概念：**
将多个组件需要共享的状态，提升到它们最近的共同父组件中进行管理。

**使用场景：**
- 多个子组件需要共享数据
- 兄弟组件之间需要通信
- 需要统一管理相关状态

**实现步骤：**
1. 找到共同父组件
2. 将状态移到父组件
3. 通过props传递给子组件
4. 子组件通过回调函数更新状态

**优点：**
- 数据流向清晰
- 状态管理统一
- 减少组件间的耦合

**缺点：**
- 层级过深时props传递麻烦
- 可以考虑使用Context或状态管理库

## 二、Electron

### 1、Electron是什么？它有什么优势？

**Electron概念：**
Electron是GitHub开发的跨平台桌面应用开发框架，用Web技术（HTML、CSS、JavaScript）构建桌面应用。

**核心优势：**
- **跨平台**：一套代码支持Windows、macOS、Linux
- **技术栈统一**：前端开发者无需学习新技术
- **生态丰富**：可以使用npm的所有包
- **开发效率高**：热重载、调试方便

**知名应用：**
VS Code、Slack、Discord、WhatsApp、Figma等

**适用场景：**
- 需要跨平台的桌面应用
- Web应用的桌面版
- 开发工具类应用

### 2、Electron的主要进程有哪些？它们之间如何通信？

**两种进程：**
- **主进程**：应用生命周期管理、创建渲染进程、调用原生API
- **渲染进程**：显示UI界面、类似浏览器页面

**通信方式：**
- **IPC（进程间通信）**：
  - `ipcMain`：主进程接收消息
  - `ipcRenderer`：渲染进程发送消息
- **remote模块**：渲染进程直接调用主进程API

**基本通信：**
```javascript
// 渲染进程发送
ipcRenderer.send('message', data);

// 主进程接收
ipcMain.on('message', (event, data) => {
  // 处理消息
});
```

### 3、Electron的安全问题有哪些？如何防范？

**常见安全风险：**
- **XSS攻击**：注入恶意脚本
- **代码注入**：Node.js集成被滥用
- **远程代码执行**：加载不可信内容

**安全最佳实践：**
- **关闭Node.js集成**：`nodeIntegration: false`
- **启用上下文隔离**：`contextIsolation: true`
- **禁用远程模块**：`enableRemoteModule: false`
- **内容安全策略**：设置CSP头部

**配置示例：**
```javascript
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true
  }
});
```

### 4、Electron的打包和分发有哪些方式？

**打包工具：**
- **electron-builder**：功能最全，支持多平台
- **electron-packager**：简单易用，基础打包
- **electron-forge**：官方推荐，集成度好

**分发渠道：**
- **应用商店**：Microsoft Store、Mac App Store
- **直接下载**：官网提供安装包
- **自动更新**：electron-updater

**打包优化：**
- **代码分割**：减少初始包大小
- **ASAR打包**：保护源码，提高性能
- **签名认证**：提高安全性

**局限性：**
- **体积较大**：内置Chromium导致体积大
- **内存占用**：相比原生应用内存消耗高
- **启动速度**：冷启动相对较慢
- **性能上限**：不适合高性能要求的应用

**替代方案：**
- **Tauri**：Rust后端，体积更小
- **Flutter Desktop**：Google的跨平台方案
- **PWA**：渐进式Web应用
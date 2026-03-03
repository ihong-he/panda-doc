---
outline: [1,3]
---

::: tip 提示
本文档用来记录一些前端面试相关的问题
:::

### 1、vue 如何提高首屏加载速度

**路由懒加载**：使用 `import()` 语法动态导入组件，按需加载路由。

**代码分割**：通过 webpack 的 SplitChunksPlugin 将公共代码抽离，减少重复打包。

**CDN 加速**：将 Vue、Vuex、Vue Router 等库通过 CDN 引入，减少包体积。

**Tree Shaking**：移除未使用的代码，按需引入组件库（如 Element Plus 的按需引入）。

**图片优化**：使用懒加载（`v-lazy`）、WebP 格式、图片压缩减少加载时间。

**预加载策略**：使用 `<link rel="preload">` 预加载关键资源，`prefetch` 预加载可能用到的资源。

**SSR 渲染**：使用 Nuxt.js 等服务端渲染方案，让首屏直接返回 HTML。

**Gzip 压缩**：开启服务器 gzip 压缩，减小传输体积。



### 2、AI 工具在工作中的使用

::: info 🤖 AI 辅助开发
AI 工具已成为前端开发的必备助手，合理使用可以显著提升开发效率，但不能完全替代人工思考和代码质量把控。
:::

#### **🎯 核心应用场景**

| 场景 | AI 工具 | 优势 | 注意事项 |
|------|---------|------|----------|
| **代码生成** | Cursor/CodeBuddy | 快速生成样板代码 | 需人工审核和测试 |
| **代码解释** | ChatGPT/Claude | 快速理解复杂逻辑 | 验证解释准确性 |
| **Bug 修复** | AI 调试工具 | 定位和修复常见问题 | 深度问题需人工分析 |
| **代码重构** | Cursor Refactor | 优化代码结构和质量 | 保持业务逻辑不变 |
| **文档生成** | AI 文档工具 | 快速生成 API 文档 | 需人工补充细节 |

#### **⚡ AI 工具使用最佳实践**

##### **✅ 推荐做法**

1. **代码生成后必须审查**
   ```javascript
   // AI 生成的代码
   const data = await fetch('/api/users').then(res => res.json());

   // 人工审查后改进：添加错误处理
   const data = await fetch('/api/users')
     .then(res => {
       if (!res.ok) throw new Error('请求失败');
       return res.json();
     })
     .catch(err => {
       console.error('获取用户列表失败:', err);
       return [];
     });
   ```

2. **提供清晰的上下文**
   ```
   ❌ 差的提示词：帮我写个函数
   ✅ 好的提示词：帮我写一个函数，输入用户 ID 列表，异步获取每个用户的详细信息，
     返回 Promise<User[]>，需要处理并发请求，最多同时 5 个请求
   ```

3. **保持代码风格一致**
   ```javascript
   // 统一使用项目现有的代码风格
   const getUserById = async (id: number): Promise<User> => {
     const response = await fetch(`/api/users/${id}`);
     if (!response.ok) throw new Error('用户不存在');
     return response.json();
   };
   ```

---

##### **❌ 避免陷阱**

1. **盲目信任 AI 生成的代码**
   ```javascript
   // AI 可能生成不安全的代码
   // ❌ 危险：直接拼接 SQL
   const query = `SELECT * FROM users WHERE name = '${userName}'`;

   // ✅ 安全：使用参数化查询
   const query = 'SELECT * FROM users WHERE name = ?';
   db.query(query, [userName]);
   ```

2. **忽略性能优化**
   ```javascript
   // ❌ 低效：循环中的异步请求
   for (const id of userIds) {
     const user = await getUserById(id);
     users.push(user);
   }

   // ✅ 高效：并发请求
   const users = await Promise.all(userIds.map(id => getUserById(id)));
   ```

3. **不进行测试**
   ```javascript
   // AI 生成代码后，必须编写测试用例
   describe('getUserById', () => {
     it('应该返回用户信息', async () => {
       const user = await getUserById(1);
       expect(user).toBeDefined();
       expect(user.id).toBe(1);
     });

     it('应该处理用户不存在的情况', async () => {
       await expect(getUserById(999)).rejects.toThrow('用户不存在');
     });
   });
   ```

---

#### **📊 AI 工具效率提升数据**

| 任务类型 | 传统时间 | AI 辅助时间 | 效率提升 |
|----------|----------|-------------|----------|
| 创建基础组件 | 30 分钟 | 5 分钟 | **6x** |
| 编写工具函数 | 20 分钟 | 3 分钟 | **6.7x** |
| 代码重构 | 1 小时 | 15 分钟 | **4x** |
| Bug 定位 | 30 分钟 | 5 分钟 | **6x** |
| 编写文档 | 45 分钟 | 10 分钟 | **4.5x** |

::: tip 💡 记忆口诀
**AI 工具是助手，生成代码要审查，效率提升很显著，质量把控不放松**
:::

### 3、ESLint 和 prettier 冲突的解决

::: tip 💡 核心思路
关闭 ESLint 中与 Prettier 冲突的格式化规则，让 Prettier 专注格式化，ESLint 专注代码质量检查。
:::

#### **方案一：使用 eslint-config-prettier（推荐）**

关闭 ESLint 中所有与 Prettier 冲突的规则：

```bash
npm install -D eslint-config-prettier
```

> **作用**：关闭 ESLint 中所有与 Prettier 冲突的格式化规则，让 ESLint 专注代码质量检查，Prettier 专注格式化。

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',  // ESLint 官方推荐的规则集
    'prettier'             // 放在最后，关闭所有与 Prettier 冲突的格式化规则
  ]
}
```

#### **方案二：使用 eslint-plugin-prettier**

让 ESLint 运行 Prettier 规则：

```bash
npm install -D eslint-plugin-prettier eslint-config-prettier
```

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'  // 包含了 eslint-config-prettier
  ]
}
```

#### **方案三：在 VS Code 中配置保存自动修复**

```json
// settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

::: tip 💡 记忆口诀
**ESLint 和 Prettier 冲突不难解，prettier 放最后，配置要一致**
:::

### 4、讲解一下 vue 中的Diff算法

Vue Diff 算法是 Vue 进行虚拟 DOM 比较和更新的核心机制，用于高效地找出新旧节点的差异并更新真实 DOM。

#### **核心思路**

1. **同层比较**：只在同一层级进行比较，不跨层级
2. **双端比较**：Vue 2 采用双指针从两端向中间比较
3. **最长递增子序列**：Vue 3 使用 LIS 算法优化列表 diff

#### **Vue 2 的 Diff 过程**

1. **oldStart/newStart 比较**：相同则向右移动
2. **oldEnd/newEnd 比较**：相同则向左移动
3. **oldStart/newEnd 比较**：相同则将 oldStart 节点移到末尾
4. **oldEnd/newStart 比较**：相同则将 oldEnd 节点移到开头
5. **以上都不匹配**：使用 key 在旧节点中查找，找到则移动，找不到则创建新节点

#### **Vue 3 的 Diff 优化**

- 使用最长递增子序列（LIS）算法，减少节点移动次数
- 静态提升和静态标记，跳过静态节点的比较
- 编译时优化，生成更高效的 diff 代码

#### **Key 的作用**

- 帮助 Diff 算法准确识别节点身份
- 避免不必要的节点销毁和重建
- 提升列表渲染性能

::: tip 💡 记忆口诀
**Diff 算法同层比，双端指针两边移，Key 值不能少，Vue3 用 LIS 更快**
:::

### 5、说一说前端编程中的异步

异步编程是指不会阻塞主线程的编程方式，允许程序在等待某些操作完成时继续执行其他代码。

#### **为什么需要异步**

JavaScript 是单线程语言，如果所有操作都同步执行，一个耗时操作会阻塞后续所有代码执行，导致页面卡顿甚至无响应。

#### **常见异步场景**

1. **网络请求**：`fetch`、`axios`、AJAX
2. **定时器**：`setTimeout`、`setInterval`
3. **事件处理**：点击、滚动等用户交互
4. **文件操作**：Node.js 中的文件读写

#### **异步解决方案演进**

**1️⃣ 回调函数（Callback）**
```javascript
setTimeout(() => {
  console.log('执行完成');
}, 1000);
```
*缺点：回调地狱，代码难以维护*

**2️⃣ Promise**
```javascript
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```
*优点：链式调用，错误处理更清晰*

**3️⃣ Async/Await**
```javascript
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```
*优点：同步代码的写法，最推荐的方式*

::: tip 💡 记忆口诀
**异步不阻塞，回调地狱难，Promise 链式，async await 最简单**
:::

### 6、Options/Composition API是什么？应用场景有啥区别？

Vue 的 Options API 和 Composition API 是两种不同的代码组织方式。

#### **Options API（选项式 API）**

Vue 2 的经典写法，通过配置对象来组织代码。

```javascript
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  },
  mounted() {
    console.log('组件挂载完成')
  }
}
```

**特点**：
- 代码按功能类型分组（data、methods、computed 等）
- 适合中小型组件
- 学习曲线平缓，容易上手

#### **Composition API（组合式 API）**

Vue 3 推出的新写法，通过函数组合来组织代码。

```javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    onMounted(() => {
      console.log('组件挂载完成')
    })

    return { count, increment }
  }
}
```

**特点**：
- 代码按逻辑功能分组
- 便于代码复用和提取
- 更好的 TypeScript 支持

#### **应用场景对比**

| 场景 | Options API | Composition API |
|------|-------------|-----------------|
| **小型组件** | ✅ 推荐 | 可用 |
| **大型组件** | 较困难 | ✅ 推荐 |
| **逻辑复用** | Mixin/插件 | Composable 函数 |
| **TypeScript** | 支持一般 | ✅ 支持优秀 |
| **学习难度** | 简单 | 稍复杂 |

#### **选择建议**

- **Options API**：适合新手、简单业务、团队已有项目
- **Composition API**：适合大型项目、复杂逻辑、追求更好的代码组织

::: tip 💡 记忆口诀
**Options 选项式，按类型分组适合小项目；Composition 组合式，按逻辑分组适合大项目**
:::

### 7、组件的封装的设计思想

组件封装的核心思想是将 UI 和逻辑进行模块化，提高代码的可复用性和可维护性。

#### **核心设计原则**

**1️⃣ 单一职责原则**
一个组件只做一件事，专注解决特定问题。

```javascript
// ✅ 好的示例：专注按钮功能
<BasicButton type="primary" onClick={handleClick} />

// ❌ 不好的示例：按钮还处理表单逻辑
<ButtonWithForm type="primary" submitUrl="/api" />
```

**2️⃣ 数据驱动（Props Down, Events Up）**
- 父组件通过 `props` 向子组件传递数据
- 子组件通过 `$emit` 触发事件通知父组件

```javascript
// 父组件
<UserList :users="users" @select="handleSelect" />

// 子组件
props: ['users'],
methods: {
  selectUser(user) {
    this.$emit('select', user)
  }
}
```

**3️⃣ 封装内部实现**
使用者不需要知道组件内部如何实现，只关心暴露的接口（props、事件、插槽）。

```javascript
// ✅ 使用者只关心接口
<DatePicker 
  v-model="date" 
  :disabled="false" 
  @change="handleChange" 
/>

// ✅ 组件内部复杂逻辑对使用者透明
```

**4️⃣ 可配置性**
通过 props 提供灵活的配置选项，满足不同使用场景。

```javascript
<Modal 
  :visible="showModal"
  :title="modalTitle"
  :footer="false"
  :mask-closable="true"
/>
```

**5️⃣ 默认行为和兜底**
为 props 提供合理的默认值，确保组件在任何情况下都能正常工作。

```javascript
props: {
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
}
```

#### **组件分层设计**

```
基础组件（Base Components）
  ↓ 纯 UI 组件，如 Button、Input、Select
业务组件（Business Components）
  ↓ 结合业务逻辑，如 UserSelect、ProductList
页面组件（Page Components）
  ↓ 完整页面，如 UserListPage、ProductDetailPage
```

#### **封装的好处**

- ✅ **复用性强**：一次封装，多处使用
- ✅ **维护性好**：修改只需改一处
- ✅ **协作高效**：团队成员专注各自模块
- ✅ **测试方便**：组件独立，易于单元测试

::: tip 💡 记忆口诀
**单一职责是基础，Props Down Events Up，封装实现只接口，灵活配置有默认**
:::

### 8、简单讲解一下前端监控和简单实现

前端监控是指在用户使用 Web 应用的过程中，通过采集和分析各种性能指标、错误信息、用户行为等数据，来帮助开发者发现和解决问题的技术手段。

#### **监控的分类**

**1️⃣ 性能监控**
- 页面加载时间（FP、FCP、LCP 等）
- 资源加载时间（JS、CSS、图片等）
- 首屏渲染时间
- 白屏时间、可交互时间（TTI）

**2️⃣ 错误监控**
- JavaScript 运行时错误
- 资源加载错误
- Promise 错误
- 接口请求错误

**3️⃣ 用户行为监控**
- PV（页面浏览量）/ UV（独立访客）
- 用户停留时长
- 点击热力图
- 用户路径分析


#### **主流前端监控方案**

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **Sentry[/ˈsentri/]** | 开源免费，支持多种语言，错误监控强大 | 中小型项目，注重错误监控 |
| **阿里云 ARMS** | 功能全面，性能+错误+行为监控 | 企业级应用，需要一站式方案 |
| **腾讯云 RUM** | 性能监控优秀，支持实时监控 | 对性能要求高的项目 |
| **自研方案** | 完全可控，按需定制 | 有特殊需求的大型项目 |

::: tip 💡 记忆口诀
**前端监控三大类，性能错误行为追，收集数据要全面，上报选择 sendBeacon**
:::

### 9、前端哪些行为会导致内存泄漏？

内存泄漏是指程序中动态分配的内存由于某种原因没有被释放，导致内存占用不断增加，最终可能导致应用卡顿或崩溃。

#### **常见的内存泄漏场景**

**1️⃣ 全局变量**

未声明的变量会自动挂载到全局对象（window），导致无法被垃圾回收。避免使用未声明的变量，或显式创建全局变量。

**2️⃣ 定时器未清理**

`setTimeout` 或 `setInterval` 在组件销毁后未清理，回调函数保持对组件的引用。解决方法是在组件销毁生命周期中调用 `clearTimeout` 或 `clearInterval` 清理定时器。

**3️⃣ 事件监听未移除**

DOM 事件（如 resize、scroll）或自定义事件监听器未在组件销毁时移除，导致组件实例无法被回收。解决方法是在组件销毁时调用 `removeEventListener` 移除监听器。

**4️⃣ 闭包引用**

闭包持有外部大对象的引用，导致外部变量无法被回收。优化方法是只引用真正需要的数据，而非整个大对象。

**5️⃣ DOM 引用**

组件销毁后，代码中仍保存对 DOM 元素的引用（如缓存在变量中），导致 DOM 无法被回收。解决方法是在组件销毁时将 DOM 引用置为 null。

**6️⃣ 路由跳转后的长连接**

WebSocket、EventSource 等长连接在路由跳转后未关闭，持续占用内存和网络资源。解决方法是在路由跳转或组件销毁时调用 `close()` 关闭连接。

**7️⃣ 第三方库未正确销毁**

某些第三方库（如 ECharts、Monaco Editor、Three.js 等）需要手动调用销毁方法释放资源，否则会导致内存泄漏。

#### **检测和排查方法**

**1️⃣ Chrome DevTools Performance /pəˈfɔːməns/**
录制页面操作，观察内存变化趋势，查看内存持续增长的节点。

**2️⃣ Chrome DevTools Memory**
使用 Heap Snapshot 拍摄堆快照，对比两次快照，找出无法回收的对象。

**3️⃣ Chrome DevTools Coverage**
分析未使用的代码，检查是否有未释放的代码引用。

#### **内存泄漏排查步骤**

1. 打开 Chrome DevTools → Performance
2. 开启录制
3. 执行可能泄漏的操作（如页面切换）
4. 停止录制，查看内存曲线
5. 使用 Heap Snapshot 分析具体泄漏对象

::: tip 💡 记忆口诀
**全局变量要避免，定时监听要清理，闭包引用要注意，第三方库要销毁，DOM 引用要置空**
:::

---
outline: [1,3]
---

::: tip 提示
本文档用来记录一些前端正式面试遇到的问题，方便回顾和复习。
:::

## 高频面试题

### 1、虚拟列表处理不定高行的解决方案

**虚拟列表的痛点**：传统虚拟列表假设所有行高度固定，但实际项目中经常遇到不定高的内容（如多行文本、图片加载后高度变化等）。

**方案一：预估高度 + 动态缓存**

实现思路：给每行一个预估高度，等实际渲染后测量真实高度并缓存，重新计算位置。

- 初始时用预估高度计算滚动位置
- 行渲染完成后通过 `ResizeObserver` 或 ref 获取真实高度
- 缓存每行的实际高度到 Map 或数组中
- 重新计算所有行的偏移位置和总高度
- 滚动时根据缓存高度准确计算可见区域

**核心代码：**
```js
// 1. 初始化配置
const estimatedRowHeight = 50;  // 每行预估高度
const rowCache = new Map();     // 缓存每行的实际高度

// 2. 计算某个位置的累计高度（用于定位）
function getOffsetBefore(index) {
  let offset = 0;
  for (let i = 0; i < index; i++) {
    offset += rowCache.get(i) || estimatedRowHeight;
  }
  return offset;
}

// 3. 计算总高度
function getTotalHeight() {
  let height = 0;
  for (let i = 0; i < totalRows; i++) {
    height += rowCache.get(i) || estimatedRowHeight;
  }
  return height;
}

// 4. 根据滚动位置计算可见范围
function getVisibleRange(scrollTop, containerHeight) {
  let offset = 0;
  let startIndex = 0;
  
  // 找到开始位置
  for (let i = 0; i < totalRows; i++) {
    const rowHeight = rowCache.get(i) || estimatedRowHeight;
    if (offset + rowHeight > scrollTop) {
      startIndex = i;
      break;
    }
    offset += rowHeight;
  }
  
  // 计算结束位置
  let endIndex = startIndex;
  let currentOffset = offset;
  while (currentOffset < scrollTop + containerHeight && endIndex < totalRows) {
    currentOffset += rowCache.get(endIndex) || estimatedRowHeight;
    endIndex++;
  }
  
  return { startIndex, endIndex };
}

// 5. 行渲染后测量真实高度
function onRowRender(index, element) {
  const realHeight = element.offsetHeight;
  if (rowCache.get(index) !== realHeight) {
    rowCache.set(index, realHeight);
    // 触发重新计算和渲染
    updateList();
  }
}

// 6. 渲染函数
function renderList(scrollTop, containerHeight) {
  const { startIndex, endIndex } = getVisibleRange(scrollTop, containerHeight);
  const offsetY = getOffsetBefore(startIndex);
  
  return (
    <div style={{ height: getTotalHeight() }}>
      <div style={{ transform: `translateY(${offsetY}px)` }}>
        {rows.slice(startIndex, endIndex).map(row => (
          <div 
            key={row.id} 
            ref={(el) => onRowRender(row.index, el)}
          >
            {row.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

**方案二：使用 el-table-v2 的 `estimated-row-height`**

核心思路：Element Plus 的 Table V2 组件内置了不定高支持,通过属性配置即可。

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    :estimated-row-height="50"
    :row-height="getRowHeight"
    :row-key="rowKey"
    fixed
  />
</template>

<script setup>
// 预估每行高度(必须提供,用于未渲染时的估算)
const estimatedRowHeight = 50;

// 动态计算某行高度(可选,不提供则使用固定高度)
const getRowHeight = ({ rowData, rowIndex }) => {
  // 根据数据内容返回实际高度
  return rowData.height || estimatedRowHeight;
};
</script>
```

**关键属性说明：**
- `estimated-row-height`: 预估行高,用于未渲染行的位置计算
- `row-height`: 可选,返回某行的实际高度,可以是固定值或函数
- `fixed`: 启用固定表头

**优势：**
开箱即用,内置性能优化,无需手动维护高度缓存和位置计算。

### 2、CSS中的定位及作用

**static（默认定位）**
- 按文档流正常排列
- 无法使用 `top/left/right/bottom` 调整位置

**relative（相对定位）**
- 相对于自身原始位置偏移
- 不影响其他元素布局
- 常用场景：绝对定位的父容器

**absolute（绝对定位）**
- 相对于最近的有定位（非static）的祖先元素定位
- 脱离文档流，不占空间
- 常用场景：弹窗、下拉菜单、悬浮按钮

**fixed（固定定位）**
- 相对于浏览器窗口定位
- 滚动时位置固定
- 常用场景：导航栏、回到顶部按钮

**sticky（粘性定位）**
- 在指定范围内表现为 relative，超出范围变为 fixed
- 常用场景：吸顶导航栏、表格表头

### 3、作为前端负责人，如何负责项目的技术选型和架构设计？

**技术选型原则：**
1. **业务需求优先** - 根据项目复杂度、团队规模、开发周期选择
2. **团队能力匹配** - 考虑团队现有技术栈，学习成本，社区生态
3. **长期可维护** - 选择成熟稳定、有长期支持的方案
4. **性能要求** - 对比方案的性能表现，做压测验证

**具体流程：**
1. **需求分析** - 明确功能范围、性能指标、用户量级
2. **方案调研** - 列出2-3个候选方案，做POC验证
3. **团队评审** - 召开技术评审会，听取团队意见
4. **决策确认** - 综合评估后选择，输出技术选型文档
5. **持续优化** - 项目中定期复盘，根据实际情况调整

**架构设计要点：**
- 模块化分层：按业务域拆分模块，降低耦合
- 统一规范：代码规范、接口规范、Git流程规范
- 可扩展性：预留扩展点，方便后续功能迭代
- 性能优化：构建优化、加载优化、渲染优化策略

### 4、ESLint 和 prettier 冲突的解决

**冲突原因：**
ESLint 和 Prettier 都负责代码格式化，规则不一致时会相互覆盖。

**解决方案：**
1. **安装 `eslint-config-prettier`**
   ```bash
   npm install eslint-config-prettier -D
   ```

2. **在 ESLint 配置中禁用与 Prettier 冲突的规则**
   ```js
   // .eslintrc.js
   {
     "extends": [
       "eslint:recommended",
       "plugin:vue/vue3-recommended",
       "prettier"  // 必须放在最后，禁用所有冲突规则
     ]
   }
   ```

3. **分工明确**
   - ESLint：负责代码质量（未使用变量、逻辑错误等）
   - Prettier：负责代码格式（缩进、引号、换行等）

4. **IDE 配置**
   - 保存时先运行 Prettier 格式化，再运行 ESLint 检查
   - 避免多次格式化闪烁

### 5、前端页面卡死如何查找原因和解决方案

**排查步骤：**

1. **打开 Chrome DevTools**
   - Performance 面板录制页面操作，查看主线程执行情况
   - Memory 面板查看内存是否持续增长（内存泄漏）
   - Network 面板查看请求是否阻塞

2. **查看 Console**
   - 是否有无限递归、死循环报错
   - 是否有大量错误日志输出

3. **使用 `console.time` 标记**
   ```js
   console.time('heavy-task');
   // 可能卡顿的代码
   console.timeEnd('heavy-task');
   ```

**常见原因及解决方案：**

| 原因 | 解决方案 |
|------|----------|
| 死循环/无限递归 | 检查循环终止条件，递归边界 |
| 大数据量渲染 | 使用虚拟列表、分页、懒加载 |
| 频繁 DOM 操作 | 使用文档片段、防抖节流 |
| 内存泄漏 | 及时解绑事件、清除定时器、断开引用 |
| 同步阻塞 | 使用 Web Worker、requestIdleCallback |

### 6、type 和 interface 的区别？

**声明方式：**

- `type` 可以定义任意类型：
  - 别名：给类型起个名字，如 `type ID = string | number`
  - 联合类型：多个类型任选其一，如 `type Status = 'loading' | 'success' | 'error'`
  - 元组：固定长度和类型的数组，如 `type Point = [number, number]`
  - 基本类型：如 `type Str = string`
- `interface` 只能定义对象类型

**合并能力：**

- `interface` 会自动合并：同名接口会自动合并成一个
- `type` 不会合并：同名类型会报错

```typescript
// interface 可以合并
interface User {
  name: string;
}
interface User {
  age: number;
}
// 最终：{ name: string; age: number; }

// type 不可以合并，会报错
```

**扩展方式：**

- `interface` 使用 `extends` 继承
- `type` 使用交叉类型 `&` 或 extends

**适用场景：**

- **interface**：定义对象、类、组件 props，需要合并的场景
- **type**：联合类型、元组、函数类型、映射类型

**实际开发建议：**

- 定义对象优先用 `interface`
- 定义联合类型、元组等用 `type`
- React 组件 props 用 `interface`（方便扩展）

### 7、在项目中你会使用webpack 或者 vite进行哪些配置？

**常用配置项：**

**1. 入口和出口配置**
- 配置入口文件路径（多页面项目配置多个入口）
- 配置输出文件名、路径、CDN 前缀

**2. 开发服务器配置**
- 配置端口、代理接口解决跨域
- 热更新（HMR）配置
- 开启 gzip 压缩

**3. 路径别名**
```js
// 简化导入路径
import { Button } from '@/components/Button'  // 不用 '../../../components/Button'
```

**4. Loader 配置**
- 处理 CSS、Sass、Less 等样式文件
- 处理图片、字体等静态资源
- 转译 TypeScript、JSX

**5. 环境变量**
- 区分开发/测试/生产环境
- 配置不同环境的 API 地址

**6. 构建优化**
- 代码分割：按路由、第三方库拆分代码
- Tree Shaking：删除未使用的代码
- 压缩代码、生成 source map

**7. 插件配置**
- HTML 模板插件：自动生成 HTML 文件
- 复制资源插件：复制静态文件到输出目录
- 清理插件：每次构建前清空输出目录

**Vite 优势：**
- 开发启动快，基于 ESM 按需编译
- 配置简单，开箱即用
- 内置 TypeScript 支持



### 8、在项目开发中，你是什么角色？是如何协作的？

**我的角色定位：**

在团队中我担任前端小组组长，主要职责包括：
1. **技术方向把控** - 负责项目的技术选型、架构设计和代码规范制定
2. **任务分配** - 根据团队成员的能力和特长合理分配任务
3. **质量把控** - Code Review 评审代码，确保代码质量和一致性
4. **技术指导** - 帮助团队成员解决技术难题，组织技术分享
5. **跨部门协作** - 与产品、后端、设计等角色沟通协作

**协作方式：**

**1. 需求阶段**
- 参与需求评审，从技术角度评估可行性和风险
- 与产品经理确认需求细节，提前识别潜在问题
- 输出技术方案文档，明确技术实现路径

**2. 开发阶段**
- 使用敏捷开发，每日站会同步进度和风险
- 建立代码规范，统一 ESLint、Prettier 配置
- 提交 PR 前自测，通过后进行 Code Review
- 使用 Git 分支策略（develop/feature/hotfix）规范版本管理

**3. 沟通协作**
- 与后端对齐接口文档，使用 Swagger 或 TypeScript 类型定义
- 与设计师确认 UI/UX 细节，使用 Figma/蓝湖 等协作工具
- 内部搭建组件库和工具函数库，避免重复造轮子
- 定期组织技术分享会，提升团队整体技术水平

**实际成果：**
- 将项目首屏加载时间优化了 40%
- 搭建了内部组件库，提升开发效率 30%
- 带领 5 人前端团队按时交付了 3 个大型项目
- 建立了完善的代码规范和文档体系，降低新人上手成本
## 其它面试题

### 1、AI 工具在工作中的使用，以 codebuddy 为例

**日常工作场景：**

1. **代码生成** - 快速生成组件模板、工具函数、API 接口定义
2. **代码解释** - 遇到不懂的代码，直接让 AI 解释逻辑和原理
3. **Bug 修复** - 描述问题现象，AI 帮忙定位原因并提供修复方案
4. **代码重构** - 选中一段代码，让 AI 优化性能、提升可读性
5. **单元测试** - 自动生成测试用例，提高测试覆盖率
6. **文档编写** - 生成 README、API 文档、技术方案文档

**使用技巧：**
- 提问要具体，说明上下文和期望结果
- 让 AI 先理解代码结构，再进行修改
- 生成后 review 代码，不要完全依赖 AI
- 积累好用的 prompt，提高效率

**实际效果：**
- 减少重复劳动，效率提升 30%-50%
- 快速学习新技术，降低学习成本
- 减少低级错误，提高代码质量

### 2、Grid 布局方案的使用

**核心概念：**
- `grid-template-columns` - 定义列
- `grid-template-rows` - 定义行
- `grid-gap` - 单元格间距
- `grid-area` - 指定单元格位置

**常用场景：**

1. **圣杯布局**
   ```css
   .container {
     display: grid;
     grid-template-columns: 200px 1fr 200px;
     grid-template-rows: 60px 1fr 40px;
     grid-template-areas:
       "header header header"
       "left main right"
       "footer footer footer";
   }
   ```

2. **响应式网格**
   ```css
   .grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 16px;
   }
   ```

3. **卡片对齐**
   ```css
   .card {
     display: grid;
     grid-template-columns: auto 1fr;
     gap: 12px;
     align-items: center;
   }
   ```

**优势：**
- 二维布局能力强大，一行代码搞定复杂布局
- 响应式友好，配合 `minmax`、`auto-fit` 自适应
- 性能好，浏览器原生支持

### 3、Options/Composition API有什么区别？

**Options API（选项式 API）**
- 按选项组织代码：`data`、`methods`、`computed`、`watch`
- 适合简单组件、新手入门
- 缺点：逻辑分散，复杂组件难以维护

**Composition API（组合式 API）**
- 按逻辑组织代码，相关代码放在一起
- 提供 `ref`、`reactive`、`computed`、`watch` 等组合式函数
- 适合复杂组件、逻辑复用

**代码对比：**
```js
// Options API
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } },
  computed: { double() { return this.count * 2 } }
}

// Composition API
import { ref, computed } from 'vue'
export default {
  setup() {
    const count = ref(0)
    const increment = () => count.value++
    const double = computed(() => count.value * 2)
    return { count, increment, double }
  }
}
```

**优势总结：**
- 更好的 TypeScript 支持
- 逻辑复用更灵活（自定义 Hook）
- 代码组织更清晰，便于维护

### 4、给你一个数组，如何打乱/随机顺序渲染？

**方案一：Fisher-Yates 洗牌算法（最优方案）**

**实现步骤：**
1. 复制原数组，避免修改原数据
2. 从数组末尾开始遍历
3. 每次随机选取一个 0 到当前位置的索引
4. 交换当前元素和随机选中的元素
5. 重复直到遍历完成

```javascript
function shuffleArray(array) {
  const arr = [...array]; // 不修改原数组
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 使用
const data = [1, 2, 3, 4, 5];
const shuffled = shuffleArray(data);
// 直接渲染 shuffled 数组即可
```

**方案二：sort 方法（简单但不推荐）**

**实现步骤：**
1. 复制原数组
2. 使用 sort 方法，传入随机比较函数
3. 比较函数返回 -0.5 到 0.5 的随机值

```javascript
const shuffled = [...array].sort(() => Math.random() - 0.5);
```

**注意事项：**
- Fisher-Yates 时间复杂度 O(n)，分布均匀，是标准做法
- sort 方法虽然简单，但洗牌不均匀，不适合要求严格的场景
- 如果是 React 列表渲染，记得给每项加唯一 key

### 5、如何封装一个通用的组件？

**封装原则：**

1. **单一职责** - 组件只做一件事，功能明确
2. **可配置性** - 通过 props 控制行为和样式
3. **插槽支持** - 预留插槽增强灵活性
4. **事件透传** - 向外暴露关键事件
5. **文档完善** - 说明使用方式和 props 说明

**示例：通用按钮组件**
```vue
<template>
  <button
    :class="['btn', `btn-${type}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'primary' }, // primary/secondary/danger
  disabled: { type: Boolean, default: false }
})
defineEmits(['click'])
</script>

<style scoped>
.btn { /* ... */ }
.btn-primary { /* ... */ }
</style>
```

**使用技巧：**
- 从业务中抽取共性，逐步沉淀通用组件
- 先有使用场景，再做封装，避免过度设计
- 保持简单，复杂的业务场景用组合组件解决

### 6、如何封装项目的通用逻辑？以 vue3 项目为例

**封装方式：**

1. **Composables（组合式函数）**
   ```js
   // useRequest.js - 封装请求逻辑
   import { ref } from 'vue'
   import axios from 'axios'

   export function useRequest(url) {
     const data = ref(null)
     const loading = ref(false)
     const error = ref(null)

     const fetch = async () => {
       loading.value = true
       try {
         const res = await axios.get(url)
         data.value = res.data
       } catch (e) {
         error.value = e
       } finally {
         loading.value = false
       }
     }

     return { data, loading, error, fetch }
   }

   // 使用
   const { data, loading, fetch } = useRequest('/api/users')
   ```

2. **工具函数（utils）**
   ```js
   // format.js - 格式化工具
   export const formatDate = (date) => { /* ... */ }
   export const formatMoney = (num) => { /* ... */ }
   ```

3. **全局指令（Directives）**
   ```js
   // v-focus.js
   export const focus = {
     mounted: (el) => el.focus()
   }
   ```

4. **全局插件（Plugins）**
   ```js
   // app.config.globalProperties.$message = showMessage
   ```

**组织结构：**
```
src/
├── composables/      # 组合式函数
├── utils/            # 纯函数工具
├── directives/       # 全局指令
└── plugins/          # 全局插件
```

**原则：**
- 单一职责，每个模块只做一件事
- 做好输入输出参数定义和类型提示
- 提供使用示例和文档


### 7、Vue 中的 diff算法

**核心思路：**
对比新旧虚拟 DOM 树，找出差异，最小化 DOM 操作。

**Diff 过程：**

1. **同层比较** - 只比较同一层级的节点，不跨层级
2. **类型判断** - 节点类型不同直接替换，不再比较子节点
3. **Key 优化** - 通过 key 判断节点是否可复用，提高 diff 效率
4. **双端比较** - Vue2 使用双端指针优化列表 diff

**为什么要用 key？**
```js
// 没有 key：Vue 按位置复用，可能错误更新
// 有 key：Vue 按 key 匹配，正确更新
```
- 唯一标识节点，避免不必要的 DOM 创建和销毁
- 列表渲染时必须用稳定唯一的 key（避免用 index）

**Vue3 优化：**
- 静态提升 - 静态节点提前提取，不参与 diff
- 补丁标记 - 记录节点变化类型，只更新变化部分
- 长子序列优化 - 最长递增子序列算法，最小化移动操作

### 8、大数据量表格渲染的解决方法有哪些？简要回答

**1. 分页加载**
- 按页请求数据，一次只渲染当前页
- 简单有效，适合需要翻页的场景

**2. 虚拟滚动**
- 只渲染可视区域内的行，滚动时动态替换
- 减少节点数量，支持万级数据流畅滚动
- 可用库：vue-virtual-scroller、react-window

**3. 延迟渲染/懒加载**
- 首屏只渲染部分数据，滚动到底部加载更多
- 适合无限滚动场景

**4. 按需展开**
- 默认只渲染折叠行，点击展开才渲染详情
- 减少初始渲染压力

**5. Web Worker**
- 将大数据处理放到 Worker 线程，避免阻塞主线程
- 适合需要复杂计算的场景

### 9、如何控制页面的渲染顺序？比如说三栏布局先渲染中间的部分

**HTML 顺序控制 DOM 结构：**
```html
<!-- 中间栏放在最前面，先渲染 -->
<div class="container">
  <main>中间内容</main>
  <aside class="left">左侧</aside>
  <aside class="right">右侧</aside>
</div>
```

**CSS 调整布局顺序：**

**方案一：Flexbox + order**
```css
.container {
  display: flex;
}
.left { order: 1; }
main { order: 2; }
.right { order: 3; }
```

**方案二：Grid + grid-template-areas**
```css
.container {
  display: grid;
  grid-template-areas: "left main right";
  grid-template-columns: 200px 1fr 200px;
}
.left { grid-area: left; }
main { grid-area: main; }
.right { grid-area: right; }
```

**方案三：绝对定位**
```css
.container { position: relative; min-height: 100vh; }
.left { position: absolute; left: 0; width: 200px; }
main { margin: 0 200px; }
.right { position: absolute; right: 0; width: 200px; }
```

**推荐方案：**
Grid 布局最灵活，Flexbox 适合简单场景，绝对定位兼容性好但不推荐。

**SEO 优势：**
重要内容（中间栏）HTML 排在前面，搜索引擎优先抓取。



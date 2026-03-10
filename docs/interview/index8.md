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
- 滚动时重新计算所有行的偏移位置和总高度

**核心代码：**

```js
// 预估高度 + 动态缓存的虚拟列表
class VirtualList {
  constructor(options) {
    this.data = options.data || [];
    this.estimatedItemHeight = options.estimatedItemHeight || 50; // 预估高度
    this.bufferSize = options.bufferSize || 3; // 缓冲数量

    // 缓存每行的真实高度
    this.heights = new Map(); // key: index, value: height
    // 缓存每行的偏移位置
    this.positions = [];
  }

  // 计算所有行的位置
  calculatePositions() {
    let offsetTop = 0;
    this.positions = this.data.map((item, index) => {
      const height = this.heights.get(index) || this.estimatedItemHeight;
      const pos = { index, offsetTop, height };
      offsetTop += height;
      return pos;
    });
    // 总高度
    this.totalHeight = offsetTop;
  }

  // 获取可见区域的起始和结束索引
  getVisibleRange(scrollTop) {
    const startIndex = this.binarySearch(0, this.data.length - 1, scrollTop);
    const start = Math.max(0, startIndex - this.bufferSize);
    const end = Math.min(this.data.length - 1, startIndex + this.visibleCount + this.bufferSize);
    return { start, end };
  }

  // 二分查找快速定位
  binarySearch(low, high, target) {
    while (low <= high) {
      const mid = (low + high) >> 1;
      const pos = this.positions[mid];
      if (pos.offsetTop + pos.height < target) {
        low = mid + 1;
      } else if (pos.offsetTop > target) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    return low;
  }

  // 行渲染完成后调用，更新真实高度
  updateItemHeight(index, height) {
    if (this.heights.get(index) !== height) {
      this.heights.set(index, height);
      this.calculatePositions(); // 重新计算位置
    }
  }
}

// 使用示例
const virtualList = new VirtualList({
  data: Array.from({ length: 1000 }, (_, i) => ({ id: i, content: `第 ${i} 行` })),
  estimatedItemHeight: 60
});
virtualList.calculatePositions();

// 渲染行时记录ref并更新高度
function Item({ item, index, style }) {
  const itemRef = useRef(null);

  useEffect(() => {
    // 渲染后测量真实高度并缓存
    if (itemRef.current) {
      const height = itemRef.current.getBoundingClientRect().height;
      virtualList.updateItemHeight(index, height);
    }
  }, []);

  return (
    <div style={style} ref={itemRef}>
      {item.content}
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

### 3、vue2 项目如何迁移到 vue3？

**迁移步骤：**

1. **使用迁移工具**
   ```bash
   npm install @vue/compat
   ```
   开启兼容模式，逐步替换旧 API

2. **升级核心依赖**
   - vue2.x → vue3.x
   - vue-router3 → vue-router4
   - vuex3 → vuex4 或 pinia
   - element-ui → element-plus

3. **替换破坏性语法**
   - `new Vue()` → `createApp()`
   - 生命周期：`beforeDestroy` → `beforeUnmount`
   - 全局 API：`Vue.use()` → `app.use()`
   - `v-model`：`.sync` 修饰符 → `v-model:prop`

4. **组合式 API 重构**
   - Option API → Composition API
   - data/methods → setup() 函数
   - 使用 ref/reactive 管理响应式数据

5. **其他调整**
   - 移除 `过滤器`，改用计算属性或方法

**最佳实践：**
- 小项目直接重写，大项目分模块渐进式迁移
- 新功能用 Vue3 写，旧功能逐步重构


### 4、ESLint 和 prettier 冲突的解决

**冲突原因：**
ESLint 和 Prettier 都有代码格式化功能，但两者的规则存在重叠且不完全一致：
- ESLint 的格式化规则（如 `vue/html-indent`）和 Prettier 的缩进规则可能冲突
- 同时运行时，两者会互相干扰，导致格式化结果不确定

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


::: code-group
```js [Webpack 配置]
// ========== Webpack 配置 (webpack.config.js) ==========
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 1. 入口和出口配置
  entry: './src/index.js',             // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash].js',  // 加哈希解决缓存
    publicPath: '/',                    // CDN 前缀
    clean: true,                        // 清理输出目录
  },

  // 2. 开发服务器配置
  devServer: {
    port: 3000,
    hot: true,                          // 热更新
    proxy: {                            // 代理解决跨域
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },

  // 3. 路径别名配置
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 4. Loader 配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  // 5. 插件配置
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],

  // 6. 构建优化
  optimization: {
    splitChunks: {                      // 代码分割
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

``` js [Vite 配置]
// ========== Vite 配置 (vite.config.js) ==========
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // 1. 入口和出口配置
  build: {
    outDir: 'dist',                    // 输出目录
    assetsDir: 'assets',               // 静态资源目录
    rollupOptions: {
      output: {
        // 入口文件名加哈希，解决缓存问题
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
      }
    }
  },

  // 2. 开发服务器配置
  server: {
    port: 3000,                        // 端口号
    proxy: {                           // 代理配置，解决跨域
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },

  // 3. 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // @ 代表 src 目录
    }
  },

  // 4. 环境变量
  envPrefix: 'VITE_',                   // 环境变量前缀
})
```
:::

**常用配置项：**

**1. 入口和出口配置**
- `entry`配置入口文件路径
- `output`配置输出文件名、路径、CDN 前缀

**2. 开发服务器配置**
- 配置端口、代理接口解决跨域
- 热更新（HMR）配置

**3. 路径别名**

使用`@`替代相对路径

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

**Code Review 流程：**

```text
开发完成 → 发起 PR → 自动化检查 → 代码评审 → 修改/合并
         ↓           ↓           ↓
      自测通过    CI 流水线    至少1人 review
```
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
- 与后端对齐接口文档，使用 Swagger 或 Apifox
- 与设计师确认 UI/UX 细节，使用 Figma/蓝湖 等协作工具
- 内部搭建组件库和工具函数库，避免重复造轮子
- 定期组织技术分享会，提升团队整体技术水平

**实际成果：**
- 将项目首屏加载时间优化了 40%
- 搭建了内部组件库，提升开发效率 30%
- 带领 5 人前端团队按时交付了 3 个大型项目
- 建立了完善的代码规范和文档体系，降低新人上手成本

### 9、前端监控与错误日志

**场景**：线上应用需要实时监控报错、用户行为、性能指标，以便快速定位问题和优化体验。  
**解决方案**：
- **错误捕获**：
  - `window.onerror` / `window.addEventListener('error')` 捕获 JS 运行时错误。
  - `unhandledrejection` 捕获未处理的 Promise 错误。
  - Vue/React 框架错误边界（ErrorBoundary）捕获组件渲染错误。
- **性能监控**：
  - 使用 Performance API 获取 FP、FCP、LCP、TTI 等指标。
  - 监听 `load` 和 `DOMContentLoaded` 时间。
- **用户行为追踪**：埋点记录 PV/UV、点击事件、页面跳转、API 请求耗时与状态。
- **数据上报**：
  - 使用 `navigator.sendBeacon` 保证页面卸载时数据也能发送。
  - 合并上报、限频，避免影响业务请求。
- **SourceMap 解析**：生产环境上传 SourceMap 到监控平台，将压缩代码错误还原为源码位置。
- **告警策略**：设置错误阈值，触发邮件/钉钉/企业微信通知。


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

**核心概念**：二维布局系统，可同时控制行和列

**基本语法**：
```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 三列等宽 */
    grid-template-rows: 100px auto;     /* 两行 */
    gap: 20px;                          /* 间距 */
}
```

**常用属性**：
- `grid-template-columns/rows`：定义行列（支持 `fr`、`repeat()`、`minmax()`）
- `gap`：单元格间距
- `grid-area`：指定单元格位置
- `justify-content`：主轴方向（水平）整体对齐，控制列在容器中的水平分布位置
- `align-content`：交叉轴方向（垂直）整体对齐，控制行在容器中的垂直分布位置

**优势**：
- 比Flex更强大，适合复杂布局
- 代码简洁，无需嵌套
- 响应式友好

**典型应用**：网页整体布局、图片网格、仪表盘

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

1. **从后向前遍历**：从数组最后一个位置开始，逐步向前遍历
2. **生成随机索引**：在 [0, i] 范围内生成随机整数 j
3. **交换元素**：将当前位置 i 与随机位置 j 的元素交换
4. **重复执行**：直到遍历完所有位置

**面试回答要点：**
- 核心思想是**每次从待排序元素中随机选一个与当前元素交换**
- 每个元素最终位于每个位置的概率都是 1/n，满足均匀分布
- 时间复杂度 O(n)，空间复杂度 O(1)

**代码示例**
```javascript
function shuffleArray(array) {
  // 1. 复制原数组，避免修改原数据（保持数据不可变性）
  const arr = [...array];
  
  // 2. 从数组最后一个位置开始向前遍历
  for (let i = arr.length - 1; i > 0; i--) {
    // 3. 生成 0 到 i 之间的随机整数（包括 0 和 i）
    // 这里的随机范围确保每个元素都有机会被交换到前面
    const j = Math.floor(Math.random() * (i + 1));
    
    // 4. 交换当前位置 i 和随机位置 j 的元素
    // 使用解构赋值实现值的交换，无需临时变量
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  // 5. 返回打乱后的新数组
  return arr;
}

// 使用示例
const data = [1, 2, 3, 4, 5];
const shuffled = shuffleArray(data);
// 输出例如: [3, 1, 5, 2, 4]（每次运行结果不同）
console.log(shuffled);
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

### 5、前端组件的设计思想有哪些？以表格组件为例

**核心设计思想：**

**1. 单一职责**
- 组件只做一件事，表格组件只负责数据展示
- 复杂功能拆分：Table 容器、TableHeader 表头、TableRow 行、TableCell 单元格

**2. 可配置性（Props 驱动）**
```js
<Table
  :columns="columns"      // 列配置
  :data="data"            // 数据源
  :loading="loading"      // 加载状态
  :pagination="pagination" // 分页配置
  :rowKey="id"            // 行唯一标识
/>
```

**3. 可扩展性（插槽机制）**
```js
<Table>
  <template #headerCell="{ column }">
    <!-- 自定义表头 -->
  </template>
  <template #bodyCell="{ record, column }">
    <!-- 自定义单元格内容 -->
  </template>
</Table>
```

**4. 事件通信**
- 组件内部状态不对外暴露，通过事件通知父组件
- `@change` 分页变化、`@sort` 排序、`@select` 行选择

**5. 受控与非受控**
- 受控：父组件传入 value，完全控制组件状态
- 非受控：组件内部维护状态，初始值通过 defaultValue 传入

**6. 性能优化**
- 虚拟滚动处理大数据量
- 分页减少渲染压力
- 列冻结/列宽拖拽等复杂功能按需加载

### 6、Vue 中的 diff算法原理

**核心思路：**
对比新旧虚拟 DOM 树，找出差异，最小化 DOM 操作。

**Diff 过程：**

1. **同层比较** - 只比较同一层级的节点，不跨层级
2. **类型判断** - 节点类型不同直接替换，不再比较子节点
3. **Key 优化** - 通过 key 判断节点是否可复用，提高 diff 效率
4. **双端比较** - Vue2 使用双端指针优化列表 diff（从两端向中间比较）

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

### 7、大数据量表格渲染的解决方法有哪些？

**核心思路：减少 DOM 节点数量，只渲染可视区域数据**

**解决方案：**

1. **虚拟滚动**
   - 只渲染可视区域的行（20-30 行）
   - 监听滚动事件，动态更新数据
   - 库：`vue-virtual-scroller`、`@tanstack/vue-virtual`

2. **分页加载**
   - 每页固定条数，减少单次渲染量
   - 结合后端分页接口

3. **数据懒加载**
   - 首次只加载前 100 条数据
   - 滚动到底部时加载更多

4. **防抖节流**
   - 滚动事件加防抖（200-300ms）
   - 减少频繁触发渲染

5. **其他优化**
   - 避免复杂的表格单元格渲染
   - 禁用响应式：使用 `Object.freeze()` 冻结数据
   - 减少不必要的计算属性和 watch


### 8、如何控制页面的渲染顺序？比如说三栏布局先渲染中间的部分

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


### 9、Vue3中的 Hooks 是什么？在项目中如何使用的？

> 💡 **通俗理解**：Hooks就是把重复的逻辑抽离成独立的函数,多个组件可以复用同一个逻辑。

#### 📦 Hooks是什么
- **本质**：就是普通的JavaScript/TypeScript函数
- **作用**：提取可复用的逻辑代码
- **优势**：相比Vue2的mixins,更清晰、类型更好、避免命名冲突

#### ⚡ 使用场景
- **表单验证**：`useForm` 封装表单逻辑
- **网络请求**：`useRequest` 封装API调用
- **权限控制**：`usePermission` 封装权限判断
- **弹窗管理**：`useModal` 封装弹窗开关

#### 🎯 实际例子
```javascript
// 封装一个获取列表的Hook
import { ref } from 'vue'

export function useList(api) {
  const list = ref([])
  const loading = ref(false)

  const fetch = async () => {
    loading.value = true
    list.value = await api()
    loading.value = false
  }

  return { list, loading, fetch }
}

// 在组件中使用
const { list, loading, fetch } = useList(getUserList)
```

#### 💡 为什么用Hooks
- **代码复用**：不用重复写同样的逻辑
- **逻辑清晰**：相关代码聚合在一起,易维护
- **类型友好**：TypeScript支持完美

### 10、微前端架构是什么？如何使用

> 💡 **通俗理解**：把一个大项目拆成多个小项目独立开发、部署,最后组合成一个完整应用。

#### 📦 微前端是什么
- **核心思想**：将一个大型前端应用拆分成多个独立的子应用
- **特点**：每个子应用可以独立开发、独立部署、独立运行
- **优势**：解决巨型项目维护难、协作冲突、发布慢的问题

#### ⚡ 常见技术方案

**1. qiankun（蚂蚁金服）**
- 基于single-spa封装,开箱即用
- 支持Vue、React、Angular混用
- JS沙箱隔离,样式隔离完善
- 主应用/子应用架构清晰

**2. 微前端框架对比**
| 方案 | 特点 | 适用场景 |
|------|------|----------|
| qiankun | 成熟稳定,文档完善 | 大型企业应用 |
| Module Federation | Webpack5原生支持 | 新项目,技术栈统一 |
| iframe | 最简单 | 快速方案,隔离性强 |

#### 🎯 实际使用步骤（qiankun）

```javascript
// 主应用注册子应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: '子应用1',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/app1'
  }
])

start()
```

```javascript
// 子应用导出生命周期
export async function bootstrap() {}
export async function mount(props) {}
export async function unmount(props) {}
```

#### 💡 什么时候用微前端
- **项目太大**：团队超过20人,一个仓库难以协作
- **技术栈不同**：部分用Vue,部分用React
- **独立部署**：不同业务线需要独立发布
- **历史项目改造**：旧项目逐步迁移到新架构

::: tip 📚 个人经验
我之前的B端管理系统就是用qiankun拆分的,用户管理、订单管理、权限管理都是独立的子应用,开发互不影响,发布各自负责,效率提升明显。
:::
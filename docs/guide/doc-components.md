---
outline: deep
---

# 文档组件使用示例

本站内置了一组面向前端技术文档的展示与交互组件，参照 [Vue.js 官方文档](https://cn.vuejs.org/guide/introduction.html) 的思路，把「术语解释、自测折叠、步骤编排、方案对比、全站偏好切换」这些高频阅读场景封装成可复用组件。

所有组件都在 `docs/.vitepress/theme/index.js` 里通过 `enhanceApp` 全局注册，因此 **Markdown 中直接写标签即可，不需要 `import`**。样式全部基于 VitePress 主题变量，自动适配暗色模式。

::: tip 适用读者
如果你要新增技术文档，可以直接复用下面的组件；如果要新增组件，参考文末的扩展约定。
:::

## 组件一览

| 组件 | 用途 | 典型页面 |
| --- | --- | --- |
| `TermTip` | 行内术语解释浮卡 | 前端基础、概念笔记 |
| `AnswerReveal` | 答案 / 解析折叠，自测后再展开 | 面试题、手写代码 |
| `Steps` | 带序号与连接线的操作步骤 | 项目实战、环境搭建 |
| `Compare` | 双栏方案对比 | Vue2 / Vue3、React / Vue |
| `PreferenceSwitch` + `PreferencePanel` | 全站代码风格偏好联动 | Vue 系列教程 |

## 一、TermTip 术语解释

技术文档里概念密集，读者遇到陌生术语往往需要跳出当前页面去搜索。`TermTip` 把解释放在行内浮卡中，支持鼠标悬停、键盘聚焦和点击（触屏）三种触发方式。

| Prop | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `term` | `string` | 是 | 行内显示的术语 |
| `definition` | `string` | 是 | 浮卡中的解释文字 |
| `href` | `string` | 否 | 浮卡底部「查看文档」外链 |

用法：

```vue
在 JavaScript 中，<TermTip term="闭包" definition="函数与其定义时所在词法环境的组合，使函数可以访问外部作用域的变量。" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures" /> 是高频考点。
```

效果（把鼠标移到下面的术语上）：

在 JavaScript 中，<TermTip term="闭包" definition="函数与其定义时所在词法环境的组合，使函数可以访问外部作用域的变量。" href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures" /> 是高频考点。

## 二、AnswerReveal 答案折叠

面试题场景适合「先自己想，再看答案」。`AnswerReveal` 默认收起，点击后以高度过渡展开；`points` 用于罗列要点，默认插槽可放自定义内容。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `点击查看答案` | 收起时的按钮文案 |
| `openTitle` | `string` | `收起答案` | 展开时的按钮文案 |
| `points` | `string[]` | `[]` | 答案要点列表 |
| `defaultOpen` | `boolean` | `false` | 是否默认展开 |

用法：

```vue
<AnswerReveal title="点击查看：事件循环的输出顺序" :points="['同步任务先执行', '微任务在本次事件循环末尾清空', '宏任务进入下一轮']" />
```

效果：

<AnswerReveal title="点击查看：事件循环的输出顺序" :points="['同步任务先执行', '微任务在本次事件循环末尾清空', '宏任务进入下一轮']" />

::: warning 插槽内容不解析 Markdown
组件标签之间写的内容会按 Vue 模板处理，不会经过 Markdown 渲染。富文本建议通过 `points` 等数组 prop 传入，或在插槽里直接写 HTML。
:::

## 三、Steps 操作步骤

教程类文档常需要「第一步、第二步」。`Steps` 提供序号圆点、步骤连接线，并可用 `current` 高亮当前所处步骤。

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `steps` | `(string \| { title, desc })[]` | 必填 | 步骤数组，字符串或对象 |
| `current` | `number` | `0` | 高亮第几步（从 1 开始），`0` 为不高亮 |

用法：

```vue
<Steps :current="2" :steps="[{ title: '创建项目', desc: 'npm create vite@latest' }, { title: '安装依赖', desc: 'npm install' }, { title: '启动服务', desc: 'npm run dev' }]" />
```

效果：

<Steps :current="2" :steps="[{ title: '创建项目', desc: 'npm create vite@latest' }, { title: '安装依赖', desc: 'npm install' }, { title: '启动服务', desc: 'npm run dev' }]" />

## 四、Compare 方案对比

前端文档里大量内容是「两种写法 / 两个版本」的对照，双栏比纯文字表格更易扫读。`Compare` 在窄屏下会自动堆叠为单栏。

| Prop | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `left` | `{ title: string, items: string[] }` | 是 | 左栏（对照项） |
| `right` | `{ title: string, items: string[] }` | 是 | 右栏（推荐项，主色高亮） |
| `caption` | `string` | 否 | 图注 |

用法：

```vue
<Compare :left="{ title: 'Options API', items: ['按 data / methods / computed 分块', '通过 this 访问实例', '逻辑分散在多个选项中'] }" :right="{ title: 'Composition API', items: ['按功能聚合在 setup 中', '直接使用响应式变量', '可用 composable 复用逻辑'] }" caption="Vue 组件逻辑的两种组织方式" />
```

效果：

<Compare :left="{ title: 'Options API', items: ['按 data / methods / computed 分块', '通过 this 访问实例', '逻辑分散在多个选项中'] }" :right="{ title: 'Composition API', items: ['按功能聚合在 setup 中', '直接使用响应式变量', '可用 composable 复用逻辑'] }" caption="Vue 组件逻辑的两种组织方式" />

## 五、PreferenceSwitch + PreferencePanel 全站偏好联动

这是参照 Vue.js 官方文档「API 风格偏好」设计的一组组件：切换一次，**同一页面所有 `PreferencePanel` 同步变化**；选择写入 `localStorage`，跳到其它页面再回来仍然保留。适合 Vue2 / Vue3、Options / Composition 这类需要全站统一展示口径的系列教程。

| 组件 / Prop | 类型 | 说明 |
| --- | --- | --- |
| `PreferenceSwitch` | 无 prop | 切换器，一般放在章节开头 |
| `PreferencePanel.options` | `string` | 选项式偏好下显示的文案 |
| `PreferencePanel.composition` | `string` | 组合式偏好下显示的文案 |

用法：

```vue
<PreferenceSwitch />

<PreferencePanel options="选项式 API：在 data 中声明 count，在 methods 中定义 increment。" composition="组合式 API：用 ref(0) 声明 count，直接定义 increment 函数。" />
```

效果（点击切换，观察下面两个面板同时变化）：

<PreferenceSwitch />

<PreferencePanel options="选项式 API：在 data 中声明 count，在 methods 中定义 increment。" composition="组合式 API：用 ref(0) 声明 count，直接定义 increment 函数。" />

<PreferencePanel options="选项式：逻辑按选项拆分，复用依赖 mixins。" composition="组合式：逻辑按功能聚合，复用依赖 composable 函数。" />

::: tip 实现要点
偏好状态放在 `theme/composables/useApiPreference.js` 的模块级 `ref` 中，VitePress 客户端是 SPA，因此跨页面保持；`localStorage` 的读取放在 `onMounted` 之后，避免 SSG 服务端渲染与水合结果不一致。需要更复杂的联动时，可在自己的组件里 `useApiPreference()` 读取当前值。
:::

## 扩展约定

新增组件时建议遵循以下约定，保证与现有文档体系一致：

1. 组件放在 `docs/.vitepress/theme/components/`，并在 `theme/index.js` 的 `enhanceApp` 中注册，Markdown 才能直接使用标签。
2. 颜色统一用 VitePress 变量（`--vp-c-brand-1`、`--vp-c-bg-soft`、`--vp-c-divider`、`--vp-c-text-1/2/3`），不要写死颜色，以自动适配暗色模式。
3. 交互元素用原生 `button` 并补齐 `aria-expanded` / `aria-pressed`，保证键盘可达。
4. 需要浏览器 API（`localStorage`、`window`）时放在 `onMounted` 或判断 `inBrowser`，VitePress 会为每个页面做服务端渲染。
5. 需要展示富文本时优先用数组 / 对象 prop；组件插槽内的内容不会经过 Markdown 解析。

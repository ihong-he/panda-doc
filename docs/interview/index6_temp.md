---
outline: deep
---

# 🚀 React & Electron

::: tip 📚 面试小贴�?本文档涵盖React和Electron的核心知识点，帮你快速掌握企业面试重点！重点理解概念原理，结合代码实例加深记忆�?:::

## 📑 目录�?[[toc]]

## ⚛️ 一、React

### 1、JSX是什么？

::: info 💡 核心概念
JSX是JavaScript XML的缩写，是React提供的一种语法扩展，允许在JavaScript代码中编写类似HTML的标记�?:::

**核心特性：**
- 语法糖：最终会被编译为`React.createElement()`调用
- 类型安全：编译时检查标签是否正确闭�?- 表达能力强：可以在{}中嵌入任意JavaScript表达�?
**示例�?*
```jsx
const element = <h1>Hello, {name}!</h1>;
```

::: warning ⚠️ 注意事项
- 必须返回单个

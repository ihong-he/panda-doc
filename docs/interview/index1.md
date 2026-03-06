---
outline: deep
---

# HTML & CSS

::: tip 💡 面试小贴士
本章节涵盖HTML/CSS核心概念、布局技巧、性能优化等面试必备知识点，助你轻松应对前端技术面试！
:::


## 📑 目录表
[[toc]]

## 一、HTML基础

### 1、DOCTYPE是什么？

> 💡 **简单来说**，DOCTYPE是告诉浏览器是哪个版本的HTML来写这个网页的声明。它必须放在HTML文档的最顶部，在`<html>`标签之前。

**🎯 核心作用**：
- 告诉浏览器用哪种标准来解析和渲染页面
- 避免浏览器进入"怪异模式"，保证页面在不同浏览器中显示一致
- HTML5的DOCTYPE非常简单：`<!DOCTYPE html>`

::: warning ⚠️ 面试要点
没有DOCTYPE，浏览器可能用老版本的标准解析页面，导致样式错乱、布局问题，这是前端开发的基础常识。
:::

### 2、什么是HTML语义化？

> 📝 **定义**：语义化就是根据内容的含义选择合适的HTML标签，而不是只考虑外观效果。

**🔍 举个例子**：
- 用`<header>`、`<footer>`、`<nav>`等标签来表示页面的不同部分
- 用`<strong>`表示重要内容，用`<em>`表示强调，而不是直接用`<b>`、`<i>`

**🏢 为什么企业这么重视语义化**：
1. **🔍 SEO友好**：搜索引擎更容易理解页面结构，提升排名
2. **♿ 有利于无障碍访问**：屏幕阅读器能更好地为视障用户朗读内容
3. **🛠️ 代码维护性高**：团队协作时别人一看就懂每个区域的用途
4. **🎨 样式与结构分离**：便于后期重构和样式调整

::: tip 💼 面试回答技巧
强调语义化是现代Web开发的基础，体现了开发者的专业素养。
:::

### 🔥 3、浏览器渲染页面的过程是什么？

::: danger 🔥 高频考点
这是一个高频面试题，考察对浏览器工作原理的理解。
:::

**🔄 简单来说的渲染流程**：

1. **解析HTML** → 构建DOM树
2. **解析CSS** → 构建CSSOM树
3. **合并DOM和CSSOM** → 生成渲染树
4. **布局Layout** → 计算每个节点的几何信息
5. **绘制Paint** → 填充像素，将元素的视觉样式（颜色、边框、阴影等）绘制到位图中
6. **合成Composite** → 将各个绘制好的图层按照正确的顺序合成到最终的屏幕画面上

**⚡ 关键优化点**：
- CSS阻塞渲染，JS会阻塞HTML解析
- 重排和重绘会影响性能
- 理解这个过程有助于写出性能更好的代码

### 4、行内元素 vs 块级元素，怎么转换？

| 类型 | 📱 行内元素（inline） | 📦 块级元素（block） |
|------|----------------------|-------------------|
| **布局特性** | 不会单独占一行，和其他元素排在一行 | 独占一行，默认占满父容器宽度 |
| **尺寸设置** | 不能设置width、height，margin上下无效 | 可以设置width、height、margin等 |
| **常见标签** | `<span>`、`<a>`、`<img>`、`<strong>` | `<div>`、`<p>`、`<h1>-<h6>`、`<ul>`、`<li>` |

**🔄 转换方式**：
```css
/* 块级转行内 */
div { display: inline; }

/* 行内转块级 */
span { display: block; }

/* 两全其美：行内块 */
span { display: inline-block; }
```

> 💡 **补充**：现在还有`flex`、`grid`等显示模式，Flexbox和Grid布局在现代开发中更常用。

### 5、HTML5有哪些重要的新特性？

::: tip ✨ 革命性变化
HTML5带来了革命性变化，这些是面试官最喜欢问的：
:::

**🏷️ 新的语义化标签**：
- 结构标签：`<header>`、`<footer>`、`<nav>`、`<main>`、`<article>`、`<section>`、`<aside>`
- 让代码更有意义，利于SEO和无障碍访问

**🎬 多媒体支持**：
- `<audio>`、`<video>`标签，告别Flash时代
- 原生支持音频视频播放

**📝 表单增强**：
- 新的input类型：`email`、`date`、`number`、`tel`等
- 新属性：`placeholder`、`required`、`pattern`（正则表达式验证）等
- 内置验证功能，减少JavaScript代码

**🎨 图形和存储**：
- `<canvas>`：绘图API，可以画图、做游戏
- `localStorage`、`sessionStorage`：客户端存储
- 离线应用支持

**🚀 新API**：
- 地理定位、拖拽、WebSocket等

::: tip 💬 面试重点
HTML5让Web应用变得更强大，减少了对第三方插件的依赖。
:::

### 6、Cookie vs LocalStorage vs SessionStorage

> 📊 **重要对比表格**，面试时直接说：

| 特性 | 🍪 Cookie | 💾 LocalStorage | 📋 SessionStorage |
|------|----------|----------------|------------------|
| **大小限制** | 4KB左右 | 5-10MB | 5-10MB |
| **生命周期** | 可设置过期时间 | 永久保存（除非手动清除） | 仅当前标签页有效 |
| **作用域** | 同域名下所有窗口 | 同源下所有页面 | 仅当前标签页 |
| **HTTP请求** | 每次都会自动携带 | 不会 | 不会 |
| **安全性** | 相对较低，易被劫持 | 较安全 | 较安全 |

**🎯 实际应用场景**：
- **🍪 Cookie**：用户登录状态、购物车信息、个性化设置
- **💾 LocalStorage**：用户偏好设置、离线数据缓存
- **📋 SessionStorage**：表单数据临时保存、页面间数据传递

::: info 💡 面试回答技巧
现在更推荐使用LocalStorage/SessionStorage，除非必须与服务器交互才用Cookie。
:::

## 二、CSS核心知识

### 1、CSS3有哪些新特性？

### 2、CSS选择器优先级

::: warning 📚 必背知识点
CSS选择器优先级，这个必须背下来！
:::

**🔥 优先级从高到低**：
1. `!important`（慎用，会让维护变得困难）
2. **内联样式** `style="color: red"`
3. **ID选择器** `#header`
4. **类选择器/属性选择器/伪类** `.class`、`[type="text"]`、`:hover`
5. **元素选择器/伪元素** `div`、`::before`
6. **通配选择器** `*`

**🧠 简单记忆法**：
- 内联 > ID > 类/属性 > 标签 > 通配
- 相同优先级时，后面的覆盖前面的
- 可以用计算器类比：内联(1000) + ID(100) + 类(10) + 标签(1)

**❓ 面试常见问题**：
```css
/* 优先级：0,0,2,0（两个类选择器） */
.nav .item { color: blue; }

/* 优先级：0,1,0,0（一个ID选择器） */  
#nav { color: red; } /* 🔴 红色会胜出 */
```


### 3、CSS3盒模型是什么？box-sizing怎么用？

> 📦 **盒模型就是网页元素的"包装盒"**，每个元素都是一个矩形盒子，从外到内包含：

**外边距（Margin）** → **边框（Border）** → **内边距（Padding）** → **内容区（Content）**

**⚖️ 两种盒模型标准**：

**🔷 标准盒模型（content-box，默认）**：
- `width`和`height`只包含内容区域
- 总宽度 = width + padding + border + margin

**🔶 IE盒模型（border-box）**：
- `width`和`height`包含内容、内边距和边框
- 总宽度 = width + margin

**💡 实际开发建议**：
```css
/* 现代开发推荐使用border-box */
*, *::before, *::after {
    box-sizing: border-box;
}
```

> ✅ **为什么推荐border-box**：计算更直观，不会因为加了padding和border而意外撑大容器。

### 🔥 4、CSS中的定位及作用

::: danger 🎯 必考题目
定位是 CSS 中控制元素位置的一种方式，通过 position 属性实现。
:::

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

### 🔥 5、Grid 网格布局

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
- `justify-content/align-content`：整体对齐

**优势**：
- 比Flex更强大，适合复杂布局
- 代码简洁，无需嵌套
- 响应式友好

**典型应用**：网页整体布局、图片网格、仪表盘


### 6、px、em、rem有什么区别？

| 单位 | 📏 px（像素） | 📐 em | 🌍 rem（root em） |
|------|-------------|-------|------------------|
| **类型** | 绝对单位，固定大小 | 相对单位，相对于父元素的字体大小 | 相对单位，相对于根元素`<html>`的字体大小 |
| **计算方式** | 固定值 | 2em = 父元素字体大小的2倍 | 1rem = html字体大小（通常设置为16px） |
| **优点** | 精确，兼容性好 | 可以整体缩放 | 全局统一，方便整体缩放 |
| **缺点** | 不利于响应式设计和用户缩放 | 嵌套时容易混乱，1.5em的1.5em不是简单乘法 | 需要计算 |

**💻 现代开发最佳实践**：
```css
/* 设置基础字体大小 */
html {
    font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    html { font-size: 14px; }
}

/* 使用rem单位 */
.container {
    width: 20rem;  /* 320px */
    margin: 1rem;  /* 16px */
}

/* 边框、阴影等固定尺寸用px */
.button {
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**面试回答技巧**：推荐使用rem配合媒体查询做响应式，px用于固定尺寸，em慎用。

### 7、元素水平垂直居中的N种方法

::: danger 🎯 面试必考题
这是面试必考题，建议掌握前3种：
:::

**1. 🌟 Flexbox方法（最推荐）**：
```css
.parent {
    display: flex;
    justify-content: center;  /* 水平居中 */
    align-items: center;      /* 垂直居中 */
}
```

**2. 🎯 Grid方法（简单优雅）**：
```css
.parent {
    display: grid;
    place-items: center;  /* 一行搞定 */
}
```

**3. 📍 绝对定位 + transform（兼容性好）**：
```css
.parent {
    position: relative;
}
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

**📋 其他方法了解即可**：
- 绝对定位 + margin（需要知道子元素尺寸）
- 表格布局（老方法，不推荐）
- line-height（仅适用于单行文本）

::: tip 💡 面试选择策略
优先说Flexbox，次选Grid，最后提transform作为兼容方案。
:::

### 8、BFC到底是什么？什么时候用？

> 🌍  **BFC（Block Formatting Context，块级格式化上下文）** 是Web页面中一个独立的渲染区域，拥有独立的布局规则：

```mermaid
graph LR
    A[BFC内部] -.隔离.-> B[BFC外部]
    C[外部元素] -.不影响.-> D[BFC内部]
```

- BFC内部元素的布局不会影响外部
- 外部元素也不会影响BFC内部
- 就像一个隔离的布局环境

**⚙️ 如何创建BFC**：
- `overflow: hidden/auto`（最常用）
- `display: flex/grid`
- `position: absolute/fixed`
- `float: left/right`

**🔧 BFC能解决什么问题**：

1. **🌊 清除浮动**：父容器加`overflow: hidden`
2. **📏 防止margin重叠**：相邻元素用一个包起来
3. **📱 两栏自适应布局**：左边浮动，右边触发BFC

::: tip 💡 面试回答技巧
BFC主要用于解决布局问题，现在有了Flexbox和Grid，BFC用的相对少了，但理解它对调试布局bug很有帮助。
:::



### 9、重绘和重排的区别？

| 类型 | 🔄 重排（Reflow/回流） | 🎨 重绘（Repaint） |
|------|---------------------|-------------------|
| **触发条件** | 元素的尺寸、位置发生改变 | 元素的外观发生改变，但位置不变 |
| **具体例子** | 修改width、height、margin、display等 | 修改color、background、visibility等 |
| **影响范围** | 重新计算整个页面的布局 | 只需要重新绘制受影响的区域 |
| **性能消耗** | 消耗很大，要尽量避免 | 消耗相对较小 |


### 11、如何实现一个三栏布局？

::: danger 🎯 必考题目
三栏布局是网页经典布局，左右固定、中间自适应，现代开发优先用 Flexbox 或 Grid
:::

**1. 🌟 Flexbox方案（最推荐）**：

使用 `display: flex` 创建弹性布局，左右两侧固定宽度，中间部分通过 `flex: 1` 自动占据剩余空间。
```css
.container {
    display: flex;
}
.left, .right {
    width: 200px;
    flex-shrink: 0; /* 禁止收缩，保持固定宽度 */
}
.main {
    flex: 1; /* 自动占据剩余空间 */
}
```

**2. 🎯 Grid方案**：

使用 `display: grid` 创建网格布局，通过 `grid-template-columns: 200px 1fr 200px` 定义三列，其中 `1fr`单位让中间列自动填充剩余空间。
```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
}
```

**3. 🏛️ 圣杯布局（经典面试题）**：
- 左右栏浮动，中间栏margin
- 利用负margin和relative定位


### 12、CSS预处理器是什么？

> 💡 **简单来说**，CSS预处理器就是用编程的方式写样式，最后编译成浏览器能识别的CSS代码。

**🎯 常见工具**：
- Sass/SCSS（最流行）
- Less
- Stylus

**✨ 主要作用**：
1. **变量**：定义颜色、字体等，一处修改全局生效
2. **嵌套**：子样式写父样式内部，结构更清晰
3. **混合（Mixin）**：封装常用样式，按需复用
4. **函数和运算**：支持数学计算
5. **模块化**：拆分文件，便于维护

**💼 面试回答**：CSS本身很死板，预处理器让CSS有了编程能力，开发效率更高，代码更易维护。



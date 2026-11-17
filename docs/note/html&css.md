---
outline: deep
---

# HTML 与 CSS 基础

这篇笔记从「浏览器如何读懂一个网页」出发，覆盖 HTML 结构、CSS 选择器与布局，一直讲到 HTML5 / CSS3 的新能力。既可以作为入门的第一份教材，也适合有经验的开发者回来查漏补缺。

::: tip 怎么读这篇文档
文中带虚线的**术语卡**可悬停查看解释，**自测折叠**建议先自己想再看答案，**交互演示**可以直接拖参数观察变化。不同基础选不同读法：
:::

<Steps :steps="[{ title: '刚入门：按顺序读', desc: '先建立「结构 + 样式」的整体印象，重点是标签、选择器与盒模型。' }, { title: '有经验：跳到难点', desc: '优先看 CSS 三大特性、定位、浮动与 Flex，顺手做文末自测题。' }, { title: '复习 / 面试：只看对比与自测', desc: '用对比表和自测题快速定位知识盲区。' }]" />

<Compare :left="{ title: 'HTML 负责「是什么」', items: ['标签描述内容的语义与层级', '表单、表格、多媒体提供原生能力', '浏览器据此构建 DOM 树', '语义化影响可访问性与 SEO'] }" :right="{ title: 'CSS 负责「长什么样」', items: ['选择器决定样式作用到哪些元素', '层叠与权重决定冲突时谁生效', '盒模型、定位、Flex 决定空间分配', '响应式让同一份结构适配不同屏幕'] }" caption="先分清职责，后面的概念会更容易定位" />

## 一、HTML

### 1、什么是HTML

HTML（HyperText Markup Language，超文本标记语言）是一种用于创建和结构化网页内容的标准标记语言。它是构建网页的基础，定义了网页的基本结构和内容。HTML使用标签（tags）来标记文本和其他元素，以告诉浏览器如何显示这些内容。

#### HTML的基本概念

1. **元素（Element）**：
   - 由开始标签和结束标签包裹的内容构成。
   - 例如：`<p>This is a paragraph.</p>`。

2. **标签（Tag）**：
   - 用于标记HTML元素的名称，通常成对出现，包括开始标签和结束标签。
   - 例如：`<h1>`, `</h1>`。

3. **属性（Attribute）**：
   - 提供关于HTML元素的附加信息，通常在开始标签中指定。
   - 例如：`<a href="https://www.example.com">Link</a>`中的`href`属性。

4. **嵌套（Nesting）**：
   - HTML元素可以包含其他HTML元素，形成嵌套结构。
   - 例如：
     ```html
     <div>
       <p>This is a paragraph inside a div.</p>
     </div>
     ```

#### HTML的基本结构

一个典型的HTML文档包含以下基本结构：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>This is a heading</h1>
  <p>This is a paragraph.</p>
  <a href="https://www.example.com">This is a link</a>
</body>
</html>
```

**解释**：

1. `<!DOCTYPE html>`：声明文档类型，告知浏览器这是一个HTML5文档。
2. `<html>`：HTML文档的根元素。
3. `<head>`：包含元数据（metadata），如文档的标题（title）、字符集（charset）等。
4. `<title>`：定义文档的标题，显示在浏览器的标题栏或标签页上。
5. `<body>`：包含文档的主要内容，如标题、段落、链接、图像等。

#### 常见的HTML标签

- **标题标签**：`<h1>`到`<h6>`，表示不同级别的标题。
- **段落标签**：`<p>`，表示段落。
- **链接标签**：`<a>`，表示超链接。
- **图像标签**：`<img>`，表示图像。
- **列表标签**：`<ul>`（无序列表）、`<ol>`（有序列表）、`<li>`（列表项）。

HTML是网页开发的核心之一，与CSS（层叠样式表）和JavaScript一起构成了前端开发的三大基础技术。通过学习和掌握HTML，开发者可以创建结构良好、语义清晰的网页内容。

### 2、HTML的语义化

​	HTML语义化是指用合理的HTML标记以及其特有的属性去格式化文档内容。（例如标题用 h1-h6、段落用 p 标签，合理得给图片添加alt属性等）

语义化（<Pronounce word="Semantic" />）不只是「把 div 换成 header」，它让结构本身携带含义：

<Compare :left="{ title: '只用 div（div 汤）', items: ['全靠 class 名猜测区域用途', '辅助技术无法识别导航与主内容', '层级只能靠缩进和注释表达', '改样式时结构含义容易一起丢失'] }" :right="{ title: '语义化标签', items: ['header / nav / main / article 自带含义', '屏幕阅读器可直接定位 landmark', '标题层级与文档大纲天然对应', '结构稳定，样式重构不影响含义'] }" caption="语义化不是「标签换名字」，而是让结构自带含义" />

::: tip 一句话记住
写 HTML 时先问「这段内容是什么」，而不是「它要长什么样」；外观交给 CSS。
:::

### 3、浏览器及内核
浏览器的内核决定了它们如何渲染和呈现网页内容，以下是常用的浏览器、使用的内核以及每个内核的简要描述：


| 浏览器           | 使用的内核          | 描述                                      |
|------------------|---------------------|-------------------------------------------|
| Google Chrome    | Blink (WebKit)      | 由Google开发，性能强大，支持丰富的扩展。   |
| Mozilla Firefox  | Gecko               | 开源浏览器，注重隐私和自由软件理念。     |
| Apple Safari     | WebKit              | 苹果公司开发，提供出色的用户体验。        |
| Microsoft Edge   | Blink (EdgeHTML)    | Windows 10的默认浏览器，以速度和安全性为重。|
| Internet Explorer| Trident (EdgeHTML)  | 微软的旧版浏览器，已不再推荐使用。        |
| Opera            | Blink (Presto)      | 原版Opera使用Presto内核，现代版使用Blink。 |


::: tip 读表时抓住一个区分
表格里的「内核」通常指 <TermTip term="渲染引擎" definition="负责解析 HTML/CSS、计算布局并绘制像素，例如 Blink、WebKit、Gecko；它和 V8、SpiderMonkey 这类 JavaScript 引擎是两回事。" />。同一浏览器往往同时包含两套引擎，面试里很容易把它们混为一谈。
:::

### 5、表格标签

HTML 中的 `<table>` 元素用于创建表格，它是一种常用的方式来展示数据和信息。以下是关于 `<table>` 表格的基本用法的总结：

1. **创建表格**：

   使用 `<table>` 标签来创建表格。

   ```html
   <table>
       <!-- 表格内容 -->
   </table>
   ```

2. **表格行和单元格**：

   - 使用 `<tr>` 标签来定义表格的行。
   - 在每行中，使用 `<td>` 标签来定义单元格（数据单元格）。
   - 使用 `<th>` 标签来定义表头单元格，通常在表格的第一行使用。

   ```html
   <table>
       <tr>
           <th>表头1</th>
           <th>表头2</th>
       </tr>
       <tr>
           <td>数据1</td>
           <td>数据2</td>
       </tr>
   </table>
   ```

3. **表格标题**：

   使用 `<caption>` 标签来定义表格的标题，通常位于表格之上。

   ```html
   <table>
       <caption>这是表格标题</caption>
       <!-- 表格内容 -->
   </table>
   ```

4. **表格边框和样式**：

   - 使用 `border` 属性来定义表格边框的大小。
   - 使用 CSS 样式来自定义表格的外观，如边框颜色、背景色等。

   ```html
   <table border="1">
       <!-- 表格内容 -->
   </table>

   <!-- 使用 CSS 样式 -->
   <style>
       table {
           border-collapse: collapse; /* 合并边框 */
       }
       th, td {
           border: 1px solid #000; /* 定义单元格边框 */
           padding: 5px; /* 单元格内边距 */
           text-align: center; /* 文本居中对齐 */
       }
   </style>
   ```

5. **表格合并单元格**：

   使用 `rowspan` 和 `colspan` 属性来合并单元格，以创建跨行或跨列的单元格。

   ```html
   <table>
       <tr>
           <th rowspan="2">表头1</th>
           <th>表头2</th>
       </tr>
       <tr>
           <td>数据1</td>
           <td>数据2</td>
       </tr>
   </table>
   ```

6. **表格标题和表头**：

   - 表格标题通过 `<caption>` 定义。
   - 表头通常通过 `<th>` 定义，使其在表格中突出显示。

7. **表格内容**：

   - 表格中的数据通常通过 `<td>` 标签定义。
   - 使用多个 `<tr>` 和 `<td>` 元素创建多行和多列的表格。


表格是一个灵活且功能丰富的 HTML 元素，它可以用于各种数据展示需求。以上总结了基本的表格创建和样式化方法，但表格还有更多高级的特性和选项，可以根据具体需求进一步定制。

### 6、表单标签

常用的表单标签主要包括以下几种：

1. **`<form>`**：定义一个HTML表单，用于收集用户输入。
   ```html
   <form action="/submit" method="post">
       <!-- 表单内容 -->
   </form>
   ```

2. **`<input>`**：用于输入字段，根据`type`属性的不同，可以创建不同类型的输入控件。
   ```html
   <input type="text" name="username">
   <input type="password" name="password">
   <input type="email" name="email">
   <input type="checkbox" name="subscribe">
   <input type="radio" name="gender" value="male">
   <input type="radio" name="gender" value="female">
   <input type="submit" value="Submit">
   ```

3. **`<label>`**：用于描述表单控件的标签，提升可用性和无障碍性。
   ```html
   <label for="username">Username:</label>
   <input type="text" id="username" name="username">
   ```

4. **`<textarea>`**：多行文本输入控件。
   ```html
   <textarea name="message" rows="4" cols="50"></textarea>
   ```

5. **`<select>`**：下拉列表，`<option>`用于定义列表中的选项。
   ```html
   <select name="country">
       <option value="us">United States</option>
       <option value="ca">Canada</option>
       <option value="uk">United Kingdom</option>
   </select>
   ```

6. **`<button>`**：按钮，可以是提交按钮、重置按钮或普通按钮。
   ```html
   <button type="submit">Submit</button>
   <button type="reset">Reset</button>
   <button type="button" onclick="alert('Hello')">Click Me</button>
   ```


## 二、CSS

### 1、css选择器

CSS（层叠样式表）选择器用于选择 HTML 元素并应用样式。常用的 CSS 选择器有多种，以下是一些基本和常用的选择器类型：

#### 基本选择器

1. **元素选择器**：
   - 选择所有指定类型的元素。
   - 例如：`p { color: blue; }` 会选择所有 `<p>` 元素。

2. **类选择器**：
   - 选择所有具有指定类的元素。
   - 使用方法：在类名之前加一个点 `.`。
   - 例如：`.className { color: green; }` 会选择所有 `class="className"` 的元素。

3. **ID选择器**：
   - 选择具有特定 ID 的元素。
   - 使用方法：在 ID 名之前加一个井号 `#`。
   - 例如：`#idName { color: red; }` 会选择 ID 为 `idName` 的元素。

4. **通配符选择器**：
   - 选择所有元素。
   - 使用方法：`*`。
   - 例如：`* { margin: 0; padding: 0; }` 会选择所有元素并移除默认的外边距和内边距。

#### 组合选择器

1. **后代选择器**：
   - 选择某个元素内部的所有指定子元素。
   - 使用方法：`ancestor descendant`。
   - 例如：`div p { color: blue; }` 会选择所有在 `<div>` 内部的 `<p>` 元素。

2. **子选择器**：
   - 选择某个元素的直接子元素。
   - 使用方法：`parent > child`。
   - 例如：`ul > li { color: red; }` 会选择所有 `<ul>` 的直接子元素 `<li>`。

3. **相邻兄弟选择器**：
   - 选择紧接在另一个元素之后的兄弟元素。
   - 使用方法：`previous + next`。
   - 例如：`h1 + p { margin-top: 0; }` 会选择紧接在 `<h1>` 之后的第一个 `<p>` 元素。

4. **通用兄弟选择器**：
   - 选择所有在另一个元素之后的兄弟元素。
   - 使用方法：`previous ~ siblings`。
   - 例如：`h1 ~ p { color: green; }` 会选择所有在 `<h1>` 之后的兄弟 `<p>` 元素。

#### 属性选择器

1. **存在属性选择器**：
   - 选择包含某个属性的元素。
   - 使用方法：`[attribute]`。
   - 例如：`[title] { color: blue; }` 会选择所有包含 `title` 属性的元素。

2. **属性值选择器**：
   - 选择属性等于特定值的元素。
   - 使用方法：`[attribute=value]`。
   - 例如：`[type="text"] { color: green; }` 会选择所有 `type` 属性等于 `text` 的元素。

3. **属性值包含选择器**：
   - 选择属性值中包含特定子串的元素。
   - 使用方法：`[attribute*=value]`。
   - 例如：`[title*="hello"] { color: red; }` 会选择所有 `title` 属性中包含 `hello` 子串的元素。

#### 伪类选择器

1. **链接伪类**：
   - `:link` 选择所有未访问的链接。
   - `:visited` 选择所有已访问的链接。

2. **动态伪类**：
   - `:hover` 选择鼠标指针悬停的元素。
   - `:active` 选择被用户激活的元素。
   - `:focus` 选择获得焦点的元素。

3. **结构伪类**：
   - `:first-child` 选择父元素的第一个子元素。
   - `:last-child` 选择父元素的最后一个子元素。
   - `:nth-child(n)` 选择父元素的第 n 个子元素。

#### 伪元素选择器

1. **`::before` 和 `::after`**：
   - 在元素的内容前后插入内容。
   - 例如：
     ```css
     p::before { content: "Prefix: "; }
     p::after { content: " Suffix"; }
     ```

掌握这些选择器可以帮助你更高效地选择和样式化网页中的元素，提高开发效率和代码的可维护性。
### 2、css的显示模式

CSS中的显示模式（display mode）控制了元素在页面上的布局方式和行为。常见的CSS显示模式包括以下几种：

1. **block（块级元素）**：块级元素会在页面上独自占据一行，并从上到下依次排列。它们会尽可能地占用父容器的宽度，可以设置宽度、高度、内外边距等属性。

    示例块级元素：`<div>`, `<p>`, `<h1>`, `<ul>`, `<li>`等。

    ```css
    div {
        display: block;
    }
    ```

2. **inline（内联元素）**：内联元素不会独占一行，它们在一行内水平排列，并根据内容的大小自动调整宽度。内联元素不支持设置宽度、高度等盒模型属性。

    示例内联元素：`<span>`, `<a>`, `<strong>`, `<em>`等。

    ```css
    span {
        display: inline;
    }
    ```

3. **inline-block（内联块级元素）**：内联块级元素具有块级元素和内联元素的特性，它们在一行内水平排列，但可以设置宽度、高度等盒模型属性。

    示例内联块级元素：`<button>`, `<input>`, `<label>`, `<img>`等。

    ```css
    button {
        display: inline-block;
    }
    ```

4. **none（隐藏元素）**：元素的`display`属性设置为`none`时，元素会完全隐藏，不占用页面空间，无法与其他元素交互。

    示例：
    ```css
    .hidden-element {
        display: none;
    }
    ```

5. **flex（弹性盒子）**：弹性盒子布局允许您以更简单的方式进行水平和垂直布局。弹性容器中的子元素可以在一个方向上排列，同时自动调整其大小以填充可用空间。

    示例：
    ```css
    .flex-container {
        display: flex;
    }
    ```

6. **grid（网格布局）**：网格布局是一种更复杂的布局模式，它允许您创建多行多列的网格，以便更精确地控制元素的位置和大小。

    示例：
    ```css
    .grid-container {
        display: grid;
    }
    ```

这些是一些常见的CSS显示模式，您可以根据需要选择合适的显示模式来布局和排列页面元素。不同的显示模式适用于不同的布局需求。

### 3、css的三大特性

CSS（层叠样式表）有三个主要特性，这些特性共同作用，使得 CSS 在网页样式设计中具有强大的灵活性和控制能力：

#### **层叠性**

CSS 的层叠性是指当多个样式规则应用于同一个元素时，这些规则会按照优先级进行层叠（即叠加）和组合。浏览器会根据以下优先级规则决定最终应用的样式：

- **优先级由「选择器权重 + 书写顺序」决定，而不是样式写在哪里**：
  - 内联 `style` 权重最高（可记作 `1,0,0,0`），但仍会被带 `!important` 的普通声明覆盖。
  - `<style>` 里的内部样式与 `<link>` 引入的外部样式**属于同一层级**，没有谁天然优先；最终看选择器权重，同权重再看谁写在后面。
  - 浏览器默认样式（user agent）权重最低，任何作者样式都能覆盖它。
  - 常见权重从高到低：`!important` → 内联 → ID → 类 / 伪类 / 属性 → 元素 / 伪元素 → 通配符。

- **重要性（Specificity）**：
  - 优先级顺序：ID选择器 > 类选择器、伪类选择器 > 元素选择器、伪元素选择器。
  - 例如：`#id > .class > tag`。

- **重要声明（!important）**：
  - 使用 `!important` 可以强制某个样式规则的优先级最高。
  - 例如：`color: red !important;`。

#### **继承性**

继承性指的是某些 CSS 属性会从父元素继承到子元素。继承的属性通常是与文本和字体相关的属性，如 `color`、`font-family`、`font-size` 等。

- **可继承的属性**：
  - 例如：`color`, `font-family`, `line-height`, `text-align` 等。

- **不可继承的属性**：
  - 例如：`margin`, `padding`, `border`, `background` 等。

- **强制继承**：
  - 可以使用 `inherit` 关键字强制子元素继承父元素的某个属性。
  - 例如：`color: inherit;`。

#### **层叠顺序/优先级**

层叠顺序决定了当同一个元素有多个冲突的 CSS 声明时，哪一个声明将被应用。CSS 的层叠顺序遵循以下原则：

- **层叠层级（由低到高）**：
  - 浏览器默认样式 → 用户样式 → 作者样式（内部 `<style>` 与外部 `.css` 同层）→ 内联 `style` → `!important`。
  - 注意：内部样式表并不比外部样式表更优先，这是最常见的误区；真正起作用的是**选择器权重**和**同权重下的先后顺序**。

- **权重**：
  - ID 选择器 > 类选择器 > 标签选择器。
  - 例如：`#id {}` > `.class {}` > `tag {}`。

- **位置**：
  - 后定义的样式会覆盖先定义的样式。

- **重要性**：
  - 带有 `!important` 声明的样式具有最高优先级，甚至可以覆盖内联样式。
  - 例如：`color: red !important;` 会覆盖所有其他 `color` 声明。

**总结**

CSS 的三大特性——层叠性、继承性和层叠顺序/优先级，使得开发者可以灵活地控制网页样式，并且通过合理的样式组织和优先级控制，确保网页在不同环境和需求下都能呈现出一致且美观的样式。

**先自测一下**：下面的 `<div class="item">` 位于 `#app` 内，最终是什么颜色？

```css
#app .item { color: red; }
div.item   { color: blue; }
```

<AnswerReveal title="想好了再展开答案" :points="['答案：red（第一条生效）', '#app .item 权重 = (1,1,0)，div.item = (0,1,1)，ID 选择器权重更高', '与书写顺序无关；只有权重相同时才是后写的覆盖先写的', '把第二条改成 color: blue !important，则 blue 反过来生效']" />

### 4、外观样式
CSS常用的外观样式包括颜色、背景、字体、文本、边框和阴影等方面的样式设置。下面是一些常用的外观样式及其示例：

#### 1. 颜色 (Color)

**文本颜色**
```css
.element {
    color: #333; /* 使用十六进制颜色值 */
    color: rgb(51, 51, 51); /* 使用RGB颜色值 */
    color: rgba(51, 51, 51, 0.8); /* 使用RGBA颜色值，带透明度 */
}
```

**背景颜色**
```css
.element {
    background-color: #f0f0f0; /* 使用十六进制颜色值 */
    background-color: rgb(240, 240, 240); /* 使用RGB颜色值 */
    background-color: rgba(240, 240, 240, 0.8); /* 使用RGBA颜色值，带透明度 */
}
```

#### 2. 背景 (Background)

**背景图片**
```css
.element {
    background-image: url('image.jpg'); /* 设置背景图片 */
    background-repeat: no-repeat; /* 背景图片不重复 */
    background-size: cover; /* 背景图片按比例缩放，覆盖整个容器 */
    background-position: center; /* 背景图片居中 */
}
```

**渐变背景**
```css
.element {
    background: linear-gradient(to right, #ff7e5f, #feb47b); /* 线性渐变 */
    background: radial-gradient(circle, #ff7e5f, #feb47b); /* 放射性渐变 */
}
```

#### 3. 字体 (Font)

**字体系列**
```css
.element {
    font-family: 'Arial', sans-serif; /* 设置字体系列 */
}
```

**字体大小**
```css
.element {
    font-size: 16px; /* 设置字体大小 */
    font-size: 1em; /* 设置相对字体大小 */
}
```

**字体样式和粗细**
```css
.element {
    font-style: italic; /* 设置斜体 */
    font-weight: bold; /* 设置粗体 */
}
```

#### 4. 文本 (Text)

**文本对齐**
```css
.element {
    text-align: center; /* 文本居中对齐 */
    text-align: right; /* 文本右对齐 */
}
```

**文本装饰**
```css
.element {
    text-decoration: underline; /* 设置下划线 */
    text-decoration: line-through; /* 设置删除线 */
    text-decoration: none; /* 去除装饰 */
}
```

**文本阴影**
```css
.element {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* 设置文本阴影 */
}
```

#### 5. 边框 (Border)

**边框样式**
```css
.element {
    border: 1px solid #333; /* 设置边框宽度、样式和颜色 */
    border-top: 2px dashed #555; /* 设置顶部边框 */
    border-radius: 8px; /* 设置圆角边框 */
}
```

#### 6. 阴影 (Box Shadow)
```css
.element {
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2); /* 设置元素阴影 */
}
```

#### 7. 透明度 (Opacity)
```css
.element {
    opacity: 0.8; /* 设置元素透明度 */
}
```

### 5、盒模型

CSS盒模型（Box Model）是网页设计和布局的基础概念之一，它描述了元素占据的空间及其组成部分。盒模型包括内容、内边距（padding）、边框（border）和外边距（margin）四个主要部分。

**盒模型的组成**

1. **内容 (Content)**：
   - 这是元素的实际内容区域，如文本、图像等。可以使用 `width` 和 `height` 属性来设置其大小。

2. **内边距 (Padding)**：
   - 内边距是内容与边框之间的空白区域。内边距可以在四个方向上单独设置：`padding-top`、`padding-right`、`padding-bottom`、`padding-left`。
   - 示例：
     ```css
     .box {
         padding: 10px; /* 四个方向的内边距都设置为10px */
     }
     ```

3. **边框 (Border)**：
   - 边框是包围内容和内边距的线条。可以设置边框的宽度、样式和颜色。边框可以在四个方向上单独设置：`border-top`、`border-right`、`border-bottom`、`border-left`。
   - 示例：
     ```css
     .box {
         border: 1px solid black; /* 四个方向的边框宽度为1px，实线，黑色 */
     }
     ```

4. **外边距 (Margin)**：
   - 外边距是元素与其他元素之间的空白区域。外边距可以在四个方向上单独设置：`margin-top`、`margin-right`、`margin-bottom`、`margin-left`。
   - 示例：
     ```css
     .box {
         margin: 20px; /* 四个方向的外边距都设置为20px */
     }
     ```

**标准盒模型与替代盒/怪异盒模型**

1. **标准盒模型 (Standard Box Model)**：
   在标准盒模型中，`width` 和 `height` 属性仅指内容区域的宽度和高度，不包括内边距、边框和外边距。

   ```css
   .box {
       width: 200px;
       height: 100px;
       padding: 10px;
       border: 1px solid black;
       margin: 20px;
   }
   ```

2. **替代盒/怪异盒模型 (Alternate Box Model) (box-sizing: border-box)**：
   在替代盒模型中，`width` 和 `height` 属性包括内容、内边距和边框的总和。即，元素的总宽度和高度不会超过设置的 `width` 和 `height` 值。

   ```css
   .box {
       box-sizing: border-box;
       width: 200px;
       height: 100px;
       padding: 10px;
       border: 1px solid black;
       margin: 20px;
   }
   ```
    

上面的公式比较抽象，直接拖动滑块观察四层如何叠加；切换 `box-sizing` 可以看到两种盒模型的差别。

<BoxModelDemo />

<TermTip term="box-sizing" definition="决定 width / height 作用于内容区还是整个盒子：content-box 只算内容，border-box 含 padding 与 border。现代项目通常在全局设为 border-box。" /> 是这里最容易出错的开关，建议把两种模式各拖一遍。

### 6、css定位

CSS 定位用于在网页上准确定位元素。常见的 CSS 定位方法包括静态定位、相对定位、绝对定位和固定定位。每种定位方式都有其独特的用途和特性。

- **静态定位 (Static Positioning)**
这是默认的定位方式，元素按照文档的正常流进行排列，不需要特别指定。
```css
.element {
    position: static;
}
```

- **相对定位 (Relative Positioning)**
相对定位的元素相对于其正常位置进行偏移。即使元素被移动，它仍然占据原来的空间。
```css
.element {
    position: relative;
    top: 10px;  /* 元素向下移动10px */
    left: 20px; /* 元素向右移动20px */
}
```

- **绝对定位 (Absolute Positioning)**
绝对定位的元素相对于最近的已定位（非 static）的祖先元素进行定位。如果没有这样的祖先元素，则相对于文档根元素 (html) 进行定位。绝对定位的元素不再占据原来的空间。
```css
.container {
    position: relative;
}

.element {
    position: absolute;
    top: 50px;  /* 元素相对于其已定位祖先容器向下移动50px */
    left: 100px; /* 元素相对于其已定位祖先容器向右移动100px */
}
```

- **固定定位 (Fixed Positioning)**
固定定位的元素相对于浏览器窗口进行定位，即使页面滚动，元素的位置也不会改变。
```css
.element {
    position: fixed;
    top: 0;    /* 元素固定在浏览器窗口的顶部 */
    right: 0;  /* 元素固定在浏览器窗口的右侧 */
}
```

- **粘性定位 (Sticky Positioning)**
粘性定位结合了相对定位和固定定位的特性。元素在滚动到特定位置时变为固定定位。
```css
.element {
    position: sticky;
    top: 10px; /* 元素在距离顶部10px的位置变为固定 */
}
```
通过这些定位方式，您可以灵活地在页面上定位元素，创建复杂且美观的布局。


### 7、浮动和清除浮动

浮动（float）是CSS中的一种布局属性，它通常用于将元素从正常文档流中移动到其父元素的左侧或右侧，并允许文本和其他内容环绕它。浮动通常用于创建多列布局、图像浮动以及网页中的一些特定布局需求。以下是如何设置浮动的基本方法:

```css
.element {
    float: left; /** 左浮动 **/
}

```

要清除浮动，主要是为了解决浮动元素可能导致的父元素高度塌陷的问题。浮动的元素不会撑开其父元素的高度，这可能导致父元素无法正确包含浮动元素，进而影响页面布局。以下是一些清除浮动的常见方法：

1. **使用`clear`属性**：您可以在父元素中插入一个具有`clear`属性的空元素，以确保其下面不会有浮动元素。例如：

```html
<div style="clear: both;"></div>
```

2. **使用伪元素清除浮动**：这是一种更现代的方法，它不需要额外的HTML元素。您可以通过在父元素上应用CSS来清除浮动，如下所示：

```css
.parent::after {
    content: "";
    display: table;
    clear: both;
}
```

这将在`.parent`元素的末尾创建一个空的伪元素，用于清除浮动。

3. **使用`overflow`属性**：将父元素的`overflow`属性设置为`auto`或`hidden`也可以清除浮动。这将创建一个新的块级格式化上下文，它会包含浮动元素，从而避免高度塌陷问题。例如：

```css
.parent {
    overflow: hidden;
}
```

4. **使用`clearfix`类**：有时，您可以将一个特定的CSS类应用于父元素，该类包含清除浮动的样式规则。这是一种经常使用的约定，例如，Bootstrap框架中有一个`.clearfix`类用于清除浮动。

```css
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
```

然后，您可以将`.clearfix`类应用于需要清除浮动的父元素。

这些方法中的选择取决于您的具体需求和项目约定。清除浮动是前端开发中一个常见的问题，因为它确保了页面布局的一致性和可靠性。

### 8、Flex布局
Flexbox（Flexible Box Layout，弹性盒子布局）是一种用于布局的一维模型，可以更方便地控制元素的对齐、方向和顺序。Flexbox 主要用于一维布局，即在一个方向（行或列）上排列元素。它解决了很多传统布局方法（如浮动和定位）难以解决的问题，尤其是在需要动态调整或响应式布局时。

一句话直觉：Flex 的一切对齐都围绕两根轴——**主轴**（由 `flex-direction` 决定）和**交叉轴**（垂直于主轴）。先确定主轴方向，再看对齐属性，就不会记混。

<Compare :left="{ title: 'justify-content（主轴）', items: ['控制项目沿主轴的分布', 'flex-start / center / space-between', '主轴为 row 时表现为水平', '改变 flex-direction 后方向跟着变'] }" :right="{ title: 'align-items（交叉轴）', items: ['控制项目在交叉轴的对齐', 'stretch / center / flex-end', '主轴为 row 时表现为垂直', '与 justify-content 互不影响'] }" caption="记住「主轴 / 交叉轴」，比死记属性值更可靠" />

#### 基本概念

**Flex 容器（Flex Container）**
定义了一个 flex 容器，通过设置 `display: flex` 或 `display: inline-flex` 来创建。

```css
.container {
    display: flex;
}
```

**Flex 项目（Flex Items）**
Flex 容器中的直接子元素就是 flex 项目，一个Flex容器可以有多个Flex项目。

#### Flex 容器属性

1. **`flex-direction`**：设置主轴的方向（即项目的排列方向）。
   - `row`：默认值，水平从左到右排列。
   - `row-reverse`：水平从右到左排列。
   - `column`：垂直从上到下排列。
   - `column-reverse`：垂直从下到上排列。

   ```css
   .container {
       flex-direction: row; /* 默认值 */
   }
   ```

2. **`justify-content`**：定义项目在主轴上的对齐方式。
   - `flex-start`：默认值，项目从主轴的起点排列。
   - `flex-end`：项目从主轴的终点排列。
   - `center`：项目在主轴上居中排列。
   - `space-between`：项目之间的间隔相等，两端没有间隔。
   - `space-around`：项目之间的间隔相等，两端有半个间隔的空间。
   - `space-evenly`：项目之间的间隔相等，包括两端的空间。

   ```css
   .container {
       justify-content: center;
   }
   ```

3. **`align-items`**：定义项目在交叉轴（与主轴垂直）上的对齐方式。
   - `stretch`：默认值，项目在交叉轴上拉伸以填满容器。
   - `flex-start`：项目在交叉轴的起点对齐。
   - `flex-end`：项目在交叉轴的终点对齐。
   - `center`：项目在交叉轴上居中对齐。
   - `baseline`：项目的第一行文字的基线对齐。

   ```css
   .container {
       align-items: center;
   }
   ```

4. **`flex-wrap`**：定义是否允许项目换行。
   - `nowrap`：默认值，所有项目在一行排列。
   - `wrap`：项目在必要时换行。
   - `wrap-reverse`：项目在必要时换行，反向排列。

   ```css
   .container {
       flex-wrap: wrap;
   }
   ```

5. **`align-content`**：定义多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
   - `flex-start`：多根轴线在交叉轴的起点对齐。
   - `flex-end`：多根轴线在交叉轴的终点对齐。
   - `center`：多根轴线在交叉轴上居中对齐。
   - `space-between`：多根轴线之间的间隔相等。
   - `space-around`：多根轴线之间的间隔相等，两端有半个间隔的空间。
   - `stretch`：默认值，多根轴线拉伸以填满容器。

   ```css
   .container {
       align-content: space-around;
   }
   ```

#### Flex 项目属性

1. **`order`**：定义项目的排列顺序，数值越小，排列越靠前，默认为 0。
   ```css
   .item {
       order: 1;
   }
   ```

2. **`flex-grow`**：定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
   ```css
   .item {
       flex-grow: 1;
   }
   ```

3. **`flex-shrink`**：定义项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
   ```css
   .item {
       flex-shrink: 0;
   }
   ```

4. **`flex-basis`**：定义项目在主轴上的初始大小，可以是具体的长度值（如 `20%`、`200px`）或 `auto`，默认为 `auto`。
   ```css
   .item {
       flex-basis: 100px;
   }
   ```

5. **`flex`**：是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`。
   ```css
   .item {
       flex: 1; /* 等价于 flex: 1 1 0% */
   }
   ```

6. **`align-self`**：允许单个项目有与其他项目不一样的对齐方式，覆盖 `align-items` 属性。
   - `auto`：默认值，继承父容器的 `align-items` 属性。
   - `flex-start`：项目在交叉轴的起点对齐。
   - `flex-end`：项目在交叉轴的终点对齐。
   - `center`：项目在交叉轴上居中对齐。
   - `baseline`：项目的第一行文字的基线对齐。
   - `stretch`：项目在交叉轴上拉伸以填满容器。

   ```css
   .item {
       align-self: flex-end;
   }
   ```

**示例代码**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            height: 200px;
            background-color: lightgray;
        }

        .item {
            background-color: lightcoral;
            padding: 20px;
            margin: 10px;
            color: white;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
    </div>
</body>
</html>
```

这个示例展示了一个简单的Flexbox布局，其中三个项目在容器内水平排列并在空间中均匀分布，同时在交叉轴上居中对齐。通过灵活运用Flexbox，可以轻松实现各种复杂布局。

## 三、HTML5&CSS3

### 1、HTML5

HTML5是HTML（超文本标记语言）的第五个版本，是一种用于构建和展示网页内容的标准。HTML5不仅简化了网页开发，还增加了许多新的功能和元素，提供了更强大的多媒体支持、更好的语义结构和更广泛的设备兼容性。HTML5的主要新增功能和改进包括：

#### 新的结构性元素
HTML5引入了一些新的语义元素，以更好地描述页面的结构：

1. **`<header>`**：定义文档或节的头部内容，通常包含导航链接和标题。
2. **`<nav>`**：定义导航链接的部分。
3. **`<article>`**：定义独立的内容部分，例如博客文章或新闻条目。
4. **`<section>`**：定义文档中的节，用于分割内容。
5. **`<aside>`**：定义附属内容，通常作为侧栏或说明内容。
6. **`<footer>`**：定义文档或节的底部内容，通常包含版权信息、联系信息等。
7. **`<main>`**：定义文档的主要内容。
8. **`<figure>`** 和 **`<figcaption>`**：定义带有标题的图像或图表。

#### 新的表单控件
HTML5增强了表单的功能，引入了更多的输入类型和属性：

1. **新的输入类型**：
   - `email`：用于输入电子邮件地址。
   - `url`：用于输入URL地址。
   - `date`：用于输入日期。
   - `time`：用于输入时间。
   - `datetime-local`：用于输入日期和时间（不含时区）。
   - `number`：用于输入数字。
   - `range`：用于输入范围值，通常表现为滑动条。
   - `tel`：用于输入电话号码。
   - `color`：用于输入颜色。

2. **新的表单属性**：
   - `placeholder`：用于显示输入字段的占位符文本。
   - `required`：标识必填字段。
   - `pattern`：用于定义输入模式（正则表达式）。
   - `autofocus`：页面加载时自动聚焦到该字段。
   - `form`：用于关联输入字段与表单。

#### 多媒体元素
HTML5提供了对多媒体内容的原生支持，不需要依赖外部插件：

1. **`<audio>`**：用于嵌入音频内容。
   ```html
   <audio controls>
       <source src="audio.mp3" type="audio/mpeg">
       Your browser does not support the audio element.
   </audio>
   ```

2. **`<video>`**：用于嵌入视频内容。
   ```html
   <video width="320" height="240" controls>
       <source src="movie.mp4" type="video/mp4">
       Your browser does not support the video element.
   </video>
   ```

#### 图形和动画
HTML5引入了新的图形和动画元素，增强了网页的动态效果：

1. **`<canvas>`**：用于绘制2D图形，通过JavaScript进行控制。
   ```html
   <canvas id="myCanvas" width="200" height="100"></canvas>
   <script>
       var canvas = document.getElementById('myCanvas');
       var ctx = canvas.getContext('2d');
       ctx.fillStyle = '#FF0000';
       ctx.fillRect(0, 0, 150, 75);
   </script>
   ```

2. **`<svg>`**：用于定义矢量图形，支持XML语法。
   ```html
   <svg width="100" height="100">
       <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
   </svg>
   ```

#### 本地存储
HTML5引入了新的客户端存储机制，允许在用户浏览器中存储数据：

1. **`localStorage`**：用于存储持久数据，直到用户主动删除。
   ```javascript
   localStorage.setItem('key', 'value');
   var data = localStorage.getItem('key');
   ```

2. **`sessionStorage`**：用于存储临时数据，浏览器会话结束时删除。
   ```javascript
   sessionStorage.setItem('key', 'value');
   var data = sessionStorage.getItem('key');
   ```

#### Geolocation API
HTML5提供了地理定位功能，可以获取用户的地理位置。
```javascript
navigator.geolocation.getCurrentPosition(function(position) {
    console.log('Latitude: ' + position.coords.latitude);
    console.log('Longitude: ' + position.coords.longitude);
});
```

#### 拖放API（Drag and Drop）
HTML5增强了对拖放操作的支持，允许用户在页面中拖动和放置元素。
```html
<div id="drag1" draggable="true" ondragstart="drag(event)">Drag me</div>
<script>
    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }
</script>
```

#### 其他新增功能
1. **Web Workers**：用于在后台线程运行JavaScript代码，避免阻塞用户界面。
2. **Web Sockets**：提供了全双工通信的协议，可以实现实时通信。
3. **离线应用缓存**：允许网页在没有网络连接时也能运行。

HTML5不仅增强了网页的表现能力，还改善了开发者的工作流程和用户的体验。如果您有更多关于HTML5或其他前端开发的问题，请随时提问！

### 2、CSS3

CSS3 是 CSS（层叠样式表）的第三个主要版本，它带来了许多新特性和增强功能，使开发者能够创建更复杂和现代的网页设计。与前两个版本相比，CSS3 提供了更多的控制和灵活性，特别是在动画、布局、视觉效果和响应式设计方面。以下是 CSS3 的一些主要新增功能：

#### 新增选择器
CSS3 引入了许多新的选择器，使选择和操作 DOM 元素更加方便：
- **属性选择器**：例如 `[attribute^="value"]`、`[attribute$="value"]`、`[attribute*="value"]` 等。
- **伪类选择器**：如 `:nth-child(n)`、`:nth-of-type(n)`、`:last-child`、`:only-child` 等。
- **伪元素选择器**：如 `::before`、`::after` 等。

#### 新的颜色
CSS3 支持更多的颜色表示方法：
- **RGBA**：例如 `rgba(255, 0, 0, 0.5)` 表示 50% 透明的红色。
- **HSLA**：例如 `hsla(120, 100%, 50%, 0.3)` 表示 30% 透明的绿色。

#### 盒子模型和布局
1. **盒阴影（Box Shadow）**
   ```css
   box-shadow: 10px 10px 5px #888888;
   ```

2. **边框图片（Border Image）**
   ```css
   border-image: url(border.png) 30 30 round;
   ```

3. **盒子大小（Box Sizing）**
   ```css
   box-sizing: border-box;
   ```

4. **弹性盒子（Flexbox）**
   Flexbox 提供了一种更高效的方式来布局、对齐和分布空间，尤其在处理不同大小的项目时。
   ```css
   .container {
       display: flex;
       justify-content: center;
       align-items: center;
   }
   ```

5. **网格布局（Grid Layout）**
   Grid 提供了一个二维的布局系统，适用于更加复杂的网页布局。
   ```css
   .container {
       display: grid;
       grid-template-columns: 1fr 1fr 1fr;
   }
   ```

#### 动画和过渡
1. **过渡（Transitions）**
   ```css
   .box {
       transition: all 0.3s ease-in-out;
   }
   ```

2. **动画（Animations）**
   ```css
   @keyframes example {
       from {background-color: red;}
       to {background-color: yellow;}
   }
   
   .box {
       animation: example 5s infinite;
   }
   ```

#### 背景和边框
1. **多背景图片**
   ```css
   background-image: url(bg1.png), url(bg2.png);
   ```

2. **圆角边框（Border Radius）**
   ```css
   border-radius: 10px;
   ```

3. **渐变背景（Gradients）**
   ```css
   background: linear-gradient(to right, red, yellow);
   ```

#### 字体和文本
1. **自定义字体（@font-face）**
   ```css
   @font-face {
       font-family: 'MyFont';
       src: url('myfont.woff2') format('woff2');
   }
   
   .text {
       font-family: 'MyFont', sans-serif;
   }
   ```

2. **文本阴影（Text Shadow）**
   ```css
   text-shadow: 2px 2px 5px #888888;
   ```

#### 多列布局（Multi-column Layout）
CSS3 提供了多列布局功能，可以轻松创建报纸或杂志风格的布局：
```css
.columns {
    column-count: 3;
    column-gap: 20px;
}
```

#### 媒体查询（Media Queries）
媒体查询使响应式设计成为可能，根据不同的设备和视口大小应用不同的样式：
```css
@media screen and (max-width: 600px) {
    .container {
        flex-direction: column;
    }
}
```

#### 新的单位
CSS3 引入了新的单位，例如 `rem` 和 `vw`，以便更灵活地定义尺寸：
- **rem**：相对于根元素字体大小的单位。
- **vw**：相对于视口宽度的百分比。

**示例代码**

以下是一个综合运用 CSS3 新特性的示例：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @font-face {
            font-family: 'MyFont';
            src: url('myfont.woff2') format('woff2');
        }

        body {
            font-family: 'MyFont', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #ff7e5f, #feb47b);
        }

        .box {
            width: 200px;
            height: 200px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease-in-out;
        }

        .box:hover {
            transform: scale(1.1);
        }

        .text {
            text-shadow: 2px 2px 5px #888888;
            margin: 20px;
        }

        @media screen and (max-width: 600px) {
            body {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="box">
        <p class="text">Hello, CSS3!</p>
    </div>
</body>
</html>
```

这个示例展示了自定义字体、渐变背景、盒阴影、圆角、过渡、文本阴影和媒体查询等特性的组合用法。

## 四、自测清单

先自己回答，再展开核对。三道题分别对应结构、样式冲突和布局三个层面：

<AnswerReveal title="1. 为什么语义化标签对可访问性有帮助？" :points="['屏幕阅读器可以把 nav / main / header 当作 landmark 直接跳转', '不依赖 class 名，结构与样式解耦，重构样式时含义不变', '搜索引擎也能更准确地判断页面主次内容']" />

<AnswerReveal title="2. 内部样式表一定比外部样式表优先吗？" :points="['不一定：两者同属「作者样式」层级', '真正决定结果的是选择器权重，同权重时后写的覆盖先写的', '内联 style 权重更高，但仍会被 !important 覆盖']" />

<AnswerReveal title="3. width 200px、padding 20px、border 2px，盒子占位多宽？" :points="['content-box：200 + 20×2 + 2×2 = 244px', 'border-box：仍是 200px，content 被压缩到 156px', 'margin 不计入元素自身占位，但要计入实际占据的空间', '可以回到上面的交互演示拖一遍验证']" />

::: tip 接下来读什么
掌握这些基础后，建议顺着 [Vue3 基础](/note/vue3)、[TS 快速上手](/note/ts) 继续，或直接进入 [项目实战](/project/ggzx/index1) 把知识用起来。
:::


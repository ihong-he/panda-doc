---
outline: deep
---

# JavaScript 基础核心

::: tip 📚 JavaScript 学习指南
本文档涵盖JavaScript的核心概念，从基础数据类型到高级特性，帮助你掌握面试必备知识点！
:::

## 📑 目录表
[[toc]]

## 🔢 JavaScript 基础

### 1、JS数据类型

::: info 💾 数据类型概览
JS有8种数据类型，记住7个基本类型+1个引用类型就行：
:::

**7个基本类型（原始值）：**
- **Number**：数字，包括整数和小数
- **String**：字符串，用单引号或双引号包起来
- **Boolean**：布尔值，就两个值 true/false
- **Undefined**：未定义，变量声明了但没赋值
- **Null**：空值，表示"没有对象"
- **Symbol**：独一无二的值，ES6新增
- **BigInt**：大整数，ES11新增，能装超大数字

**1个引用类型：**
- **Object**：对象，包括数组、函数、日期等复杂类型

::: warning 🎯 面试重点
基本类型是值传递，引用类型是引用传递（传递内存中的地址），这是面试高频考点！
:::

### 2、如何检测数据类型

::: tip 🔍 检测方法对比
面试官经常问这个，记住这几个方法就够了：
:::

**1. typeof - 最常用**
- 优点：简单快捷，能检测基本类型
- 缺点：检测null返回"object"，数组也是"object"，有点坑
- 记住这个陷阱：`typeof null === "object"`，这是JS历史遗留问题

**2. instanceof - 检测对象类型**
- 用来判断对象是不是某个构造函数的实例
- 比如：[] instanceof Array 是true
- 坑点：不同iframe之间的数组instanceof会失败，因为构造函数不同

**3. Array.isArray() - 专门检测数组**
- ES6新增，专门用来判断是不是数组
- 比`instanceof`更可靠，跨iframe也能用

**4. Object.prototype.toString.call() - 最准确**
- 这是检测数据类型最可靠的方法
- 能准确识别各种类型，包括数组、日期等
- 写法稍微复杂，但结果最准


::: tip 💬 面试技巧
先说typeof的优缺点，再说instanceof的局限性，最后说toString.call是最完美的方案！
:::

### 3、null vs undefined

**区别：**
- `undefined`：变量声明了但没赋值，或者函数没有返回值（被动产生）
- `null`：主动设置为空值，表示"没有对象"（主动设置）

**核心区别：**
1. `typeof undefined` 是 `"undefined"`，`typeof null` 是 `"object"`（历史遗留问题）
2. `null == undefined` 是 `true`，`null === undefined` 是 `false`
3. `Number(undefined)` 是 `NaN`，`Number(null)` 是 `0`

**使用建议：**
- 变量默认不赋值就是 `undefined`
- 需要明确表示"空对象"时用 `null`

### 4、数组基本方法

::: info 📊 数组方法分类
数组方法是面试必考点，记住这些分类就很清晰：
:::

**改变原数组的方法（会修改原数组）：**
- `push/pop` - 尾部添加/删除
- `unshift/shift` - 头部添加/删除  
- `splice` - 截取，增删改全能选手
- `sort` - 排序
- `reverse` - 反转

**不改变原数组的方法（返回新数组）：**
- `concat` - 合并数组
- `slice` - 切片，不包含结束位置
- `join` - 拼接成字符串
- `toString` - 转字符串

**查找方法：**
- `indexOf/lastIndexOf` - 查找索引，找不到返回-1
- `includes` - ES6新增，判断是否包含，返回true/false

::: danger 🎯 面试重点
splice方法最强大：
- splice(start, deleteCount, items...)
- 一个方法搞定增删改
- 记住参数：从哪开始，删几个，加什么
:::

**技巧对比：**
- slice(start, end) - 不改变原数组，包头不包尾
- splice(start, length) - 改变原数组，从哪开始删几个

**记忆口诀：**
- 增删用splice，不改变用slice
- 找位置用indexOf，判断存在用includes
- 头尾操作push/pop和unshift/shift要记牢！

### 5、数组遍历方法

::: tip 🔄 ES6+遍历方法
这是现在面试的重点，ES6+数组方法必须掌握：
:::

**遍历但不改变数组（纯遍历）：**
- `forEach()` - 就是为了遍历，没返回值，不改变原数组
- 注意：forEach不能用break，需要用for...of

**遍历并返回新数组：**
- `map()` - 最常用，一对一转换，返回新数组
- `filter()` - 过滤，返回符合条件的元素组成的新数组

**遍历并返回布尔值：**
- `some()` - 有一项满足条件就返回true
- `every()` - 所有项都满足条件才返回true

**查找元素：**
- `find()` - 返回第一个满足条件的元素
- `findIndex()` - 返回第一个满足条件的元素索引

**遍历并返回单个值：**
- `reduce()` - 累计算器，最终返回一个值
- 用法：reduce(callback, initialValue)
- 常见场景：求和、求乘积、数组转对象

::: warning 🎯 面试高频问题
1. forEach和map的区别？
   - forEach没返回值，map有返回值
   - forEach不返回新数组，map返回新数组
   - map可以用链式调用，forEach不行

2. reduce的应用场景？
   - 数组求和、求平均
   - 数组转对象
   - 数组扁平化
:::

**记忆技巧：**
- 遍历用forEach
- 转换用map  
- 过滤用filter
- 累计用reduce
- 判断用some/every
- 查找用find/findIndex

### 6、字符串方法

::: info 📝 字符串方法大全
字符串方法也挺多，记住这些常用的就行：
:::

**查找相关：**
- `indexOf/lastIndexOf` - 查找位置，找不到返回-1
- `includes()` - ES6新增，判断是否包含，返回true/false
- `startsWith/endsWith()` - ES6新增，判断开头/结尾

**取子串：**
- `slice(start, end)` - 最常用，包头不包尾
- `substring(start, end)` - 和slice类似，但参数为负数时处理不同
- `substr(start, length)` - 已废弃，不建议用

**替换和分割：**
- `replace()` - 替换，默认只替换第一个
- `replaceAll()` - ES2021新增，替换所有
- `split()` - 字符串转数组

**修改大小写：**
- `toUpperCase()/toLowerCase()` - 转 大写/小写

**去除空格：**
- `trim()` - 去除首尾空格
- `trimStart()/trimEnd()` - ES6新增，分别去除开头/结尾空格

::: danger 🎯 面试重点
1. slice和substring的区别？
   - slice支持负数索引，substring负数当0处理
   - slice可以反着写slice(-3)，substring不行

2. replace和replaceAll的区别？
   - replace只替换第一个，replaceAll替换所有
   - replace可以用正则/g实现替换所有
:::

**实用技巧：**
- 字符串反转：str.split('').reverse().join('')
- 重复字符串：str.repeat(n)
- 字符串补齐：padStart/padEnd（ES6）

::: tip 💡 记住
现代项目更多使用includes、startsWith、endsWith这些ES6方法！
:::

### 7、闭包函数

::: warning 🔥 核心概念
闭包是JS的核心概念，面试必问，理解透彻很重要：
:::

💬 **白话解释**：
内部函数能访问外部函数的变量，而且外部函数执行完后，这些变量还不会被销毁，因为内部函数还在引用它们。

**闭包的形成条件：**
1. 函数嵌套函数
2. 内部函数引用外部函数的变量
3. 外部函数执行后，内部函数还能被外部调用或返回（变量不会销毁）

**实际应用场景：**
1. **防抖节流函数** - 最常见
2. **模块化** - 避免全局污染
3. **私有变量** - JS没有真正的私有变量，用闭包模拟
4. **事件处理** - 保存状态

**闭包的优缺点：**
- 优点：变量持久化、避免全局污染、实现封装
- 缺点：内存泄漏风险（变量不会被回收）

**经典面试题：**
```javascript
// 题目：输出什么？
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i)
    }, 1000)
}
// 输出：3 3 3（1秒后）
```

**为什么都是3？**
- `var` 是函数作用域，i 在整个循环中是同一个变量
- 循环结束时，i 已经变成 3
- setTimeout 的回调在1秒后执行，此时 i = 3

**闭包解决方案：**
```javascript
// 方案1：使用立即执行函数（IIFE）
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j)
        }, 1000)
    })(i)
}
// 输出：0 1 2
```

**闭包的关键作用：**
- 让每个 `setTimeout` 回调函数**记住自己专属的值**
- 变量 `j` 不会被销毁，因为回调函数还在引用它
- 形成了3个独立的闭包，每个闭包保存不同的值

::: tip 💬 面试回答技巧
1. 先说概念定义
2. 再说形成条件
3. 然后说应用场景
4. 最后说优缺点
:::

> 🎯 **记住**：闭包就是"函数+它能访问的变量"的组合！

### 8、原型、原型链

::: info 🔗 继承机制
原型链是JS继承的核心，理解了它就理解了JS的对象机制：
:::

**核心概念：**
1. 每个对象都有个`__proto__`属性，指向它的原型对象
2. 每个函数都有个`prototype`属性，也是原型对象
3. 原型对象也有自己的原型，这样一层一层就形成了原型链

**白话理解：**
就像继承关系一样，儿子从父亲那里继承属性，父亲从爷爷那里继承，一直往上追溯。

**原型链查找过程：**
访问对象属性时：
1. 先在对象自己身上找
2. 没找到就去`__proto__`上找（原型对象）
3. 还没找到就去原型的`__proto__`上找
4. 一直找到`Object.prototype.__proto__`（等于null）为止

**三个重要属性：**
- `prototype` - 函数的属性，指向原型对象
- `__proto__` - 对象的属性，指向构造函数的原型
- `constructor` - 原型对象的属性，指回构造函数


**面试常问题：**
1. 如何实现继承？
   - 原型链继承、构造函数继承、组合继承、ES6 class继承

2. instanceOf原理？
   - 就是沿着原型链查找构造函数的prototype属性


::: tip 🧠 记忆技巧
- 函数有prototype，对象有__proto__
- 查找属性就沿着__proto__链往上找
- 最终都会找到Object.prototype
:::

### 9、new 操作符

::: danger 🎯 高频考点
new操作符是JS中创建对象实例的核心，面试经常问它的原理：
:::

**new操作符做了什么：**
1. 创建一个空对象 {}
2. 设置这个空对象的原型（__proto__）指向构造函数的prototype
3. 执行构造函数，把this指向这个新对象
4. 如果构造函数没有返回对象，就返回这个新对象

**手动实现new：**
```javascript
function myNew(Constr, ...args) {
    // 1. 创建空对象
    let obj = {}
    
    // 2. 设置原型
    obj.__proto__ = Constr.prototype
    
    // 3. 执行构造函数
    let result = Constr.apply(obj, args)
    
    // 4. 返回对象
    return result instanceof Object ? result : obj
}
```

**常见面试题：**
```javascript
function Person() {
    this.name = '张三'
    return { name: '李四' }
}
let p = new Person()
console.log(p.name) // '李四'，因为返回了对象
```

**记忆要点：**
- new就是创建对象+设置原型+绑定this+返回对象
- 箭头函数不能用new是高频考点！

### 10、对 this 的理解

::: warning 🎯 容易混淆的概念
this是JS中最容易混淆的概念，但掌握了规则就很简单：
:::

> 💡 **this指向的核心原则**：
> 谁调用this，this就指向谁！（箭头函数除外）

**各种情况下的this：**

1. **全局调用** - 指向全局对象
   ```javascript
   function fn() { console.log(this) } 
   fn() // window（非严格模式）
   ```

2. **对象方法调用** - 指向调用对象
   ```javascript
   let obj = { 
       name: '张三',
       say() { console.log(this.name) }
   }
   obj.say() // '张三'
   ```

3. **构造函数调用** - 指向新创建的对象
   ```javascript
   function Person() { this.name = '李四' }
   let p = new Person()
   ```

4. **call/apply/bind调用** - 指向指定对象
   ```javascript
   fn.call(obj) // this指向obj
   fn.apply(obj) // this指向obj
   fn.bind(obj)() // this指向obj
   ```

5. **箭头函数** - 没有自己的this，继承外层
   ```javascript
   let obj = {
       name: '王五',
       say: () => console.log(this.name) // 这里的this不是obj
   }
   ```

**面试经典问题：**
1. setTimeout中的this为什么指向window？
   - setTimeout是全局方法，普通函数调用时this指向全局

2. 如何改变this指向？
   - call/apply/bind
   - 用箭头函数
   - 用that = this缓存

3. 严格模式下的this？
   - 全局函数调用时this是undefined，不是window
   - 严格模式就是在文件开头加 `'use strict'`，让JS更严格、更安全

**实用技巧：**
- 对象方法用普通函数（this指向对象）
- 回调函数用箭头函数（避免this丢失）
- 想强制指向谁用bind

**记忆口诀：**
普通调用看全局，对象调用看左边，new调用是新对象，箭头函数看外层，call/bind说了算！

### 11、防抖和节流

::: danger 🔥 性能优化核心手段
这是性能优化的核心手段，面试几乎必问，手写代码是重点：
:::

**防抖（Debounce）：**
- **原理**：事件触发后等一会，如果在这段时间内又触发了，就重新计时
- **生活比喻**：电梯门，有人进来就重新等一会关门
- **应用场景**：搜索框输入、按钮防止重复点击、窗口resize

**节流（Throttle）：**
- **原理**：固定时间间隔执行，不管触发多频繁，都按固定频率执行
- **生活比喻**：地铁进站，固定时间一班，人再多也按这个节奏发车
- **应用场景**：滚动事件、鼠标移动、游戏射击

**手写防抖（重点）：**
```javascript
function debounce(func, delay) {
    let timer
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
```

**手写节流（重点）：**
```javascript
function throttle(func, delay) {
    let timer = null
    return function(...args) {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args)
                timer = null
            }, delay)
        }
    }
}
```

**实际项目应用：**
- 搜索防抖：用户输入停止后再发送请求
- 滚动节流：页面滚动时按固定频率加载更多

**记忆技巧：**
- 防抖 = 延迟执行 + 重置计时
- 节流 = 时间间隔 + 节制执行

### 12、0.1+0.2 != 0.3？为什么？

::: tip 💻 经典问题
这个经典问题考察对浮点数精度的理解：
:::

**为什么会这样？**
- 计算机用二进制存储数字，0.1和0.2在二进制中是无限循环小数
- 就像10进制中1/3=0.3333...一样，无法精确表示
- 存储时会有精度丢失，计算时会产生误差

**具体过程：**
- 0.1 → 二进制：0.00011001100110011...
- 0.2 → 二进制：0.00110011001100110...
- 相加后存储的精度有限，导致结果是0.30000000000000004

**解决方案：**

1. **转换为整数计算（最常用）：**
```javascript
let result = (0.1 * 10 + 0.2 * 10) / 10
console.log(result) // 0.3
```

2. **使用toFixed格式化：**
```javascript
let result = (0.1 + 0.2).toFixed(1) // 返回字符串 "0.3"
console.log(result) // "0.3"
// 如果需要数字类型
console.log(parseFloat(result)) // 0.3
```

3. **误差范围判断返回精确值：**
```javascript
// 使用误差范围判断并返回精确值
function add(a, b, tolerance = 0.00001) {
    let result = a + b
    // 判断结果是否接近某个精度 Math.round()四舍五入到整数
    let rounded = Math.round(result / tolerance) * tolerance
    return rounded
}
let result = add(0.1, 0.2)
console.log(result) // 0.3
console.log(result === 0.3) // true
```

**面试扩展问题：**
1. 为什么只有有些小数有这个问题？
   - 分母是2的幂次方的数可以精确表示（如0.5、0.25）

2. 其他语言也有这个问题吗？
   - 基本都有，这是浮点数存储机制导致的

3. 项目中如何避免？
   - 涉及金额计算用整数（分）
   - 或者使用专门的数学库（如big.js）

**记忆要点：**
- 这是浮点数精度问题，不是JS特有
- 用误差范围或转整数的方式解决
- 涉及金钱计算要特别注意！

### 13、TypeScript vs JavaScript 区别

::: danger 🔥 面试必问
TS vs JS 是前端面试常问问题，需要从多个维度回答！
:::

**核心区别：**

| 维度 | JavaScript | TypeScript |
|------|-----------|------------|
| 类型 | 动态弱类型 | 静态强类型 |
| 编译 | 解释执行 | 需要编译成JS再执行 |
| 错误检查 | 运行时发现 | 编译时发现 |
| 语法 | ES规范 | 超集，包含ES所有特性 + 类型系统 |
| 代码提示 | 有限 | 完整的智能提示和类型推断 |
| 维护性 | 难以维护大型项目 | 更适合大型项目 |

**TS的优势：**

1. **类型安全**
   - 编译时捕获错误，减少运行时bug
   - 提供类型检查，避免类型不匹配
   ```typescript
   // TypeScript 会在编译时报错
   let num: number = 'hello' // ❌ Type 'string' is not assignable to type 'number'
   ```

2. **更好的代码提示**
   - IDE能提供完整的类型提示
   - 重构更安全（自动更新所有引用）

3. **更好的可维护性**
   - 类型即文档，代码自解释
   - 团队协作更高效
   - 大型项目易于维护

4. **支持新特性**
   - TS支持更新的JS特性
   - 编译时可指定目标版本

5. **高级特性**
   - 接口 Interface
   - 泛型 Generics
   - 装饰器 Decorators
   - 枚举 Enum
   - 命名空间 Namespace

**TS的劣势：**
- 学习成本较高
- 开发时需要编译步骤
- 配置复杂（tsconfig.json）
- 文件体积略大（类型信息会被编译掉）

**面试加分回答：**
- 我在实际项目中使用TS开发，减少了约60%的运行时错误
- 团队协作时，TS的类型系统让代码审查更高效
- 对于小型项目，JS可能更灵活；但对于中大型项目，TS是更好的选择

::: tip 🧠 记忆要点
TS = JS + 类型系统，编译时检查错误，适合大型项目！
:::

### 14、事件循环 Event Loop

::: danger 🔥 核心机制必考
事件循环是JS的核心机制，面试必问，一定要搞懂：
:::

**为什么需要事件循环？**
JS是单线程的，为了不阻塞主线程，用异步处理耗时操作

**执行顺序（重点）：**
1. **同步代码** → 立即执行
2. **微任务** → 同步代码执行完后立即执行
3. **宏任务** → 微任务执行完后执行

**哪些是微任务？**
- Promise.then/catch/finally
- async/await（本质是Promise语法糖）
- process.nextTick（Node.js）
- MutationObserver（浏览器）

**哪些是宏任务？**
- setTimeout/setInterval
- I/O操作
- UI渲染
- requestAnimationFrame

**经典面试题：**
```javascript
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('start')
// 输出：start → promise → timeout
```

**执行过程：**
1. 先执行同步：console.log('start')
2. 检查微任务队列：执行promise的then
3. 检查宏任务队列：执行setTimeout

**浏览器 vs Node.js：**
- 浏览器：多个宏任务队列，按时间排序
- Node.js：分阶段处理，Timer、Poll、Check等阶段

::: tip 🧠 记忆口诀
同步先执行，微任务紧跟着，宏任务最后来，一轮一轮转！
:::
---
outline: deep
---
## 目录表
[[toc]]
## 一、面试实战

### 1、前端性能优化

前端性能优化的方式包括：

1. **减少HTTP请求**：合并文件（JS、CSS、图片），使用雪碧图。
2. **资源压缩和代码优化**：压缩JS、CSS文件，使用Tree Shaking去除未用代码。
3. **异步加载资源**：懒加载图片，异步加载JS和CSS。
4. **缓存优化**：合理使用浏览器缓存和Service Worker。
5. **图片优化**：选择合适格式和压缩图片（如WebP）。
6. **减少DOM操作**：优化DOM更新，减少重排和重绘。
7. **使用CDN**：将静态资源放在CDN上，减少加载时间。
8. **代码分割**：使用Webpack/Vite进行代码分割，按需加载。
9. **预加载和预连接**：使用`<link rel="preload">`和`<link rel="dns-prefetch">`。
10. **虚拟列表**：对于长列表使用虚拟滚动，只渲染可视区域元素。

这些方法结合使用能显著提升页面加载速度和性能。

### 2、Promise

`Promise` 是 JavaScript 中用于处理异步操作的对象。它代表一个尚未完成但预期将来会完成的操作，可以处于以下三种状态之一：

1. **Pending（待定）**：初始状态，表示操作尚未完成。
2. **Fulfilled（已完成）**：操作成功完成，返回一个值。
3. **Rejected（已拒绝）**：操作失败，返回一个错误。

通过 `.then()` 和 `.catch()` 方法，可以处理成功和失败的回调，`Promise` 使得异步代码更加易于理解和维护。

**相关面试热点：**
- **async/await**：Promise的语法糖，让异步代码看起来像同步代码
- **Promise.all()**：并行执行多个Promise，全部成功才返回
- **Promise.race()**：多个Promise竞争，最先完成的结果返回
- **Promise.allSettled()**：不管成功失败，返回所有结果
- **错误处理**：.then().catch() 和 try/catch 的区别
- **手写Promise**：面试常考，理解其内部实现原理

**企业实战题：**
```javascript
// 并发请求控制 - 限制同时进行的请求数量
class RequestQueue {
  constructor(limit = 3) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.run();
    });
  }

  async run() {
    if (this.running >= this.limit || this.queue.length === 0) return;

    this.running++;
    const { request, resolve, reject } = this.queue.shift();

    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.run();
    }
  }
}
```

## 二、手写代码

### 0、ES6新特性（面试热点）

**箭头函数与普通函数的区别**

```javascript
// 普通函数
function normal() {
  console.log(this); // 取决于调用方式
}

// 箭头函数
const arrow = () => {
  console.log(this); // 继承外层this，无法改变
};

// 关键区别：
// 1. 箭头函数没有自己的this，继承外层
// 2. 箭头函数不能用作构造函数
// 3. 箭头函数没有arguments对象
// 4. 箭头函数不能使用yield命令
```

**解构赋值技巧**

```javascript
// 数组解构
const [a, b, ...rest] = [1, 2, 3, 4, 5];

// 对象解构
const {name, age, city = '北京'} = user;

// 重命名解构
const {name: userName} = user;

// 函数参数解构
const greet = ({name, age}) => `你好，${name}今年${age}岁`;
```

### 1、数组去重

数组去重是面试高频题，记住这几种方法就够了！

**方法 1：使用 Set（最推荐）**

```javascript
function uniqueArray(arr) {
    return [...new Set(arr)];
}

// 测试
console.log(uniqueArray([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]
```
**口诀：** Set天生去重，扩展运算符转数组

---

**方法 2：使用 filter + indexOf**

```javascript
function uniqueArray(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
```
**口诀：** 过滤首次出现，相同项只留第一个

---

**方法 3：传统 for 循环**

```javascript
function uniqueArray(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (!result.includes(arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}
```
**口诀：** 遍历检查是否存在，不存在就push

---

**面试加分项：对象数组去重**
```javascript
function uniqueObjects(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

const users = [
    {id: 1, name: '张三'},
    {id: 2, name: '李四'},
    {id: 1, name: '张三重复'}
];

console.log(uniqueObjects(users, 'id'));
// [{id: 1, name: '张三'}, {id: 2, name: '李四'}]
```

### 2、冒泡排序

冒泡排序就像气泡一样，大的往上冒，小的往下沉！

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // 提前退出标志位，性能优化
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换相邻元素，ES6解构赋值最简洁
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果本轮没交换，说明已经排好了
    if (!swapped) break;
  }
  return arr;
}

// 测试
const array = [5, 2, 9, 1, 5, 6];
console.log('排序前：', array);
console.log('排序后：', bubbleSort(array));
```

**口诀记忆：**
- 外层循环控制轮次，内层循环比较相邻
- 大的往后换，小的往前移
- 一轮下来最大值沉底
- swapped标志优化，有序提前停

**时间复杂度：**
- 最好：O(n) - 本来就有序
- 最坏：O(n²) - 完全倒序
- 平均：O(n²)

**面试要点：**
- 稳定性：稳定的排序算法（相等元素顺序不变）
- 适用场景：数据量小，基本有序的情况


### 3、快速排序

快速排序：选个基准，左边小右边大，递归搞定！

```javascript
function quickSort(arr) {
  // 递归出口：数组为空或只有一个元素，直接返回
  if (arr.length <= 1) {
    return arr;
  }

  // 选基准，选中间的
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];   // 比基准小的
  const right = [];  // 比基准大的
  const equal = [];  // 和基准相等的

  // 分组
  for (const num of arr) {
    if (num < pivot) {
      left.push(num);
    } else if (num > pivot) {
      right.push(num);
    } else {
      equal.push(num);
    }
  }

  // 递归左右两边，然后合并
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 测试
const array = [5, 2, 9, 1, 5, 6];
console.log('排序前：', array);
console.log('排序后：', quickSort(array));
```

**四步口诀：**
1. 选基准（pivot）- 找个数当裁判
2. 分三组 - 小的、大的、相等的
3. 递归调用 - 左右两边继续排
4. 合并结果 - 左+中+右搞定

**时间复杂度：**
- 最好：O(n log n) - 基准选得好
- 最坏：O(n²) - 基准选得差（比如数组已排序）
- 平均：O(n log n)

**面试要点：**
- 不稳定排序（相等元素可能改变顺序）
- 空间复杂度：O(log n) - 递归栈空间
- 原地排序版本（面试加分手写）

### 4、浅拷贝和深拷贝

一句话区分：浅拷贝只复制表面，深拷贝复制到底！

**浅拷贝 - 只复制一层**
```javascript
// 方法1：Object.assign()
const shallowCopy = (obj) => Object.assign({}, obj);

// 方法2：展开运算符（推荐）
const shallowCopy = (obj) => ({ ...obj });

// 示例
const obj = { a: 1, b: { c: 2 } };
const copy = shallowCopy(obj);
copy.b.c = 99;  // 修改copy，原对象也会变！
console.log(obj.b.c); // 99 - 这就是浅拷贝的问题
```

---

**深拷贝 - 完全独立**

**方法1：JSON方法（最简单，有限制）**
```javascript
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

// 局限：无法处理函数、Date、RegExp、undefined等
const obj = { 
  a: 1, 
  fn: () => {}, 
  date: new Date() 
};
const copy = deepCopy(obj); // fn和date会丢失或类型错误
```

**方法2：递归实现（面试常考）**
```javascript
const deepCopy = (obj) => {
  // 基本类型和null直接返回
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理Date对象
  if (obj instanceof Date) return new Date(obj);
  // 处理RegExp对象
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 创建新容器（数组或对象）
  const copy = Array.isArray(obj) ? [] : {};
  
  // 递归复制每个属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
};
```

**方法3：structuredClone（现代浏览器首选）**
```javascript
const deepCopy = (obj) => structuredClone(obj);
// 支持大部分类型，包括循环引用！
```

**面试要点：**
- 浅拷贝：只复制引用，修改影响原对象
- 深拷贝：完全独立，修改不影响原对象
- 手写递归：记住边界条件判断（null、基本类型、特殊对象）
- 性能考虑：深拷贝比浅拷贝开销大

### 5、数组扁平化

数组扁平化就是把嵌套数组拍平成一维数组，面试常考！

**方法1：递归实现（最直观）**
```javascript
function flattenArray(arr) {
  let result = [];
  
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 是数组就递归，然后拼接结果
      result = result.concat(flattenArray(arr[i]));
    } else {
      // 不是数组就push
      result.push(arr[i]);
    }
  }
  return result;
}

// 测试
const nestedArray = [1, [2, [3, 4], 5], 6];
console.log(flattenArray(nestedArray)); // [1, 2, 3, 4, 5, 6]
```

**方法2：reduce + 递归（更简洁）**
```javascript
const flatten = arr => 
  arr.reduce((acc, cur) => 
    Array.isArray(cur) ? acc.concat(flatten(cur)) : acc.concat(cur)
  , []);

// 测试
console.log(flatten([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
```

**方法3：ES6 flat()（最简单）**
```javascript
// 指定深度，Infinity表示无限深度
const result = [1, [2, [3, 4], 5], 6].flat(Infinity);
console.log(result); // [1, 2, 3, 4, 5, 6]
```

**方法4：toString + split（巧解，有局限）**
```javascript
function flattenByString(arr) {
  return arr.toString().split(',').map(item => +item || item);
}

// 局限：只适用于纯数字数组
console.log(flattenByString([1, [2, [3, 4], 5], 6])); // [1, 2, 3, 4, 5, 6]
```

**面试要点：**
- 递归是核心思路，必须掌握
- reduce版本展示函数式编程能力
- 了解ES6的flat()方法
- 注意边界情况：空数组、非数组元素、循环引用

**记忆口诀：**
- 递归思想：是数组就继续，不是就收集
- reduce思路：累积器+递归，简洁高效
- toString技巧：转字符串再分割，偷懒解法

### 6、防抖和节流

防抖和节流都是控制函数执行频率的方法，面试必考！

#### **防抖（Debounce）- 等你停手了再执行**

防抖就像打字时的延迟发送，你不停输入，就一直等，停了才发送。

```javascript
function debounce(func, delay) {
  let timer;  // 延迟执行的定时器
  
  return function (...args) {
    // 每次触发都清除上一个定时器
    clearTimeout(timer);
    
    // 重新设置定时器
    timer = setTimeout(() => {
      func.apply(this, args);  // 保持this指向
    }, delay);
  };
}

// 使用场景：搜索框输入
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
  console.log('搜索：', e.target.value);
  // 发送API请求
}, 500));
```

---

#### **节流（Throttle）- 固定时间间隔执行**

节流就像水龙头，不管你怎么拧，水滴都是固定频率流出来的。

```javascript
// 方法1：定时器版本
function throttle(func, delay) {
  let timer = null;
  
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;  // 执行完后重置
      }, delay);
    }
  };
}

// 方法2：时间戳版本
function throttleTimestamp(func, delay) {
  let lastTime = 0;
  
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

// 使用场景：滚动事件
window.addEventListener('scroll', throttle(() => {
  console.log('滚动位置：', window.scrollY);
  // 更新进度条、懒加载等
}, 100));
```

---

#### **对比记忆**

| 特性 | 防抖 | 节流 |
|------|------|------|
| **执行时机** | 停止触发后延迟执行 | 固定时间间隔执行 |
| **触发次数** | 可能只执行1次 | 会执行多次 |
| **经典场景** | 搜索框、resize | 滚动、按钮防连点 |

**面试要点：**
- 都要正确处理this指向（使用apply/call）
- 防抖适合：搜索框、表单验证、resize事件
- 节流适合：滚动加载、按钮防连点、鼠标移动
- 知道两种节流实现方式的区别

**记忆口诀：**
- 防抖：等你停了再动
- 节流：定时来一次，不管你怎么折腾

### 7、JS对象转为树形结构

将一个扁平的 JavaScript 对象数组转化为树形结构，可以按照以下思路实现：  

1. **确定数据结构**  
   - 每个对象有一个唯一标识 `id`。
   - 每个对象有一个父级标识 `parentId`，顶级节点的 `parentId` 为 `null` 或其他特殊值。

2. **实现步骤**  
   - 创建一个哈希表以便快速查找。
   - 遍历数据，将对象挂载到其父节点的 `children` 数组中。

以下是具体实现代码：  

```javascript
function buildTree(data) {
  const tree = [];
  const map = new Map();

  // 初始化哈希表，用 id 作为键
  data.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 构建树
  data.forEach(item => {
    const node = map.get(item.id);
    if (item.parentId === null) {
      // 顶级节点
      tree.push(node);
    } else {
      // 非顶级节点，加入父节点的 children
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}

// 测试数据
const input = [
  { id: 1, name: '根节点', parentId: null },
  { id: 2, name: '子节点 1', parentId: 1 },
  { id: 3, name: '子节点 2', parentId: 1 },
  { id: 4, name: '子节点 1-1', parentId: 2 },
  { id: 5, name: '子节点 2-1', parentId: 3 },
];

const tree = buildTree(input);
console.log(JSON.stringify(tree, null, 2));
```

**输出结果**

```json
[
  {
    "id": 1,
    "name": "根节点",
    "parentId": null,
    "children": [
      {
        "id": 2,
        "name": "子节点 1",
        "parentId": 1,
        "children": [
          {
            "id": 4,
            "name": "子节点 1-1",
            "parentId": 2,
            "children": []
          }
        ]
      },
      {
        "id": 3,
        "name": "子节点 2",
        "parentId": 1,
        "children": [
          {
            "id": 5,
            "name": "子节点 2-1",
            "parentId": 3,
            "children": []
          }
        ]
      }
    ]
  }
]
```

**说明**
1. **时间复杂度：**  
   - 哈希表初始化：O(n)  
   - 遍历数据构建树：O(n)  
   总体复杂度为 O(n)。

2. **特点：**  
   - `children` 数组在每个节点中表示其子节点。  
   - 顶级节点存储在 `tree` 数组中。

这样可以轻松构建树形结构，适用于菜单、目录等场景。


### 8、提取 URL 参数

以下是提取 URL 中的 GET 查询参数并将其存储为 JSON 结构的实现代码：  

```javascript
function parseQueryParams(url) {
  const queryString = url.split('?')[1]; // 获取问号后面的部分
  if (!queryString) {
    return {}; // 如果没有查询参数，返回空对象
  }

  const params = {};
  const pairs = queryString.split('&'); // 根据 & 拆分每个键值对

  pairs.forEach(pair => {
    const [key, value] = pair.split('='); // 根据 = 拆分键和值
    params[decodeURIComponent(key)] = decodeURIComponent(value || ''); // 解码并处理空值
  });

  return params;
}

// 测试
const url = 'https://example.com/page?name=John&age=30&city=New%20York';
const result = parseQueryParams(url);
console.log(result);
```

**输出结果**
```json
{
  "name": "John",
  "age": "30",
  "city": "New York"
}
```

---

**代码说明**
1. **分割 URL 和查询字符串**  
   使用 `split('?')` 提取 URL 中 `?` 后面的部分。

2. **拆分键值对**  
   使用 `split('&')` 将查询字符串按 `&` 拆分为每个键值对。

3. **解析键和值**  
   使用 `split('=')` 将每个键值对拆分成键和值，同时使用 `decodeURIComponent` 解码 URL 编码的字符。

4. **处理空值**  
   如果键没有对应的值，默认值为 `''`。

---

### 9、交换a,b的值

以下是几种方法在不使用临时变量的情况下交换两个变量 `a` 和 `b` 的值：

**1. 使用数组解构**
```javascript
let a = 5, b = 3;

[a, b] = [b, a];

console.log(a, b); // 输出：3, 5
```

**2. 使用加减法**
```javascript
let a = 5, b = 3;

a = a + b; // a = 8
b = a - b; // b = 5
a = a - b; // a = 3

console.log(a, b); // 输出：3, 5
```

**3. 使用异或（XOR）运算**
```javascript
let a = 5, b = 3;

a = a ^ b; // a = 6 (0101 ^ 0011 = 0110)
b = a ^ b; // b = 5 (0110 ^ 0011 = 0101)
a = a ^ b; // a = 3 (0110 ^ 0101 = 0011)

console.log(a, b); // 输出：3, 5
```

**推荐方法**
- **使用数组解构** 是最直观且安全的现代方法。
- **加减法** 和 **异或** 适合对性能要求高的场景，但需注意溢出问题。

### 10、1到100求和

1到100求和，多种方法任你选！

```javascript
// 方法一：普通循环（最基础）
let sum = 0;
for (let i = 1; i <= 100; i++) {
  sum += i;
}
console.log("循环求和:", sum); // 5050

// 方法二：数学公式（最优雅）
// 高斯求和公式：(首项 + 末项) × 项数 ÷ 2
const sumFormula = (1 + 100) * 100 / 2;
console.log("公式求和:", sumFormula); // 5050

// 方法三：递归（展示递归思维）
function sumRecursive(n) {
  if (n === 1) return 1;  // 递归出口
  return n + sumRecursive(n - 1);  // 递归公式
}
console.log("递归求和:", sumRecursive(100)); // 5050

// 方法四：reduce（函数式编程）
const sumReduce = Array.from({length: 100}, (_, i) => i + 1)
  .reduce((acc, cur) => acc + cur, 0);
console.log("reduce求和:", sumReduce); // 5050
```

**面试加分项：**
- 数学公式：O(1)时间复杂度，最优解
- 递归：展示算法思维，但要注意栈溢出
- reduce：展示函数式编程能力

---

### 11、函数柯里化（面试高阶题）

柯里化就是把一个多参数函数，转换成一系列单参数函数的调用。

```javascript
// 基础柯里化实现
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

**实用场景：**
```javascript
// 柯里化的应用：创建专用函数
const add10 = curriedAdd(10);
console.log(add10(5)(5)); // 20

// 表单验证
const validate = (rules) => (value) => {
  return rules.every(rule => rule(value));
};

const validateEmail = validate([
  v => v.includes('@'),
  v => v.includes('.')
]);

console.log(validateEmail('test@example.com')); // true
```

---

### 12、Promise手写实现（面试高频）

```javascript
// 简化版Promise实现
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleResolve = () => {
        try {
          const result = onFulfilled ? onFulfilled(this.value) : this.value;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      const handleReject = () => {
        try {
          const result = onRejected ? onRejected(this.reason) : this.reason;
          reject(result);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === 'fulfilled') {
        handleResolve();
      } else if (this.state === 'rejected') {
        handleReject();
      } else {
        this.onResolvedCallbacks.push(handleResolve);
        this.onRejectedCallbacks.push(handleReject);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// 使用示例
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve('成功！'), 1000);
});

promise.then(
  value => console.log(value),
  reason => console.log(reason)
);
```

**Promise核心要点：**
- 三种状态：pending → fulfilled/rejected
- 状态不可逆：一旦改变就不能再变
- 链式调用：then方法返回新Promise
- 异常处理：catch和try/catch


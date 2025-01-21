---
outline: deep
---

## 一、综合

### 1、前端性能优化的方式

前端性能优化的方式可以从以下几个方面进行归纳：

---

1. **资源加载优化**
- **代码压缩与混淆**：压缩 HTML、CSS、JavaScript（如使用 `Terser` 或 `UglifyJS`）。
- **图片优化**：使用合适的图片格式（如 WebP）、压缩图片、使用懒加载。
- **静态资源缓存**：通过 `Cache-Control`、`ETag` 实现浏览器缓存。
- **CDN 加速**：将静态资源部署到 CDN，缩短传输距离。

---

2. **网络优化**
- **减少 HTTP 请求**：合并 CSS、JS 文件或使用雪碧图。
- **开启 Gzip 或 Brotli 压缩**：减少资源传输体积。
---

3. **渲染优化**
- **减少重排与重绘**：避免频繁修改 DOM 树和样式，使用 `class` 替代样式直接操作。
- **CSS 优化**：减少复杂选择器，避免使用 `@import`。
- **虚拟 DOM**：利用 Vue、React 的虚拟 DOM 提升性能。
- **懒加载与预加载**：按需加载资源，使用 `prefetch`、`preload` 提前加载关键资源。

---

4. **代码执行优化**
- **减少主线程阻塞**：优化长任务，拆分为小任务。
- **防抖与节流**：控制高频事件触发（如输入、滚动）。
- **Web Worker**：将复杂计算任务转移到子线程。

---

5. **用户体验优化**
- **骨架屏**：提升页面加载时的感知速度。
- **首屏渲染优化**：优先加载关键资源，减少白屏时间。
---

总结：前端性能优化是多方面的，需要结合项目特点和目标用户环境综合考虑，重点提升资源加载速度、页面渲染性能和用户操作流畅度。

## 二、手写代码

### 1、数组去重

以下是几种实现数组去重函数的方法：

---

**方法 1：使用 `Set`（推荐）**

**代码：**
```javascript
function uniqueArray(arr) {
    return [...new Set(arr)];
}

// 测试
console.log(uniqueArray([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]
```
**解析：**
- `Set` 是一种数据结构，能自动去除重复值。
- 使用扩展运算符将 `Set` 转换为数组。

---

**方法 2：使用 `filter` 和 `indexOf`**

**代码：**
```javascript
function uniqueArray(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 测试
console.log(uniqueArray([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]
```
**解析：**
- `filter` 遍历数组，保留第一个出现的元素，过滤掉后续重复项。

---

**方法 3：使用 `for` 循环**

**代码：**
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

// 测试
console.log(uniqueArray([1, 2, 2, 3, 4, 4])); // [1, 2, 3, 4]
```
**解析：**
- 遍历原数组，通过 `includes` 检查结果数组中是否已存在当前元素。

---

根据场景选择最合适的方法即可！

### 2、冒泡排序

以下是使用 JavaScript 手写的冒泡排序：

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // 提前退出标志位
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换相邻元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果本轮没有交换过，数组已排序好，提前退出
    if (!swapped) break;
  }
  return arr;
}

// 测试
const array = [5, 2, 9, 1, 5, 6];
console.log('排序前：', array);
console.log('排序后：', bubbleSort(array));
```

**算法说明**
1. 冒泡排序通过多次遍历数组，每次比较相邻两个元素，如果顺序不对就交换。
2. 每一轮遍历结束后，最大的元素会移动到数组的末尾。
3. 使用 `swapped` 标志位优化：若某轮遍历没有发生交换，说明数组已排序好，可以提前退出。

**时间复杂度**
- 最好情况：O(n)（数组本身有序）。
- 最坏情况：O(n²)（数组完全逆序）。
- 平均情况：O(n²)。


### 3、快速排序

以下是使用 JavaScript 手写的快速排序算法：

```javascript
function quickSort(arr) {
  // 如果数组长度为 0 或 1，直接返回
  if (arr.length <= 1) {
    return arr;
  }

  // 选择基准元素，一般选择中间值
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];

  // 遍历数组，将元素按大小分到不同的数组
  for (const num of arr) {
    if (num < pivot) {
      left.push(num);
    } else if (num > pivot) {
      right.push(num);
    } else {
      equal.push(num);
    }
  }

  // 递归排序左右两部分，并合并结果
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 测试
const array = [5, 2, 9, 1, 5, 6];
console.log('排序前：', array);
console.log('排序后：', quickSort(array));
```

**算法说明**
1. **选择基准值（Pivot）：** 通常从数组中选择一个元素作为基准，这里选择数组的中间元素。
2. **划分子数组：** 将数组中的元素根据与基准的大小分为三部分：
   - 比基准小的元素放入 `left`。
   - 与基准相等的元素放入 `equal`。
   - 比基准大的元素放入 `right`。
3. **递归处理：** 对 `left` 和 `right` 子数组递归调用快速排序。
4. **合并结果：** 最后将 `left`、`equal` 和 `right` 合并成一个已排序的数组。

### 4、浅拷贝和深拷贝

> 浅拷贝只复制对象的第一层属性，嵌套对象仅复制引用，而深拷贝会递归复制对象及其嵌套对象的所有层级，创建完全独立的副本。

**浅拷贝方法**

1. **使用 `Object.assign()`**
```javascript
const shallowCopy = (obj) => Object.assign({}, obj);
```

2. **使用展开运算符**
```javascript
const shallowCopy = (obj) => ({ ...obj });
```

---

**深拷贝方法**

1. **使用 `JSON.parse()` 和 `JSON.stringify()`**
（适用于无函数和特殊对象的场景）
```javascript
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
```

2. **递归实现深拷贝**
```javascript
// 定义 deepCopy 函数，接收一个对象作为参数
const deepCopy = (obj) => {
  // 如果对象为 null 或者不是对象类型，直接返回该对象
  if (obj === null || typeof obj!== 'object') return obj;

  // 判断对象是否为数组，如果是数组，创建一个空数组作为复制对象，否则创建一个空对象
  const copy = Array.isArray(obj)? [] : {};
  // 遍历对象的键
  for (const key in obj) {
    // 确保只复制对象自身的属性，不复制原型链上的属性
    if (obj.hasOwnProperty(key)) {
      // 递归调用 deepCopy 函数，对每个属性进行深拷贝
      copy[key] = deepCopy(obj[key]);
    }
  }
  // 返回深拷贝后的对象
  return copy;
};
```

3. **使用 `structuredClone`**
（现代浏览器支持）
```javascript
const deepCopy = (obj) => structuredClone(obj);
```

---

**总结**

- 浅拷贝适合拷贝简单对象。
- 深拷贝应根据场景选择合适方法：如递归更灵活，`JSON`方法简单但有限制，`structuredClone`是现代浏览器的首选。

### 5、数组扁平化

你可以使用递归来实现一个数组扁平化函数，将多维数组变成一维数组。下面是一个JavaScript函数示例：

```javascript
function flattenArray(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 如果当前元素是数组，递归调用flattenArray并合并结果
      result = result.concat(flattenArray(arr[i]));
    } else {
      // 如果不是数组，直接将元素添加到结果数组中
      result.push(arr[i]);
    }
  }

  return result;
}

// 示例用法
const nestedArray = [1, [2, [3, 4], 5], 6];
const flattenedArray = flattenArray(nestedArray);
console.log(flattenedArray); // 输出 [1, 2, 3, 4, 5, 6]
```

这个`flattenArray`函数接受一个多维数组作为参数，然后使用递归遍历数组的每个元素。如果当前元素是数组，它会递归调用`flattenArray`来处理内部数组，并将结果合并到结果数组中。如果当前元素不是数组，它将直接将元素添加到结果数组中。最终，返回一个一维数组，其中包含了多维数组中的所有元素。

### 6、防抖和节流

以下是手写的防抖和节流函数：

---

#### **防抖函数（Debounce）**
防抖函数在事件触发后，只有在指定的时间间隔内没有再次触发，才会执行函数。

```javascript
function debounce(func, delay) {
  let timer; // 定时器
  return function (...args) {
    clearTimeout(timer); // 清除上一次的定时器
    timer = setTimeout(() => {
      func.apply(this, args); // 保证 `this` 的正确性
    }, delay);
  };
}

// 测试防抖
const log = debounce(() => console.log('防抖触发！'), 1000);
window.addEventListener('resize', log);
```

---

#### **节流函数（Throttle）**
节流函数在指定的时间间隔内，只允许执行一次函数。

**使用定时器**
```javascript
function throttle(func, delay) {
  let timer;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args); // 执行函数
        timer = null; // 清空定时器
      }, delay);
    }
  };
}

// 测试节流
const log = throttle(() => console.log('节流触发！'), 1000);
window.addEventListener('scroll', log);
```

---

 **对比与选择**
1. **防抖**适用于短时间内频繁触发的场景，比如搜索框输入、窗口大小调整等。
2. **节流**适用于需要控制频率的场景，比如滚动事件、页面点击等。

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
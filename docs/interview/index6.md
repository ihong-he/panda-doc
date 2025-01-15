---
outline: deep
---

## 二、JavaScript

### 1、js数据类型有哪些

JavaScript有七种基本数据类型：

1. **Number**：用于整数和浮点数。
2. **String**：用于表示文本数据，即字符串。
3. **Boolean**：仅有两个值`true`和`false`，用于逻辑运算。
4. **Undefined**：当声明一个变量但未赋值时，默认值为`undefined`。
5. **Null**：只有一个值`null`，表示无或空值。
6. **Symbol**（ES6新增）：表示独一无二的值，通常用作对象属性的键。
7. **BigInt**（ES11新增）：用于安全地存储和操作大整数。

此外，还有**Object**类型，它是一种引用类型，用于存储复杂的数据结构如对象、数组、函数等。这些是构成JavaScript语言基础的所有数据类型。

### 2、如何检测数据类型

在JavaScript中，您可以使用不同的方法来检测数据类型。以下是一些常用的方法：

1. **typeof 操作符**：`typeof` 操作符用于检测变量或值的数据类型，并返回一个表示数据类型的字符串。

   ```javascript
   typeof 5; // 返回 "number"
   typeof "Hello"; // 返回 "string"
   typeof true; // 返回 "boolean"
   typeof undefined; // 返回 "undefined"
   typeof null; // 返回 "object"（注意这是一个历史遗留问题，null被错误地认为是"object"）
   typeof {}; // 返回 "object"
   typeof []; // 返回 "object"（数组也被错误地认为是"object"）
   typeof function() {}; // 返回 "function"
   ```

   `typeof` 对于大多数数据类型都有效，但对于对象和数组来说，它只会返回 "object"。要进一步检测对象的具体类型，需要使用其他方法。


2. **Array.isArray()**：用于检测一个值是否为数组。

   ```javascript
   Array.isArray([]); // 返回 true
   Array.isArray({}); // 返回 false
   ```

   这是专门用于检测数组的方法。

3. **instanceof 操作符**：`instanceof` 操作符用于检测对象是否是特定构造函数的实例。

   ```javascript
   let d = new Date();
   d instanceof Date; // 返回 true，d是Date对象的实例
   ```

   `instanceof` 主要用于检测自定义的构造函数和实例之间的关系。

这些方法可以根据您的需求来选择使用，根据不同情况来确定数据类型是很重要的，特别是在处理不同类型的数据时。

### 3、null和undefined区别是什么

`null`和`undefined`在JavaScript中都是表示“无”的值，但它们之间有一些关键的区别：

1. **含义与用途**：
   - `undefined`：表示一个变量已声明但尚未赋值，或者对象属性不存在时的默认值。它意味着“未定义”，通常用于指示变量或属性还没有被赋予有效的值。
   - `null`：表示一个变量指向的对象为空（即没有对象），或者有意地将一个变量设置为“空”或“无”。它代表的是“无值”或“空值”。

2. **类型差异**：
   - 使用`typeof`操作符检查时，`undefined`的结果是`"undefined"`，而`null`的结果却是`"object"`。这是一个历史遗留问题，实际上`null`被认为是一个原始值。

3. **赋值意图**：
   - 当你使用`null`时，通常是明确地指出这个变量不引用任何对象，是一种有意识的空值设定。
   - `undefined`则更多时候是由JavaScript引擎自动分配的，表明某物尚未被赋予特定值。

简单来说，如果你想要表达“这里应该有一个值，但现在没有”，你可以选择`null`。而`undefined`则更常用于描述“这里本应有一个值，但它尚未被设置或不可用”。理解这两者的区别有助于编写更加精确和清晰的代码。

### 4、数组基本方法

JavaScript 中数组有许多常用的方法，这些方法用于操作和处理数组的元素。以下是一些常见的数组方法，以及每个方法的示例：

1. **`push()` 方法**：向数组末尾添加一个或多个元素，并返回新的数组长度。

   ```javascript
   var fruits = ['apple', 'banana'];
   var newLength = fruits.push('orange', 'cherry');
   console.log(fruits); // ['apple', 'banana', 'orange', 'cherry']
   console.log(newLength); // 4
   ```

2. **`pop()` 方法**：移除数组最后一个元素，并返回移除的元素。

   ```javascript
   var fruits = ['apple', 'banana', 'orange'];
   var removedFruit = fruits.pop();
   console.log(fruits); // ['apple', 'banana']
   console.log(removedFruit); // 'orange'
   ```

3. **`unshift()` 方法**：向数组开头添加一个或多个元素，并返回新的数组长度。

   ```javascript
   var fruits = ['apple', 'banana'];
   var newLength = fruits.unshift('orange', 'cherry');
   console.log(fruits); // ['orange', 'cherry', 'apple', 'banana']
   console.log(newLength); // 4
   ```

4. **`shift()` 方法**：移除数组的第一个元素，并返回移除的元素。

   ```javascript
   var fruits = ['orange', 'cherry', 'apple', 'banana'];
   var removedFruit = fruits.shift();
   console.log(fruits); // ['cherry', 'apple', 'banana']
   console.log(removedFruit); // 'orange'
   ```

5. **`concat()` 方法**：合并两个或多个数组，返回一个新的数组，不会改变原始数组。

   ```javascript
   var fruits1 = ['apple', 'banana'];
   var fruits2 = ['orange', 'cherry'];
   var combinedFruits = fruits1.concat(fruits2);
   console.log(combinedFruits); // ['apple', 'banana', 'orange', 'cherry']
   ```

6. **`join()` 方法**：将数组的所有元素组成一个字符串，并使用指定的分隔符分隔元素。

   ```javascript
   var fruits = ['apple', 'banana', 'cherry'];
   var fruitString = fruits.join(', ');
   console.log(fruitString); // 'apple, banana, cherry'
   ```

7. **`slice()` 方法**：从数组中提取指定范围的元素，并返回一个新的数组，不会改变原始数组。

   ```javascript
   var fruits = ['apple', 'banana', 'cherry', 'orange', 'kiwi'];
   var slicedFruits = fruits.slice(1, 4);
   console.log(slicedFruits); // ['banana', 'cherry', 'orange']
   ```

8. **`splice()` 方法**：用于删除、替换或添加数组的元素。

   ```javascript
   var fruits = ['apple', 'banana', 'cherry', 'orange', 'kiwi'];
   fruits.splice(2, 1); // 删除从索引 2 开始的 1 个元素
   console.log(fruits); // ['apple', 'banana', 'orange', 'kiwi']

   fruits.splice(1, 2, 'grape', 'melon'); // 替换从索引 1 开始的 2 个元素
   console.log(fruits); // ['apple', 'grape', 'melon', 'orange', 'kiwi']

   fruits.splice(2, 0, 'pear', 'peach'); // 在索引 2 处添加新元素
   console.log(fruits); // ['apple', 'grape', 'pear', 'peach', 'melon', 'orange', 'kiwi']
   ```

9. **`indexOf()` 方法**：返回数组中第一个匹配元素的索引，如果未找到匹配元素则返回 -1。

   ```javascript
   var fruits = ['apple', 'banana', 'cherry', 'orange'];
   var index = fruits.indexOf('cherry');
   console.log(index); // 2
   ```

10. **`lastIndexOf()` 方法**：返回数组中最后一个匹配元素的索引，如果未找到匹配元素则返回 -1。

    ```javascript
    var fruits = ['apple', 'banana', 'cherry', 'orange', 'cherry'];
    var lastIndex = fruits.lastIndexOf('cherry');
    console.log(lastIndex); // 4
    ```

这些是一些常用的数组方法，它们允许您对数组进行添加、删除、合并、提取等操作。根据您的需求，选择适当的方法来处理数组。
### 5、数组遍历方法

JavaScript 数组有多种方法用于遍历数组中的元素。以下是一些常用的数组遍历方法：

1. **`forEach()` 方法**：遍历数组的每一个元素，并对每个元素执行指定的回调函数，没有返回值。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   numbers.forEach(function(number) {
       console.log(number);
   });
   ```

2. **`map()` 方法**：遍历数组的每一个元素，并调用指定的函数，最终返回一个新的数组。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var doubled = numbers.map(function(number) {
       return number * 2;
   });
   console.log(doubled); // [2, 4, 6, 8, 10]
   ```

3. **`filter()` 方法**：用于过滤数组的元素，返回一个符合指定条件的新数组，不会改变原始数组。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var evenNumbers = numbers.filter(function(number) {
       return number % 2 === 0;
   });
   console.log(evenNumbers); // [2, 4]
   ```

4. **`reduce()` 方法**：对数组的元素累加应用一个函数，返回一个累加的结果。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var sum = numbers.reduce(function(accumulator, currentNumber) {
       return accumulator + currentNumber;
   }, 0); // 初始值为 0
   console.log(sum); // 15
   ```

5. **`some()` 方法**：检查数组中是否至少有一个元素满足指定条件，如果有则返回 `true`，否则返回 `false`。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var hasEven = numbers.some(function(number) {
       return number % 2 === 0;
   });
   console.log(hasEven); // true
   ```

6. **`every()` 方法**：检查数组中是否所有元素都满足指定条件，如果是则返回 `true`，否则返回 `false`。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var allEven = numbers.every(function(number) {
       return number % 2 === 0;
   });
   console.log(allEven); // false
   ```

7. **`find()` 方法**：返回数组中第一个满足指定条件的元素，如果没有找到则返回 `undefined`。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var firstEven = numbers.find(function(number) {
       return number % 2 === 0;
   });
   console.log(firstEven); // 2
   ```

8. **`findIndex()` 方法**：返回数组中第一个满足指定条件的元素的索引，如果没有找到则返回 `-1`。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var firstEvenIndex = numbers.findIndex(function(number) {
       return number % 2 === 0;
   });
   console.log(firstEvenIndex); // 1 (元素 2 的索引)
   ```

这些数组遍历方法允许您以不同的方式操作和处理数组的元素，根据需要选择适当的方法。

### 6、字符串方法

JavaScript 字符串具有许多内置方法，用于处理和操作字符串。以下是一些常用的字符串方法：

1. **`length` 属性**：返回字符串的长度。

   ```javascript
   var str = "Hello, World!";
   console.log(str.length); // 13
   ```

2. **`charAt()` 方法**：返回指定索引位置的字符。

   ```javascript
   var str = "Hello, World!";
   console.log(str.charAt(0)); // 'H'
   ```

3. **`charCodeAt()` 方法**：返回指定索引位置字符的 Unicode 编码。

   ```javascript
   var str = "Hello, World!";
   console.log(str.charCodeAt(0)); // 72 (字符 'H' 的 Unicode 编码)
   ```

4. **`substring()` 方法**：返回字符串的子字符串，指定起始索引和结束索引。

   ```javascript
   var str = "Hello, World!";
   console.log(str.substring(0, 5)); // 'Hello'
   ```

5. **`slice()` 方法**：返回字符串的子字符串，指定起始索引和可选的结束索引。

   ```javascript
   var str = "Hello, World!";
   console.log(str.slice(0, 5)); // 'Hello'
   ```

6. **`indexOf()` 方法**：返回字符串中第一次出现指定子字符串的索引，如果未找到则返回 -1。

   ```javascript
   var str = "Hello, World!";
   console.log(str.indexOf("World")); // 7
   ```

7. **`lastIndexOf()` 方法**：返回字符串中最后一次出现指定子字符串的索引，如果未找到则返回 -1。

   ```javascript
   var str = "Hello, World!";
   console.log(str.lastIndexOf("o")); // 8
   ```

8. **`replace()` 方法**：替换字符串中的指定子字符串为新的字符串。

   ```javascript
   var str = "Hello, World!";
   var newStr = str.replace("World", "Universe");
   console.log(newStr); // 'Hello, Universe!'
   ```

9. **`toLowerCase()` 和 `toUpperCase()` 方法**：将字符串转换为小写或大写。

   ```javascript
   var str = "Hello, World!";
   console.log(str.toLowerCase()); // 'hello, world!'
   console.log(str.toUpperCase()); // 'HELLO, WORLD!'
   ```

10. **`trim()` 方法**：去除字符串两端的空白字符。

    ```javascript
    var str = "   Hello, World!   ";
    var trimmedStr = str.trim();
    console.log(trimmedStr); // 'Hello, World!'
    ```

11. **`split()` 方法**：将字符串分割为数组，使用指定的分隔符。

    ```javascript
    var str = "apple,banana,cherry";
    var fruits = str.split(",");
    console.log(fruits); // ['apple', 'banana', 'cherry']
    ```

12. **`concat()` 方法**：将多个字符串拼接成一个新字符串。

    ```javascript
    var str1 = "Hello,";
    var str2 = "World!";
    var greeting = str1.concat(" ", str2);
    console.log(greeting); // 'Hello, World!'
    ```

这些是一些常用的字符串方法，它们允许您对字符串进行各种操作，如查找、替换、拆分、转换大小写等。根据您的需求选择适当的方法。

### 7、闭包函数

闭包函数（Closure）是一个函数，它可以访问其包含函数（外部函数）作用域中的变量，即使外部函数已经执行完毕。
闭包函数通常用于以下情况：

1. 保留变量的状态：通过闭包，变量的值可以在外部函数执行完毕后继续存在，不会被垃圾回收。

2. 封装私有数据：通过闭包，可以创建私有变量和方法，这些私有变量和方法对外部代码不可见。

3. 创建工厂函数：通过闭包，可以创建类似于工厂函数的机制，用于生成对象实例。

下面是一些示例，演示了如何创建和使用闭包函数：

- **保留变量的状态：**

```javascript
function counter() {
  let count = 0;

  return function() {
    return ++count;
  };
}

const increment = counter();

console.log(increment()); // 1
console.log(increment()); // 2
console.log(increment()); // 3
```

在上面的示例中，`counter` 函数返回一个内部函数，该内部函数使用了 `count` 变量，即使 `counter` 函数已经执行完毕，但内部函数依然可以访问并修改 `count` 变量的状态。

### 8、说说对原型、原型链的理解

在JavaScript中，每个对象都有一个内部属性 `Prototype`，通常称为原型（Prototype）。这个原型是一个指向另一个对象的引用，用来实现对象之间的继承关系。

当我们访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript引擎会沿着原型链向上查找，直到找到匹配的属性或方法或者到达原型链的顶端（Object.prototype）。

**原型（Prototype）**：每个对象都有一个原型，它是一个指向另一个对象的引用，用来寻找属性和方法。

**原型链（Prototype Chain）**：当查找属性或方法时，如果当前对象没有，JavaScript引擎会沿着原型链向上查找，直到找到匹配的属性或方法，或者到达原型链的顶端。

以下是对原型和原型链的更详细解释：

1. **原型（Prototype）**：
   - 原型是一个对象，它包含可以被其他对象继承的属性和方法。
   - 在JavaScript中，每个对象都有一个原型，可以通过 `__proto__` 属性访问，或者使用 `Object.getPrototypeOf()` 方法来获取。
   - 当访问一个对象的属性或方法时，如果在对象本身找不到，JavaScript引擎会自动查找该对象的原型，以查找属性或方法。

2. **原型链（Prototype Chain）**：
   - 原型链是一系列连接在一起的对象，每个对象都有一个原型，直到达到原型链的顶端，它的原型是 `null`。
   - 当查找属性或方法时，JavaScript引擎会首先在当前对象本身查找，如果找不到，就会沿着原型链向上查找，直到找到匹配的属性或方法，或者到达原型链的顶端。
   - 原型链允许对象之间共享属性和方法，实现了继承的概念。

示例：

```javascript
// 创建一个对象 person
const person = {
    firstName: "John",
    lastName: "Doe",
};

// person 对象的原型是 Object.prototype
console.log(person.__proto__ === Object.prototype); // true

// Object.prototype 的原型是 null，这是原型链的顶端
console.log(Object.getPrototypeOf(Object.prototype) === null); // true
```

原型和原型链是JavaScript中实现继承和对象共享属性的基础，它们是理解对象之间关系和属性查找的关键概念。


### 9、new操作符都做了什么事情

在JavaScript中，`new` 操作符用于创建对象的实例。当使用 `new` 操作符创建一个对象实例时，它执行以下步骤：

1. 创建一个空对象：首先，`new` 操作符会创建一个新的空对象，这个对象将成为最终的实例。

2. 设置对象的原型：新创建的空对象会被设置一个原型，它用于继承构造函数的属性和方法。

3. 执行构造函数：`new` 操作符会调用构造函数，并将新创建的空对象绑定到构造函数内部的 `this` 上。

4. 返回新对象：如果构造函数没有显式返回一个对象，则 `new` 操作符会自动返回新创建的对象。

下面是一个使用 `new` 操作符创建对象实例的示例：

```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// 使用 new 操作符创建一个 Person 的实例
const person1 = new Person("Alice", 30);

console.log(person1.name); // 输出 "Alice"
console.log(person1.age); // 输出 30
```

需要注意的是，`new` 操作符不仅用于创建内置对象（如 `Array`、`Date` 等），还用于创建自定义的构造函数（如上面的 `Person` 构造函数）。使用 `new` 操作符可以帮助创建对象实例，并且可以通过构造函数来初始化对象的属性和方法。

### 10、说说你对this的理解

在JavaScript中，`this` 是一个特殊关键字，它代表当前执行上下文中的对象。`this` 的值取决于它在哪里被使用，通常有以下几种情况：

1. **全局上下文中的 `this`：** 在全局作用域中，`this` 指向全局对象，通常是浏览器环境中的 `window` 对象。

2. **函数内部的 `this`：** 在函数内部，`this` 取决于函数的调用方式。以下是一些常见情况：
   - **作为普通函数调用：** 如果函数是作为普通函数调用的，`this` 将指向全局对象（浏览器环境中通常是 `window`）。
   - **作为对象方法调用：** 如果函数作为对象的方法调用，`this` 将指向调用该方法的对象。
   - **使用构造函数：** 如果函数作为构造函数使用（使用 `new` 关键字），`this` 将指向新创建的对象。
   - **使用 `call` 或 `apply` 方法：** 可以使用 `call` 或 `apply` 方法来显式指定函数内部的 `this` 值。

3. **箭头函数中的 `this`：** 箭头函数没有自己的 `this`，它会继承外部函数的 `this` 值。这使得箭头函数在回调函数等情况下非常有用，因为它们不会改变 `this` 的指向。

总之，`this` 的值在 JavaScript 中是动态的，取决于执行上下文。理解 `this` 的关键是了解它是如何绑定的，它可能是全局对象、调用它的对象，或者是通过箭头函数继承的外部 `this`。

### 11、防抖和节流

防抖（Debouncing）和节流（Throttling）都是用于控制事件触发频率的技术，通常在Web前端开发中用来提高性能和用户体验。

1. 防抖（Debouncing）：
   - 防抖是在事件被触发后，会等待一段时间（例如 100ms），如果在这段时间内没有再次触发事件，那么才会执行事件处理函数；如果在这段时间内事件又被触发，则重新开始计时。
   - 主要用于防止短时间内多次触发的事件导致过多的资源消耗，例如输入框输入时的搜索功能，只有在用户停止输入一段时间后才触发搜索请求。

   JavaScript中的一个简单防抖函数示例：
   ```javascript
   function debounce(func, delay) {
     let timer;
     return function() {
       clearTimeout(timer);
       timer = setTimeout(() => {
         func.apply(this, arguments);
       }, delay);
     };
   }
   ```

2. 节流（Throttling）：
   - 节流是在一段时间内只允许执行一次事件处理函数，即使事件在这段时间内被触发多次，也只会执行一次事件处理函数。
   - 与防抖不同，节流不会重新开始计时，而是固定间隔执行事件处理函数。
   - 主要用于频繁触发的事件，以控制事件处理函数的执行频率，例如滚动事件，每隔一定时间触发一次滚动事件处理函数，而不是每次滚动都触发。

   JavaScript中的一个简单节流函数示例：
   ```javascript
   function throttle(func, delay) {
     let timer;
     return function() {
       if (!timer) {
         timer = setTimeout(() => {
           func.apply(this, arguments);
           timer = null;
         }, delay);
       }
     };
   }
   ```

需要注意的是，防抖和节流的具体实现方式可以根据具体的需求和场景进行调整和扩展。选择合适的技术来控制事件触发频率可以提高网页性能，减少不必要的资源消耗。

### 12、为什么0.1+0.2 ! == 0.3

0.1 + 0.2 不等于 0.3 是由于 JavaScript 中的浮点数精度问题导致的。这是由于浮点数在计算机内部以二进制表示，而某些小数无法准确表示为二进制分数，因此可能会出现微小的舍入误差。

要解决这个问题，通常可以使用以下方法之一：

1. **四舍五入或修复小数位数**：
   ```javascript
   const result = (0.1 + 0.2).toFixed(1); // 将结果四舍五入为指定小数位数
   console.log(parseFloat(result) === 0.3); // true
   ```

2. **使用EPSILON比较**：
   这是一种常见的方法，它通过比较两个浮点数的差是否小于一个小的误差值来判断它们是否近似相等。
   ```javascript
   const epsilon = 0.000001; // 定义一个足够小的误差值
   const result = 0.1 + 0.2;
   console.log(Math.abs(result - 0.3) < epsilon); // true
   ```

3. **使用第三方库**：
   一些第三方库，如`decimal.js`或`big.js`，提供了更精确的数学运算，可以避免浮点数精度问题。

总之，要在JavaScript中比较浮点数时，最好使用适当的方法来处理精度问题，以确保得到正确的结果。

### 13、Ts和Js有哪些区别

[TypeScript](/note/ts) 和 JavaScript 是两种不同的编程语言，它们之间有一些显著的区别：

1. **类型系统：**
   - JavaScript 是一种动态类型语言，变量的类型在运行时才确定。
   - TypeScript 是一种静态类型语言，它引入了类型系统，在编译时就能够确定变量的类型。

2. **类型注解：**
   - 在 TypeScript 中，可以使用类型注解来明确变量的类型，例如 `let num: number = 10;`。
   - JavaScript 中没有类型注解的概念，变量的类型是由赋值的值来推断的。

3. **编译环境：**
   - JavaScript 可以在浏览器、Node.js 等环境中直接运行，无需编译。
   - TypeScript 需要通过编译器将 TypeScript 代码转换为 JavaScript 代码，然后才能在浏览器或 Node.js 中运行。

4. **语言功能：**
   - TypeScript 在 JavaScript 的基础上增加了一些功能，如接口、枚举、泛型等，使得代码更加可读性和可维护性更强。

5. **错误检查：**
   - TypeScript 编译器可以在编译时发现一些潜在的错误，例如类型不匹配、未定义的变量等，从而帮助开发者提前发现并修复问题。
   - JavaScript 在运行时才会报错，因此需要更加谨慎地编写代码来避免错误。

总的来说，TypeScript 是 JavaScript 的超集，它在 JavaScript 的基础上添加了类型系统等功能，使得代码更加健壮、可维护。因此，对于大型项目或团队协作来说，使用 TypeScript 可以提高代码质量和开发效率。
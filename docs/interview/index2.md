---
outline: deep
---
## 目录表
[[toc]]

## 一、JavaScript 基础

### 1、JS数据类型

JavaScript 有七种基本数据类型：

1. **Number**：用于整数和浮点数。
2. **String**：用于表示文本数据，即字符串。
3. **Boolean**：仅有两个值`true`和`false`，用于逻辑运算。
4. **Undefined**：当声明一个变量但未赋值时，默认值为`undefined`。
5. **Null**：只有一个值`null`，表示无或空值。
6. **Symbol**（ES6 新增）：表示独一无二的值，通常用作对象属性的键。
7. **BigInt**（ES11 新增）：用于安全地存储和操作大整数。

此外，还有**Object**类型，它是一种引用类型，用于存储复杂的数据结构如对象、数组、函数等。这些是构成 JavaScript 语言基础的所有数据类型。

### 2、如何检测数据类型

在 JavaScript 中，您可以使用不同的方法来检测数据类型。以下是一些常用的方法：

1. **typeof 操作符**：`typeof` 操作符用于检测变量或值的数据类型，并返回一个表示数据类型的字符串。

   ```javascript
   typeof 5; // 返回 "number"
   typeof "Hello"; // 返回 "string"
   typeof true; // 返回 "boolean"
   typeof undefined; // 返回 "undefined"
   typeof null; // 返回 "object"（注意这是一个历史遗留问题，null被错误地认为是"object"）
   typeof {}; // 返回 "object"
   typeof []; // 返回 "object"（数组也被错误地认为是"object"）
   typeof function () {}; // 返回 "function"
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

### 3、null vs undefined

`null`和`undefined`在 JavaScript 中都是表示“无”的值，但它们之间有一些关键的区别：

1. **含义与用途**：

   - `undefined`：表示一个变量已声明但尚未赋值，或者对象属性不存在时的默认值。它意味着“未定义”，通常用于指示变量或属性还没有被赋予有效的值。
   - `null`：表示一个变量指向的对象为空（即没有对象），或者有意地将一个变量设置为“空”或“无”。它代表的是“无值”或“空值”。

2. **类型差异**：

   - 使用`typeof`操作符检查时，`undefined`的结果是`"undefined"`，而`null`的结果却是`"object"`。这是一个历史遗留问题，实际上`null`被认为是一个原始值。

3. **赋值意图**：
   - 当你使用`null`时，通常是明确地指出这个变量不引用任何对象，是一种有意识的空值设定。
   - `undefined`则更多时候是由 JavaScript 引擎自动分配的，表明某物尚未被赋予特定值。

简单来说，如果你想要表达“这里应该有一个值，但现在没有”，你可以选择`null`。而`undefined`则更常用于描述“这里本应有一个值，但它尚未被设置或不可用”。理解这两者的区别有助于编写更加精确和清晰的代码。

### 4、数组基本方法

JavaScript 中数组有许多常用的方法，这些方法用于操作和处理数组的元素。以下是一些常见的数组方法，以及每个方法的示例：

1. **`push()` 方法**：向数组末尾添加一个或多个元素，并返回新的数组长度。

2. **`pop()` 方法**：移除数组最后一个元素，并返回移除的元素。

3. **`unshift()` 方法**：向数组开头添加一个或多个元素，并返回新的数组长度。

4. **`shift()` 方法**：移除数组的第一个元素，并返回移除的元素。

5. **`concat()` 方法**：合并两个或多个数组，返回一个新的数组，不会改变原始数组。

6. **`join()` 方法**：将数组的所有元素组成一个字符串，并使用指定的分隔符分隔元素。

7. **`slice()` 方法**：从数组中提取指定范围的元素，并返回一个新的数组，不会改变原始数组。

   ```javascript
   var fruits = ["apple", "banana", "cherry", "orange", "kiwi"];
   var slicedFruits = fruits.slice(1, 4);
   console.log(slicedFruits); // ['banana', 'cherry', 'orange']
   ```

8. **`indexOf()` 方法**：返回数组中第一个匹配元素的索引，如果未找到匹配元素则返回 -1。


### 5、数组遍历方法

JavaScript 数组有多种方法用于遍历数组中的元素。以下是一些常用的数组遍历方法：

1. **`forEach()` 方法**：遍历数组的每一个元素，并对每个元素执行指定的回调函数，没有返回值。

2. **`map()` 方法**：遍历数组的每一个元素，并调用指定的函数，最终返回一个新的数组。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var doubled = numbers.map(function (number) {
     return number * 2;
   });
   console.log(doubled); // [2, 4, 6, 8, 10]
   ```

3. **`filter()` 方法**：用于过滤数组的元素，返回一个符合指定条件的新数组，不会改变原始数组。

4. **`reduce()` 方法**：对数组的元素累加应用一个函数，返回一个累加的结果。

   ```javascript
   var numbers = [1, 2, 3, 4, 5];
   var sum = numbers.reduce(function (accumulator, currentNumber) {
     return accumulator + currentNumber;
   }, 0); // 初始值为 0
   console.log(sum); // 15
   ```

5. **`some()` 方法**：检查数组中是否至少有一个元素满足指定条件，如果有则返回 `true`，否则返回 `false`。

6. **`every()` 方法**：检查数组中是否所有元素都满足指定条件，如果是则返回 `true`，否则返回 `false`。

### 6、字符串方法

JavaScript 字符串具有许多内置方法，用于处理和操作字符串。以下是一些常用的字符串方法：

1. **`length` 属性**：返回字符串的长度。

2. **`charAt()` 方法**：返回指定索引位置的字符。

   ```javascript
   var str = "Hello, World!";
   console.log(str.charAt(0)); // 'H'
   ```

3. **`charCodeAt()` 方法**：返回指定索引位置字符的 Unicode 编码。

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


这些是一些常用的字符串方法，它们允许您对字符串进行各种操作，如查找、替换、拆分、转换大小写等。根据您的需求选择适当的方法。

### 7、闭包函数

闭包是指有权访问另一个函数作用域中变量的函数。

- **原理**：在一个函数内部定义另一个函数，内部函数可以访问外部函数的变量。当外部函数执行完毕后，其内部变量本应该被销毁，但因为内部函数仍然引用这些变量，所以这些变量不会被垃圾回收机制回收，从而形成了闭包。
- **作用**：可以用来保留变量的状态或者实现数据隐藏和封装，例如在JavaScript中模拟私有变量。比如：
```javascript
function outerFunction() {
    let count = 0;
    return function innerFunction() {
        count++;
        return count;
    };
}
let counter = outerFunction();
console.log(counter()); // 1
console.log(counter()); // 2
```
在这个例子中，`innerFunction`就是一个闭包，它可以访问`outerFunction`中的`count`变量，并且这个变量在多次调用`counter`函数时能够一直保存状态。

### 8、原型、原型链

在JavaScript中，原型（Prototype）和原型链（Prototype Chain）是实现继承的核心机制。

- **原型和原型链**：每个JavaScript对象都有一个内部属性 `[[Prototype]]`，通常称为**原型**，指向它的原型对象。这个原型对象本身也是一个对象，因此也有自己的原型。通过这种方式，对象之间形成了一个链式结构，即**原型链**。

- **原型链的查找机制**：当访问一个对象的属性时，如果该对象自身没有这个属性，JavaScript引擎会沿着原型链向上查找，直到找到目标属性或到达原型链的末端（`null`）。这种机制允许对象共享属性和方法，节省内存消耗并提高代码复用性。

例如：

```javascript
let obj = {};
console.log(obj.toString()); // 使用了从Object.prototype继承的方法toString
```

在这个例子中，`obj`对象本身没有定义`toString`方法，但它可以通过原型链访问到`Object.prototype`上的`toString`方法。


### 9、new 操作符

在 JavaScript 中，`new` 操作符用于创建对象的实例。当使用 `new` 操作符创建一个对象实例时，它执行以下步骤：

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


### 10、对 this 的理解

在 JavaScript 中，`this` 是一个特殊关键字，它代表当前执行上下文中的对象。`this` 的值取决于它在哪里被使用，通常有以下几种情况：

1. **全局上下文中的 `this`：** 在全局作用域中，`this` 指向全局对象，通常是浏览器环境中的 `window` 对象。

2. **函数内部的 `this`：** 在函数内部，`this` 取决于函数的调用方式。以下是一些常见情况：

   - **作为普通函数调用：** 如果函数是作为普通函数调用的，`this` 将指向全局对象（浏览器环境中通常是 `window`）。
   - **作为对象方法调用：** 如果函数作为对象的方法调用，`this` 将指向调用该方法的对象。
   - **使用构造函数：** 如果函数作为构造函数使用（使用 `new` 关键字），`this` 将指向新创建的对象。
   - **使用 `call` 或 `apply` 方法：** 可以使用 `call` 或 `apply` 方法来显式指定函数内部的 `this` 值。

3. **箭头函数中的 `this`：** 箭头函数没有自己的 `this`，它会继承外部函数的 `this` 值。这使得箭头函数在回调函数等情况下非常有用，因为它们不会改变 `this` 的指向。

### 11、防抖和节流

防抖（Debouncing）和节流（Throttling）都是用于控制事件触发频率的技术，通常在 Web 前端开发中用来提高性能和用户体验。

1. 防抖（Debouncing）：

   - 防抖是在事件被触发后，会等待一段时间（例如 100ms），如果在这段时间内没有再次触发事件，那么才会执行事件处理函数；如果在这段时间内事件又被触发，则重新开始计时。
   - 主要用于防止短时间内多次触发的事件导致过多的资源消耗，例如输入框输入时的搜索功能，只有在用户停止输入一段时间后才触发搜索请求。

   JavaScript 中的一个简单防抖函数示例：

   ```javascript
   function debounce(func, delay) {
     let timer;
     return function () {
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

   JavaScript 中的一个简单节流函数示例：

   ```javascript
   function throttle(func, delay) {
     let timer;
     return function () {
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

### 12、0.1+0.2 ! == 0.3？

1. **原因分析**
   - 在计算机中，十进制的小数（如0.1和0.2）会被转换为二进制来进行计算。0.1的二进制表示是一个无限循环小数，0.2也是。
   - 当计算机对这两个二进制小数进行相加时，会产生舍入误差。相加后的结果的二进制再转换回十进制就不是精确的0.3，而是`0.30000000000000004`。
2. **解决方法**
   - 在JavaScript等编程语言中，如果要比较浮点数是否相等，可以设置一个误差范围。例如：
   ```javascript
   function approximatelyEqual(a, b, tolerance = 0.00001) {
       return Math.abs(a - b) < tolerance;
   }
   console.log(approximatelyEqual(0.1 + 0.2, 0.00001)); 
   ```
   - 这样就可以在一定程度上解决浮点数比较的问题。这种误差是由于计算机底层存储和计算浮点数的机制导致的，几乎所有编程语言都会遇到这个问题。

### 13、Ts 和 Js 有哪些区别

1. **类型系统**
   - **JavaScript（Js）**：是一种动态类型语言。这意味着变量的类型在运行时才确定，并且可以在运行过程中改变类型。例如：
   ```javascript
   let variable = 1;
   variable = "string";
   ```
   - **TypeScript（Ts）**：是JavaScript的超集，具有静态类型系统。在代码编写阶段就需要确定变量、函数参数、返回值等的类型。例如：
   ```typescript
   let variable: number = 1;
   variable = "string"; // 会报错，因为类型不匹配
   ```
   - 静态类型系统有助于在开发阶段发现更多错误，提高代码的健壮性和可维护性。
2. **编译过程**
   - **Js**：可以直接在浏览器或Node.js环境中运行，不需要额外的编译步骤。
   - **Ts**：需要先编译成JavaScript才能运行。编译器会检查类型错误并将Ts代码转换为兼容的Js代码。例如，使用`tsc`（TypeScript编译器）命令来编译`.ts`文件：
   ```
   tsc yourFile.ts
   ```
3. **语言特性和语法糖**
   - **Ts**：提供了一些JavaScript中没有的语法特性，如接口（interface）、枚举（enum）、泛型（generic）等。
   - 接口用于定义对象的形状，例如：
   ```typescript
   interface Person {
       name: string;
       age: number;
   }
   let person: Person = {
       name: "John",
       age: 30
   };
   ```
   - 枚举用于定义一组命名常量，例如：
   ```typescript
   enum Color {
       Red,
       Green,
       Blue
   }
   let myColor: Color = Color.Green;
   ```
   - 泛型可以创建可复用的代码，适用于多种类型，例如：
   ```typescript
   function identity<T>(arg: T): T {
       return arg;
   }
   let result = identity<string>("string value");
   ```
4. **开发工具支持**
   - **Ts**：由于其静态类型系统，集成开发环境（IDE）可以提供更好的代码自动补全、导航和错误检查功能。而JavaScript在这方面相对较弱。

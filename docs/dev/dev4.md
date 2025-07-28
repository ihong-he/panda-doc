---
outline: deep
---

## 数据处理与状态管理

> 关注前端应用中数据的查找、过滤、合并、拷贝以及状态管理等问题

### 一、数组遍历与操作

### 1.1、移除数组中不需要的项

**问题描述**

在一个由对象组成的数组中，我们有时需要移除对象中的某些属性（例如 `age`），生成一个新的数组，保留所需的字段。这常用于后端接口字段过滤或前端展示优化。

---

**行之有效的解决方案**

可以使用 `Array.map()` 遍历数组，并在每个对象中利用 **解构赋值** 或 `delete` 操作去除不需要的属性。推荐使用解构或 `Object.keys()` 动态重构新对象，以保持函数式编程风格（不改变原对象）。

---

**配套的代码示例**

```javascript
const arr = [
  { id: 1, name: 'Tom', age: 15 },
  { id: 2, name: 'Jack', age: 18 }
];

// 方法1：使用解构省略
const newArr1 = arr.map(({ age, ...rest }) => rest);
console.log(newArr1);
// 输出: [{ id: 1, name: 'Tom' }, { id: 2, name: 'Jack' }]

// 方法2：动态删除属性 (会改变副本)
const newArr2 = arr.map(item => {
  const copy = { ...item };
  delete copy.age;
  return copy;
});
console.log(newArr2);
// 输出: [{ id: 1, name: 'Tom' }, { id: 2, name: 'Jack' }]
```
::: tip

`({ age, ...rest })` 会从每个对象中取出 age 属性，同时用 `...rest` 收集除 age 以外的其他属性组成的新对象。

:::

---

### 1.2、筛选出满足特定条件的元素

**问题描述**
在前端开发中，经常需要从对象数组中筛选出满足特定条件的所有元素，例如找出 `age > 18` 的所有用户。这种需求常见于表格过滤、数据统计等场景。

---

**行之有效的解决方案**
可以使用 `Array.filter()` 方法，该方法会遍历数组中的每一个元素，并返回一个新的数组，其中只包含满足条件的元素。

* **语法：** `arr.filter(item => 条件表达式)`
* 返回值是一个新的数组，不会修改原始数组。

---

**配套的代码示例**

```javascript
const arr = [
  { id: 1, name: 'Tom', age: 15 },
  { id: 2, name: 'Jack', age: 18 },
  { id: 3, name: 'Lucy', age: 20 }
];

// 筛选 age > 18 的所有对象
const filteredArr = arr.filter(item => item.age > 18);

console.log(filteredArr);
// 输出: [ { id: 3, name: 'Lucy', age: 20 } ]
```

---

**拓展：复杂条件筛选**

```javascript
// 筛选年龄大于15并且名字包含 'a' 的用户
const result = arr.filter(item => item.age > 15 && item.name.includes('a'));
console.log(result);
// 输出: [ { id: 2, name: 'Jack', age: 18 } ]
```

---





### 二、查找和过滤数据
### 三、对象属性的操作

#### 3.1、对象转数组

**问题描述**

在前端开发中，我们经常需要获取一个对象的所有属性名（key），并将其组成一个数组以便后续处理，例如遍历、判断或动态渲染 UI。

---

**行之有效的解决方案**

JavaScript 提供了 `Object.keys()` 方法，它可以直接返回对象所有可枚举的属性名组成的数组。这是最简洁、最常用的方式。

* `Object.keys(obj)` 会返回一个数组，包含对象 `obj` 所有可枚举属性的 key。
* 若需要包括不可枚举属性或 `Symbol` 属性，可使用 `Object.getOwnPropertyNames()` 或 `Reflect.ownKeys()`。

---

**配套的代码示例**

```javascript
// 示例对象
const person = {
  name: "Alice",
  age: 25,
  city: "Beijing"
};

// 使用 Object.keys() 获取所有 key
const keysArray = Object.keys(person);

console.log(keysArray);
// 输出: ["name", "age", "city"]
```

### 四、深拷贝与浅拷贝
### 五、合并对象和数组

#### 5.1、获取两个数组的交集或者并集

**问题描述**
在前端开发中，获取两个数组的交集（共同存在的元素）和并集（所有不重复的元素）是非常常见的需求，特别是在数据过滤、合并等操作中。

---

**行之有效的解决方案**

* **交集**：过滤出第一个数组中存在且也存在于第二个数组的元素。使用 `Set` 加快查找。
* **并集**：把两个数组合并后去重，使用 `Set` 可以方便地去重。

---

**配套的代码示例**

```javascript
// 获取交集
function getIntersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
}

// 获取并集
function getUnion(arr1, arr2) {
  return Array.from(new Set([...arr1, ...arr2]));
}

// 示例
const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];

console.log(getIntersection(array1, array2)); // 输出: [3, 4]
console.log(getUnion(array1, array2));        // 输出: [1, 2, 3, 4, 5, 6]
```

---

需要帮你写差集的简洁版本吗？或者其他数组操作？






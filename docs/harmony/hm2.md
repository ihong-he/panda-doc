---
outline: deep
---

## 七、ArkTS 核心进阶

### 7.1 if 分支语句

#### 作用

根据逻辑条件结果，执行不同代码

#### 语法规则

```TypeScript
if (条件1) {
  // 条件1成立时执行的代码
} else if (条件2) {
  // 条件2成立时执行的代码
} else {
  // 所有条件都不成立时执行的代码
}
```

示例（判断是否为未成年人）：

```TypeScript
let age: number = 17;
if (age < 18) {
  console.log('小朋友，未成年人不能进入网吧');
} else {
  console.log('欢迎光临');
}
```

### 7.2 条件表达式

#### 作用

根据逻辑条件结果，得到不同的值

#### 语法规则

```
条件 ? 条件成立的表达式 : 条件不成立的表达式
```

示例（获取两个数中的较大值）：

```TypeScript
let num1: number = 100;
let num2: number = 20;
let result: number = num1 > num2 ? num1 : num2; // 结果为100
```

### 7.3 条件渲染

#### 作用

根据逻辑条件结果，渲染不同的UI内容

#### 语法规则

```TypeScript
if (条件1) {
  // 条件1成立时渲染的组件
} else if (条件2) {
  // 条件2成立时渲染的组件
} else {
  // 所有条件都不成立时渲染的组件
}
```

示例（根据库存显示按钮）：

```TypeScript
let hasStock: boolean = false;
if (hasStock) {
  Text('加入购物车').backgroundColor('red');
} else {
  Text('该商品暂时没有库存');
}
```

### 7.4 循环渲染

#### 作用

根据数组数据重复渲染UI内容（如歌曲列表、商品列表）

#### 语法规则

```TypeScript
ForEach(数组, (item: 类型, index: number) => {
  // 要重复渲染的组件，item为数组中的每一项，index为索引
})
```

示例（渲染歌曲列表）：

```TypeScript
let songs: string[] = ['直到世界的尽头', '画', 'Sweet Dreams'];
ForEach(songs, (song: string, index: number) => {
  Text(song).fontSize(20);
})
```

### 7.5 状态管理（V2）

#### 核心概念

应用运行时的状态变化时，自动刷新UI渲染

#### 状态变量定义

```TypeScript
@ComponentV2
struct Index {
  @Local num: number = 1; // 状态变量，必须指定类型和初始值
  // ...
}
```

#### 状态使用与修改

- 访问状态：`this.num`

- 修改状态（如点击事件）：

  - ```TypeScript
    组件.onClick(() => {
      this.num++; // 状态改变，UI自动刷新
    })
    ```

#### 点击事件添加

```TypeScript
组件.onClick(() => {
  // 点击后要执行的代码
})
```

### 7.6 @Builder 自定义构建函数

#### 作用

封装UI元素，提升组件复用性（如重复使用的标题、列表项）

#### 语法规则

1. 定义自定义构建函数：

```TypeScript
@Builder
函数名(参数列表: 类型) {
  // 要复用的组件结构
}
```

1. 调用自定义构建函数：

```TypeScript
this.函数名(参数);
```

## 八、案例实战：歌单交互效果

### 核心功能实现

1. 循环渲染歌单：
   1. 准备歌曲对象数组
   2. 使用ForEach循环渲染列表项
2. 播放状态控制：
   1. 定义状态变量`@Local playingIndex: number = 0`（记录正在播放歌曲的索引）
   2. 使用Stack层叠组件放置播放状态图标（如播放/暂停图标）
   3. 条件渲染：判断当前歌曲索引是否等于playingIndex，显示对应状态
   4. 点击事件：修改playingIndex为当前歌曲索引，切换播放状态

### 核心组件：Stack层叠容器

作用：让多个组件叠在一起显示（如歌曲名称和播放图标叠放）

```TypeScript
Stack({ alignContent: Alignment.TopEnd }) { // 内容对齐到右上角
  Text('直到世界的尽头'); // 下层组件
  Image($r('app.media.play')).width(20); // 上层组件
}
```

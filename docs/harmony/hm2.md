---
outline: [1,3]
---

## 一、ArkTS 核心进阶

ArkTS 是华为为 HarmonyOS（鸿蒙系统）推出的声明式编程语言，基于 TypeScript 扩展而来，专为构建高性能、跨设备的鸿蒙应用而设计。

它融合了 TypeScript 的类型安全与面向对象特性，并深度集成 ArkUI 框架，支持声明式 UI 语法（如 @Component、@State 等装饰器），可高效开发响应式、多端适配的应用。ArkTS 兼具开发效率与运行性能，是鸿蒙生态的主力开发语言。


### if 分支语句

#### 作用

根据逻辑条件结果，执行不同代码块，实现程序的分支逻辑控制。

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

#### 示例（多条件判断）：

```TypeScript
let score: number = 85;
let grade: string;

if (score >= 90) {
  grade = '优秀';
} else if (score >= 80) {
  grade = '良好';
} else if (score >= 60) {
  grade = '及格';
} else {
  grade = '不及格';
}
console.log(`成绩等级：${grade}`);
```

### 条件表达式（三元运算符）

#### 作用

根据逻辑条件结果，简洁地得到不同的值，是if-else语句的简化形式。

#### 语法规则

```TypeScript
条件 ? 条件成立的表达式 : 条件不成立的表达式
```


#### 示例（获取两个数中的较大值）：

```TypeScript
let num1: number = 100;
let num2: number = 20;
let result: number = num1 > num2 ? num1 : num2; // 结果为100
```

### 条件渲染

#### 作用

根据逻辑条件结果，动态渲染不同的UI组件，实现界面内容的动态切换。

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

#### 示例（根据库存显示按钮）：

```TypeScript
let hasStock: boolean = false;
if (hasStock) {
  Text('加入购物车').backgroundColor('red');
} else {
  Text('该商品暂时没有库存');
}
```

### 循环渲染

#### 作用

根据数组数据重复渲染UI内容，用于展示列表数据（如歌曲列表、商品列表、消息列表等）。

#### 语法规则

```TypeScript
ForEach(数组, (item: 类型, index: number) => {
  // 要重复渲染的组件，item为数组中的每一项，index为索引
})
```

#### 示例（渲染歌曲列表）：

```TypeScript
let songs: string[] = ['直到世界的尽头', '画', 'Sweet Dreams'];
ForEach(songs, (song: string, index: number) => {
  Text(song).fontSize(20);
})
```

#### 进阶示例（对象数组渲染）：

```TypeScript
// 定义歌曲对象类型
interface Song {
  id: number;
  title: string;
  artist: string;
}

@ComponentV2
struct SongList {
  @Local songs: Song[] = [
    { id: 1, title: '直到世界的尽头', artist: 'WANDS' },
    { id: 2, title: '画', artist: 'G.E.M.邓紫棋' },
    { id: 3, title: 'Sweet Dreams', artist: 'Eurythmics' }
  ];

  build() {
    Column() {
      Text('我的歌单').fontSize(24).fontWeight(FontWeight.Bold);
      
      ForEach(this.songs, (song: Song, index: number) => {
        Row() {
          // 序号
          Text(`${index + 1}`).width(30).textAlign(TextAlign.Center);
          // 歌曲信息
          Column({ space: 5 }) {
            Text(song.title).fontSize(16).fontWeight(FontWeight.Medium);
            Text(song.artist).fontSize(12).fontColor('#666');
          }.layoutWeight(1);
        }
        .onClick(() => {
          console.log(`点击了歌曲：${song.title}`);
        });
      }, (song: Song) => song.id.toString()) // 提供唯一key
    }
  }
}
```

#### 最佳实践：

1. **提供唯一key**：使用key参数提高渲染性能
2. **避免在循环中定义复杂逻辑**：复杂逻辑应提前处理
3. **考虑分页加载**：大数据量时使用分页或虚拟滚动

### 状态管理（V2）

#### 核心概念

应用运行时的状态变化时，自动刷新UI渲染，实现数据驱动视图的响应式编程模式。

#### 状态变量定义

```TypeScript
@ComponentV2
struct Index {
  @Local num: number = 1; // 状态变量，必须指定类型和初始值
  // ...
}
```

#### 状态使用与修改

- **访问状态**：`this.num`
- **修改状态**：直接赋值，UI会自动刷新
- **状态类型**：支持基本类型、对象、数组等

#### 修改状态（如点击事件）：

```TypeScript
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

#### 状态管理最佳实践：

1. **不可变更新**：使用展开运算符创建新对象/数组
2. **类型安全**：为状态变量定义明确的类型
3. **状态最小化**：只存储必要的状态数据

### @Builder 自定义构建函数

#### 作用

封装UI元素，提升组件复用性，减少代码重复，提高代码可维护性。适用于重复使用的标题、列表项、卡片等UI组件。

#### 语法规则

1. 定义自定义构建函数：

```TypeScript
@Builder
函数名(参数列表: 类型) {
  // 要复用的组件结构
}
```

2. 调用自定义构建函数：

```TypeScript
this.函数名(参数);
```

#### 使用要点

- **装饰器**：必须使用`@Builder`装饰器
- **参数支持**：可以接受参数，支持默认值
- **组件组合**：可以包含任意ArkTS组件
- **复用性**：同一组件内可多次调用

#### 基础示例（标题组件）：

```TypeScript
@ComponentV2
struct ArticlePage {
  @Builder
  Title(title: string, subtitle?: string) {
    Column({ space: 5 }) {
      Text(title)
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#1890ff');
      
      if (subtitle) {
        Text(subtitle)
          .fontSize(14)
          .fontColor('#666');
      }
    }
    .padding(15)
    .backgroundColor('#f5f5f5')
    .borderRadius(8)
    .width('100%')
  }

  build() {
    Column({ space: 20 }) {
      this.Title('ArkTS教程', '深入学习ArkTS核心概念');
      this.Title('状态管理', '掌握响应式编程');
      this.Title('组件开发');
    }
  }
}
```

#### @Builder最佳实践：

1. **单一职责**：每个@Builder函数只负责一个明确的UI功能
2. **参数设计**：合理设计参数，支持默认值和可选参数
3. **组合使用**：可以嵌套使用多个@Builder函数

## 二、案例实战：歌单交互效果

### 核心功能实现

1. **循环渲染歌单**：
   - 准备歌曲对象数组，包含歌曲信息
   - 使用ForEach循环渲染列表项
   - 为每个歌曲项添加点击事件

2. **播放状态控制**：
   - 定义状态变量`@Local playingIndex: number = -1`（记录正在播放歌曲的索引，-1表示未播放）
   - 使用Stack层叠组件放置播放状态图标
   - 条件渲染：判断当前歌曲索引是否等于playingIndex，显示对应状态
   - 点击事件：修改playingIndex为当前歌曲索引，切换播放状态

### 完整实现代码

::: code-group
```TypeScript [Index.ets]
interface SongItemType {
  img: string
  name: string
  author: string
}

@Entry
  // 标记为应用入口组件
@ComponentV2
  // 标记为自定义组件
struct Index {
  @Local songs: SongItemType[] = [
    {
      img: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/0.jpg',
      name: '直到世界的尽头',
      author: 'WANDS',
    },
    {
      img: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/1.jpg',
      name: '画',
      author: '赵磊',
    },
    {
      img: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/2.jpg',
      name: 'Sweet Dreams',
      author: 'TPaul Sax / Eurythmics',
    }
  ]
  @Local playingIndex: number = -1

  build() {
    Column() { // 垂直布局容器
      // 标题部分
      Text('猜你喜欢')
        .fontColor('#fff')
        .width('100%')  // 宽度占满父容器
        .margin({ bottom: 15 }) // 底部外边距15单位

      // 内容列表部分
      List() { // 列表组件
        ForEach(this.songs, (item: SongItemType, index: number) => {
          ListItem() { // 列表项
            Row() { // 水平布局容器
              // 层叠结构
              Stack() {
                // 左侧图片
                Image(item.img)
                  .width(('30%')) // 宽度设为父容器的30%

                if (this.playingIndex === index) {
                  // 放置播放状态图标
                  Image($r('app.media.wave'))
                    .width(25)
                }
              }
              // 中间内容区域
              Column() { // 垂直布局容器
                Text(item.name)
                  .fontColor('#fff')
                  .margin({ bottom: 25 })

                Row() { // 水平布局容器（歌手信息行）
                  Text('VIP')
                    .fontSize(14)
                    .fontColor('red')
                    .border({ width: 1, color: Color.Red, radius: 5 })
                    .padding(2)
                    .margin({ right: 10 })

                  Text(item.author)
                    .fontColor('gray')
                }
              }
              .layoutWeight(1) // 设置布局权重为1，占据剩余空间

              // 右侧更多操作图标
              Image($r('app.media.ic_more'))
                .width(50)
            }
          }.margin({ bottom: 5 })
          .onClick(() => {
            this.playingIndex = index
          })
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('black')
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]) // 扩展安全区域，避开系统UI
  }
}
```
:::
### 核心组件详解：Stack层叠容器

#### 作用
让多个组件叠在一起显示，实现复杂的UI布局效果。

#### 基本用法
```TypeScript
Stack({ alignContent: Alignment.TopEnd }) { // 内容对齐到右上角
  Text('直到世界的尽头'); // 下层组件
  Image($r('app.media.play')).width(20); // 上层组件
}
```

#### 对齐方式
- `Alignment.TopStart`：左上角
- `Alignment.TopEnd`：右上角  
- `Alignment.BottomStart`：左下角
- `Alignment.BottomEnd`：右下角
- `Alignment.Center`：居中

#### 进阶示例
```TypeScript
// 带背景的标签卡片
Stack({ alignContent: Alignment.TopStart }) {
  // 背景
  Rectangle()
    .width(80)
    .height(30)
    .fill('rgba(24, 144, 255, 0.1)')
    .border({ width: 1, color: '#1890ff' })
    .borderRadius(15);
  
  // 文字
  Text('热门')
    .fontSize(12)
    .fontColor('#1890ff')
    .margin({ left: 15, top: 8 });
}
```
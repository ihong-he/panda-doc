---
outline: deep
---

## 一、项目介绍

**黑马云音乐鸿蒙项目** 是一个面向 **HarmonyOS 应用开发者**（尤其是初学者）的项目，旨在通过构建一个功能完整的类“网易云音乐”风格的移动端应用，系统性地讲解鸿蒙生态下的开发全流程。

#### 1.1 **技术栈与平台**

- **操作系统**：HarmonyOS Next（即纯血鸿蒙，不兼容 Android）
- **开发语言**：ArkTS（基于 TypeScript 语法扩展，支持声明式 UI 与响应式编程）
- **UI 框架**：ArkUI（使用`@Component`、`@State`、`@Observed`等装饰器构建界面）
- **构建工具**：DevEco Studio（华为官方 IDE）

#### 1.2 **核心功能模块详解**

<ImgPreview :imgs="['/img/hm5.png']" />

- **启动页（Splash）**：3 秒倒计时跳转，支持手动跳过，适配刘海屏安全区域。
- **底部 Tab 导航**：包含 **推荐、发现、动态、我的** 四大主页面，使用`Navigation`与`Tabs`组件实现。
- **推荐页内容**：
  - 顶部搜索栏
  - 轮播广告图（Swiper 组件）
  - 每日推荐歌单卡片流
  - 热门榜单（如新歌榜、飙升榜）
- **播放器核心（Play Page）**：
  - 使用系统级 `AVPlayer` API 播放音频
  - 支持播放/暂停、上一首/下一首、进度拖拽
  - 三种播放模式：列表循环、随机播放、单曲循环（注意：单曲循环仅在自然播放结束时生效，手动切歌仍会跳转）
  - 封面旋转动画、歌词展示（部分版本）
- **数据管理**：
  - 全局状态通过自定义 `MusicStore` 或 `@StorageLink` 实现
  - 播放列表、当前歌曲索引、播放状态持久化
- **网络能力（进阶版）**：
  - 集成轻量级 HTTP 库（如 `@nutpi/axios`）
  - 对接公开音乐 API（如第三方测试接口），动态获取歌单、歌曲 URL、封面图等
  - 支持异步加载与错误处理

#### 1.3 **学习路径**

- **零基础友好**：从创建项目、配置环境到逐功能实现，步骤清晰
- **覆盖鸿蒙核心概念**：
  - 声明式 UI 开发
  - 页面路由与生命周期
  - 状态管理与组件通信
  - 媒体播放与权限申请
  - 网络请求与异步处理
  - 安全区适配与设备兼容
- **工程结构规范**：按功能分模块组织代码（pages, components, models, utils），培养良好开发习惯

## 二、模拟器配置

1. 下载配置：新建模拟器 → 下载 SDK → 配置模拟器

<ImgPreview :imgs="['/img/hm6.png']" />

2. 启动运行：启动模拟器 → 运行项目

<ImgPreview :imgs="['/img/hm7.png']" />

3. 安装路径要求：同开发环境，不选 C 盘，无中文/特殊符号

## 三、项目基础配置

在鸿蒙（HarmonyOS）API 16（对应 Stage 模型）开发中，修改应用图标和名称的步骤如下：

---

### 3.1 修改应用名称

1. **打开配置文件**  
   路径：`entry/src/main/module.json5`

2. **定位 `label` 字段**  
   在 `module -> abilities` 数组中找到类似：

   ```json
   "label": "$string:EntryAbility_label"
   ```

3. **修改字符串资源**  
   打开：`entry/src/main/resources/base/element/string.json`  
   修改对应项的 `value`，例如：
   ```json
   {
     "name": "EntryAbility_label",
     "value": "我的新应用名"
   }
   ```

---

### 3.2 修改应用图标

1. **准备新图标**  
   建议格式：PNG，尺寸 ≥ 192×192（推荐 512×512），放入：

   ```
   entry/src/main/resources/base/media/
   ```

   文件名如：`app_icon.png`

2. **更新图标引用**  
   在 `module.json5` 中修改 `icon` 字段，例如：
   ```json
   "icon": "$media:app_icon"
   ```

---

### 注意事项

- 修改后需**卸载旧应用再重新安装**，否则桌面可能仍显示旧名称/图标。
- 若使用多语言，可在 `resources/zh-CN/element/` 等目录下提供对应语言的 `string.json`。

完成以上步骤后，重新编译运行即可看到新图标和名称。

## 四、Navigation 及广告页

### 4.1 系统路由表

在 ArkUI 中，系统路由表是一个**核心的配置机制**，它像一个“地址簿”，告诉 Navigation 组件在收到一个页面名称（例如'Start'）时，应该去哪个文件找对应的页面，以及如何构建它。下面这个表格清晰地展示了如何在基于 Navigation 的路由中使用它：

| 任务             | 配置文件            | 关键配置/代码示例                                                                                        |
| :--------------- | :------------------ | :------------------------------------------------------------------------------------------------------- |
| **声明路由表**   | `module.json5`      | `"routerMap": "$profile:route_map"`                                                                      |
| **定义页面映射** | `route_map.json`    | `{"name": "Start", "pageSourceFile": "src/main/ets/pages/Start.ets", "buildFunction": "PageOneBuilder"}` |
| **构建目标页**   | 你的 Start.ets 文件 | 使用`@Builder`修饰构建函数（例如`StartBuilder`）                                                         |
| **执行页面跳转** | 你的导航页/其他组件 | `this.pathStack.pushPathByName('Start', null)`                                                           |

#### 🔧 详细配置与使用步骤

下面我们来看看如何具体完成上述配置，并实现页面跳转。

1.  **配置工程文件**

    首先，你需要在项目的 `module.json5` 文件中声明你将使用一个外部路由配置文件。

    ```json
    // module.json5
    {
      "module": {
        // ... 其他配置 ...
        "routerMap": "$profile:route_map"
      }
    }
    ```

2.  **创建路由表文件**

    接下来，在 `resources/base/profile/` 目录下创建一个名为 `route_map.json` 的文件。在这个文件里，你需要定义具体的页面映射关系。

    ```json
    // resources/base/profile/route_map.json
    {
      "routerMap": [
        {
          "name": "Start", // 你跳转时使用的页面名称
          "pageSourceFile": "src/main/ets/pages/Start.ets", // 页面源文件路径
          "buildFunction": "StartBuilder", // 用于构建该页面的函数名
          "data": {
            "description": "this is Start" // 可选的额外数据
          }
        }
        // 你可以继续添加更多页面的映射...
      ]
    }
    ```

3.  **构建目标页面**

    你的目标页面（例如 `Start.ets`）必须提供一个用 `@Builder` 装饰器修饰的函数，这个函数的名称需要与路由表中 `buildFunction` 字段指定的名称一致。

    ```typescript
    // src/main/ets/pages/Start.ets
    /**
     * StartBuilder构建器函数
     * 用于构建Start组件的入口点
     */
    @Builder
    export function StartBuilder() {
      Start();
    }

    /**
     * Start组件
     * 广告页组件，提供跳转到布局页的功能
     */
    @Component
    struct Start {

      // 导航路径栈，用于管理页面导航历史
      pathStack: NavPathStack = new NavPathStack();

      build() {
        // 创建导航目标组件
        NavDestination() {
          Button("跳转到布局页")
            .onClick(() => {
              // 参数说明：页面名称为"Layout"，无传递数据，不带动画效果
              this.pathStack.pushPathByName("Layout", null, false)
            })
        }
        .title('广告页')
        .onReady((context: NavDestinationContext) => {
          this.pathStack = context.pathStack;
        })
      }
    }
    ```

4.  **执行页面跳转**

    最后，在你发起跳转的组件（通常是导航页）中，你需要一个 `NavPathStack` 对象，并调用其方法进行跳转。

    ```typescript
    // 例如在 index.ets 导航页中
    @Entry
    @Component
    struct Index {
      pageStack : NavPathStack = new NavPathStack();

      build() {
        // 创建Navigation导航容器，使用pageStack管理页面栈
        Navigation(this.pageStack){
        }.onAppear(() => {
          // 页面首次显示时，将"Start"页面推入导航栈
          this.pageStack.pushPathByName("Start", null, false);
        })
        .hideNavBar(true)
      }
    }
    ```

#### 💡 核心概念与优势

- **工作原理**：系统路由表在应用编译时就被处理。当你调用 `pushPathByName('Start')` 时，Navigation 组件内部的 `NavPathStack` 会去查询路由表，找到名为'Start'的配置，然后根据配置找到对应的 `.ets` 文件和 `Builder` 函数，最终完成页面的实例化与显示。
- **为何使用它**：使用系统路由表是实现 **跨包路由**（例如跳转到 HAR 或 HSP 包中的页面）的基础。同时，它将页面名称与具体实现解耦，让代码更清晰，也更易于维护。
- **Navigation 的优势**：相较于传统的 `@ohos.router` 模块，**Navigation 组件被官方推荐用于实现更灵活的组件内导航**。它支持更丰富的动效、生命周期管理、路由拦截以及一次开发多端部署的自动适配能力（如在平板上自动切换为分栏模式）。

### 4.2 开屏广告

- 背景图片：全屏显示一张广告图（stack 层叠）。
- 跳过按钮：点击后跳转到`Layout`主页面。
- 导航管理：通过 `pathStack` 控制页面跳转。

**核心代码**

```TypeScript
  // 跳转页面入口函数
  @Builder
  export function StartBuilder() {
    Start();
  }

  @Component
  struct Start {
    pathStack: NavPathStack = new NavPathStack();

    build() {
      NavDestination() {

        Stack({alignContent: Alignment.TopEnd}) {
          // 背景图片
          Image($r("app.media.ad"))
            .width("100%")
            .height("100%")
            .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]) // 扩展安全区域，避开系统UI

          // 跳过按钮
          Button("跳过")
            .backgroundColor(Color.Gray)
            .margin(5)
            .onClick(() => {
              this.pathStack.replacePathByName("Layout", null, false)
            })
        }
      }
      .onReady((context: NavDestinationContext) => {
        this.pathStack = context.pathStack;
      })
    }
  }
```

### 4.3 定时跳转

1. 生命周期函数：`aboutToAppear()`（组件即将显示时执行）
2. 延迟函数：`setTimeout(函数, 时间)`（毫秒单位）

```TypeScript
aboutToAppear(): void {
  setTimeout(() => {
    // 页面跳转代码（如跳转到首页）
    this.pathStack.replacePathByName("Layout", null, false)
  }, 3000); // 3秒后自动跳转
}
```

## 五、布局页：Tabs 选项卡

### 5.1 Tabs 选项卡

Tabs 组件的页面组成包含两个部分，分别是`TabContent`和`TabBar`。

TabContent 是内容页，TabBar 是导航页签栏，页面结构如下图所示，根据不同的导航类型，布局会有区别，可以分为底部导航、顶部导航、侧边导航，其导航栏分别位于底部、顶部和侧边。

<ImgPreview :imgs="['/img/hm8.png']" />

每一个`TabContent`对应的内容需要有一个页签，可以通过 TabContent 的`tabBar`属性进行配置。

```typescript
Tabs() {
  TabContent() {
    Text('首页的内容').fontSize(30)
  }
  .tabBar('首页')
  ...
}
```

导航栏位置使用 Tabs 的`barPosition`参数进行设置。默认情况下，导航栏位于顶部，此时，barPosition 为`BarPosition.Start`。

```typescript
Tabs({ barPosition: BarPosition.End }) {
  // TabContent的内容：首页、发现、推荐、我的
  // ...
}
```

### 5.2 布局页代码

```TypeScript
// 跳转页面入口函数
@Builder
export function LayoutBuilder() {
  Layout();
}

interface TabClass {
  text: string
  icon: ResourceStr
}

@Component
struct Layout {
  pathStack: NavPathStack = new NavPathStack();
  tabData: TabClass[] = [
    { text: '推荐', icon: $r('app.media.ic_recommend') },
    { text: '发现', icon: $r('app.media.ic_find') },
    { text: '动态', icon: $r('app.media.ic_moment') },
    { text: '我的', icon: $r('app.media.ic_mine') }
  ]

  build() {
    NavDestination() {
      Tabs({ barPosition: BarPosition.End }) {
        ForEach(this.tabData, (item: TabClass, index: number) => {
          TabContent() {
            Text('内容区域' + index).fontSize(30)
          }
          .tabBar(item.text)
        })
      }
    }
    .title('布局页')
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
    })
  }
}
```

### 5.3 交互功能实现

1. 菜单默认高亮：定义状态变量`@Local currentIndex: number = 0`，根据索引设置颜色

2. 切换功能：

   ```TypeScript
   Tabs().onChange((index: number) => {
     this.currentIndex = index; // 记录当前选中索引
   })
   ```

3. 内容切换：根据 currentIndex 条件渲染不同组件

## 六、推荐内容实现

### 6.1 搜索区域

[TextInput](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/ts-basic-components-textinput) 是鸿蒙应用开发中最基础的交互组件之一，主要用于接收用户输入的文本信息。

**关键属性（常用）**

以下是一些用于控制单行文本框行为和外观的最关键属性：

| 属性名         | 类型                                             | 说明                                                                                 |
| :------------- | :----------------------------------------------- | :----------------------------------------------------------------------------------- |
| `placeholder`  | `string`                                         | **占位符文本**。在用户没有输入任何内容时显示的灰色提示文字，如“请输入用户名”。       |
| `text`         | `string`                                         | **输入框的当前文本内容**。可用于设置初始值或获取用户输入的值。                       |
| `type`         | `InputType`                                      | **输入框类型**。这是一个枚举，非常重要，它决定了键盘类型和输入规则。                 |
|                | - `Normal`: 默认类型，普通文本。                 |
|                | - `Password`: 密码类型，输入内容显示为圆点。     |
|                | - `Email`: 邮箱地址，键盘会优化显示`@`和`.com`。 |
|                | - `Number`: 纯数字，调出数字键盘。               |
| `enterKeyType` | `EnterKeyType`                                   | **回车键的显示类型**。提示用户按下回车键会执行什么操作，如“搜索”、“发送”、“完成”等。 |
| `maxLength`    | `number`                                         | **最大输入长度**。限制用户最多能输入的字符数。                                       |

---

**关键事件（常用）**

通过监听这些事件，可以响应用户的交互：

| 事件名     | 描述                                                                     |
| :--------- | :----------------------------------------------------------------------- |
| `onChange` | **输入内容变化时触发**。这是最常用的事件，可以实时获取用户最新输入的值。 |
| `onSubmit` | **按下回车键时触发**。在单行模式下，这是用户完成输入并准备提交的信号。   |

---

**完整代码**

```TypeScript
Row() {
  Image($r('app.media.ic_search'))
    .width(22)
    .fillColor('#817D83')
  TextInput({ placeholder: '请输入歌曲名' })
    .placeholderColor('#817D83')
    .layoutWeight(1)
    .padding({ left: 5 })
    .fontColor('#999')
  Image($r('app.media.ic_code'))
    .width(22)
    .fillColor('#817D83')
}
.width('100%')
.backgroundColor('#2D2B29')
.border({ radius: 20 })
.padding({ left: 8, right: 8 })
```

### 6.2 轮播图区域

[Swiper](https://developer.huawei.com/consumer/cn/doc/harmonyos-references/ts-container-swiper) 组件是一个功能强大的滑块视图容器，主要用于实现子组件的轮播显示效果。

在实际编码中，你通常需要结合 `ForEach` 循环来遍历数据，动态生成 Swiper 的子项

| 类别           | 项目                | 说明                                     |
| :------------- | :------------------ | :--------------------------------------- |
| **核心属性**   | `index`             | 设置当前显示的子组件索引，支持双向绑定。 |
|                | `autoPlay`          | 控制是否自动轮播。                       |
|                | `interval`          | 自动轮播的时间间隔，单位为毫秒。         |
|                | `loop`              | 控制是否循环播放。                       |
|                | `duration`          | 设置页面切换时的动画时长。               |
| **控制器方法** | `showNext()`        | 滑动到下一页。                           |
|                | `showPrevious()`    | 滑动到上一页。                           |
|                | `finishAnimation()` | 停止播放动画。                           |

**完整代码**

```TypeScript
 Swiper() {
     ForEach(this.swiperList, (item: string) => {
       Image(item)
         .width('100%')
         .border({radius: 5})
     })
   }
   .autoPlay(true)
```

> [!IMPORTANT] 注意
> 网络图片需要在`module.json5`配置文件的`requestPermissions`标签中声明 [INTERNET](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/declare-permissions) 权限

### 6.3 每日推荐

`List/ForEach`实现横向列表布局，`maxLines`和`textOverflow`处理文本溢出显示，`clip`控制子组件显示范围，以及`@Builder`装饰器构建可复用UI组件

**每日推荐代码**

::: code-group

```ts [Recomment.ets]
  // 推荐区域
  this.titleBuilder('每日推荐')
  List() {
    ForEach(this.dailyRecommend, (item: recommendDailyType) => {
      ListItem() {
        Column() {
          Text(item.type)
          Image(item.img)
            .width('100%')
          Text(item.title)
            // maxLines是截断，用于限制文本的显示长度
            .maxLines(2)
            // textOverflow是超出显示省略号，用于限制文本的显示长度
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
      }
      .width('40%')
      .backgroundColor(Color.Pink)
      .border({ radius: 10 })
      .margin({ right: 10 })
      // clip是裁剪，用于限制子组件的显示范围
      .clip(true)
    })
  }
  .listDirection(Axis.Horizontal)
  .height(230)

```

```ts [titleBuilder]
@Builder
  titleBuilder(title: string) {
    Row() {
      Text(title)
        .fontColor('#000')
        .fontWeight(700)
        .layoutWeight(1)
      Image($r('app.media.ic_more'))
        .width(22)
        .fillColor('#000')
    }
    .width('100%')
    .height(40)
  }
```
:::

**推荐歌单代码**

::: code-group
```ts [Recomment.ets]
  // 推荐歌单
  this.titleBuilder('推荐歌单')
  List() {
    ForEach(this.recommendList, (item: recommendListType) => {
      ListItem() {
        Column() {
          // Stack组件是堆叠布局，可以设置子组件的堆叠顺序，并支持子组件的堆叠位置。
          Stack({alignContent: Alignment.TopStart}) {
            Image(item.img)
            Text(item.count)
          }
          Text(item.title)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .width('30%')
        .backgroundColor(Color.Green)
        .margin({ right: 10 })
      }
    })

  }
  // listDirection是列表方向，设置为水平
  .listDirection(Axis.Horizontal)

```
:::


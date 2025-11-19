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

- 背景图片：全屏显示一张广告图（stack层叠）。
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

Tabs组件的页面组成包含两个部分，分别是`TabContent`和`TabBar`。

TabContent是内容页，TabBar是导航页签栏，页面结构如下图所示，根据不同的导航类型，布局会有区别，可以分为底部导航、顶部导航、侧边导航，其导航栏分别位于底部、顶部和侧边。

<ImgPreview :imgs="['/img/hm8.png']" />

每一个`TabContent`对应的内容需要有一个页签，可以通过TabContent的`tabBar`属性进行配置。

```typescript
Tabs() {
  TabContent() {
    Text('首页的内容').fontSize(30)
  }
  .tabBar('首页')
  ...
}
```

导航栏位置使用Tabs的`barPosition`参数进行设置。默认情况下，导航栏位于顶部，此时，barPosition为`BarPosition.Start`。

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

1. 搜索区域：使用 Row 容器+TextInput 输入框

   1. ```TypeScript
      Row() {
        TextInput({ placeholder: '搜索歌曲/歌手' }).placeholderColor('#999');
      }.backgroundColor('#f5f5f5').padding(10);
      ```

2. 轮播图区域：

   1. ```TypeScript
      Swiper() {
        Image('网络图片链接1').width('100%');
        Image('网络图片链接2').width('100%');
      }.autoPlay(true) // 自动播放
      ```

   2. 注意：网络图片需要在配置中开通 INTERNET 权限

3. 每日推荐/推荐歌单：

   1. 标题：使用@Builder 封装复用
   2. 内容：使用 List 组件渲染，配合循环渲染展示多首歌曲

## 七、页面跳转进阶（非 Navigation 子页）

1. 全局共享跳转对象：使用 AppStorageV2 实现应用级状态共享

2. 核心代码：

   1. ```TypeScript
      pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!
      ```

3. 跳转调用：`this.pathStack.pushPathByName('播放页')`

## 八、播放功能实现

### 8.1 AVPlayer 播放流程

1. 创建播放器：`createAVPlayer()`
2. 设置播放资源：指定歌曲 URL
3. 监听状态：`player.on('stateChange', () => {})`（监听播放状态变化）
4. 播控功能：`player.play()`（播放）、`player.pause()`（暂停）、`player.seek(时间)`（跳转播放）

### 8.2 播放器工具类封装

1. 定义工具类：

   1. ```TypeScript
      class AvPlayerManager {
        // 播放器属性和方法（如创建、播放、暂停）
      }
      ```

2. 实例化调用：`const playerManager: AvPlayerManager = new AvPlayerManager()`

### 8.3 播放数据共享

1. 定义共享数据类型：

   1. ```TypeScript
      @ObservedV2 // 监听类属性变化
      export class GlobalMusic {
        @Trace img: string = ""; // 歌曲封面
        @Trace name: string = ""; // 歌曲名称
        @Trace time: number = 0; // 当前播放时间
        @Trace duration: number = 0; // 歌曲总时长
      }
      ```

2. 共享数据操作：

   1. 创建共享数据：`AppStorageV2.connect(GlobalMusic, 'SONG_KEY', () => new GlobalMusic())`
   2. 页面使用：`@Local playState: GlobalMusic = AppStorageV2.connect(GlobalMusic, 'SONG_KEY', () => new GlobalMusic())`

### 8.4 播放进度控制

使用 Slider 组件实现进度条：

```TypeScript
Slider({
  value: this.playState.time, // 当前播放时间
  min: 0,
  max: this.playState.duration // 歌曲总时长
}).onChange((value) => {
  playerManager.seek(value); // 跳转到指定进度
})
```

## 九、播控核心功能

1. 播放/暂停：根据播放状态切换，修改共享数据中的状态标识
2. 上一首/下一首：
   1. 下一首：`playingIndex++`，超出数组长度则重置为 0
   2. 上一首：`playingIndex--`，小于 0 则设为数组最后一个索引
3. 播放模式切换：
   1. 列表播放：按顺序循环
   2. 随机播放：随机生成索引
   3. 单曲循环：索引不变
4. 播放列表管理：
   1. 滑动移除歌曲：使用`splice(索引, 1)`删除数组元素
   2. 切歌逻辑：如果移除的是正在播放的歌曲，自动播放下一首

## 十、播控中心（后台播放）

实现后台播放/熄屏播放需配置：

1. 接入 AVSession（媒体会话）：注册控制命令、设置播放状态和元数据
2. 申请长时任务：避免播放被系统强制中断
3. 生命周期管理：创建会话、注销会话（回收内存资源）

## 十一、Cursor 工具使用（AI 辅助开发）

### 11.1 核心功能

基于项目进行 AI 对话，生成代码，提升开发效率

### 11.2 使用步骤

1. 下载安装 Cursor 工具
2. 注册登录账号
3. 配置：安装汉化插件，设置相关规则
4. 使用：在项目中提问，让 AI 生成所需代码（如“生成一个歌曲列表项组件”）

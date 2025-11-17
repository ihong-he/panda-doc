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
- **底部 Tab 导航**：包含“推荐”“发现”“动态”“我的”四大主页面，使用`Navigation`与`Tabs`组件实现。
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

---

## 二、模拟器配置

1. 下载配置：新建模拟器 → 下载 SDK → 配置模拟器

<ImgPreview :imgs="['/img/hm6.png']" />

2. 启动运行：启动模拟器 → 运行项目

<ImgPreview :imgs="['/img/hm7.png']" />

3. 安装路径要求：同开发环境，不选 C 盘，无中文/特殊符号

## 三 项目基础配置

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

## 四、广告页实现

### 4.1 开屏广告

1.  使用 Navigation 组件实现页面导航

2.  核心代码：

    - ```TypeScript
      Navigation() {
        NavDestination('首页') { // 子页面
          // 首页内容
        }
      }
      ```

3.  控制跳转对象：NavPathStack

### 4.2 定时跳转

1. 生命周期函数：`aboutToAppear()`（组件即将显示时执行）
2. 延迟函数：`setTimeout(函数, 时间)`（毫秒单位）

```TypeScript
aboutToAppear(): void {
  setTimeout(() => {
    // 页面跳转代码（如跳转到首页）
  }, 3000); // 3秒后自动跳转
}
```

## 五、布局页：Tabs 选项卡

### 5.1 核心语法

```TypeScript
Tabs({barPosition: BarPosition.End}) { // 选项卡位置在底部
  TabContent() {
    // 推荐组件内容
  }.tabBar('推荐') // 选项卡菜单文字

  TabContent() {
    // 发现组件内容
  }.tabBar('发现')
}
```

### 5.2 交互功能实现

1. 菜单默认高亮：定义状态变量`@Local currentIndex: number = 0`，根据索引设置颜色

2. 切换功能：

   1. ```TypeScript
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
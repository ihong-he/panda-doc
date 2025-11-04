---
outline: deep
---

## 九、黑马云音乐项目完整实现

### 9.1 项目功能结构

```Plain
广告页（Start）→ 首页（Index）→ 布局页（Layout）
                          ↓
布局页包含：推荐组件、发现组件、动态组件、我的组件
                          ↓
播放页（Play）、播控中心（支持后台播放）
```

### 9.2 模拟器配置

1. 下载配置：新建模拟器 → 下载SDK → 配置模拟器
2. 启动运行：启动模拟器 → 运行项目
3. 安装路径要求：同开发环境，不选C盘，无中文/特殊符号

### 9.3 项目基础配置

1. 修改项目启动图标：

   1. 编辑配置文件`module.json5`
   2. 修改`icon`、`startWindowIcon`属性，引用`$media:图标名`（图标存放在resources/media目录）

2. 开屏广告跳转：

   1. 使用Navigation组件实现页面导航

   2. 核心代码：

      - ```TypeScript
        Navigation() {
          NavDestination('首页') { // 子页面
            // 首页内容
          }
        }
        ```

   3. 控制跳转对象：NavPathStack

### 9.4 广告页实现（3秒自动跳转）

1. 生命周期函数：`aboutToAppear()`（组件即将显示时执行）
2. 延迟函数：`setTimeout(函数, 时间)`（毫秒单位）

```TypeScript
aboutToAppear(): void {
  setTimeout(() => {
    // 页面跳转代码（如跳转到首页）
  }, 3000); // 3秒后自动跳转
}
```

### 9.5 布局页：Tabs选项卡

#### 核心语法

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

#### 交互功能实现

1. 菜单默认高亮：定义状态变量`@Local currentIndex: number = 0`，根据索引设置颜色

2. 切换功能：

   1. ```TypeScript
      Tabs().onChange((index: number) => {
        this.currentIndex = index; // 记录当前选中索引
      })
      ```

3. 内容切换：根据currentIndex条件渲染不同组件

### 9.6 推荐内容实现

1. 搜索区域：使用Row容器+TextInput输入框

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

   2.  注意：网络图片需要在配置中开通INTERNET权限

3. 每日推荐/推荐歌单：

   1. 标题：使用@Builder封装复用
   2. 内容：使用List组件渲染，配合循环渲染展示多首歌曲

### 9.7 页面跳转进阶（非Navigation子页）

1. 全局共享跳转对象：使用AppStorageV2实现应用级状态共享

2. 核心代码：

   1. ```TypeScript
      pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!
      ```

3. 跳转调用：`this.pathStack.pushPathByName('播放页')`

### 9.8 播放功能实现

#### AVPlayer播放流程

1. 创建播放器：`createAVPlayer()`
2. 设置播放资源：指定歌曲URL
3. 监听状态：`player.on('stateChange', () => {})`（监听播放状态变化）
4. 播控功能：`player.play()`（播放）、`player.pause()`（暂停）、`player.seek(时间)`（跳转播放）

#### 播放器工具类封装

1. 定义工具类：

   1. ```TypeScript
      class AvPlayerManager {
        // 播放器属性和方法（如创建、播放、暂停）
      }
      ```

2. 实例化调用：`const playerManager: AvPlayerManager = new AvPlayerManager()`

#### 播放数据共享

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

#### 播放进度控制

使用Slider组件实现进度条：

```TypeScript
Slider({
  value: this.playState.time, // 当前播放时间
  min: 0,
  max: this.playState.duration // 歌曲总时长
}).onChange((value) => {
  playerManager.seek(value); // 跳转到指定进度
})
```

### 9.9 播控核心功能

1. 播放/暂停：根据播放状态切换，修改共享数据中的状态标识
2. 上一首/下一首：
   1. 下一首：`playingIndex++`，超出数组长度则重置为0
   2. 上一首：`playingIndex--`，小于0则设为数组最后一个索引
3. 播放模式切换：
   1. 列表播放：按顺序循环
   2. 随机播放：随机生成索引
   3. 单曲循环：索引不变
4. 播放列表管理：
   1. 滑动移除歌曲：使用`splice(索引, 1)`删除数组元素
   2. 切歌逻辑：如果移除的是正在播放的歌曲，自动播放下一首

### 9.10 播控中心（后台播放）

实现后台播放/熄屏播放需配置：

1. 接入AVSession（媒体会话）：注册控制命令、设置播放状态和元数据
2. 申请长时任务：避免播放被系统强制中断
3. 生命周期管理：创建会话、注销会话（回收内存资源）

## 十、Cursor工具使用（AI辅助开发）

### 核心功能

基于项目进行AI对话，生成代码，提升开发效率

### 使用步骤

1. 下载安装Cursor工具
2. 注册登录账号
3. 配置：安装汉化插件，设置相关规则
4. 使用：在项目中提问，让AI生成所需代码（如“生成一个歌曲列表项组件”）

## 完结篇

本课程以“黑马云音乐”项目为核心，覆盖鸿蒙5.0开发的核心知识点，从环境搭建、基础语法到项目实战，帮你快速掌握鸿蒙应用开发技能。

鸿蒙生态正处于高速发展期，掌握原生开发技术将为你的职业发展增添重要竞争力。多练习、多实践，才能真正掌握鸿蒙开发精髓！
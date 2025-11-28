---
outline: deep
---

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

---
outline: deep
---

## 七、页面跳转进阶

> [!IMPORTANT] 核心概念
> 使用 AppStorageV2 实现应用级状态共享，解决非 Navigation 子页之间的跳转问题

在 HarmonyOS 应用开发中，页面跳转是一个常见需求。当页面不是 Navigation 的直接子页时，传统的跳转方式可能会遇到限制。本章将介绍如何使用 AppStorageV2 来实现全局共享的跳转对象，从而解决跨页面跳转的问题。

### 7.1 发现页和播放页代码实现

<ImgPreview :imgs="['/img/hm9.png']" />

下面展示音乐应用中的发现页（Find.ets）和播放页（Play.ets）的完整实现：

::: code-group

```ts [models/music.ets]
// 歌曲数据类型
export interface SongItemType {
  img: string;
  name: string;
  author: string;
  url: string;
  id: string;
}
```

```ts [Find.ets]
import { SongItemType } from "../models/music"
import { AppStorageV2 } from "@kit.ArkUI"

@ComponentV2
export struct Find {
  // 通过 AppStorageV2 获取全局共享的导航栈对象
  pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack',
            () => new NavPathStack())!

  // 音乐列表数据 - 包含歌曲的基本信息
  songs: SongItemType[] = [
    {
      img: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/0.jpg',
      name: '直到世界的尽头',
      author: 'WANDS',
      url: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/0.m4a',
      id: '0000'
    },
    // ... 更多歌曲数据
  ]

  build() {
    Column() {
      // 页面标题
      Text('猜你喜欢')
        .fontColor('#fff')
        .width('100%')
        .margin({ bottom: 10 })

      // 音乐列表容器
      List() {
        ForEach(this.songs, (item: SongItemType, index: number) => {
          ListItem() {
            Row() {
              // 左侧：歌曲封面和播放状态图标
              Stack() {
                Image(item.img)
                  .width(80)
                  .border({ radius: 8 })
                  .margin({ right: 10 })
                // 播放状态指示器（音频波形图标）
                Image($r('app.media.wave'))
                  .width(24)
              }

              // 中间：歌曲信息区域
              Column() {
                // 歌曲名称
                Text(item.name)
                  .fontColor('#F3F3F3')
                  .width('100%')
                  .fontWeight(700)
                  .margin({ bottom: 15 })

                // VIP标识和作者信息
                Row() {
                  Text('VIP')
                    .fontColor('#9A8E28')
                    .border({ width: 1, color: '#9A8E28', radius: 12 })
                    .padding({
                      left: 5,
                      right: 5,
                      top: 3,
                      bottom: 3
                    })
                    .margin({ right: 10 })
                  Text(item.author)
                    .fontColor('#696969')
                }
                .width('100%')
              }
              .layoutWeight(1)

              // 右侧：更多操作按钮
              Image($r('app.media.ic_more'))
                .width(24)
                .fillColor('#FEFEFE')
            }
            .width('100%')
            .height(80)
            .margin({ bottom: 10 })
            // 添加点击事件 - 跳转到播放页面
            .onClick(() => {
              // 使用全局共享的 pathStack 进行页面跳转
              this.pathStack.pushPathByName('Play', null, false)
            })
          }
        })
      }
      .scrollBar(BarState.Off) // 隐藏滚动条
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#131313') // 深色背景
    .padding({ left: 10, right: 10 })
    // 扩充组件安全区域，适配不同屏幕尺寸
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }
}
```

```ts [Play.ets]
import { SongItemType } from "../models/music"
import { AppStorageV2 } from "@kit.ArkUI"

// 页面入口函数 - 用于路由注册
@Builder
export function PlayBuilder() {
  Play()
}

@ComponentV2
struct Play {
  // 播放列表面板的高度和透明度控制
  @Local panelHeight: string = '0%'  // 初始状态：面板隐藏
  @Local panelOpacity: number = 0   // 初始状态：完全透明

  // 导航栈对象 - 用于页面间的跳转控制
  pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!

  // 音乐播放列表数据
  songs: SongItemType[] = [
    {
      img: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/0.jpg',
      name: '直到世界的尽头',
      author: 'WANDS',
      url: 'http://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/HeimaCloudMusic/0.m4a',
      id: '0000'
    },
    // ... 更多歌曲数据
  ]

  // 当前播放的歌曲状态
  @Local playState: SongItemType = this.songs[0]

  // 滑动删除按钮构建器
  @Builder
  deleteButton(index: number) {
    Button('删除')
      .backgroundColor('#ec5c87')
      .fontColor('#fff')
      .width(80)
      .height('100%')
      .type(ButtonType.Normal)
  }

  // 时间格式化工具函数 - 将毫秒转换为 MM:SS 格式
  number2time(number: number) {
    // 毫秒 → 秒 → 分+秒; 先判断是否大于1分钟
    if (number > 60 * 1000) {
      const s = Math.floor(number/1000%60)  // 秒数
      const m = Math.floor(number/1000/60)  // 分钟数
      const second = s.toString().padStart(2, '0')  // 补零格式化
      const minute = m.toString().padStart(2, '0')
      return minute + ':' + second
    } else {
      const s = Math.floor(number/1000%60)
      const second = s.toString().padStart(2, '0')
      return '00:' + second
    }
  }

  build() {
    // 导航目标容器 - 作为独立页面的根容器
    NavDestination() {
      Stack({ alignContent: Alignment.Bottom }) {
        // 主播放界面区域
        Stack() {
          // 模糊背景效果 - 使用当前播放歌曲的封面作为背景
          Image(this.playState.img)
            .width('100%')
            .height('100%')
            .blur(1000)  // 高斯模糊效果
            .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])

          // 主要内容区域
          Column() {
            // 播放界面主体
            Column() {
              // 唱片和唱针区域
              Stack({ alignContent: Alignment.Top }) {
                // 唱片容器
                Row() {
                  Row() {
                    // 歌曲封面图片
                    Image(this.playState.img)
                      .width('70%')
                      .borderRadius(400)  // 圆形效果
                  }
                  // CD 纹理背景
                  .backgroundImage($r('app.media.ic_cd'))
                  .backgroundImageSize(ImageSize.Cover)
                  .justifyContent(FlexAlign.Center)
                  .width('100%')
                  .borderRadius(400)
                  .clip(true)
                  .aspectRatio(1)  // 保持正方形比例
                }
                .margin({ top: 50 })
                .width('90%')
                .aspectRatio(1)
                .justifyContent(FlexAlign.Center)
                .padding(24)

                // 唱针装饰
                Image($r('app.media.ic_stylus'))
                  .width(200)
                  .aspectRatio(1)
                  .rotate({
                    angle: -55,  // 倾斜角度
                    centerX: 100,
                    centerY: 30
                  })
                  .animation({
                    duration: 500  // 唱针动画时长
                  })
              }

              // 歌曲信息显示区域 - 使用多层 Stack 创建视觉层次效果
              Stack() {
                // 第一层：蓝色文字效果
                Column({ space: 8 }) {
                  Text(this.playState.name)
                    .fontSize(28)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#4bb0c4')
                  Text(this.playState.author)
                    .fontSize(18)
                    .fontColor('#4bb0c4')
                }
                .layoutWeight(1)
                .justifyContent(FlexAlign.Center)
                .zIndex(1)

                // 第二层：粉色文字效果
                Column({ space: 8 }) {
                  Text(this.playState.name)
                    .fontSize(28)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#ec5c87')
                  Text(this.playState.author)
                    .fontSize(18)
                    .fontColor('#ec5c87')
                }
                .layoutWeight(1)
                .justifyContent(FlexAlign.Center)
                .zIndex(2)

                // 第三层：白色文字效果（最顶层）
                Column({ space: 8 }) {
                  Text(this.playState.name)
                    .fontSize(28)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                  Text(this.playState.author)
                    .fontSize(18)
                    .fontColor(Color.White)
                }
                .layoutWeight(1)
                .justifyContent(FlexAlign.Center)
                .zIndex(3)
              }
              .layoutWeight(1)

              // 操作按钮区域
              Row() {
                // 点赞按钮带徽章
                Badge({ value: '99+', style: { badgeSize: 12, badgeColor: '#45CCCCCC' } }) {
                  Image($r("app.media.ic_like"))
                    .fillColor(Color.White)
                    .width(24)
                }

                // 评论按钮带徽章
                Badge({ value: '10W', style: { badgeSize: 12, badgeColor: '#45cccccc' } }) {
                  Image($r("app.media.ic_comment_o"))
                    .fillColor(Color.White)
                    .width(18)
                }

                // 分享按钮带徽章
                Badge({ value: 'hot', style: { badgeSize: 12, badgeColor: '#a8ff3131' } }) {
                  Image($r("app.media.ic_bells_o"))
                    .fillColor(Color.White)
                    .width(24)
                }

                // 下载按钮带徽章
                Badge({ value: 'vip', style: { badgeSize: 12, badgeColor: '#b7efd371' } }) {
                  Image($r("app.media.ic_download_o"))
                    .fillColor(Color.White)
                    .width(24)
                }
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceAround)

              // 播放控制区域
              Column() {
                // 进度条区域
                Row({ space: 4 }) {
                  Text("00:00")  // 当前播放时间
                    .fontSize(12)
                    .fontColor(Color.White)

                  // 进度条滑块
                  Slider({
                    value: 0,    // 当前进度值
                    min: 0,      // 最小值
                    max: 0       // 最大值（动态设置）
                  })
                    .layoutWeight(1)
                    .blockColor(Color.White)        // 滑块颜色
                    .selectedColor(Color.White)     // 已播放部分颜色
                    .trackColor('#ccc5c5c5')        // 未播放部分颜色
                    .trackThickness(2)              // 进度条粗细

                  Text("00:00")  // 总时长
                    .fontSize(12)
                    .fontColor(Color.White)
                }
                .width('100%')
                .padding(24)

                // 播放控制按钮区域
                Row() {
                  // 播放模式按钮
                  Image($r('app.media.ic_auto'))
                    .fillColor(Color.White)
                    .width(30)

                  // 上一首按钮
                  Image($r("app.media.ic_prev"))
                    .fillColor(Color.White)
                    .width(30)

                  // 播放/暂停按钮（中央大按钮）
                  Image($r('app.media.ic_paused'))
                    .fillColor(Color.White)
                    .width(50)

                  // 下一首按钮
                  Image($r('app.media.ic_next'))
                    .fillColor(Color.White)
                    .width(30)

                  // 播放列表按钮 - 点击显示播放列表面板
                  Image($r('app.media.ic_song_list'))
                    .fillColor(Color.White)
                    .width(30)
                    .onClick(() => {
                      this.panelHeight = '50%'  // 设置面板高度为50%
                      this.panelOpacity = 1     // 设置面板完全不透明
                    })
                }
                .width('100%')
                .padding({ bottom: 24 })
                .justifyContent(FlexAlign.SpaceAround)
              }
              .width('100%')
            }
            .layoutWeight(1)
            .width('100%')
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor(Color.Transparent)

        // 播放列表面板 - 从底部滑出的面板
        Column() {
          // 透明遮罩层 - 点击可关闭面板
          Column() {}
          .width('100%')
          .layoutWeight(1)
          .onClick(() => {
            this.panelHeight = '0%'  // 隐藏面板
            this.panelOpacity = 0    // 设置透明
          })

          // 播放列表内容区域
          Column() {
            // 列表标题栏
            Row() {
              // 播放图标
              Row() {
                Image($r("app.media.ic_play"))
                  .width(20)
                  .fillColor('#ff5186')
              }
              .width(50)
              .aspectRatio(1)
              .justifyContent(FlexAlign.Center)

              // 标题文字
              Row({ space: 8 }) {
                Text(`播放列表 (0)`)  // 显示歌曲数量
                  .fontColor(Color.White)
                  .fontSize(14)
              }
              .layoutWeight(1)

              // 关闭按钮
              Image($r('app.media.ic_close'))
                .fillColor('#ffa49a9a')
                .width(24)
                .height(24)
                .margin({ right: 16 })
                .onClick(() => {
                  this.panelHeight = '0%'  // 关闭面板
                  this.panelOpacity = 0
                })
            }
            .width('100%')
            .backgroundColor('#ff353333')  // 深色背景
            .padding(8)
            .border({
              width: { bottom: 1 },
              color: '#12ec5c87'  // 分割线颜色
            })
            .borderRadius({
              topLeft: 4,
              topRight: 4
            })

            // 歌曲列表
            List() {
              ForEach(this.songs, (item: SongItemType, index: number) => {
                ListItem() {
                  Row() {
                    // 序号
                    Row() {
                      Text((index + 1).toString())
                        .fontColor('#ffa49a9a')
                    }
                    .width(50)
                    .aspectRatio(1)
                    .justifyContent(FlexAlign.Center)

                    // 歌曲信息
                    Row({ space: 10 }) {
                      Column() {
                        Text(item.name)
                          .fontSize(14)
                          .fontColor('#ffa49a9a')
                        Text(item.author)
                          .fontSize(12)
                          .fontColor(Color.Gray)
                      }
                      .layoutWeight(1)
                      .alignItems(HorizontalAlign.Start)
                      .justifyContent(FlexAlign.Center)
                    }
                    .layoutWeight(1)

                    // 更多操作按钮
                    Image($r('app.media.ic_more'))
                      .width(24)
                      .height(24)
                      .margin({ right: 16 })
                      .fillColor(Color.Gray)
                  }
                  .alignItems(VerticalAlign.Center)
                }
                // 滑动删除功能
                .swipeAction({
                  end: this.deleteButton(index)  // 右滑显示删除按钮
                })
                .border({
                  width: { bottom: 1 },
                  color: '#12ec5c87'
                })
              })
            }
            .layoutWeight(1)
            .backgroundColor('#ff353333')

          }
          .height(400)  // 固定高度
        }
        .height(this.panelHeight)  // 动态高度控制显示/隐藏
        .animation({
          duration: 300  // 面板显示/隐藏动画时长
        })
        .backgroundColor('#ff353333')
        .opacity(this.panelOpacity)  // 透明度控制
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Color.Transparent)
    }
    // 页面准备就绪时获取导航栈
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack
    })
    .hideTitleBar(true)  // 隐藏系统标题栏
  }
}
```

:::

### 7.2 路由配置

在 HarmonyOS 中，页面跳转需要在 `route_map.json` 文件中注册路由信息。这个文件定义了应用的页面路由映射关系。

- **`route_map.json`文件新增播放页路由信息**

```json
{
  "routerMap": [
    // ... 其他路由配置
    {
      "name": "Play", // 路由名称，用于跳转时标识
      "pageSourceFile": "src/main/ets/pages/components/Play.ets", // 页面文件路径
      "buildFunction": "PlayBuilder", // 页面构建函数名
      "data": {
        "description": "this is Play" // 页面描述信息（可选）
      }
    }
  ]
}
```

**路由配置说明：**

- `name`: 路由的唯一标识符，在代码中通过此名称进行跳转
- `pageSourceFile`: 页面源文件的相对路径
- `buildFunction`: 页面入口函数，必须是使用 `@Builder` 装饰器导出的函数

### 7.3 `AppStorageV2` 共享跳转对象

**核心概念**：`AppStorageV2` 是 HarmonyOS 提供的应用级状态管理工具，可以在整个应用范围内共享数据。

#### 7.3.1 项目入口文件配置

在应用入口文件 `index.ets` 中，我们需要创建并共享导航栈对象 `pathStack`：

```ts {1,7}
import { AppStorageV2 } from '@kit.ArkUI';

@Entry
@Component
struct Index {
  // 传统方式：每个组件独立创建导航栈（不推荐）
  // pathStack : NavPathStack = new NavPathStack();

  // 推荐方式：使用 AppStorageV2 创建全局共享的导航栈
  pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!

  build() {
    Navigation(this.pathStack){
      // Navigation 内容区域
    }.onAppear(() => {
      // 应用启动时自动跳转到启动页
      this.pathStack.pushPathByName("Start", null, false);
    })
    // 隐藏系统导航栏
    .hideNavBar(true)
  }
}
```

**代码解析：**

1. `AppStorageV2.connect()` 方法用于连接或创建共享状态
2. 第一个参数：状态的数据类型 `NavPathStack`
3. 第二个参数：状态的唯一标识符 `'navStack'`
4. 第三个参数：状态的初始化函数，当状态不存在时自动创建
5. 返回值为共享状态的引用，可在任意组件中使用

#### 7.3.3 TypeScript 非空断言操作符（!）

上述代码中，结尾的叹号 `!` 是 TypeScript 的**非空断言操作符**：

```ts
pathStack: NavPathStack = AppStorageV2.connect(
  NavPathStack,
  "navStack",
  () => new NavPathStack()
)!;
//                                                                                      ↑
//                                                                              非空断言操作符
```

**作用和含义：**

- 告诉 TypeScript 编译器：**我确定这个值不会是 null 或 undefined**
- 移除编译器的空值检查警告
- 在运行时不会产生任何效果，仅影响编译时的类型检查

**为什么这里需要使用：**

- `AppStorageV2.connect()` 方法的返回类型可能是 `NavPathStack | null`
- 但根据 AppStorageV2 的工作机制，当提供了初始化函数时，返回值必定不会为 null
- 使用 `!` 可以避免额外的空值检查代码

#### 7.3.2 页面间跳转实现

在需要跳转的页面中，通过相同的标识符获取共享的导航栈对象：

```ts
import { AppStorageV2 } from "@kit.ArkUI"
import { SongItemType } from "../../models/music"

@ComponentV2
export struct Find {
  // 获取全局共享的导航栈对象
  pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!

  build() {
    Column() {
      // 列表项或其他可点击元素
      ListItem() {
        // 列表项内容
      }
      .onClick(() => {
        // 使用共享的导航栈进行页面跳转到播放页
        this.pathStack.pushPathByName('Play', null, false)
      })
    }
  }
}
```

**跳转方法参数说明：**

- `pushPathByName(name, param, animated)`
  - `name`: 目标页面的路由名称（在 route_map.json 中定义）
  - `param`: 传递给目标页面的参数（可为 null）
  - `animated`: 是否使用动画效果（false 为无动画跳转）

### 7.4 技术优势总结

使用 `AppStorageV2` 实现页面跳转的优势：

1. **全局状态共享**：避免了在每个组件中重复创建导航栈对象
2. **状态一致性**：确保整个应用使用同一个导航栈，避免状态不一致问题
3. **代码复用**：减少了重复代码，提高了代码的可维护性
4. **灵活扩展**：可以轻松扩展到其他需要全局共享的状态数据
5. **类型安全**：TypeScript 支持确保状态类型的安全性

这种模式特别适用于需要在多个页面间进行复杂导航管理的应用场景，如音乐播放器、电商应用等。

## 八、播放功能实现

### 8.1 AVPlayer 播放歌曲

> [!NOTE] 核心要点
> 使用 HarmonyOS 的 `AVPlayer` API 实现音频播放功能，通过封装播放器管理类实现统一的播放控制

在 HarmonyOS 应用中实现音乐播放功能，需要使用系统提供的 `AVPlayer` 组件。为了更好地管理播放器的生命周期和状态，我们需要封装一个专门的播放器管理类。

#### 8.1.1 播放器管理类封装

首先创建一个 `AvPlayerManager` 类来统一管理音频播放功能：

::: code-group

```ts [utils/AvPlayerManager.ets]
import { media } from "@kit.MediaKit";
import { SongItemType } from "../models/music";

/**
 * AVPlayer 播放器管理类
 * 负责音频播放的完整生命周期管理
 */
class AvPlayerManager {
  /** AVPlayer 实例，初始为空 */
  player: media.AVPlayer | null = null;

  /**
   * 初始化播放器并设置状态监听
   * 在应用启动时调用，确保播放器准备就绪
   */
  async init() {
    // 避免重复创建播放器实例
    if (!this.player) {
      this.player = await media.createAVPlayer();
    }

    // 监听播放器状态变化，实现自动播放流程
    this.player.on("stateChange", (state) => {
      switch (state) {
        case "initialized":
          // 播放器初始化完成，准备播放资源
          this.player?.prepare();
          break;
        case "prepared":
          // 播放资源准备完成，开始播放
          this.player?.play();
          break;
      }
    });
  }

  /**
   * 播放指定歌曲
   * @param song 要播放的歌曲对象，包含音频URL等信息
   */
  singPlay(song: SongItemType) {
    if (!this.player) {
      console.warn("播放器未初始化");
      return;
    }

    // 设置音频源URL，触发播放流程
    this.player.url = song.url;
  }
}

// 导出单例实例，确保全局使用同一个播放器
export const playerManager: AvPlayerManager = new AvPlayerManager();
```

:::

#### 8.1.2 应用启动时初始化播放器

在应用入口文件中初始化播放器，确保在用户点击播放前播放器已经准备就绪：

::: code-group

```ts [entryability/EntryAbility.ets]
import { playerManager } from '../utils/AvPlayerManager';

onWindowStageCreate(windowStage: window.WindowStage): void {
    // Main window is created, set main page for this ability

    // 🔥 关键步骤：在应用启动时初始化播放器
    // 这确保了播放器在用户首次点击播放时已经准备就绪
    playerManager.init()

}
```

:::

#### 8.1.3 集成播放功能到页面交互

在音乐列表页面中集成播放功能，当用户点击歌曲时同时实现页面跳转和音频播放：

```ts {15}
build() {
   Column() {
   // 音乐列表渲染
   List() {
     ForEach(this.songs, (item: SongItemType, index: number) => {
       ListItem() {
         ...
       }
       // 🎵 核心交互：点击歌曲触发播放和跳转
       .onClick(() => {
         // 1. 使用全局共享的导航栈跳转到播放页面
         this.pathStack.pushPathByName('Play', item, false)

         // 2. 调用播放器管理器播放当前点击的歌曲
         playerManager.singPlay(item)
       })
     })
   }
   }
}
```

### 8.2 播放数据共享与状态管理

> [!IMPORTANT] 核心概念
> 使用 `@ObservedV2` 和 `@Trace` 装饰器实现响应式数据管理，通过 `AppStorageV2` 实现应用级数据共享

在音乐播放应用中，需要管理大量的播放状态数据，如当前播放歌曲、播放进度、播放列表等。为了确保这些数据在不同页面间保持同步，我们需要使用 HarmonyOS 提供的响应式数据管理机制。

#### 8.2.1 @ObservedV2 和 @Trace 装饰器

**@ObservedV2 装饰器**：
- 用于标记一个类为**可观察类**，当类的属性发生变化时，会触发 UI 更新
- 必须配合 `@Trace` 装饰器使用，只有被 `@Trace` 标记的属性才具有响应式特性

**@Trace 装饰器**：
- 标记类的属性为**可追踪属性**，当这些属性的值发生变化时，会自动通知依赖它们的组件进行更新
- 支持基本数据类型和复杂对象类型

::: code-group

```ts [models/GlobalMusic.ets]
import { SongItemType } from "./music";

/**
 * 全局音乐播放状态管理类
 * 使用 @ObservedV2 装饰器标记为可观察类
 */
@ObservedV2
export class GlobalMusic {
  // 当前播放歌曲的基本信息
  @Trace img: string = "";           // 音乐封面URL
  @Trace name: string = "";          // 音乐名称
  @Trace author: string = "";        // 作者信息
  @Trace url: string = "";           // 当前播放音频链接
  
  // 播放进度相关状态
  @Trace time: number = 0;           // 当前播放进度（毫秒）
  @Trace duration: number = 0;      // 歌曲总时长（毫秒）
  
  // 播放列表管理
  @Trace playIndex: number = 0;      // 当前播放歌曲在列表中的索引
  @Trace playList: SongItemType[] = []; // 播放列表数据
}
```
:::

#### 8.2.2 数据共享机制实现

**1. 播放器管理类中的共享数据创建**

在 `AvPlayerManager` 工具类中，我们使用 `AppStorageV2.connect()` 方法创建全局共享的播放状态：

```ts
class AvPlayerManager {
  // AVPlayer 播放器实例
  player: media.AVPlayer | null = null;
  
  /**
   * 全局共享的播放状态数据
   * 使用 AppStorageV2.connect() 确保整个应用使用同一个状态实例
   */
  currentSong: GlobalMusic = AppStorageV2.connect(
    GlobalMusic,           // 数据类型
    "SONG_KEY",            // 全局唯一标识符
    () => new GlobalMusic() // 初始化函数（当状态不存在时调用）
  )!;
}
```

**2. 播放页面中的状态使用**

在播放页面中，通过相同的标识符获取共享的播放状态，确保数据同步：

```ts
@ComponentV2
struct Play {
  /**
   * 当前播放状态
   * 使用 @Local 装饰器标记为本地状态，但通过 AppStorageV2.connect() 连接到全局状态
   * 当全局状态变化时，此处的状态也会自动更新
   */
  @Local
  playState: GlobalMusic = AppStorageV2.connect(GlobalMusic, 'SONG_KEY', () => new GlobalMusic())!
  
  build() {
    // 页面构建逻辑...
    // 使用 playState 中的数据进行 UI 渲染
  }
}
```

**技术优势**：
- **数据一致性**：所有页面使用同一个状态实例，避免数据不一致问题
- **自动同步**：状态变化时，所有依赖该状态的组件自动更新
- **类型安全**：TypeScript 类型检查确保数据操作的安全性
- **内存优化**：全局共享避免重复创建状态对象

### 8.3 播放进度控制与 Slider 组件使用

> [!NOTE] 核心功能
> 使用 `Slider` 组件实现精确的播放进度控制，通过监听播放器事件实时更新进度数据

#### 8.3.1 播放器进度监听机制

播放器管理类需要监听播放器的进度变化事件，并实时更新共享状态：

```ts
class AvPlayerManager {
  player: media.AVPlayer | null = null;
  
  /**
   * 初始化播放器并设置进度监听
   */
  async init() {
    if (!this.player) {
      this.player = await media.createAVPlayer();
    }
    
    // 监听播放时长变化
    this.player.on('durationUpdate', (duration: number) => {
      // 更新共享状态中的总时长
      this.currentSong.duration = duration;
    });
    
    // 监听播放进度变化（每秒触发多次）
    this.player.on('timeUpdate', (time: number) => {
      // 更新共享状态中的当前播放时间
      this.currentSong.time = time;
    });
    
  }
  
  /**
   * 进度跳转功能
   * @param value 目标时间点（毫秒）
   */
  seekPlay(value: number) {
    // 调用播放器的 seek 方法跳转到指定时间
    this.player?.seek(value);
  }
}
```

#### 8.3.2 Slider 组件详解与使用

`Slider` 组件是 HarmonyOS 提供的滑动条组件，非常适合用于播放进度控制：

**Slider 核心属性说明**：

- `value`: 当前滑块的值，对应播放进度
- `min`: 最小值，通常为 0
- `max`: 最大值，对应歌曲总时长
- `blockColor`: 滑块颜色
- `selectedColor`: 已选择区域颜色（已播放部分）
- `trackColor`: 轨道颜色（未播放部分）
- `trackThickness`: 轨道粗细

**完整的进度条实现**：

```ts
@ComponentV2
struct Play {
  // 获取共享的播放状态
  @Local
  playState: GlobalMusic = AppStorageV2.connect(GlobalMusic, 'SONG_KEY', () => new GlobalMusic())!
  
  /**
   * 时间格式化工具函数
   * 将毫秒转换为 MM:SS 格式
   */
  number2time(number: number): string {
    if (number > 60 * 1000) {
      const seconds = Math.floor(number / 1000 % 60);
      const minutes = Math.floor(number / 1000 / 60);
      const formattedSeconds = seconds.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
    } else {
      const seconds = Math.floor(number / 1000 % 60);
      const formattedSeconds = seconds.toString().padStart(2, '0');
      return `00:${formattedSeconds}`;
    }
  }
  
  build() {
    Column() {
      // 进度控制区域
      Row({ space: 8 }) {
        // 当前播放时间显示
        Text(this.number2time(this.playState.time))
          .fontSize(12)
          .fontColor(Color.White)
          .width(40)
        
        /**
         * Slider 进度条组件
         * 关键配置说明：
         * - value: 绑定到当前播放时间，实现双向数据绑定
         * - min/max: 设置进度范围，从0到歌曲总时长
         * - onChange: 用户拖动滑块时的回调函数
         */
        Slider({
          value: this.playState.time,        // 当前播放进度
          min: 0,                           // 最小值
          max: this.playState.duration      // 最大值（歌曲总时长）
        })
          .layoutWeight(1)                  // 占据剩余空间
          .blockColor(Color.White)          // 滑块颜色为白色
          .selectedColor(Color.White)       // 已播放部分为白色
          .trackColor('#ccc5c5c5')          // 未播放部分为浅灰色
          .trackThickness(2)                // 进度条高度为2像素
          .onChange((value: number) => {
            // 用户拖动滑块时调用进度跳转
            playerManager.seekPlay(value);
          })
        
        // 歌曲总时长显示
        Text(this.number2time(this.playState.duration))
          .fontSize(12)
          .fontColor(Color.White)
          .width(40)
      }
      .width('100%')
      .padding({ left: 20, right: 20, top: 10, bottom: 10 })
    }
    .width('100%')
  }
}
```

**Slider 组件使用技巧**：

1. **实时响应**：Slider 的 value 属性绑定到响应式数据，播放进度变化时自动更新
2. **用户交互**：onChange 回调处理用户拖动操作，实现精确的进度控制
3. **视觉优化**：通过颜色和粗细配置创建美观的进度条效果
4. **布局适配**：使用 layoutWeight 确保进度条在不同屏幕尺寸下都能正确显示

### 8.4 切歌功能

> [!TIP] 智能播放
> 实现智能的播放列表管理和切歌逻辑，支持多种播放场景

播放器管理类实现完整的切歌功能：

```ts
class AvPlayerManager {
  player: media.AVPlayer | null = null;
  
  /**
   * 智能播放歌曲
   * 支持多种播放场景：
   * 1. 歌曲在播放列表中且正在播放 → 继续播放
   * 2. 歌曲在播放列表中但未播放 → 切换到该歌曲
   * 3. 歌曲不在播放列表中 → 添加到列表并播放
   */
  singPlay(song: SongItemType) {
    // 检查歌曲是否已在播放列表中
    const isInList = this.currentSong.playList.some(item => item.id === song.id);
    
    if (isInList) {
      // 场景1和2：歌曲已在播放列表中
      if (this.currentSong.url === song.url) {
        // 正在播放当前歌曲 → 继续播放
        this.player?.play();
      } else {
        // 切换到播放列表中的其他歌曲
        this.currentSong.playIndex = this.currentSong.playList.findIndex(item => item.id === song.id);
        this.changeSong(); // 执行切歌操作
      }
    } else {
      // 场景3：新歌曲 → 添加到播放列表开头并播放
      this.currentSong.playList.unshift(song);
      this.currentSong.playIndex = 0;
      this.changeSong(); // 执行切歌操作
    }
  }
  
  /**
   * 切换歌曲的核心逻辑
   * 重置播放器并设置新的音频源
   */
  async changeSong() {
    if (!this.player) return;
    
    try {
      // 1. 重置播放器状态
      await this.player.reset();
      
      // 2. 重置播放进度数据
      this.currentSong.duration = 0;
      this.currentSong.time = 0;
      
      // 3. 更新当前播放歌曲信息
      const currentSong = this.currentSong.playList[this.currentSong.playIndex];
      this.currentSong.img = currentSong.img;
      this.currentSong.name = currentSong.name;
      this.currentSong.author = currentSong.author;
      this.currentSong.url = currentSong.url;
      
      // 4. 设置新的音频源并准备播放
      this.player.url = currentSong.url;
      
    } catch (error) {
      console.error('切歌失败:', error);
    }
  }
}
```

**技术总结**：

1. **响应式数据管理**：使用 `@ObservedV2` 和 `@Trace` 实现数据变化的自动响应
2. **全局状态共享**：通过 `AppStorageV2` 确保多页面间数据一致性
3. **精确进度控制**：`Slider` 组件提供直观的播放进度交互体验
4. **智能播放逻辑**：支持多种播放场景的智能切换
5. **错误处理**：完善的异常处理机制确保播放稳定性


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

> [!IMPORTANT] 核心概念
> 音视频应用在实现音视频功能的同时，需要接入媒体会话即 `AVSession Kit` 来实现完整的后台播放体验。后台播放是音乐类应用的核心功能，确保用户在切换应用或锁屏时音乐不会中断。

### 10.1 后台播放架构概述

在 HarmonyOS 中实现后台播放功能需要三个关键组件的协同工作：

1. **`AVSession Kit`**：媒体会话管理，负责与系统媒体控制中心交互
2. **`BackgroundTasks Kit`**：后台任务管理，申请长时任务避免应用被挂起
3. **权限配置**：在应用配置文件中声明必要的后台运行权限

当应用需要实现后台播放等功能时，必须使用 `BackgroundTasks Kit`（后台任务管理）的能力，申请对应的长时任务，避免应用进入挂起（Suspend）状态，确保音乐持续播放。

### 10.2 媒体会话管理器实现

::: code-group

```ts [utils/AvSessionManager.ets]
import { avSession } from '@kit.AVSessionKit'
import { wantAgent } from '@kit.AbilityKit'
import backgroundTaskManager from '@ohos.resourceschedule.backgroundTaskManager'

/**
 * AVSession 管理器类
 * 负责媒体会话的创建、管理和后台播放任务的申请
 */
class AvSessionManager {
  // 媒体会话实例，用于与系统媒体控制中心交互
  session: avSession.AVSession | null = null

  /**
   * 初始化媒体会话
   * @param content 应用上下文，用于会话创建
   */
  async init(content: Context) {
    // 创建音频类型的媒体会话
    // 参数说明：
    // - content: 应用上下文
    // - 'bgPlay': 会话标签，用于标识会话
    // - 'audio': 会话类型，指定为音频类型
    this.session = await avSession.createAVSession(content, 'bgPlay', 'audio')
  }

  /**
   * 申请后台长时任务
   * 该方法在用户开始播放音乐时调用，确保应用在后台持续运行
   */
  async startBackgroundTask() {
    // 配置 WantAgent 信息，定义后台任务启动时的行为
    let wantAgentInfo: wantAgent.WantAgentInfo = {
      wants: [
        {
          bundleName: "com.example.hm_music",  // 应用包名
          abilityName: "EntryAbility"          // 启动的Ability名称
        }
      ],
      actionType: wantAgent.OperationType.START_ABILITY,  // 启动Ability操作
      requestCode: 0,                                    // 请求代码
      actionFlags: [wantAgent.WantAgentFlags.UPDATE_PRESENT_FLAG]  // 更新现有实例标志
    }
    
    // 获取 WantAgent 对象
    const want = await wantAgent.getWantAgent(wantAgentInfo)
    
    // 启动音频播放后台任务
    // 参数说明：
    // - getContext(): 获取当前上下文
    // - BackgroundMode.AUDIO_PLAYBACK: 音频播放后台模式
    // - want: WantAgent对象，定义任务启动行为
    await backgroundTaskManager.startBackgroundRunning(
      getContext(), 
      backgroundTaskManager.BackgroundMode.AUDIO_PLAYBACK, 
      want
    )
  }
}

// 导出单例实例，确保全局使用同一个会话管理器
export const sessionManager: AvSessionManager = new AvSessionManager()
```

:::

### 10.3 后台权限配置

在应用配置文件 `module.json5` 中声明后台运行权限和音频播放背景模式：

::: code-group

```json [module.json5]
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.KEEP_BACKGROUND_RUNNING",  // 保持后台运行权限
        "reason": "用于音乐播放器后台持续播放功能"           // 权限申请原因说明
      }
    ],
    "abilities": [
      {
        "backgroundModes": ["audioPlayback"]  // 声明音频播放后台模式
      }
    ]
  }
}
```

:::

### 10.4 应用启动时准备后台任务

在应用入口 Ability 的 `onWindowStageCreate` 方法中初始化媒体会话管理器：

::: code-group

```ts [entryability/EntryAbility.ets]
import { sessionManager } from '../utils/AvSessionManager'

onWindowStageCreate(windowStage: window.WindowStage): void {
  // Main window is created, set main page for this ability
  
  // 🔥 关键步骤：在应用启动时初始化媒体会话管理器
  // 确保在用户开始播放前，后台播放功能已准备就绪
  sessionManager.init(this.context)
}
```

:::

### 10.5 集成后台播放功能

在播放器管理器中集成后台播放功能，当用户开始播放音乐时自动申请后台任务：

::: code-group

```ts [utils/AvPlayerManager.ets]
import { sessionManager } from './AvSessionManager'

class AvPlayerManager {
  /**
   * 播放指定歌曲
   * 该方法不仅启动音频播放，还会申请后台播放权限
   * @param song 要播放的歌曲对象
   */
  singPlay(song: SongItemType) {
    // 1. 申请后台长时任务，确保音乐在后台持续播放
    sessionManager.startBackgroundTask()
    
    // 2. 执行具体的播放逻辑（此处省略具体播放实现）
    // ...
  }
}
```

:::

### 10.6 技术要点总结

**后台播放实现的关键技术要点：**

1. **媒体会话管理**：使用 `AVSession` 创建媒体会话，与系统媒体控制中心建立连接
2. **后台任务申请**：通过 `BackgroundTasks Kit` 申请音频播放后台任务，避免应用被挂起
3. **权限声明**：在配置文件中明确声明后台运行权限和音频播放背景模式
4. **生命周期管理**：在合适的时机（应用启动、播放开始）初始化和申请后台功能

**用户体验优化：**
- 后台播放时，用户可以在锁屏界面、通知栏控制音乐播放
- 应用切换到后台后，音乐不会中断，持续播放
- 系统会智能管理后台资源，确保应用性能和系统稳定性

## 十一、Cursor 工具使用（AI 辅助开发）

### 11.1 核心功能

基于项目进行 AI 对话，生成代码，提升开发效率

### 11.2 使用步骤

1. 下载安装 Cursor 工具
2. 注册登录账号
3. 配置：安装汉化插件，设置相关规则
4. 使用：在项目中提问，让 AI 生成所需代码（如“生成一个歌曲列表项组件”）

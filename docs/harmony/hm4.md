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

```ts [Find.ets]
import { SongItemType } from "../models/music"
import { AppStorageV2 } from "@kit.ArkUI"

@ComponentV2
export struct Find {
  // 通过 AppStorageV2 获取全局共享的导航栈对象
  pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!
  
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
      "name": "Play",                                    // 路由名称，用于跳转时标识
      "pageSourceFile": "src/main/ets/pages/components/Play.ets",  // 页面文件路径
      "buildFunction": "PlayBuilder",                   // 页面构建函数名
      "data": {
        "description" : "this is Play"                  // 页面描述信息（可选）
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
pathStack: NavPathStack = AppStorageV2.connect(NavPathStack, 'navStack', () => new NavPathStack())!
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
        // 使用共享的导航栈进行页面跳转
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
import { media } from '@kit.MediaKit'
import { SongItemType } from '../models/music'

/**
 * AVPlayer 播放器管理类
 * 负责音频播放的完整生命周期管理
 */
class AvPlayerManager {
  /** AVPlayer 实例，初始为空 */
  player: media.AVPlayer | null = null

  /**
   * 初始化播放器并设置状态监听
   * 在应用启动时调用，确保播放器准备就绪
   */
  async init() {
    // 避免重复创建播放器实例
    if (!this.player) {
      this.player = await media.createAVPlayer()
    }

    // 监听播放器状态变化，实现自动播放流程
    this.player.on('stateChange', (state) => {
      switch (state) {
        case 'initialized':
          // 播放器初始化完成，准备播放资源
          this.player?.prepare()
          break
        case 'prepared':
          // 播放资源准备完成，开始播放
          this.player?.play()
          break
      }
    })
  }

  /**
   * 播放指定歌曲
   * @param song 要播放的歌曲对象，包含音频URL等信息
   */
  singPlay(song: SongItemType) {
    if (!this.player) {
      console.warn('播放器未初始化')
      return
    }
    
    // 设置音频源URL，触发播放流程
    this.player.url = song.url
  }
}

// 导出单例实例，确保全局使用同一个播放器
export const playerManager: AvPlayerManager = new AvPlayerManager()
```
:::

#### 8.1.2 应用启动时初始化播放器

在应用入口文件中初始化播放器，确保在用户点击播放前播放器已经准备就绪：

::: code-group 
```ts [entryability/EntryAbility.ets]
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

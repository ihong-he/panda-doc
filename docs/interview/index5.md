---
outline: deep
---
## 目录表
[[toc]]
## 一、小程序

### 1、小程序有哪些文件类型，各自干啥的？

微信小程序开发时会接触到这几种文件，记住它们的作用很重要：

- **`.json` 配置文件** - 就像房子的装修图纸，`app.json`是全局配置，页面配置管单个页面，定义页面路径、窗口样式这些

- **`.wxml` 结构文件** - 类似HTML，写页面结构的，支持数据绑定、条件判断、循环列表，小程序的"骨架"

- **`.wxss` 样式文件** - 相当于CSS，控制页面样式，比CSS多了点微信特有的写法

- **`.js` 逻辑文件** - JavaScript代码，写业务逻辑、处理交互的，遵循CommonJS规范，用require导入模块

- **`.wxs` 脚本文件** - 可以理解成"轻量级JS"，专门处理复杂计算和逻辑，独立于页面运行，性能更好

记住这个顺序：配置→结构→样式→逻辑，开发时按这个思路来就不会乱。

### 2、小程序生命周期有哪些？什么时候触发？

生命周期就像人的一生，不同阶段做不同事：

**页面生命周期：**
- `onLoad()` - 页面"出生"，只调用一次，获取页面参数就在这里
- `onReady()` - 页面"成年"，可以和用户交互了，也只调用一次  
- `onShow()` - 页面"上班"，每次显示都触发
- `onHide()` - 页面"下班"，页面隐藏时触发
- `onUnload()` - 页面"退休"，页面卸载时触发

**面试高频考点：**
- `onLoad`只执行一次，适合做初始化
- `onShow`每次都执行，适合做页面刷新
- 跳转方式会影响生命周期：`navigateTo`会触发`onHide`，`redirectTo`会触发`onUnload`

### 3、最常用的组件和API有哪些？

**五大组件（面试常问）：**

1. **`<view>`** - 万能容器，相当于div，布局用的
2. **`<text>`** - 显示文字，比直接写字更规范
3. **`<button>`** - 按钮，可以加各种事件
4. **`<image>`** - 图片组件，支持网络和本地图片
5. **`<input>`** - 输入框，收集用户输入的

**五大API（必须掌握）：**

1. **`wx.navigateTo`** - 页面跳转，保留当前页，能返回
2. **`wx.request`** - 发HTTP请求，获取数据的核心
3. **`wx.showToast`** - 弹提示，用户体验必备
4. **`wx.getStorageSync`** - 本地存储，数据持久化
5. **`wx.getLocation`** - 获取位置，做定位相关功能

记住：组件负责"显示"，API负责"功能"，搭配使用开发效率才高。

### 4、页面之间怎么传数据？三种方式

**方式一：全局变量（简单粗暴）**
在app.js里定义globalData，任何页面都能通过getApp()访问：
```js
// app.js
App({
  globalData: {
    userInfo: null
  }
})
// 页面里用
const app = getApp()
app.globalData.userInfo = '用户信息'
```

**方式二：URL传参（最常用）**
跳转时带参数，目标页面onLoad接收：
```js
// 发送页
wx.navigateTo({
  url: '/pages/detail/detail?id=123&name=张三'
})
// 接收页
onLoad: function(options) {
  console.log(options.id, options.name)
}
```

**方式三：本地缓存（数据持久化）**
用`wx.setStorageSync`存，`wx.getStorageSync`取，关了小程序数据还在。

**面试技巧：** 问哪种方式好？URL传参最规范，全局变量适合存公共数据，缓存适合需要长期保存的数据。

### 5、小程序启动慢怎么优化？

**包体积优化（立竿见影）：**
- **分包加载** - 首选方案，主包只放核心页面，其他功能分包
- **图片压缩** - 用tinypng压缩，支持webp就更好了
- **代码复用** - 组件化开发，减少重复代码
- **清理无用文件** - 定期检查删除不用代码和图片

**请求优化（用户体验）：**
- **关键数据优先** - onLoad时先请求核心数据，次要数据后请求
- **合并请求** - 一次请求多拿数据，减少请求次数
- **缓存策略** - 不常变的数据用CDN缓存
- **预加载** - 提前加载可能用到的数据

**渲染优化（性能提升）：**
- **图片懒加载** - 滚动到可视区域再加载
- **setData优化** - 不要一次设置太多数据，分批处理
- **减少节点** - DOM层级不要太深

记住这个口诀：分包减体积、缓存提速度、懒加载省流量、setData要克制。

### 6、小程序登录流程是怎样的？

![An image](/img/wx-login.jpg)

登录流程就像进门验证身份，分几步走：

1. **获取临时凭证** - 调用`wx.login()`拿到code，code只能用一次
2. **发送给服务器** - 通过`wx.request()`把code发给你的后端
3. **换取用户标识** - 后端用code向微信服务器换取openid和session_key
4. **生成自定义登录态** - 服务器生成token或session返回给小程序
5. **存储登录状态** - 小程序存储token，后续请求带上这个token

**关键点记住：**
- code是一次性的，用完就废
- openid是用户唯一标识，永久有效
- session_key是解密密钥，要保存在服务器
- 登录态管理用token或session

面试时常问：code过期了怎么办？重新调用wx.login()获取新code。

### 7、怎么获取用户头像和昵称？（2024年最新）

微信政策一直在变，现在不能直接获取用户信息了，必须用户主动操作：

**头像获取：**
```html
<button open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
  <image src="{{avatarUrl}}"></image>
</button>
```
用户点击选择头像后，通过`bindchooseavatar`事件获取头像临时路径。

**昵称获取：**
```html
<input type="nickname" placeholder="请输入昵称" />
```
input设置type为nickname，用户输入时微信会提供昵称建议。

**记住这个变化：**
- 旧版：`wx.getUserInfo` → `getUserProfile` → 现在都不能用了
- 新版：必须用户主动操作，不能再自动获取
- 头像要用户选择，昵称要用户输入

面试时说清楚这个演变过程，体现你对技术发展的关注。

### 8、小程序支付怎么实现？

支付功能涉及资金，要特别注意安全和流程：

**完整流程：**
1. **用户点击支付** - 前端触发支付
2. **创建订单** - 调用你自己的服务器接口创建订单
3. **获取支付参数** - 服务器调用微信支付接口获取prepay_id
4. **生成支付签名** - 服务器用商户密钥生成签名
5. **调起支付** - 前端用`wx.requestPayment`调起微信支付

**核心代码：**
```js
wx.requestPayment({
  timeStamp: '时间戳',
  nonceStr: '随机字符串', 
  package: 'prepay_id=xxxxx',
  signType: 'MD5',
  paySign: '签名',
  success(res) {
    // 支付成功，更新订单状态
  },
  fail(res) {
    // 支付失败，处理错误
  }
})
```

**安全要点：**
- 签名必须在服务器生成，前端不能有密钥
- 支付结果要验证，防止伪造
- 异常情况要处理：用户取消、网络超时等

面试重点：支付流程、签名生成、异常处理。

### 9、用户取消支付怎么办？

用户取消支付很常见，处理不好影响用户体验：

**检测取消操作：**
```js
wx.requestPayment({
  // 支付参数...
  fail(res) {
    if (res.errMsg === "requestPayment:fail cancel") {
      // 用户主动取消
      wx.showToast({
        title: '支付已取消',
        icon: 'none'
      })
      // 提供重新支付选项
    }
  }
})
```

**需要处理的场景：**
1. **订单状态回滚** - 如果已创建订单，要标记为未支付
2. **库存恢复** - 如果扣了库存，要恢复
3. **优惠券恢复** - 如果用了优惠券，要退回
4. **重新支付选项** - 给用户再次支付的入口
5. **友好提示** - 不要让用户觉得出错了

**最佳实践：**
- 支付前先确认：显示订单信息，让用户核对
- 支付后立即验证：调接口查支付状态
- 超时处理：设置支付超时时间

记住：用户体验第一，让用户感觉操作流畅、安全可靠。

### 10、小程序分包怎么用？

分包就像把大房子分成几个小房间，按需进入：

**为什么要分包：**
- 主包超过2M无法发布
- 分包每个不超过20M，所有分包不超过50M
- 提升首屏加载速度

**怎么配置分包：**
```json
// app.json
{
  "subPackages": [
    {
      "root": "packageA",
      "pages": ["page1", "page2"],
      "name": "pack1"
    }
  ]
}
```

**目录结构：**
```
├── app.js
├── pages/           // 主包页面
└── packageA/        // 分包目录
    ├── page1/
    └── page2/
```

**动态加载分包：**
```js
wx.loadSubPackage({
  name: 'pack1',
  success(res) {
    // 分包加载成功
  }
})
```

**分包预加载：**
```json
// app.json
{
  "preloadRule": {
    "pages/index/index": {
      "network": "wifi",
      "packages": ["pack1"]
    }
  }
}
```

**面试常问：**
- 分包和主包的区别？主包必须包含首页、tabBar页面
- 分包什么时候加载？用户访问分包页面时加载
- 如何优化分包体验？设置预加载规则

### 11、怎么跳转到其他小程序？

小程序之间跳转用开放能力：

**方法一：navigateToMiniProgram**
```js
wx.navigateToMiniProgram({
  appId: '目标小程序appId',
  path: 'pages/index/index?id=123',
  extraData: {
    key: 'value' // 传给目标小程序的数据
  },
  success(res) {
    // 跳转成功
  }
})
```

**方法二：URL Scheme（外部跳转）**
生成格式：`weixin://dl/business/?t=miniProgram&appId=xxx&path=xxx`

**注意事项：**
- 需要在app.json配置跳转的小程序列表
- 用户可以在跳转时取消操作
- 限制：最多10个小程序
- 2023年后需要用户主动触发才能跳转

**返回处理：**
```js
// 目标小程序中处理返回
wx.navigateBackMiniProgram({
  extraData: {
    result: 'success'
  }
})
```

**应用场景：**
- 电商小程序跳转支付小程序
- 工具小程序跳转主应用
- 多小程序生态联动


## 二、可视化大屏

### 1、ECharts是什么？常用图表有哪些？

**ECharts基本概念：**
ECharts是百度开源的JavaScript图表库，后来捐赠给Apache，现在是Apache项目的顶级项目。它能在网页上画各种漂亮的图表，而且功能很强大，配置也很灵活。

**面试常问的图表类型：**

**基础图表类：**
- **折线图（Line）** - 看趋势变化，适合时间序列数据，比如用户增长、销售趋势
- **柱状图（Bar）** - 看数值对比，适合分类数据比较，比如各城市销量
- **饼图（Pie）** - 看占比关系，展示部分占整体的比例，比如市场份额
- **散点图（Scatter）** - 看两个变量的关系，比如身高体重相关性

**高级图表类：**
- **雷达图** - 多维度数据对比，比如能力评估、产品对比
- **热力图** - 数据密度和分布，比如地图上的人流密度
- **桑基图** - 数据流向关系，比如资金流向、用户路径
- **漏斗图** - 转化率分析，比如用户转化流程

**3D图表类：**
- **3D柱状图** - 立体数据展示
- **3D地球** - 地理数据可视化
- **3D散点图** - 多维数据展示

**面试技巧：** 背住这几类图表的应用场景，面试时能说清楚什么数据用什么图表展示，就很有竞争力了。

### 2、大屏怎么适配不同屏幕？（面试高频题）

大屏适配是大屏开发的核心难点，面试必问！掌握这几种方案：

**方案一：整体缩放（推荐，最常用）**
核心思路：按设计稿比例整体缩放，简单粗暴但有效。

```css
/* 基础样式 */
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; /* 防止滚动条 */
}

#screen {
    width: 1920px;  /* 设计稿宽度 */
    height: 1080px; /* 设计稿高度 */
    transform-origin: left top; /* 从左上角缩放 */
}

/* JavaScript动态缩放 */
function setScale() {
    const scale = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080
    );
    document.getElementById('screen').style.transform = `scale(${scale})`;
}

window.addEventListener('resize', setScale);
setScale();
```

**优点：** 实现简单，效果好，不会出现布局错乱
**缺点：** 可能会有黑边，分辨率不够时会模糊

**方案二：REM适配（移动端常用）**
核心思路：动态设置根字体大小，所有尺寸用rem单位。

```javascript
// 设计稿宽度为1920px，设置基础字体大小为100px
function setRem() {
    const baseWidth = 1920;
    const scale = document.documentElement.clientWidth / baseWidth;
    document.documentElement.style.fontSize = scale * 100 + 'px';
}

window.addEventListener('resize', setRem);
setRem();
```

**CSS中使用：**
```css
/* 192px / 100px = 1.92rem */
.chart-container {
    width: 1.92rem;
    height: 2rem;
}
```

**方案三：Flex布局 + 百分比（灵活适配）**
适合组件化程度高的大屏：

```css
.screen-container {
    display: flex;
    width: 100%;
    height: 100%;
}

.left-panel {
    width: 20%;    /* 左侧占20% */
    height: 100%;
}

.center-panel {
    flex: 1;       /* 中间自适应 */
    height: 100%;
}

.right-panel {
    width: 25%;    /* 右侧占25% */
    height: 100%;
}
```

**方案四：媒体查询（多设备适配）**
针对不同分辨率制定不同样式：

```css
/* 超大屏 */
@media (min-width: 2560px) {
    .chart-title { font-size: 24px; }
}

/* 普通大屏 */
@media (min-width: 1920px) and (max-width: 2559px) {
    .chart-title { font-size: 18px; }
}

/* 小屏 */
@media (max-width: 1919px) {
    .chart-title { font-size: 14px; }
}
```

**实际开发经验总结：**

1. **PC大屏首选缩放方案** - 开发简单，效果好
2. **移动端用REM方案** - 适配性好
3. **Flex布局做组件自适应** - 提高复用性
4. **媒体查询做细节调整** - 提升体验
5. **记得加响应式meta标签：**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

**面试时这样说：**
"我们项目用的是缩放适配方案，因为大屏主要是1920*1080分辨率，整体缩放能保证设计稿的完美还原。同时结合了Flex布局处理组件内部的响应式，还加了媒体查询做细节优化。"

记住这四个方案，面试时能说出适用场景，就很有说服力了！

### 3、大屏数据更新怎么处理？（性能优化）

**数据更新的常见问题：**
- 频繁更新导致页面卡顿
- 大量数据渲染慢
- 内存泄漏累积

**解决方案：**

**1. 定时轮询 + 缓存**
```javascript
// 智能轮询，有数据变化才更新
let lastData = {};

function fetchData() {
    fetch('/api/dashboard-data')
        .then(res => res.json())
        .then(data => {
            // 检查数据是否有变化
            if (JSON.stringify(data) !== JSON.stringify(lastData)) {
                updateCharts(data);
                lastData = data;
            }
        });
}

// 根据业务调整轮询间隔
setInterval(fetchData, 5000); // 5秒轮询一次
```

**2. WebSocket实时推送**
```javascript
const ws = new WebSocket('ws://your-domain.com/ws');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    // 批量更新，减少重绘次数
    batchUpdateCharts(data);
};

function batchUpdateCharts(data) {
    // 用requestAnimationFrame优化渲染
    requestAnimationFrame(() => {
        chart1.setOption(data.chart1);
        chart2.setOption(data.chart2);
        chart3.setOption(data.chart3);
    });
}
```

**3. 数据分页加载**
```javascript
// 大数据量时用分页，避免一次性渲染过多数据
function loadChartData(page = 1, pageSize = 1000) {
    fetch(`/api/chart-data?page=${page}&size=${pageSize}`)
        .then(res => res.json())
        .then(data => {
            // 增量渲染
            appendChartData(data);
        });
}
```

**4. 图表性能优化**
```javascript
// ECharts性能优化配置
const option = {
    animation: false,        // 关闭动画提升性能
    hoverLayerThreshold: 3000, // 超过3000个数据点启用渐进渲染
    progressive: 1000,       // 渐进式渲染阈值
    progressiveThreshold: 5000, // 开启渐进渲染的阈值
    series: [{
        type: 'line',
        large: true,         // 开启大数据优化
        largeThreshold: 2000, // 大数据量阈值
        data: hugeDataArray
    }]
};
```

**面试加分项：**
- 提到防抖和节流技术
- 了解虚拟滚动概念
- 会用Chrome DevTools做性能分析


### 4、大屏项目遇到过什么坑？（实战经验）

**常见问题和解决方案：**

**1. 图表不显示/显示不完整**
```javascript
// 确保容器有明确的宽高
.chart-container {
    width: 100%;
    height: 400px;
}

// 图表初始化时机要正确
onMounted(() => {
    nextTick(() => {
        chartInstance = echarts.init(domElement);
    });
});
```

**2. 浏览器标签页切换回来图表空白**
```javascript
// 监听页面可见性变化
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && chartInstance) {
        chartInstance.resize();
    }
});

// 或者监听窗口大小变化
window.addEventListener('resize', debounce(() => {
    chartInstance?.resize();
}, 300));
```

**3. 内存泄漏导致越来越卡**
```javascript
// 组件销毁时清理资源
onUnmounted(() => {
    if (chartInstance) {
        chartInstance.dispose(); // 销毁图表实例
        chartInstance = null;
    }
    // 清理定时器
    if (timer) {
        clearInterval(timer);
    }
    // 关闭WebSocket
    if (websocket) {
        websocket.close();
    }
});
```

**4. 数据量大时渲染慢**
```javascript
// 数据采样，减少渲染点数
function sampleData(data, maxPoints = 1000) {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
}

// 或者用ECharts的数据采样功能
option: {
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100 // 只显示部分数据
    }]
}
```

**5. 多图表联动处理**
```javascript
// 图表联动
const chart1 = echarts.init(dom1);
const chart2 = echarts.init(dom2);

// 监听第一个图表的事件
chart1.on('click', function(params) {
    // 更新第二个图表
    chart2.setOption({
        series: [{
            data: getFilteredData(params.name)
        }]
    });
});

// 或者使用ECharts的联动API
echarts.connect([chart1, chart2]);
```

**面试时讲这些经验：**
"我之前做大屏项目时遇到过图表切换标签页后不显示的问题，后来发现是resize没有正确触发。我加了visibilitychange监听和防抖处理，就解决了。还有就是内存泄漏问题，现在都会在组件销毁时主动dispose图表实例。"



**面试要点：**
- 强调组件化思维
- 提到响应式处理经验
- 说明性能优化考虑
- 展示对细节的关注

记住：大屏开发不只是技术，更是产品思维，要让数据展示既美观又实用！
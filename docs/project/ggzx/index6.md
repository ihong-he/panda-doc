---
outline: [1, 3]
---

# 大屏开发

## 一、数字驾驶舱

数字驾驶舱（Digital Cockpit），也称为**大屏驾驶舱**，是一种以数据可视化为核心的智能化管理工具，通常用于展示企业、机构或项目的关键业务指标（KPI）和运行状况。它通过结合大屏显示技术、数据整合与分析，以及交互式界面，为用户提供直观、高效的数据监控和决策支持。

### **主要特点**
1. **大屏展示**  
   通常采用超高清LED显示屏或投影设备，屏幕尺寸大、分辨率高，适合会议室、监控中心或展厅等场景。
   
2. **数据可视化**  
   利用图表、地图、动态图形等形式，将复杂的数据呈现为易于理解的可视化内容。例如折线图、柱状图、饼图、热力图、关系图等。
   
3. **实时数据更新**  
   集成数据接口，可实时获取和更新业务数据，如监控设备状态、销售额、库存等。

4. **多维度分析**  
   支持多维度、多层次的数据分析，帮助用户深入挖掘数据背后的规律与趋势。

5. **交互性强**  
   支持触摸屏、鼠标操作或智能控制（如语音、手势），用户可以动态切换数据视图或筛选数据。

---

### **典型应用场景**
1. **企业管理**  
   - 展示企业运营数据，如财务状况、销售业绩、人力资源分布等。
   - 帮助高层管理人员快速了解企业整体运行情况。

2. **智慧城市**  
   - 用于监控城市交通、环保、能源分布等。
   - 提供决策支持，如实时交通调度、应急管理。

3. **工业生产**  
   - 展示生产流水线运行状态、设备运行状况、产能分析等。

4. **能源管理**  
   - 监控发电、配电网络运行状态。
   - 追踪碳排放、能耗效率等指标。

5. **安全监控**  
   - 集成视频监控、报警系统、设备状态数据，实现集中管理。

---

### **技术组成**
1. **前端技术**  
   - 使用 **HTML5**、**CSS3**、**JavaScript** 进行界面开发。
   - 数据可视化库：ECharts、D3.js、Three.js 等。
   - 框架：Vue.js、React.js 等。

2. **后端技术**  
   - 数据处理与接口服务：Node.js、Python、Java 等。
   - 数据库：MySQL、MongoDB、Redis 等。

## 二、大屏开发

> 使用 Vue 3 和 ECharts 开发企业大屏，可以充分利用 Vue 3 的 Composition API 来实现更高效、灵活的代码组织方式。以下是开发步骤：

---

- 项目结构设计

一个典型的大屏项目结构如下：

```bash
src/
├── assets/         # 静态资源（图片、字体等）
├── components/     # 公共组件
│   ├── ChartCard.vue  # 图表卡片组件
│   ├── TitleBar.vue   # 标题栏组件
├── views/          # 页面
│   ├── Dashboard.vue  # 主大屏页面
├── utils/          # 工具函数（如请求封装、数据处理）
├── styles/         # 样式
│   ├── common.scss    # 全局样式
│   ├── variables.scss # 样式变量
├── App.vue         # 根组件
├── main.js         # 入口文件
```

### **1. 封装基础图表组件**

在 `components/ChartCard.vue` 中：

```vue
<template>
  <div class="chart-card" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

// Props
defineProps({
  options: {
    type: Object,
    required: true,
  },
});

const chartContainer = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = () => {
  if (chartContainer.value) {
    chartInstance = echarts.init(chartContainer.value);
    chartInstance.setOption(options);
  }
};

// 调整图表大小
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 生命周期钩子
onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  if (chartInstance) {
    chartInstance.dispose();
  }
});

// 监听 options 数据变化
watch(
  () => options,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.setOption(newOptions);
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-card {
  width: 100%;
  height: 100%;
}
</style>
```

---

### **2. 主页面开发**

在 `views/Dashboard.vue` 中：

```vue
<template>
  <div class="dashboard">
    <TitleBar title="企业大屏" />
    <div class="charts-container">
      <ChartCard :options="lineChartOptions" />
      <ChartCard :options="barChartOptions" />
      <ChartCard :options="pieChartOptions" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import TitleBar from '@/components/TitleBar.vue';
import ChartCard from '@/components/ChartCard.vue';

// 定义图表配置
const chartOptions = reactive({
  lineChartOptions: {
    title: { text: '折线图示例', textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line' }],
  },
  barChartOptions: {
    title: { text: '柱状图示例', textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', 'E'] },
    yAxis: { type: 'value' },
    series: [{ data: [10, 52, 200, 334, 390], type: 'bar' }],
  },
  pieChartOptions: {
    title: { text: '饼图示例', textStyle: { color: '#fff' } },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '分类A' },
          { value: 735, name: '分类B' },
          { value: 580, name: '分类C' },
          { value: 484, name: '分类D' },
          { value: 300, name: '分类E' },
        ],
      },
    ],
  },
});

// 解构 reactive 数据
const { lineChartOptions, barChartOptions, pieChartOptions } = chartOptions;
</script>

<style scoped>
.dashboard {
  background: #000;
  color: #fff;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  padding: 20px;
}
</style>
```

---

### **3. 使用 TitleBar 组件**

在 `components/TitleBar.vue` 中：

```vue
<template>
  <div class="title-bar">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '企业大屏',
  },
});
</script>

<style scoped>
.title-bar {
  width: 100%;
  text-align: center;
  padding: 10px 0;
  background: linear-gradient(90deg, #1f1f1f, #333);
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
</style>
```

---

### **4. 启动项目**

运行以下命令启动项目：
```bash
npm run dev
```

---

### **5. 扩展与优化**
#### **添加动态数据**
- 使用 Axios 请求后端接口数据。
- 通过 `watch` 或 `computed` 响应数据变化。

#### **适配多分辨率**
- 利用 `vw` 和 `vh` 单位或动态缩放（如 `transform: scale`）。

#### **动画与交互**
- 在 ECharts 配置中添加 `animation`，增强视觉体验。
- 为图表添加点击事件，展示详情数据。

#### **部署**
- 使用 Vite 的 `build` 命令进行打包。
- 将打包后的静态文件上传至 Nginx 或其他静态服务器。

## 三、屏幕适配

利用 CSS 的 `vw` 和 `vh` 单位可以实现响应式设计，从而适配不同分辨率的屏幕，尤其适用于企业大屏开发。以下是详细的讲解和实践方法：

---

### **1. 什么是 `vw` 和 `vh`？**
- **`vw`**：视口宽度的 1%。例如，`1vw` 等于当前视口宽度的 1/100。
- **`vh`**：视口高度的 1%。例如，`1vh` 等于当前视口高度的 1/100。

#### **优点**
- 不依赖固定像素，直接以视口尺寸为基准，适配所有屏幕。
- 无需复杂的媒体查询，大屏项目常用来设计全屏布局。

---

### **2. 基本用法**
#### **设置大屏布局**
以下是一个典型的大屏页面样式：
```css
.dashboard {
  width: 100vw; /* 占满视口宽度 */
  height: 100vh; /* 占满视口高度 */
  display: flex;
  flex-direction: column;
  background-color: #000;
  color: #fff;
}
```

#### **图表区域布局**
```css
.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列布局 */
  gap: 2vw; /* 使用 vw 单位设置列间距 */
  width: 96vw; /* 留出左右边距 */
  height: 80vh; /* 高度占视口的 80% */
  margin: 2vh auto; /* 上下居中 */
}
```

#### **字体和其他元素尺寸**
```css
.title-bar {
  font-size: 2vw; /* 字体大小随视口宽度动态调整 */
  padding: 1vh;   /* 顶部间距随视口高度变化 */
}
.chart-card {
  width: 30vw; /* 每张图表卡片宽度为视口的 30% */
  height: 25vh; /* 高度为视口的 25% */
}
```

---

### **3. 配合 JavaScript 动态缩放**
如果需要更精细的适配，结合 CSS 和 JavaScript 动态调整比例。

#### **动态缩放公式**
通过获取屏幕分辨率，计算缩放比例：
```javascript
const designWidth = 1920; // 设计稿宽度
const designHeight = 1080; // 设计稿高度

const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);

// 应用缩放
document.documentElement.style.transform = `scale(${scale})`;
document.documentElement.style.transformOrigin = 'top left';
```

在项目入口 `main.js` 中调用：
```javascript
window.addEventListener('resize', () => {
  adjustScale();
});

function adjustScale() {
  const designWidth = 1920;
  const designHeight = 1080;
  const scale = Math.min(window.innerWidth / designWidth, window.innerHeight / designHeight);
  
  document.documentElement.style.transform = `scale(${scale})`;
  document.documentElement.style.transformOrigin = 'top left';
}

adjustScale(); // 初始化时调用
```

---

### **4. 使用 rem 和 vw 动态结合**
可以通过设置 `html` 的字体大小，将 `rem` 与 `vw` 结合使用：
```css
html {
  font-size: calc(1vw + 1vh); /* 根据视口宽高动态调整根字体大小 */
}

.title-bar {
  font-size: 2rem; /* 使用 rem 配合动态字体大小 */
}
```

---

### **5. 实战案例：完整布局**
```vue
<template>
  <div class="dashboard">
    <div class="title-bar">企业大屏</div>
    <div class="charts-container">
      <div class="chart-card">图表1</div>
      <div class="chart-card">图表2</div>
      <div class="chart-card">图表3</div>
    </div>
  </div>
</template>

<style>
.dashboard {
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.title-bar {
  font-size: 2vw;
  text-align: center;
  padding: 1vh;
  background: #333;
  color: #fff;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2vw;
  padding: 2vh;
  width: 96vw;
  height: 80vh;
}

.chart-card {
  background: #1f1f1f;
  border: 1px solid #444;
  border-radius: 5px;
  width: 100%;
  height: 100%;
}
</style>
```

---

### **6. 总结**
- **`vw` 和 `vh`** 是大屏适配的核心，适合全屏布局。
- 动态缩放（`transform: scale`）适配高宽比不同的屏幕。
- 可以结合 **`rem`** 和 **`vw`/`vh`** 进一步优化字体和间距的动态调整。
- 使用 JavaScript 计算缩放，确保组件在超宽或超高屏幕上显示比例正确。


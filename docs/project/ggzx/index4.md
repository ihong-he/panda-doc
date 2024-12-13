---
outline: [1, 3]
---

# 页面配置

## 一、页面布局及配置

![An image](/item/rms-layout.png)

### 1. 首页页面

```vue
<template>
  <div class="home">
    <img src="@/assets/images/welcome.png" alt="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
onMounted(() => {
  // userStore.getUser()
});
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;

  > img {
    width: 75%;
    max-width: 1200px;
  }
}
</style>
```

### 2. 404 页面

```vue
<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="404">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped lang="scss">
.not-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .not-img {
    margin-right: 120px;
  }

  .not-detail {
    display: flex;
    flex-direction: column;

    h2,
    h4 {
      padding: 0;
      margin: 0;
    }

    h2 {
      font-size: 60px;
      color: var(--el-text-color-primary);
    }

    h4 {
      margin: 30px 0 20px;
      font-size: 19px;
      font-weight: normal;
      color: var(--el-text-color-regular);
    }

    .el-button {
      width: 100px;
    }
  }
}
</style>
```

### 3. 页脚

- 页脚组件

```vue
<!-- src/views/layout/footer/index.vue -->
<template>
  <div class="footer">
    <a href="http://www.robothink.cn/" target="_blank">
      2024 © 杭州博欣科技有限公司
    </a>
  </div>
</template>

<style scoped lang="scss">
.footer {
  height: 30px;
  background-color: var(--el-bg-color);
  line-height: 30px;
  text-align: center;
  a {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    text-decoration: none; // 去掉下划线
    letter-spacing: 0.5px; // 字间距
  }
}
</style>
```

- 注册并使用

```vue{4}
<template>
  <!-- 底部 -->
  <el-footer>
    <Footer></Footer>
  </el-footer>
</template>

<script setup lang="ts">
import Footer from "./footer/index.vue";
</script>
```

### 4. 右侧抽屉

> 抽屉组件，用于设置主题和页面布局。

![image](/item/rms-draw.png)

- 核心代码

::: details

```vue
<template>
  <el-drawer
    v-model="settingStore.isDraw"
    size="290"
    title="主题设置"
    :direction="direction"
    :before-close="handleClose"
  >
    <el-divider>
      <el-icon>
        <Brush />
      </el-icon>
      <span class="icon-text">全局主题</span>
    </el-divider>
    <div class="theme-box">
      <div class="theme-item">
        <div>主题颜色</div>
        <el-color-picker
          v-model="colorVal"
          show-alpha
          :predefine="predefineColors"
        />
      </div>
      <div class="theme-item">
        <div>暗黑模式</div>
        <el-switch
          v-model="settingStore.isDark"
          inline-prompt
          active-icon="Sunny"
          inactive-icon="Moon"
          @change="changeDark"
        />
      </div>
    </div>
    <el-divider>
      <el-icon>
        <ColdDrink />
      </el-icon>
      <span class="icon-text">界面设置</span>
    </el-divider>
    <div class="theme-box">
      <div class="theme-item">
        <div>菜单折叠</div>
        <el-switch
          v-model="setCollapse"
          inline-prompt
          active-icon="Hide"
          inactive-icon="View"
          @change="menuCollapse"
        />
      </div>
      <div class="theme-item">
        <div>页脚设置</div>
        <el-switch
          v-model="setFooter"
          inline-prompt
          active-icon="Close"
          inactive-icon="Check"
          @change="footerShow"
        />
      </div>
      <div class="theme-item">
        <div>面包屑导航</div>
        <el-switch
          v-model="setNav"
          inline-prompt
          active-icon="Hide"
          inactive-icon="View"
          @change="navShow"
        />
      </div>
      <div class="theme-item">
        <div>面包屑图标</div>
        <el-switch
          v-model="setIcon"
          inline-prompt
          active-icon="Close"
          inactive-icon="Check"
          @change="iconShow"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useSettingStore } from "@/store/modules/setting";
import { useDark, useToggle } from "@vueuse/core";

//switch开关的chang事件进行暗黑模式的切换
const isDark = useDark();
const changeDark = useToggle(isDark); // 切换暗黑模式
const settingStore = useSettingStore();
const colorVal = ref("#409EFF");
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
]);

const setNav = ref(settingStore.setNav);
const setIcon = ref(settingStore.setIcon);
const setCollapse = ref(settingStore.isCollapse);
const setFooter = ref(settingStore.setFooter);

const menuCollapse = () => {
  settingStore.setCollapse();
};
const footerShow = () => {
  settingStore.setFooter = !settingStore.setFooter;
};
const navShow = () => {
  settingStore.setNav = !settingStore.setNav;
};
const iconShow = () => {
  settingStore.setIcon = !settingStore.setIcon;
};

// const drawer = ref(settingStore.isDraw);
const direction = ref("rtl");
const handleClose = () => {
  settingStore.isDraw = false;
};
</script>

<style lang="scss" scoped>
.icon-text {
  margin-left: 10px;
}

.el-divider {
  margin-bottom: 30px;
}

.theme-box {
  width: 100%;
  color: var(--theme-font);
  font-size: 14px;

  .theme-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
}
</style>
```

:::

### 5、pinia 持久化

> Pinia 插件 `pinia-plugin-persistedstate` 配置的 Pinia 存储持久化

- 安装依赖包

```bash
pnpm add pinia-plugin-persistedstate
```

- 将插件添加到你的 pinia 实例中

```js
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

- 在声明 store 时，将新 persist 选项设置为 true

::: code-group

```js{11} [setup syntax]
import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore(
  "main",
  () => {
    const someState = ref("hello pinia");
    return { someState };
  },
  {
    persist: true,
  }
);
```

```js{9} [option syntax]
import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => {
    return {
      someState: 'hello pinia',
    }
  },
  persist: true,
})

:::

这样 pinia 关于主题设置的配置信息将会被持久保存到浏览器的 localStorage 中。

## 二、暗黑主题

> 此方案基于 [elementPlus](https://element-plus.org/zh-CN/guide/dark-mode.html) 和 css 变量实现暗黑和明亮主题切换效果

1. 下载`@vueuse/core`，该包会在 HTML 添加`.dark`类名

```

pnpm i @vueuse/core

````

2. 新建`dark.scss`文件

```css
/* 定义根作用域下的变量 */
:root {
  --theme-font: #333;
  --theme-light-font: #999;
  --theme-background: #fff;
  --main-background: #f2f3f5;
  --card-border: #e4e7ed;
}

/* 暗黑模式*/
/* 更改dark类名下变量的取值 */
.dark {
  --theme-font: #fff;
  --theme-light-font: #ccc;
  --theme-background: #0a0a0a;
  --main-background: #0a0a0a;
  --card-border: #666;
}
````

3. 导入到 main.js 入口文件

   ```js
   // elementPlus css变量
   import "element-plus/theme-chalk/dark/css-vars.css";
   // 自定义变量文件
   import "@/styles/dark.scss";
   ```

4. 使用设置的 css 变量

   ```css
   .card {
     background-color: var(--theme-background);
   }
   ```

5. 触发事件

   ```vue
   <template>
     <el-switch
       v-model="layoutStore.isDark"
       inline-prompt
       @change="changeDark"
       :active-icon="Sunny"
       :inactive-icon="Moon"
     />
   </template>
   <script setup lang="ts">
   import useLayoutStore from "@/store/modules/setting.ts";
   import { Sunny, Moon } from "@element-plus/icons-vue";
   import { useDark, useToggle } from "@vueuse/core";
   const layoutStore = useLayoutStore();
   //switch开关的chang事件进行暗黑模式的切换
   const isDark = useDark();
   const changeDark = useToggle(isDark);
   </script>
   ```

6. 使用 pina 共享状态及持久化存储

   ```js
   state: () => {
     return {
       isDark:
         // 控制暗黑主题
         localStorage.getItem("vueuse-color-scheme") == "dark" ? true : false, 
     };
   };
   ```

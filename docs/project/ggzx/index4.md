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

## 二、主题及颜色设置

### 1、暗黑模式

> 此方案基于 [elementPlus](https://element-plus.org/zh-CN/guide/dark-mode.html) 和 css 变量实现暗黑和明亮主题切换效果

- 下载`@vueuse/core`，该包会在 HTML 添加`.dark`类名

```

pnpm i @vueuse/core

````

- 新建`dark.scss`文件

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

- 导入到 main.js 入口文件

  ```js
  // elementPlus css变量
  import "element-plus/theme-chalk/dark/css-vars.css";
  // 自定义变量文件
  import "@/styles/dark.scss";
  ```

- 使用设置的 css 变量

  ```css
  .card {
    background-color: var(--theme-background);
  }
  ```

- 触发事件

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

- 使用 pina 共享状态及持久化存储

  ```js
  state: () => {
    return {
      isDark:
        // 控制暗黑主题
        localStorage.getItem("vueuse-color-scheme") == "dark" ? true : false,
    };
  };
  ```

### 2、颜色设置

> 使用 [elementPlus](https://element-plus.org/zh-CN/guide/theming.html#%E9%80%9A%E8%BF%87-css-%E5%8F%98%E9%87%8F%E8%AE%BE%E7%BD%AE) 官方提供的通过 js 控制 css 变量来设置主题色

- store 仓库设置颜色变量

```js
// src/store/modules/setting.ts
// 设置相关仓库
import { defineStore } from "pinia";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    // 主题色
    color: "#409EFF",
  }),
});
```

- 监听颜色变化变化，并设置 css 变量

```vue
<template>
  <div class="theme-item">
    <div>主题颜色</div>
    <el-color-picker
      v-model="colorVal"
      :predefine="predefineColors"
      @change="changeColor"
    />
  </div>
</template>
<script setup>
// 引入颜色处理函数
import { getLightColor, getDarkColor } from "@/utils/color";

// 定义颜色选择器的颜色值
const colorVal = ref(settingStore.color);
// 监听颜色变化
const changeColor = (val) => {
  console.log(val);
  settingStore.color = val;
  // const el = document.documentElement;
  // // 设置 css 变量
  // el.style.setProperty('--el-color-primary', settingStore.color)

  if (!val) {
    val = "#409EFF";
    ElMessage({
      type: "success",
      message: `主题颜色已重置为 ${val}`,
    });
  }
  // 计算主题颜色变化
  document.documentElement.style.setProperty("--el-color-primary", val);
  document.documentElement.style.setProperty(
    "--el-color-primary-dark-2",
    isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
  );
  for (let i = 1; i <= 9; i++) {
    const primaryColor = isDark.value
      ? `${getDarkColor(val, i / 10)}`
      : `${getLightColor(val, i / 10)}`;
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${i}`,
      primaryColor
    );
  }
};
</script>
```

- 定义颜色处理函数

```js
// src/utils/color.ts
import { ElMessage } from "element-plus";

/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  let hexs: any = "";
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return ElMessage.warning("输入错误的hex");
  str = str.replace("#", "");
  hexs = str.match(/../g);
  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}

/**
 * @description rgb颜色转Hex颜色
 * @param {*} r 代表红色
 * @param {*} g 代表绿色
 * @param {*} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
export function rgbToHex(r: any, g: any, b: any) {
  let reg = /^\d{1,3}$/;
  if (!reg.test(r) || !reg.test(g) || !reg.test(b))
    return ElMessage.warning("输入错误的rgb颜色值");
  let hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
  return `#${hexs.join("")}`;
}
/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return ElMessage.warning("输入错误的hex颜色值");
  let rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++)
    rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  let reg = /^\#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return ElMessage.warning("输入错误的hex颜色值");
  let rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++)
    rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
```

- 使用`hooks`封装逻辑

```js
// 封装主题颜色切换相关的业务代码
import { ElMessage } from "element-plus";
import { useDark, useToggle } from "@vueuse/core";
import { getLightColor, getDarkColor } from "@/utils/color";
import { useSettingStore } from "@/store/modules/setting";

//switch开关的chang事件进行暗黑模式的切换
const isDark = useDark();
export function changePrimary(val) {
  useSettingStore().color = val;
  if (!val) {
    val = "#409EFF";
    ElMessage({
      type: "success",
      message: `主题颜色已重置为 ${val}`,
    });
  }
  // 计算主题颜色变化
  document.documentElement.style.setProperty("--el-color-primary", val);
  document.documentElement.style.setProperty(
    "--el-color-primary-dark-2",
    isDark.value ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
  );
  for (let i = 1; i <= 9; i++) {
    const primaryColor = isDark.value
      ? `${getDarkColor(val, i / 10)}`
      : `${getLightColor(val, i / 10)}`;
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${i}`,
      primaryColor
    );
  }

  return {
    changePrimary,
  };
}
```

- 在`App.vue`中引入逻辑

```vue
<script setup>
import { useSettingStore } from "@/store/modules/setting";
import { changePrimary } from "@/hooks/useColor";

// 渲染主题色
changePrimary(useSettingStore().color);
</script>
```

## 三、替换真实接口

> 将本地的 MOOK 接口替换为服务器上的真实接口

- `.env.development`设置接口

```bash
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '试剂管理系统运营平台'
VITE_APP_BASE_API = '/api'
VITE_SERVER = 'http://sph-api.atguigu.cn'
```

- `vite.config.ts`配置跨域

```js
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  let env = loadEnv(mode, process.cwd());
  return {
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 接口地址
          target: env.VITE_SERVER,
          // 是否跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
```

- 接口替换及响应结果修改

```ts
// 枚举接口地址
// src/api/user/index.ts
enum API {
  LOGIN_URL = "/api/user/login", // [!code --]
  USERINFO_URL = "/api/user/info", // [!code --]
  LOGOUT_URL = "/api/user/logout", // [!code --]
  LOGIN_URL = "/admin/acl/index/login", // [!code ++]
  USERINFO_URL = "/admin/acl/index/info", // [!code ++]
  LOGOUT_URL = "/admin/acl/index/logout", // [!code ++]
}
```

```ts
// src/store/modules/user.ts
async login(data: LoginParamsType) {
      const res: any = await reqLogin(data);
      if (res.code === 200) {
        this.token = res.data.token; // [!code --]
        this.token = res.data; // [!code ++]
        // 持久化存储
        storage.setItem("token", res.data.token); // [!code --]
        storage.setItem("token", res.data); // [!code ++]
        // localStorage.setItem("token", res.data.token);
        // 返回成功响应
        return Promise.resolve(res);
      } else {
        // 登录失败，返回错误信息
        return Promise.reject(res.data.message); // [!code --]
        return Promise.reject(res.data); // [!code ++]
      }
    },
```

---
outline: [1, 3]
---

# 基础配置

## 一、通用配置

### 1. 引入 element-plus

> 试剂管理系统，UI 组件库采用的`element-plus`，因此需要引入 [element-plus](https://element-plus.org/zh-CN/component/overview.html) 插件

```bash
pnpm install element-plus @element-plus/icons-vue
```

- `main.ts`全局安装`element-plus`，默认支持语言英语设置为中文

```js
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
app.use(ElementPlus, {
  locale: zhCn,
});
```

- `Element Plus`全局组件类型声明（可选）

```js
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

::: tip
配置完毕可以测试`element-plus`组件与图标的使用了。
:::

### 2. src 别名的配置

> 在开发项目的时候文件与文件关系可能很复杂，因此我们需要给`src`文件夹配置一个别名

```js{9}
// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve("./src") // 相对路径别名配置，使用 @ 代替 src
        }
    }
})
```

**TypeScript 编译配置**

```
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { //路径映射，相对于baseUrl
      "@/*": ["src/*"]
    }
  }
}
```

### 3. 环境变量的配置

::: info
项目开发过程中，至少会经历**开发环境**、**测试环境**和**生产环境**(即正式环境)三个阶段。

不同阶段请求的状态(如接口地址等)不尽相同，若手动切换接口地址是相当繁琐且易出错的。

于是环境变量配置的需求就应运而生，我们只需做简单的配置，把环境状态切换的工作交给代码。
:::

- **开发环境（development）**

  顾名思义，开发使用的环境，每位开发人员在自己的 dev 分支上干活，开发到一定程度，同事会合并代码，进行联调。

- **测试环境（testing）**

  测试同事干活的环境啦，一般会由测试同事自己来部署，然后在此环境进行测试

- **生产环境（production）**

  生产环境是指正式提供对外服务的，一般会关掉错误报告，打开错误日志。(正式提供给客户使用的环境。)

::: warning
一般情况下，一个环境一般对应一台服务器，不过也有的公司开发与测试环境是一台服务器！！！
:::

- 项目根目录分别添加 开发、生产和测试环境的文件!

```bash
.env.development
.env.production
.env.test
```

> 文件内容

```js
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '试剂管理系统运营平台'
VITE_APP_BASE_API = '/dev-api'
```

```js
NODE_ENV = "production";
VITE_APP_TITLE = "试剂管理系统运营平台";
VITE_APP_BASE_API = "/prod-api";
```

```js
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'test'
VITE_APP_TITLE = '试剂管理系统运营平台'
VITE_APP_BASE_API = '/test-api'
```

- `package.json`配置运行命令

```js
 "scripts": {
    "dev": "vite --open",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "preview": "vite preview"
  },
```

::: tip
通过`import.meta.env`获取环境变量
:::

### 4. svg 图标配置

::: info
svg 图标是一种基于 XML 格式的矢量图形，具有可缩放、文件小、可样式化和易于维护的优势，适用于 Vue 项目中的图标展示。
:::

- 安装 svg 依赖插件

```bash
pnpm install vite-plugin-svg-icons -D
```

- 在`vite.config.ts`中配置插件

```js
// 导入 createSvgIconsPlugin 插件，用于处理 SVG 图标
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// 导入 path 模块，用于处理文件路径
import path from "path";

/**
 * 配置 Vite 构建时的 SVG 图标插件
 * @returns {Object} 返回 Vite 构建配置对象，包含插件配置
 */
export default () => {
  return {
    plugins: [
      // 创建 SVG 图标插件实例
      createSvgIconsPlugin({
        // 指定图标目录，[path.resolve(process.cwd(), 'src/assets/icons')] 用于动态获取图标绝对路径
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 定义符号 ID 格式，'icon-[dir]-[name]' 使用目录和文件名作为 ID
        symbolId: "icon-[dir]-[name]",
      }),
    ],
  };
};
```

- `main.js`入口文件导入

```js
import "virtual:svg-icons-register";
```

#### 4.1 svg 封装为全局组件

> 因为项目很多模块需要使用图标，因此可以把它封装为全局组件。

- 在`src/components`目录下创建一个`SvgIcon`组件

```vue
<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: "#icon-",
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: "",
  },
  //svg宽度
  width: {
    type: String,
    default: "16px",
  },
  //svg高度
  height: {
    type: String,
    default: "16px",
  },
});
</script>
<style scoped></style>
```

- 注册`components`文件夹中的全部组件

> 在`src`文件夹`components`目录下创建一个`index.ts`文件

```js
import SvgIcon from "./SvgIcon.vue";
// 从vue中导入App类型，用于全局注册组件
import { App } from "vue";

// 定义一个包含所有全局组件的对象
const allGloabalComponents = { SvgIcon };

// 默认导出一个函数，该函数接收一个App实例，并全局注册所有组件
export default (app: App) => {
  // 遍历所有全局组件
  Object.keys(allGloabalComponents).forEach((key) => {
    // 在App中注册组件，键名作为组件名，值为组件本身
    app.component(key, allGloabalComponents[key]);
  });
};
```

- 在`main.js`入口文件安装自定义插件

```js
import gloablComponent from "@/components/index";
app.use(gloablComponent);
```

### 5. 引入 sass 及全局样式

::: info
Sass 是一种 CSS 预处理器，扩展了 CSS 的功能，支持变量、嵌套、混入等特性，能提升样式表的维护性和可扩展性。
在 Vue 项目中使用 Sass 可以让样式更加模块化、灵活，减少重复代码并提高开发效率。
:::

（1）引入 sass 模块

- 安装`sass`依赖包

```bash
npm install sass sass-loader --save
```

- 在 vue 文件中的`style`引入

```css
<style scoped lang="scss"></style>
```

（2）引入全局样式及重置样式

- 引入`reset.scss`

```css
/* src/styles/index.scss */
@import "./reset.scss";
```

::: details reset.scss

```scss
/* reset.scss */

/* 1. 设置所有元素的 box-sizing 为 border-box */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 2. 设置 html 和 body 的边距和填充为 0 */
html,
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif; /* 或根据项目需求设置 */
  line-height: 1.4;
  -webkit-font-smoothing: antialiased; /* 防止字体渲染不清晰 */
  -moz-osx-font-smoothing: grayscale;
}

/* 3. 清除 h1~h6 标签的默认样式 */
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

/* 4. 清除列表的样式 */
ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 5. 清除表格样式 */
table {
  border-collapse: collapse;
  border-spacing: 0;
}

th,
td {
  padding: 0;
  text-align: left;
}

/* 6. 清除链接的默认样式 */
a {
  text-decoration: none;
  color: inherit;
}

/* 7. 使图片不超出其容器 */
img {
  max-width: 100%;
  height: auto;
}

/* 8. 设置输入框样式 */
input,
textarea,
button,
select {
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* 9. 清除 form 默认样式 */
form {
  margin: 0;
}

/* 10. 设置 HTML5 元素默认样式 */
header,
footer,
article,
section,
aside,
nav {
  display: block;
}

/* 11. 设置自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 12. 禁止图片拖动 */
img {
  -webkit-user-drag: none;
}
```

:::

- 引入全局样式文件

```js
// main.ts引入全局样式文件
import "@/styles/index.scss";
```

（3）配置 scss 全局变量

- 在`style/variable.scss`创建一个`variable.scss`文件

- 在`vite.config.ts`文件配置如下:

```js
export default defineConfig((config) => {
    // 配置scss全局变量
	css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
}
```

::: warning
`@import "./src/styles/variable.less";`后面的`;`不要忘记，不然会报错!
:::

配置完毕你会发现 scss 提供这些全局变量可以在组件样式中使用了

```scss
$base-color: red;
```

## 二、请求配置

### 1. mock 数据

::: info
Mock.js 是一个用于 JavaScript 开发的模拟数据生成库。它可以帮助开发者在开发前端应用时，不需要后端接口支持就能生成模拟的数据，从而加快开发速度和测试效率。
:::
（1）Mock 安装及配置

- 安装依赖

```bash
pnpm install -D vite-plugin-mock mockjs
```

- 启用插件

```js
// vite.config.js
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === "serve", // 保证开发阶段使用mock接口
      }),
    ],
  };
});
```

- 创建 mock 文件夹

在根目录创建 mock 文件夹，去创建我们需要 mock 数据与接口。

在 mock 文件夹内部创建一个`user.ts`文件

```js
//用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      username: "admin",
      password: "111111",
      desc: "平台管理员",
      roles: ["平台管理员"],
      buttons: ["cuser.detail"],
      routes: ["home"],
      token: "Admin Token",
    },
    {
      userId: 2,
      avatar:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      username: "system",
      password: "111111",
      desc: "系统管理员",
      roles: ["系统管理员"],
      buttons: ["cuser.detail", "cuser.user"],
      routes: ["home"],
      token: "System Token",
    },
  ];
}

export default [
  // 用户登录接口
  {
    url: "/api/user/login", //请求地址
    method: "post", //请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body;
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().find(
        (item) => item.username === username && item.password === password
      );
      //没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: "账号或者密码不正确" } };
      }
      //如果有返回成功信息
      const { token } = checkUser;
      return { code: 200, data: { token } };
    },
  },
  // 获取用户信息
  {
    url: "/api/user/info",
    method: "get",
    response: (request) => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有此token用户
      const checkUser = createUserList().find((item) => item.token === token);
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: "获取用户信息失败" } };
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } };
    },
  },
];
```

（2）axios 测试

- 安装 axios

```bash
pnpm install axios
```

- 测试 mock 接口

```js
// 测试mock请求
import axios from "axios";
axios({
  url: "/api/user/login",
  method: "post",
  data: {
    username: "admin",
    password: "11111",
  },
});
```

### 2. axios 请求封装

::: info
Axios 是一个基于 Promise 的 HTTP 客户端，可以用于浏览器和 node.js 中。
- **跨平台**：既可以在浏览器环境中使用，也可以在 Node.js 服务器端使用。
- **基于 Promise**：所有请求都是基于 Promise 实现的，这意味着可以使用 .then 方法处理成功的响应，使用 .catch 方法处理错误，同时也支持 async/await 语法。
- **拦截请求和响应**：可以设置请求拦截器和响应拦截器，这在需要对请求或响应进行全局处理时非常有用，比如添加认证信息、格式化请求数据或响应数据等。
- **自动转换 JSON 数据**：发送请求时会自动将 JavaScript 对象转换为 JSON 格式，接收到 JSON 响应时也会自动解析成 JavaScript 对象。
:::

在根目录下创建 utils/request.ts

```js
import axios from "axios";
import { ElMessage } from "element-plus";
//创建axios实例
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
//请求拦截器
request.interceptors.request.use((config) => {
  return config;
});
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    //处理网络错误
    let msg = "";
    let status = error.response.status;
    switch (status) {
      case 401:
        msg = "token过期";
        break;
      case 403:
        msg = "无权访问";
        break;
      case 404:
        msg = "请求地址错误";
        break;
      case 500:
        msg = "服务器出现问题";
        break;
      default:
        msg = "无网络";
    }
    ElMessage({
      type: "error",
      message: msg,
    });
    return Promise.reject(error);
  }
);
export default request;
```

### 3. API 接口统一管理

在开发项目的时候，接口可能很多需要统一管理。在 src 目录下去创建 api 文件夹去统一管理项目的接口。

```js
//统一管理咱们项目用户相关的接口
import request from '@/utils/request'

import type {

 loginFormData,

 loginResponseData,

 userInfoReponseData,

} from './type'

//项目用户相关的请求地址

enum API {

 LOGIN_URL = '/admin/acl/index/login',

 USERINFO_URL = '/admin/acl/index/info',

 LOGOUT_URL = '/admin/acl/index/logout',

}
//登录接口
export const reqLogin = (data: loginFormData) =>
 request.post<any, loginResponseData>(API.LOGIN_URL, data)
//获取用户信息

export const reqUserInfo = () =>

 request.get<any, userInfoReponseData>(API.USERINFO_URL)

//退出登录

export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
```

### 扩展

- 贾成豪老师代码仓库地址:
  https://gitee.com/jch1011/vue3_admin_template-bj1.git

- 服务器域名:http://sph-api.atguigu.cn

- swagger 文档:

http://139.198.104.58:8209/swagger-ui.html

http://139.198.104.58:8212/swagger-ui.html#/

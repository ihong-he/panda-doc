---
outline: [1, 3]
---

# 页面搭建

## 一、登录模块

### 1. 静态路由配置

> `Vue Router` 是 Vue 官方的客户端路由解决方案。

- 安装`vue-router`

  ```bash
  pnpm i vue-router
  ```

- 创建 router 路由文件

  ```js
  // src/router/index.ts
  import { createRouter, createWebHashHistory } from "vue-router";
  // 创建路由器
  const router = createRouter({
    // 路由模式
    history: createWebHashHistory(),
    routes: [
      {
        // 登录
        path: "/login",
        component: () => import("@/views/login/index.vue"),
        name: "login", // 命名路由
      },
      {
        // 首页
        path: "/",
        component: () => import("@/views/home/index.vue"),
        name: "home", // 命名路由
      },
      {
        // 404
        path: "/404",
        component: () => import("@/views/404/index.vue"),
        name: "404", // 命名路由
      },
      {
        // 上面路由都没匹配
        path: "/:pathMatch(.*)*",
        redirect: "/404",
        name: "any",
      },
    ],
    // 滚动行为
    scrollBehavior() {
      return {
        top: 0,
        left: 0,
      };
    },
  });
  export default router;
  ```

- 入口文件引入路由文件

  ```js
  // main.ts
  // 引入路由文件
  import router from "./router";
  // 安装router
  app.use(router);
  ```

- 创建路由对应的页面

  ```vue
  <!-- 首页 -->
  <template>
    <div>
      <h3>首页</h3>
    </div>
  </template>
  <script setup lang="ts"></script>
  <style scoped></style>
  ```

- 根组件添加路由占位符

  ```html
  <!-- App.vue -->
  <!-- 路由占位 -->
  <router-view></router-view>
  ```

### 2. 登录页

- 效果图（兼容移动端）

![An image](/item/rms-login.png)

- 登录页模板
  ::: details 点击查看

  ```vue
  <template>
    <div class="login-container flx-center">
      <div class="login-box">
        <div class="login-left">
          <img
            class="login-left-img"
            src="@/assets/images/login_left.png"
            alt="login"
          />
        </div>
        <div class="login-form">
          <div class="login-logo">
            <img class="login-icon" src="@/assets/images/logo.png" alt="" />
            <h2 class="logo-text">RMS试剂管理系统</h2>
          </div>

          <el-form ref="loginFormRef" size="large" :model="loginForm">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                autocomplete="new-password"
              >
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <lock />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="login-btn">
            <el-button :icon="CircleClose" round size="large"> 重置 </el-button>
            <el-button :icon="UserFilled" round size="large" type="primary">
              登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { reactive } from "vue";
  import { CircleClose, User, UserFilled, Lock } from "@element-plus/icons-vue";
  const loginForm = reactive({
    username: "",
    password: "",
  });
  </script>

  <style scoped lang="scss">
  .flx-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-container {
    height: 100%;
    min-height: 550px;
    background-color: #eeeeee;
    background-image: url("@/assets/images/login_bg.svg");
    background-size: 100% 100%;
    background-size: cover;

    .login-box {
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 96.5%;
      height: 94%;
      padding: 0 50px;
      background-color: rgb(255 255 255 / 80%);
      border-radius: 10px;

      .dark {
        position: absolute;
        top: 13px;
        right: 18px;
      }

      .login-left {
        width: 800px;
        margin-right: 10px;

        .login-left-img {
          width: 100%;
          height: 100%;
        }
      }

      .login-form {
        width: 420px;
        padding: 50px 40px 45px;
        background-color: var(--el-bg-color);
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 10%) 0 2px 10px 2px;

        .login-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 45px;

          .login-icon {
            width: 60px;
            height: 52px;
          }

          .logo-text {
            padding: 0 0 0 25px;
            margin: 0;
            font-size: 30px;
            font-weight: bold;
            color: #34495e;
            white-space: nowrap;
          }
        }

        .el-form-item {
          margin-bottom: 40px;
        }

        .login-btn {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 40px;
          white-space: nowrap;

          .el-button {
            width: 185px;
          }
        }
      }
    }
  }

  @media screen and (width <=1250px) {
    .login-left {
      display: none;
    }
  }

  @media screen and (width <=600px) {
    .login-form {
      width: 97% !important;
    }
  }
  </style>
  ```

### 3. Pinia 共享数据

> `Pinia` 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。

- 安装`pinia`

  ```bash
  pnpm i pinia
  ```

- 创建 store 仓库入口文件

  ```js
  // src/store/index.ts
  import { createPinia } from "pinia";
  // 创建store仓库
  const pinia = createPinia();
  // 对外暴露仓库
  export default pinia;
  ```

- 引入并使用 pinia

  ```js
  // main.js
  // 引入仓库
  import pinia from "./store/index.ts";
  // 使用store仓库
  app.use(pinia);
  ```

- 创建用户仓库模块

  ```js
  // store/modules/user.ts
  // 用户相关仓库
  import { defineStore } from "pinia";
  // 引入接口
  import { login } from "@/api/user";
  // 引入数据类型
  import type { loginForm } from "@/api/user/type";
  // 创建用户仓库
  const useUserStore = defineStore("User", {
    // 存储数据的地方
    state: () => {
      return {
        token: localStorage.getItem("TOKEN") || "",
      };
    },
    // 异步/逻辑的地方
    actions: {
      // 用户登录的方法
      async userLogin(data: loginForm) {
        const result: any = await login(data);
        if (result.code == 200) {
          this.token = result.data.token;
          localStorage.setItem("TOKEN", result.data.token);
          return "OK";
        } else {
          return Promise.reject(new Error(result.data.message));
        }
      },
    },
  });
  // 默认导出
  export default useUserStore;
  ```

- 登录页引用用户仓库

  ```js
  // 引入用户store仓库
  import useUserStore from "@/store/modules/user";
  let userStore = useUserStore();

  const login = () => {
   // 使用userStore中的方法
   userStore
     .userLogin()
     .then((res) => {
       // 登录成功逻辑
       ...
     })
     .catch((err) => {
       // 登录失败逻辑
       ...
     });
   }

  ```

> 项目工具类 `util.ts`

::: details 点击查看

```ts
// util.ts

// 本地存储相关
export const storage = {
  // 存储数据
  setItem(key: string, value: any): void {
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value as string);
    }
  },

  // 获取数据
  getItem<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        return value as T;
      }
    }
    return null;
  },

  // 删除数据
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  // 清空所有本地存储
  clear(): void {
    localStorage.clear();
  },
};

// 日期格式化
export const formatDate = (
  date: Date | string | number,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  const d = new Date(date);
  const map: { [key: string]: string | number } = {
    YYYY: d.getFullYear(),
    MM: (d.getMonth() + 1).toString().padStart(2, "0"),
    DD: d.getDate().toString().padStart(2, "0"),
    HH: d.getHours().toString().padStart(2, "0"),
    mm: d.getMinutes().toString().padStart(2, "0"),
    ss: d.getSeconds().toString().padStart(2, "0"),
  };

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => map[matched]);
};

// 深拷贝对象
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// 获取 URL 参数
export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// 防抖函数
export const debounce = (func: Function, wait: number): Function => {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = (func: Function, wait: number): Function => {
  let lastTime = 0;
  return function (...args: any[]) {
    const now = new Date().getTime();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
};

// 判断是否是有效的邮箱
export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// 判断是否是有效的手机号
export const isValidPhone = (phone: string): boolean => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};
```

:::

### 4. 表单校验

```vue
<script setup lang="ts">
const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 10, message: "请输入5到10位的字符", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    // 自定义校验规则
    {
      validator: (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error("密码长度不能小于6位"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
});

/**
 * 提交表单函数
 * @param {FormInstance | undefined} formEl - 表单实例，用于执行表单验证
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  // 检查表单实例是否存在
  if (!formEl) return;

  // 执行表单验证
  await formEl.validate((valid, fields) => {
    // 验证通过
    if (valid) {
      console.log("submit!");
      // 调用接口登录
      ...
    } else {
      // 验证失败，输出错误信息
      console.log("error submit!", fields);
    }
  });
};
</script>
```

## 二、首页模块

### 1. 首页布局

> 效果图

![An image](/item/rms-home.png)

1. 静态模板

```vue
<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <!-- 左侧菜单 -->
      <el-aside width="210px">
        <!-- logo展示 -->
        <Logo></Logo>
        <!-- 菜单展示 -->
        <el-scrollbar class="scrollbar">
          <el-menu>
            <el-menu-item index="1">
              <el-icon><icon-menu /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="2">大屏</el-menu-item>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><location /></el-icon>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1">用户管理</el-menu-item>
                <el-menu-item index="1-2">角色管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <!-- 顶部导航 -->
        <el-header>Header</el-header>
        <!-- 内容区域 -->
        <el-main>
          <p>Main</p>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Logo from "./logo/index.vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
.el-aside {
  .scrollbar {
    height: calc(100% - 50px);
  }
}
</style>
```

### 2. 递归渲染菜单

- 创建菜单路由仓库

```ts{5,12}
// src/store/modules/user.ts
import type { LoginParamsType } from "@/api/user/types";
import { reqLogin, reqUserInfo } from "@/api/user";
import { storage } from "@/utils/util.ts";
import { constRouter } from "@/router/routers";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: storage.getItem("token") || "",
      userInfo: {},
      menuRouter: constRouter, // 菜单路由
    };
  },
});
```

- layout 组件引入

```vue{10-12}
<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <!-- 左侧菜单 -->
      <el-aside width="210px">
        <!-- logo展示 -->
        <Logo></Logo>
        <!-- 菜单展示 -->
        <el-scrollbar class="scrollbar">
          <el-menu>
            <Menu :menuList="userStore.menuRouter"></Menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      ...
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Logo from "./logo/index.vue";
import Menu from "./menu/index.vue"; // [!code ++]
import { useUserStore } from "@/store/modules/user"; // [!code ++]

const userStore = useUserStore(); // [!code ++]
</script>

<style scoped lang="scss">
...
</style>

```

- 动态菜单组件

```vue
<!-- 菜单子路由 menu/index.vue-->
<template>
  <div>
    <template v-for="item in menulist" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item v-if="!item.meta.hidden" :index="item.path">
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有且只有一个子路由 -->
      <template v-else-if="item.children && item.children.length == 1">
        <el-menu-item v-if="!item.meta.hidden" :index="item.children[0].path">
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有多个子路由 -->
      <template v-else>
        <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
          <Menu :menulist="item.children"></Menu>
        </el-sub-menu>
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { Location } from "@element-plus/icons-vue";
// 导入 defineOptions 函数，用于定义组件的选项
import { defineOptions } from "vue";

// 使用 defineOptions 函数
defineOptions({
  // 递归组件需要设置组件的名称
  name: "Menu", // [!code warning]
});
defineProps(["menuList"]);
</script>
<style scoped></style>
```

- 路由示例

  ```js
  // 登录
  path: "/login",
  component: () => import("@/views/login/index.vue"),
  name: "login", // 命名路由
  meta: {
    title: "登录",
    hidden: true, // 是否显示在左侧菜单
    icon: "House", // 菜单图标
  },
  children: [] // 子路由
  ```

- 全局注册菜单图标

  `Object.entries()` 是用于返回一个给定对象自身可枚举属性的键值对

  ```js
  // src/components/index.ts
  // 引入element-plus提供的全部图标组件
  import * as ElementPlusIconsVue from "@element-plus/icons-vue";
  // 将element-plus提供的全部图标组件注册为全局组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  ```

- 使用菜单图标

  ```vue
  <el-icon>
     <!-- 动态组件 -->
     <component :is="item.meta.icon"></component>
  </el-icon>
  ```

  ::: danger
  由于`element-plus`提供的全部图标组件注册为全局组件，需要避免新增加的组件和全局的图标组件名称相同，比如`Menu`、`User`，否则会导致图标无法显示或者页面加载不出来。
  :::

### 3. 路由出口

> 定义二级路由出口和[动画效果](https://cn.vuejs.org/guide/built-ins/transition.html)

```vue
// src/views/layout/main/index.vue
<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script setup lang="ts"></script>
<style scoped>
/* 动画效果 */
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
```

### 4. 顶部 tabbar 搭建

 - 左侧面包屑动态导航

   ```vue
   <template>
     <el-icon class="change-icon" @click="changeIcon">
       <!-- 使用动态组件component渲染图标组件 -->
       <component :is="!layoutStore.fold ? 'Fold' : 'Expand'"></component>
     </el-icon>
     <el-breadcrumb separator-icon="ArrowRight">
       <el-breadcrumb-item
         :to="item.path"
         v-for="item in $route.matched"
         v-show="item.meta.title"
       >
         <el-icon class="menu-icon">
           <component :is="item.meta.icon"></component>
         </el-icon>
         <span>{{ item.meta.title }}</span>
       </el-breadcrumb-item>
     </el-breadcrumb>
   </template>

   <script setup lang="ts">
   import { ref } from "vue";
   import useLayoutStore from "@/store/modules/setting.ts";
   import { useRoute } from "vue-router";
   let $route = useRoute();

   // 是否折叠菜单栏
   let layoutStore = useLayoutStore();
   // 折叠菜单栏
   const changeIcon = () => {
     // 图标切换
     layoutStore.fold = !layoutStore.fold;
   };
   </script>
   <script lang="ts">
   export default {
     name: "Breadcrumb",
   };
   </script>

   <style scoped lang="scss">
   // 兼容移动设备 面包屑在移动端不显示
   @media screen and (width <= 750px) {
     .el-breadcrumb {
       display: none;
     }
   }
   </style>
   ```

- 右侧设置选项

   ```vue
   <template>
     <el-button circle icon="Refresh"></el-button>
     <el-button circle icon="FullScreen"></el-button>
     <el-button circle icon="Setting"></el-button>
     <el-dropdown>
       <div>
         <div class="el-dropdown-link">
           <el-avatar
             :size="24"
             src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
           />
           <span class="name">Admin</span>
           <el-icon class="el-icon--right">
             <arrow-down />
           </el-icon>
         </div>
       </div>
       <template #dropdown>
         <el-dropdown-menu>
           <el-dropdown-item>退出登录</el-dropdown-item>
           <el-dropdown-item divided>个人中心</el-dropdown-item>
         </el-dropdown-menu>
       </template>
     </el-dropdown>
   </template>
   <script setup lang="ts"></script>
   <style scoped lang="scss"></style>
   ```

- 组件化

   ```vue
   // src/views/layout/tabbar/index.vue
   <template>
     <div class="tabbar">
       <div class="tab-left">
         <BreadCrumb></BreadCrumb>
       </div>
       <div class="tab-right">
         <Setting></Setting>
       </div>
     </div>
   </template>
   <script setup lang="ts">
   import BreadCrumb from "./breadcrumb/index.vue";
   import Setting from "./setting/index.vue";
   </script>
   <style lang="scss">
   .tabbar {
     width: 100%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: space-between;
     .tab-left {
       display: flex;
       .el-icon {
         margin: 0 15px;
         cursor: pointer;
       }
     }
     .tab-right {
       display: flex;
       align-items: center;
       margin-right: 20px;
       line-height: 50px;
       .el-avatar {
         margin: 0 5px 0 10px;
       }
       .name {
         color: #666;
       }
       .el-dropdown-link {
         display: flex;
         align-items: center;
         cursor: pointer;
       }
     }
   }
   </style>
   ```

### 5. 刷新及全屏功能

- 定义 state 变量

   ```js
   // src/store/modules/setting.ts
   state: () => {
       return {
         fold: false, // 控制菜单折叠收起
         refresh: false, // 控制刷新效果
       };
     },
    actions: {
      // 设置刷新
      setRefresh() {
        this.refresh = !this.refresh;
      },
  },
   ```

- 刷新功能实现

   ```vue
   // src/views/layout/main/index.vue
   <template>
     <!-- 路由组件出口的位置 -->
     <router-view v-slot="{ Component }">
       <transition name="fade">
         <!-- 渲染layout一级路由组件的子路由 -->
         <component :is="Component" v-if="refreshFlag" />
       </transition>
     </router-view>
   </template>

   <script setup lang="ts">
   import { watch, ref, nextTick } from "vue";
   import useLayoutStore from "@/store/modules/setting";
   let layoutStore = useLayoutStore();
   let refreshFlag = ref(true);
   // 监听是否刷新
   watch(
     () => layoutStore.refresh,
     () => {
       refreshFlag.value = false;
       // 组件渲染完毕
       nextTick(() => {
         refreshFlag.value = true;
       });
     }
   );
   </script>
   ```

- 触发刷新操作

   ```vue{8}
   <template>
      <el-button circle icon="Refresh" @click="updateRefresh"></el-button>
   </template>
   <script setup lang="ts">
   import useLayoutStore from "@/store/modules/setting";
   let layoutStore = useLayoutStore();
   const updateRefresh = () => {
     layoutStore.setRefresh();
   };
   </script>
   ```

- 全屏实现

   ```js
   // 点击全屏按钮事件
   const fullScreen = () => {
     // 当前页面是否全屏
     let full = document.fullscreenElement;
     if (!full) {
       // 实现全屏
       document.documentElement.requestFullscreen();
     } else {
       // 退出全屏
       document.exitFullscreen();
     }
   };
   ```

### 6. 获取用户信息

- 用户仓库引入接口

   ```js
   // src/store/modules/user.ts
   import { login, getUserInfo } from "@/api/user";
   state: () => {
       return {
         token: localStorage.getItem("TOKEN") || "",
         menuRouters: constantRouter, // 菜单路由数组
         username: "", // 用户名
         avatar: "", // 头像
       };
     },
    // 异步/逻辑的地方
   actions: {
       // 获取用户信息的方法
       async getUser() {
         const result: any = await getUserInfo();
         console.log(result);
         if (result.code == 200) {
           this.username = result.data.checkUser.username;
           this.avatar = result.data.checkUser.avatar;
         }
       },
   }
   ```

- 添加请求拦截器

   ```js
   // src/utils/request.ts
   request.interceptors.request.use((config) => {
     const userStore = useUserStore();
     console.log(userStore.token);
     if (userStore.token) {
       // 设置请求头
       config.headers.token = userStore.token;
     }
     return config;
   });
   ```

- 渲染用户信息

   ```js
   // 引入用户仓库数据
   import useUserStore from '@/store/modules/user';
   let userStore = useUserStore();
   // 渲染数据
   <el-avatar :size="24" :src="userStore.avatar" />
   <span class="name">{{ userStore.username }}</span>
   ```

### 7. 退出登录

- 重置仓库用户信息

   ```js
   // src/store/modules/user.ts
   // 退出登录的方法
   userLogout() {
     // 清除用户信息
     this.token = "";
     this.username = "";
     this.avatar = "";
     localStorage.removeItem("Token");
   },
   ```

- 触发退出登录操作

   ```ts
   import { useRoute } from "vue-router";
   let userStore = useUserStore();
   import useUserStore from "@/store/modules/user";
   // 获取路由信息对象
   let $router = useRoute();
   // 退出登录
   const exit = () => {
     userStore.userLogout();
     //跳转到登录页面，在URL中保存跳转前的路径
     $router.push({ path: "/login", query: { redirect: $route.path } });
   };
   ```

- 登录页处理

   ```js
   import { useRouter, useRoute } from "vue-router";
   // 获取路由器对象
   let $router = useRouter();
   // 获取路由信息对象
   let $route = useRoute();
   // 登录回调
   const login = () => {
     // 判断登录的时候,路由路径当中是否有query参数
     let redirect: any = $route.query.redirect;
     // 如果有就往query参数跳转，没有跳转到首页
     $router.push({ path: redirect || "/" });
   };
   ```

## 三、体验优化

### 1. 加载进度条

> [nprogress](https://www.npmjs.com/package/nprogress) 是前端轻量级 web 进度条插件

1. 安装 nprogress

   ```
   pnpm i nprogress
   ```

2. 新增路由鉴权文件

   ```js
   // src/router/permission.ts
   // 路由鉴权
   import router from "./index.ts";
   // 引入进度条插件及样式
   import nprogress from "nprogress";
   import "nprogress/nprogress.css";
   // 去除进度条小圆圈
   nprogress.configure({ showSpinner: false });
   // 全局前置守卫
   router.beforeEach((to, from, next) => {
     // 进度条开始
     nprogress.start();
     next();
   });
   // 全局后置钩子
   router.afterEach(() => {
     // 进度条结束
     nprogress.done();
   });
   ```

3. 导入到入口文件

   ```js
   // 引入路由鉴权文件
   import "./router/permission.ts";
   ```

### 2. 路由鉴权

> 对用户请求的权限进行判断，如果用户没有权限，则不能访问该页面

- route 新增权限字段`requiresAuth`

```js{9}
export const constRouter = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login", // 命名路由
    meta: {
      title: "登录页",
      show: false,
      requiresAuth: false, // 是否需要权限验证
  },
  ...
]
```

- 路由守卫进行权限判断

   ```js
   import router from "./index";
   import { useUserStore } from "@/store/modules/user";

   // 路由全局前置守卫
   router.beforeEach((to, from, next) => {
    // 在组件外部使用pinia必须保证store有初始化，否则会报错
    const userStore = useUserStore();
    // 设置页面标题
    if (to.meta.title) {
      document.title = ("试剂管理系统-" + to.meta.title) as string;
    }
    const isAuthenticated = userStore.token;
    // 如果目标路由是登录页
    if (to.path === "/login") {
      next(); // 如果是登录页，直接放行
    } else {
      // 如果目标路由需要鉴权
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
          // 如果没有认证，跳转到登录页
          next({ path: "/login", query: { redirect: to.path } });
        } else {
          next(); // 认证通过，继续路由导航
        }
      } else {
        next(); // 不需要鉴权的页面，继续路由导航
      }
    }
    nprogress.start();
   });
   ```

### 3. 未登录处理

> 未登录状态，点击登录按钮，跳转到登录页，登录成功后，再跳转到之前访问的路由

```vue
<!-- src/views/layout/tabbar/operate/index.vue -->
<template>
  <div class="operate-container">
    <!-- 已登录 -->
    <el-dropdown trigger="click" v-if="userStore.token">
      ...
    </el-dropdown>
    <!-- 未登录 -->
    <el-button
      type="primary"
      style="margin-left: 15px"
      plain
      v-else
      @click="router.push('/login')"
      >登录</el-button
    >
  </div>
</template>

```

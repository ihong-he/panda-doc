---
outline: deep
---
## 目录表
[[toc]]
## 一、Vue基础

### 1、MVVM是什么？Vue怎么实现的？

**通俗理解**：MVVM就是数据模型(Model)、视图(View)、视图模型(ViewModel)三层架构。

- **Model**：数据层，就是咱们定义的数据
- **View**：视图层，就是用户看到的页面
- **ViewModel**：连接层，Vue做的就是这事，让数据变化自动更新视图

**Vue3实现原理**：通过Proxy代理数据对象，当数据变化时自动更新视图。你改数据，页面自动跟着变，不用手动操作DOM。

---

### 2、Vue3和Vue2核心区别（面试重点）

**响应式原理**（必考点）：
- Vue2用`Object.defineProperty`，只能监听已有属性，新增属性要`Vue.set`
- Vue3用`Proxy`，能监听整个对象，新增属性自动响应式

**写法变化**：
- Vue2主要是选项式API（data、methods分开写）
- Vue3推荐组合式API（setup语法糖），相关逻辑放一起，代码更清爽

**性能提升**：
- Vue3编译优化更好，diff算法更智能，静态节点不重新渲染
- 支持Tree-shaking，按需引入，打包体积更小

**新特性**：
- 多根节点（不用套一层div）
- Teleport组件（传送到DOM任意位置）
- Composition API（逻辑复用更方便）

---

### 3、Vue双向绑定底层原理（高频题）

**Vue2（Object.defineProperty）**：
- 把数据属性转成getter/setter
- 读取数据时收集依赖（哪个组件用了这数据）
- 修改数据时通知依赖的组件更新

**Vue3（Proxy）**：
- 用Proxy代理整个对象
- 读取时get操作收集依赖
- 修改时set操作触发更新
- 比Vue2更强大，能监听数组、新增属性等

**一句话总结**：数据变化时自动更新视图，Vue2靠defineProperty，Vue3靠Proxy。

---

### 4、Vue常用指令（记住这几个就够了）

**必知指令**：
- `v-bind`：缩写`:`，绑定属性（如`:class="active"`）
- `v-on`：缩写`@`，绑定事件（如`@click="handleClick"`）
- `v-model`：双向绑定，表单用得多
- `v-for`：循环渲染（记得加`:key`）
- `v-if`/`v-else`：条件渲染
- `v-show`：显示隐藏（display:none）

**不常用但要知道**：
- `v-once`：只渲染一次
- `v-pre`：跳过编译
- `v-cloak`：防止页面闪烁

---

### 5、v-if和v-show的区别（经典面试题）

**核心区别**：
- `v-if`：false时DOM中真没有这个元素，是销毁/创建
- `v-show`：false时DOM还在，只是`display:none`隐藏

**选择原则**：
- 频繁切换用`v-show`（成本小）
- 条件基本不变用`v-if`（初始渲染成本低）

**面试加分**：`v-if`有更高的切换开销，`v-show`有更高的初始渲染开销。

---

### 6、组件data为什么必须是函数

**核心原因**：保证每个组件实例都有独立的数据对象。

**举例说明**：
- 如果data是对象，所有组件实例共享同一个对象，一个改了都受影响
- 如果data是函数，每次创建实例都执行函数返回新对象，数据独立

**Vue3 setup语法糖中**：
- 不用写data函数了，直接写`const count = ref(0)`
- 但原理一样，每个组件实例都有自己的响应式数据

---

### 7、Vue生命周期（背会这些就行）

**Vue2时期**（了解即可）：
- created：数据有了，DOM还没挂载
- mounted：DOM挂载完了
- updated：数据更新了，DOM也更新了
- destroyed：组件销毁了

**Vue3重点**（setup语法糖写法）：
```javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

// 挂载完
onMounted(() => {
  // 获取DOM、发请求
})

// 更新完
onUpdated(() => {
  // DOM更新后的操作
})

// 销毁前
onUnmounted(() => {
  // 清理定时器、解绑事件
})
```

**使用场景**：
- `onMounted`：获取DOM元素、发ajax请求
- `onUnmounted`：清理定时器、取消事件监听

---

### 8、组件通信方式（Vue3重点）

**父子通信**（最常用）：
- 父传子：`props`
- 子传父：`emit`

**跨层级通信**：
- `provide`/`inject`：爷孙组件通信
- EventBus（Vue3不推荐）

**全局状态管理**：
- 小项目：创建一个响应式对象导出
- 大项目：用Pinia（官方推荐）

**Vue3 setup语法糖写法**：
```javascript
// 子组件
const props = defineProps(['msg'])
const emit = defineEmits(['update'])

// 发送事件
emit('update', newValue)
```

---

### 9、v-for中的key为什么重要

**key的作用**：帮Vue识别哪个元素是哪个，提高diff性能。

**没有key的问题**：
- Vue默认用下标作为key
- 数组变化时，可能出现DOM复用混乱
- 典型问题：输入框内容错乱

**怎么选key**：
- 最好用唯一且稳定的值（如id）
- 不要用数组下标
- 不要用随机数

**一句话总结**：key给每个元素发身份证，避免认错人。

---

### 10、computed和watch的区别（必考）

**computed（计算属性）**：
- 有缓存，依赖不变就不重新计算
- 必须有返回值
- 适合根据现有数据计算新数据

**watch（监听器）**：
- 没缓存，数据变就执行
- 可以执行异步操作
- 适合数据变化时做副作用（发请求、DOM操作）

**Vue3新增**：
- `watchEffect`：自动收集依赖，不用手动指定监听谁
- `computed`写法更简洁：`const doubleCount = computed(() => count.value * 2)`

**选择原则**：
- 想缓存、有返回值用computed
- 想做副作用、异步操作用watch

---

### 11、keep-alive是什么，怎么用

**作用**：缓存组件，避免重复渲染，提升性能。

**使用场景**：
- tab切换页面
- 列表进入详情再返回
- 任何需要保持状态的页面切换

**基本用法**：
```vue
<keep-alive :include="['User', 'Post']" :max="10">
  <router-view />
</keep-alive>
```

**生命周期钩子**：
- `activated`：组件被激活时
- `deactivated`：组件被缓存时

**面试重点**：缓存后的组件不会触发`mounted`，而是触发`activated`。

---

### 12、nextTick的作用和使用

**作用**：等DOM更新完成后再执行代码。

**为什么需要**：Vue更新DOM是异步的，数据改完DOM不会马上更新。

**Vue3用法**：
```javascript
import { nextTick } from 'vue'

const updateData = async () => {
  count.value++
  await nextTick()
  // 这里DOM已经更新完了
  console.log(divRef.value.textContent)
}
```

**典型场景**：
- 数据更新后获取最新的DOM内容
- 操作依赖数据更新后的DOM

---

## 二、Vue生态

### 1、Vue Router传参数方式

**路径参数**（动态路由）：
```javascript
// 配置：{ path: '/user/:id', component: User }
// 访问：/user/123
// 获取：route.params.id
```

**查询参数**（URL问号后）：
```javascript
// 访问：/search?q=vue&page=1
// 获取：route.query.q
```

**props传参**（解耦$router）：
```javascript
// 配置：{ path: '/user/:id', component: User, props: true }
// 组件内直接用props接收：props: ['id']
```

**Vue3 setup写法**：
```javascript
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()  // 获取路由信息
const router = useRouter() // 跳转路由
```

---

### 2、路由守卫（权限控制核心）

**全局守卫**：
```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLogin) {
    next('/login')
  } else {
    next()
  }
})
```

**路由独享守卫**：
```javascript
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from, next) => {
    // 只有这个路由的守卫
  }
}
```

**组件内守卫**：
```javascript
// setup语法糖中用不了，了解即可
beforeRouteEnter // 进入前
beforeRouteUpdate // 参数更新时
beforeRouteLeave // 离开前
```

**实际应用**：登录验证、权限控制、页面离开提醒。

---

### 3、hash模式和history模式选择

**hash模式**（`#/home`）：
- 兼容性好，不用服务器配置
- URL丑，有#号
- SEO不友好

**history模式**（`/home`）：
- URL美观，符合常规认知
- 需要服务器配置（刷新404问题）
- SEO友好

**怎么选**：
- 简单项目、演示用hash
- 正式项目、要求SEO用history
- 配合nginx等服务器解决刷新问题

**Vue3中配置**：`createWebHashHistory()`或`createWebHistory()`

---

### 4、Vuex vs Pinia（状态管理）

**Vuex**（传统方案）：
- State、Getter、Mutation、Action、Module
- Mutation必须同步，Action可以异步
- 配置相对复杂

**Pinia**（Vue3推荐）：
- 更简洁，没有Mutation
- 完美支持TypeScript
- 支持DevTools
- 模块化更自然

**Pinia基本用法**：
```javascript
// store/user.js
export const useUserStore = defineStore('user', {
  state: () => ({ name: '张三' }),
  getters: {
    fullName: (state) => state.name + '先生'
  },
  actions: {
    async login() {
      // 可以写异步
    }
  }
})

// 组件中使用
const userStore = useUserStore()
```

**选择建议**：
- Vue3新项目直接用Pinia
- 老项目继续用Vuex
- 小项目可以用简单的响应式对象
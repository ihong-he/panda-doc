---
outline: deep
---

## 一、Vue

### 1、对MVVM的理解

`MVVM`是`Model-View-ViewModel`缩写，也就是把`MVC`中的`Controller`演变成`ViewModel`。`Model`层代表数据模型，`View`代表UI组件，`ViewModel`是View和Model层的桥梁，数据会绑定到viewModel层并自动将数据渲染到页面中，视图变化的时候会通知viewModel层更新数据。

### 2、双向绑定的原理

在Vue 2中，主要是通过`Object.defineProperty()`实现双向绑定。
![An image](/img/vue1.png)

- 在Vue 2中会对`data`中的数据属性进行遍历，使用`Object.defineProperty()`重新定义属性。它可以设置`get`和`set`函数，`get`在读取属性值时调用，`set`在修改属性值时调用。在`set`函数触发时，通知依赖更新。同时通过`Dep`收集依赖，`get`时收集，`set`时通知更新视图。

在Vue 3中，使用`Proxy`实现双向绑定。`Proxy`可以定义基本操作的自定义行为。在`get`操作中收集依赖，`set`操作中更新数据并且触发视图更新。`Proxy`能代理整个对象，动态添加的新属性也能是响应式的，性能和灵活性上较`Object.defineProperty()`有提升。

### 3、Vue3和Vue2的区别

以下是 Vue3 和 Vue2 的主要区别：
- **响应式原理**：
  - Vue2 使用 `Object.defineProperty` 对数据属性进行劫持，新增属性需使用 `Vue.set` 或 `this.$set` 才能实现响应式。
  - Vue3 采用 `Proxy` 实现响应式，可代理整个对象，动态添加新属性也自动为响应式。
- **组件 API**：
  - Vue2 主要使用 `Options API`，将组件的逻辑按选项分类（如 `data`、`methods`、`computed` 等）放在一个对象中。
  - Vue3 除 `Options API` 外，还提供 `Composition API`，可将逻辑按功能组织，通过 `setup` 函数实现，更利于代码复用和维护。
- **性能**：
  - Vue2 对静态节点和动态节点更新无区分，性能稍逊一筹。
  - Vue3 通过静态标记等优化，能更高效地更新，可跳过静态节点更新，性能更好。
- **全局 API**：
  - Vue2 有多个全局 API，如 `Vue.use`、`Vue.component` 等，会影响全局状态。
  - Vue3 引入应用实例 `app`，使用 `app.use`、`app.component` 等，更模块化，减少全局状态干扰。
- **Fragment 支持**：
  - Vue2 组件必须有一个根元素。
  - Vue3 支持 `Fragment`，允许组件有多个根元素，可直接写多个元素而无需包裹元素。
- **Teleport 组件**：
  - Vue3 新增 `Teleport` 组件，可将组件内容传送到 DOM 其他位置，Vue2 没有。

### 4、Vue常用的指令

Vue.js提供了一些常用的指令（Directives），用于操作DOM、数据绑定以及控制应用程序的行为。以下是一些常见的Vue指令以及示例：

1. **v-bind**：用于动态绑定HTML元素的属性。

2. **v-model**：用于实现双向数据绑定，将表单元素的值与数据模型关联。

3. **v-for**：用于循环渲染列表数据。


4. **v-if / v-else**：用于条件性地渲染元素。

5. **v-show**：类似于v-if，但是通过CSS样式来控制元素的显示和隐藏。

6. **v-on**：用于监听DOM事件，并触发相应的方法。

7. **v-pre**：跳过元素和其子元素的编译过程，用于静态内容。

8. **v-cloak**：用于防止页面闪烁，通常与CSS一起使用。

9. **v-once**：只渲染元素和组件一次，不再进行响应式更新。

这些是Vue.js中一些常用的指令。每个指令都有不同的用途，可根据需要选择使用。指令使Vue应用程序更具交互性和动态性，能够根据数据的变化来更新页面内容。

### 5、v-if VS v-show

1. **渲染方式**：
   - `v-if` 是**按需渲染**，条件为 `false` 时，DOM 元素不会存在于页面中。
   - `v-show` 是**显示/隐藏**，通过修改元素的 `display` 样式（`display: none`）来控制可见性，元素始终存在于 DOM 中。

2. **性能**：
   - `v-if` 适用于**条件变化频率较低**的场景，因为每次切换都会销毁和重新创建 DOM。
   - `v-show` 适用于**需要频繁切换显示状态**的场景，因为切换只涉及样式操作。

3. **使用场景**：
   - `v-if`：适合动态加载或初始状态为 `false` 的组件。
   - `v-show`：适合需要频繁显示和隐藏的组件。

**Vue 3 补充**：  
Vue 3 中，`v-if` 和 `v-show` 的基本行为没有改变，但性能更佳，尤其在模板编译和响应式渲染的优化上。

### 6、data为什么是一个函数

在 Vue 2 中，组件的 `data` 必须是一个函数，而在根实例中可以是一个对象。原因如下：  

1. **组件复用时的独立性**：  
   如果 `data` 是一个对象，所有组件实例将共享这一个对象，导致数据互相影响。  
   使用函数返回对象，确保每个组件实例都有独立的 `data` 副本，避免互相干扰。  

   ```javascript
   data() {
       return {
           message: "Hello, Vue!"
       };
   }
   ```

2. **根实例不需要复用**：  
   根实例只创建一次，因此 `data` 可以直接是一个对象，不存在数据共享问题。  


### 7、生命周期

**Vue 2 的生命周期函数：**

1. **创建阶段**：
   - `beforeCreate`：实例初始化之后，数据观察和事件配置尚未完成。
   - `created`：实例已创建完成，数据已响应式处理，但未挂载 DOM。

2. **挂载阶段**：
   - `beforeMount`：模板编译完成，尚未挂载到 DOM。
   - `mounted`：实例已挂载到 DOM，DOM 可被访问。

3. **更新阶段**（数据变化触发）：
   - `beforeUpdate`：数据更新时调用，DOM 尚未更新。
   - `updated`：数据更新后调用，DOM 已同步更新。

4. **销毁阶段**：
   - `beforeDestroy`：实例销毁前调用，仍可访问实例。
   - `destroyed`：实例已销毁，所有事件监听和响应数据均被清理。

---

**Vue 3 的生命周期函数**：

Vue 3 中生命周期函数与 Vue 2 基本一致，但提供了基于 **组合式 API** 的钩子函数替代选项，例如：  
- `onBeforeMount()` 对应 `beforeMount`
- `onMounted()` 对应 `mounted`
- `onBeforeUpdate()` 对应 `beforeUpdate`
- `onUpdated()` 对应 `updated`
- `onBeforeUnmount()` 对应 `beforeDestroy`
- `onUnmounted()` 对应 `destroyed`

**Vue 3 新增**：  
- `onRenderTracked` 和 `onRenderTriggered`：调试响应式数据依赖时使用。  
- `onErrorCaptured`：用于捕获子组件的错误。  

每个生命周期都有明确的作用，可以根据实际需求选择合适的钩子函数进行操作。

### 8、组件通信

**1. 父子组件通信：**

- **父传子**：通过 `props` 向子组件传递数据。  
  ```vue
  <!-- 父组件 -->
  <ChildComponent :message="parentMessage" />
  <!-- 子组件 -->
  props: ['message']
  ```
- **子传父**：通过事件 `$emit` 通知父组件，父组件通过监听事件接收数据。  
  ```vue
  <!-- 子组件 -->
  this.$emit('eventName', data)
  <!-- 父组件 -->
  <ChildComponent @eventName="handleEvent" />
  ```

---

**2. 非父子组件通信：**

- **事件总线 (Event Bus)**：使用一个空的 Vue 实例作为事件中心。  
  ```javascript
  // 创建事件总线
  const EventBus = new Vue();
  // 组件A
  EventBus.$emit('eventName', data);
  // 组件B
  EventBus.$on('eventName', (data) => { ... });
  ```
  **注意**：在 Vue 3 中已不推荐这种方式。

- **状态管理工具（如 Vuex 或 Pinia）**：管理全局状态，适合复杂项目。  
  - Vuex 示例：
    ```javascript
    // 存储数据
    this.$store.commit('mutationName', payload);
    // 访问数据
    this.$store.state.propertyName;
    ```

---

**3. 跨层级组件通信：**

- **`provide` 和 `inject`**：
  - 父级组件提供数据，子孙组件注入数据，适合层级较深的场景。
  ```javascript
  // 父组件
  provide: { key: value }
  // 子组件
  inject: ['key']
  ```

---

**4. 全局事件或全局状态：**

- **Vue.prototype** (Vue 2)：挂载方法或数据到 Vue 的原型。
- **`mitt` (Vue 3 推荐)**：轻量事件总线库。

---

**Vue 3 补充**：

- **组合式 API + `ref` 和 `reactive`**：通过共享响应式数据实现通信。
  ```javascript
  import { ref } from 'vue';
  const sharedData = ref('value');
  export default sharedData;
  ```  

根据实际场景选择合适的通信方式，注重性能和可维护性。

### 9、v-for中key值的作用

在 `v-for` 中使用 `key` 的作用主要是帮助 Vue 跟踪每个节点的身份，优化虚拟 DOM 的重渲染过程。

 **作用**：
1. **性能优化**：  
   Vue 使用 `key` 来标识每个元素，当数据变化时，Vue 能够通过 `key` 精确地识别哪个元素被更改、插入或移除，从而减少不必要的 DOM 操作，提高渲染性能。

2. **避免重用元素**：  
   如果没有 `key`，Vue 默认会通过索引来标识每个元素。这样可能会导致元素的状态（如输入框的值）在位置变化时被错误地复用，出现不一致的现象。

**例子**：
```vue
<!-- 正确用法 -->
<ul>
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
</ul>
```
- 在上面的例子中，`item.id` 作为 `key` 帮助 Vue 更精确地识别每个列表项。

**总结**：`key` 有助于提高渲染效率，并确保元素状态的正确性。


### 10、Computed VS Watch

**区别总结**：

1. **用途**：  
   - **Computed（计算属性）**：用于基于已有数据计算出新的值，适合涉及复杂逻辑的值，且具备**缓存**功能。  
   - **Watch（侦听器）**：用于**监听某个数据的变化**，适合执行一些**副作用操作**（如异步请求、手动 DOM 操作等）。  

2. **触发时机**：  
   - **Computed**：依赖的数据发生变化时，会自动重新计算，但只在被访问时触发计算。  
   - **Watch**：数据变化时立即执行回调函数。  

3. **是否有缓存**：  
   - **Computed**：有缓存，只有依赖数据发生变化时才重新计算，性能更优。  
   - **Watch**：没有缓存，每次数据变化都会触发回调。  

4. **写法**：
   - **Computed**：只需定义计算逻辑，适合返回一个值。  
   - **Watch**：需要显式定义回调函数，可以执行复杂操作。  

---

**代码示例**：

**Computed**：  
```javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
```

**Watch**：  
```javascript
watch: {
  firstName(newVal, oldVal) {
    console.log('firstName changed:', newVal);
    this.fetchData(newVal); // 执行副作用操作
  }
}
```

---

**Vue 3 补充**：

- Vue 3 中的 `ref` 和 `reactive` 配合 `computed` 和 `watch` 使用。  
- 新增了 **`watchEffect`**，可以自动收集依赖并立即执行回调，适合更简单的场景。  

**`watchEffect` 示例**：  
```javascript
import { ref, watchEffect } from 'vue';

const count = ref(0);
watchEffect(() => {
  console.log(`Count is: ${count.value}`);
});
```

### 11、对 `keep-alive` 的理解

**`keep-alive` 简要总结**：

1. **功能**：  
   - `keep-alive` 是 Vue 提供的内置组件，用于**缓存**组件状态和 DOM，防止组件在切换过程中反复销毁和重建，提升性能。  

2. **使用场景**：  
   - 适用于**多视图切换**（如路由组件）或需要保留组件状态的场景。  
   - 比如：分页表单、标签页切换等。  

3. **主要属性**：  
   - **`include`**：字符串或正则，指定哪些组件需要被缓存。  
   - **`exclude`**：字符串或正则，指定哪些组件不需要被缓存。  
   - **`max`**：数字，限制缓存组件的最大数量，超出后会根据 LRU（最近最少使用）策略移除。  

4. **生命周期**：  
   - **`activated`**：组件被激活时触发。  
   - **`deactivated`**：组件被移出缓存时触发。  
   - 与 `mounted` 和 `destroyed` 配合使用，管理逻辑更加灵活。  

---

**代码示例**：

```vue
<template>
  <keep-alive include="ComponentA" max="5">
    <router-view></router-view>
  </keep-alive>
</template>
```

---

**注意事项**：  
- `keep-alive` 只能缓存**动态组件**或**路由组件**。
- 不适用于每次都需要重新加载的场景，比如实时更新的数据展示。

---

### 12、`nextTick` 的作用

1. **主要功能**：  
   - `Vue.nextTick` 或组件实例的 `$nextTick` 用于在**下次 DOM 更新完成后**执行指定的回调函数。  

2. **使用场景**：  
   - 在数据变化后立即获取更新后的 DOM（因为 Vue 的 DOM 更新是异步的）。  
   - 解决数据变化后需要基于最新 DOM 状态执行操作的问题。  

3. **核心原理**：  
   - `nextTick` 将回调延迟到**下一个事件循环**，确保在 DOM 更新完成后再执行。  

---

**代码示例**：

```javascript
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
      this.$nextTick(() => {
        // 在这里 DOM 已更新，可以安全获取最新的 DOM 状态
        console.log(this.$refs.counter.textContent);
      });
    }
  }
};
```

```vue
<template>
  <div ref="counter">{{ count }}</div>
  <button @click="increment">Increment</button>
</template>
```

---
**Vue 3 补充**：  
- 在 Vue 3 中，`nextTick` 直接从 Vue 导入使用，无需依赖组件实例：  
  ```javascript
  import { nextTick } from 'vue';

  nextTick(() => {
    console.log('DOM updated!');
  });
  ```


## 二、VueRouter&Vuex

### 1、路由传递参数的方式

1. **路径参数（Path Params）**：
   - **描述**：通过 URL 中的路径部分传递参数，通常用于动态路由匹配。  
   - **使用方式**：在路由配置中使用 `:param` 占位符，访问时通过 URL 传递参数。  
   
   **例子**：
   ```javascript
   const routes = [
     { path: '/user/:id', component: User }
   ];
   ```

   访问时：  
   ```javascript
   <router-link to="/user/123">Go to User 123</router-link>
   ```
   
   获取参数：  
   ```javascript
   this.$route.params.id;  // '123'
   ```

2. **查询参数（Query Params）**：
   - **描述**：通过 URL 的查询字符串传递参数，适用于非强制性参数。  
   - **使用方式**：通过 `?key=value` 的形式传递参数。  
   
   **例子**：
   ```javascript
   const routes = [
     { path: '/search', component: Search }
   ];
   ```

   访问时：  
   ```javascript
   <router-link to="/search?query=vue">Search</router-link>
   ```

   获取参数：  
   ```javascript
   this.$route.query.query;  // 'vue'
   ```

3. **路由元数据（Route Meta）**：
   - **描述**：通过路由配置中的 `meta` 字段传递额外信息，通常用于存储非 URL 相关的参数。  
   - **使用方式**：通过 `meta` 字段在路由定义时传递参数。  
   
   **例子**：
   ```javascript
   const routes = [
     { path: '/profile', component: Profile, meta: { requiresAuth: true } }
   ];
   ```

   获取参数：  
   ```javascript
   this.$route.meta.requiresAuth;  // true
   ```

4. **props 传递（通过组件的 props）**：
   - **描述**：将路由参数作为 `props` 传递给组件，适用于在组件中直接获取路由参数而不依赖于 `this.$route`。  
   - **使用方式**：在路由配置中设置 `props: true`，即可将路径参数作为组件的 props。  
   
   **例子**：
   ```javascript
   const routes = [
     { path: '/user/:id', component: User, props: true }
   ];
   ```

   获取参数：  
   ```javascript
   props: ['id']
   ```

---

**Vue 3 补充**：
- Vue 3 中的路由传递参数方式与 Vue 2 基本相同。  
- 但 Vue 3 路由组件支持 **Composition API**，可以通过 `useRoute()` 钩子函数获取当前路由信息：  
  ```javascript
  import { useRoute } from 'vue-router';

  const route = useRoute();
  console.log(route.params.id);
  ```

### 2、路由守卫有哪些

1. **全局守卫**：
   - **`beforeEach`**：在路由切换前触发，适用于全局认证、权限校验等。
   - **`afterEach`**：在路由切换后触发，通常用于日志记录等副作用操作。

   **例子**：
   ```javascript
   router.beforeEach((to, from, next) => {
     // 例如：检查用户是否登录
     if (to.meta.requiresAuth && !isLoggedIn) {
       next('/login');
     } else {
       next();
     }
   });

   router.afterEach((to, from) => {
     console.log(`Navigated from ${from.path} to ${to.path}`);
   });
   ```

2. **路由独享守卫**：
   - **`beforeEnter`**：在进入某个特定路由时触发，可以用于路由级别的权限控制或数据预加载等。

3. **组件内守卫**：
   - **`beforeRouteEnter`**：进入组件之前触发，不能访问 `this`，但是可以通过回调函数访问组件实例。
   - **`beforeRouteUpdate`**：在当前路由修改时触发，适用于同一路由下的参数变化。
   - **`beforeRouteLeave`**：离开组件时触发，可以用于阻止离开或保存数据。

---

**Vue 3 补充**：
- Vue 3 中的路由守卫与 Vue 2 基本相同，但配合 **Composition API** 使用时，可以通过 `useRouter()` 和 `useRoute()` 钩子访问路由对象，从而处理路由相关操作。

### 3、hash VS history

1. **Hash 模式**：
   - **原理**：通过 URL 中的 `#` 符号来模拟不同的页面路径，浏览器不会重新加载页面。URL 形式为 `http://example.com/#/path`。
   - **特点**：
     - 不会触发页面刷新，性能较好。
     - 由于 `#` 后的内容不被发送到服务器，适合静态文件托管。
     - 对 SEO 支持较差，不利于搜索引擎优化。
   - **适用场景**：不需要服务器配置的单页面应用，适合快速开发和小型项目。

2. **History 模式**：
   - **原理**：使用 HTML5 的 History API，通过 `pushState` 和 `replaceState` 来改变浏览器历史记录，URL 形式为 `http://example.com/path`。
   - **特点**：
     - URL 更加干净和自然，不包含 `#`。
     - 支持更好的 SEO，因为 URL 是常规的路径。
     - 需要服务器支持，如果刷新时直接访问 URL，服务器需要返回正确的 HTML 文件（一般配置重定向）。
   - **适用场景**：需要更好 SEO 或者在支持服务器端渲染的应用中使用。

---
**总结**：

- **Hash 模式**：依赖 `#`，无需后端配置，适合静态资源托管。
- **History 模式**：依赖 HTML5 History API，更干净的 URL，需要服务器支持。


### 4、Vuex是什么？

Vuex 是 Vue.js 的**状态管理模式**，用于集中管理和维护组件之间共享的状态。它的核心思想是通过一个全局的 **store（仓库）** 来管理应用的所有状态，并遵循单向数据流。

**核心概念：**

1. **State**: 用于存储共享的状态。
2. **Getter**: 类似于计算属性，用于派生状态。
3. **Mutation**: 唯一可以直接更改状态的方法，必须是同步的。
4. **Action**: 用于提交 Mutation，可以包含异步操作。
5. **Module**: 将 store 分成多个模块，提高可维护性。

**Vue 3 的替代方案：**

在 Vue 3 中，推荐使用 **Pinia** 作为状态管理工具，它是 Vuex 的更轻量和现代化的替代品，但 Vuex 4 依然兼容 Vue 3。

简单总结：Vuex 是 Vue 应用的“全局状态管理工具”，解决了组件间状态共享和复杂场景下的状态管理问题。

- 拓展：[pinia用法](/project/ggzx/index3.html#_3-pinia-共享数据)

---
outline: deep
---
# vue3基础

Vue3 的组合式 API 把同一功能的代码聚合在一起，配合更好的 TypeScript 支持，尤其适合中大型组件。

::: tip 怎么读这篇
从 setup 与 ref / reactive 入手，再理解 computed / watch 与生命周期，最后看组件通信。
:::

<Steps :steps="[{ title: '入门：项目与 setup', desc: '用 create-vue 建项目，理解 setup。' }, { title: '进阶：响应式 API', desc: 'ref、reactive、computed 与 watch。' }, { title: '复习：组件通信', desc: '父子通信、defineExpose 与 provide / inject。' }]" />

<Compare :left="{ title: 'Options API', items: ['data / methods / computed 分块', '逻辑按选项组织', '通过 this 访问实例', '小组件直观易读'] }" :right="{ title: 'Composition API', items: ['逻辑按功能聚合在 setup', '直接使用 ref / reactive', '便于抽成 composable 复用', 'TypeScript 推导更友好'] }" caption="不是谁替代谁，而是大组件里组合式更好组织" />

## Vue3组合式API体验

组合式 API 不是把 Options API 的选项打散，而是按「功能」重新组织代码：同一功能的状态、计算与副作用放在一起。组件小的时候两者差别不大，组件变大后组合式的优势才会显现。
> 通过 Counter 案例 体验Vue3新引入的组合式API

```vue
// 选项式
<script>
export default {
  data(){
    return {
      count:0
    }
  },
  methods:{
    addCount(){
      this.count++
    }
  }
}
</script>
```

```vue
// 组合式
<script setup>
import { ref } from 'vue'
const count = ref(0)
const addCount = ()=> count.value++
</script>
```

特点：

1. 代码量变少
2. 分散式维护变成集中式维护
## Vue3更多的优势

<ImgPreview :imgs="['/img/vue3-1.png']" alt="An image" />

## 使用create-vue搭建Vue3项目
### 1. 认识create-vue
> create-vue是Vue官方新的脚手架工具，底层切换到了 vite （下一代前端工具链），为开发提供极速响应

<ImgPreview :imgs="['/img/vue3-2.png']" alt="An image" />

### 2. 使用create-vue创建项目
> 前置条件 - 已安装16.0或更高版本的Node.js

执行如下命令，这一指令将会安装并执行 create-vue
```bash
npm init vue@latest
```

<ImgPreview :imgs="['/img/vue3-3.png']" alt="An image" />

## 熟悉项目和关键文件

<ImgPreview :imgs="['/img/vue3-4.png']" alt="An image" />

## 组合式API - setup选项

### 1. setup选项的写法和执行时机
写法
```vue
<script>
  export default {
    setup(){
      
    },
    beforeCreate(){
      
    }
  }
</script>
```
执行时机
> 在beforeCreate钩子之前执行

<ImgPreview :imgs="['/img/vue3-5.png']" alt="An image" />

### 2. setup中写代码的特点

> 在setup函数中写的数据和方法需要在末尾以对象的方式return，才能给模版使用

```vue
<script>
  export default {
    setup(){
      const message = 'this is message'
      const logMessage = ()=>{
        console.log(message)
      }
      // 必须return才可以
      return {
        message,
        logMessage
      }
    }
  }
</script>
```

### 3. `<script setup>`语法糖

> script标签添加 setup标记，不需要再写导出语句，默认会添加导出语句

```vue
<script setup>
  const message = 'this is message'
  const logMessage = ()=>{
    console.log(message)
  }
</script>
```

<TermTip term="ref" definition="把基本类型（或对象）包装成响应式引用，通过 .value 读写；模板中会自动解包，无需写 .value。" /> —— 统一用 ref 可以减少「什么时候该解包」的心智负担。

## 组合式API - reactive和ref函数

`ref` 与 `reactive` 的选择可简化成一句话：基本类型用 ref，对象用 reactive；但 reactive 解构会丢失响应性，需要 `toRefs`。想少踩坑就全程用 ref，模板里又会自动解包，无需写 `.value`。
### 1. reactive
> 接受对象类型数据的参数传入并返回一个响应式的对象

```vue
<script setup>
 // 导入
 import { reactive } from 'vue'
 // 执行函数 传入参数 变量接收
 const state = reactive({
   msg:'this is msg'
 })
 const setSate = ()=>{
   // 修改数据更新视图
   state.msg = 'this is new msg'
 }
</script>

<template>
  {{ state.msg }}
  <button @click="setState">change msg</button>
</template>
```
### 2. ref
> 接收简单类型或者对象类型的数据传入并返回一个响应式的对象

```vue
<script setup>
 // 导入
 import { ref } from 'vue'
 // 执行函数 传入参数 变量接收
 const count = ref(0)
 const setCount = ()=>{
   // 修改数据更新视图必须加上.value
   count.value++
 }
</script>

<template>
  <button @click="setCount">{{count}}</button>
</template>
```

### 3. reactive 对比 ref

1. 都是用来生成响应式数据
2. 不同点
   - reactive不能处理简单类型的数据

   - ref参数类型支持更好，但是必须通过`.value`做访问修改

   - ref函数内部的实现依赖于reactive函数
3. 在实际工作中的推荐

   - 推荐使用ref函数，减少记忆负担

## 组合式API - computed
> 计算属性基本思想和Vue2保持一致，组合式API下的计算属性只是修改了API写法

```vue
<script setup>
// 导入
import {ref, computed } from 'vue'
// 原始数据
const count = ref(0)
// 计算属性
const doubleCount = computed(()=>count.value * 2)

// 原始数据
const list = ref([1,2,3,4,5,6,7,8])
// 计算属性list
const filterList = computed(item=>item > 2)
</script>
```
## 组合式API - watch
> 侦听一个或者多个数据的变化，数据变化时执行回调函数，俩个额外参数`immediate`控制立刻执行，`deep`开启深度侦听

### 1. 侦听单个数据
```vue
<script setup>
  // 1. 导入watch
  import { ref, watch } from 'vue'
  const count = ref(0)
  // 2. 调用watch 侦听变化
  watch(count, (newValue, oldValue)=>{
    console.log(`count发生了变化，老值为${oldValue},新值为${newValue}`)
  })
</script>
```
### 2. 侦听多个数据
> 侦听多个数据，第一个参数可以改写成数组的写法

```vue
<script setup>
  // 1. 导入watch
  import { ref, watch } from 'vue'
  const count = ref(0)
  const name = ref('cp')
  // 2. 调用watch 侦听变化
  watch([count, name], ([newCount, newName],[oldCount,oldName])=>{
    console.log(`count或者name变化了，[newCount, newName],[oldCount,oldName])
  })
</script>
```

### 3. immediate
> 在侦听器创建时立即出发回调，响应式数据变化之后继续执行回调

```vue
<script setup>
  // 1. 导入watch
  import { ref, watch } from 'vue'
  const count = ref(0)
  // 2. 调用watch侦听变化
  watch(count, (newValue, oldValue)=>{
    console.log(`count发生了变化，老值为${oldValue},新值为${newValue}`)
  },{
    immediate: true
  })
</script>
```

### 4. deep
> 通过watch监听的ref对象默认是浅层侦听的，直接修改嵌套的对象属性不会触发回调执行，需要开启deep

```vue
<script setup>
  // 1. 导入watch
  import { ref, watch } from 'vue'
  const state = ref({ count: 0 })
  // 2. 监听对象state
  watch(state, ()=>{
    console.log('数据变化了')
  })
  const changeStateByCount = ()=>{
    // 直接修改不会引发回调执行
    state.value.count++
  }
</script>

<script setup>
  // 1. 导入watch
  import { ref, watch } from 'vue'
  const state = ref({ count: 0 })
  // 2. 监听对象state 并开启deep
  watch(state, ()=>{
    console.log('数据变化了')
  },{deep:true})
  const changeStateByCount = ()=>{
    // 此时修改可以触发回调
    state.value.count++
  }
</script>

```

## 组合式API - 生命周期函数
### 1. 选项式对比组合式

<ImgPreview :imgs="['/img/vue3-6.png']" alt="An Image" />

### 2. 生命周期函数基本使用
> 1. 导入生命周期函数
> 2. 执行生命周期函数，传入回调

```vue
<scirpt setup>
  import { onMounted } from 'vue'
  onMounted(()=>{
    // 自定义逻辑
  })
</script>
```
### 3. 执行多次
> 生命周期函数执行多次的时候，会按照顺序依次执行

```vue
<scirpt setup>
  import { onMounted } from 'vue'
  onMounted(()=>{
    // 自定义逻辑
  })

  onMounted(()=>{
    // 自定义逻辑
  })
</script>
```
## 组合式API - 父子通信
### 1. 父传子
> 基本思想
> 1. 父组件中给子组件绑定属性
> 2. 子组件内部通过props选项接收数据

<ImgPreview :imgs="['/img/vue3-7.png']" alt="An Image" />

### 2. 子传父
> 基本思想
> 1. 父组件中给子组件标签通过@绑定事件
> 2. 子组件内部通过 emit 方法触发事件

<ImgPreview :imgs="['/img/vue3-8.png']" alt="An Image" />

## defineExpose
默认情况下在 `<script setup>`语法糖下组件内部的属性和方法是不开放给父组件访问的，可以通过defineExpose编译宏指定哪些属性和方法容许访问

> 说明：指定testMessage属性可以被访问到

<ImgPreview :imgs="['/img/vue3-9.png']" alt="An Image" />

## 组合式API - provide和inject
### 1. 作用和场景
> 顶层组件向任意的底层组件传递数据和方法，实现跨层组件通信

<ImgPreview :imgs="['/img/vue3-10.png']" alt="An Image" />

### 2. 跨层传递普通数据
> 实现步骤
> 1. 顶层组件通过 `provide` 函数提供数据
> 2. 底层组件通过 `inject` 函数提供数据

<ImgPreview :imgs="['/img/vue3-11.png']" alt="An Image" />

### 3. 跨层传递响应式数据
> 在调用provide函数时，第二个参数设置为ref对象

<ImgPreview :imgs="['/img/vue3-12.png']" alt="An Image" />

### 4. 跨层传递方法
> 顶层组件可以向底层组件传递方法，底层组件调用方法修改顶层组件的数据

<ImgPreview :imgs="['/img/vue3-13.png']" alt="An Image" />


## 自测清单

先自己回答，再展开核对：

<AnswerReveal title="1. ref 和 reactive 怎么选？" :points="['基本类型用 ref，对象 / 数组可用 reactive', 'ref 整体替换仍保持响应式，reactive 解构会丢响应', '统一用 ref 心智负担最小']" />
<AnswerReveal title="2. watch 和 watchEffect 的区别？" :points="['watch 明确指定监听源，能拿到新旧值', 'watchEffect 立即执行并自动收集依赖', '需要旧值或精确控制时用 watch']" />

::: tip 接下来读什么
[Vue 进阶](/note/vue-high) · [TypeScript 快速上手](/note/ts)
:::

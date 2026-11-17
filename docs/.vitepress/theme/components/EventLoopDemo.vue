<!--
  EventLoopDemo · 事件循环执行顺序演示
  ==================================================================
  用途：配合「JS 进阶」的宏任务 / 微任务对比，把「同步 → 微任务 → 宏任务」
        这句话变成可点击验证的真实输出顺序。

  设计说明：
  - 输出由真实的 Promise.then 与 setTimeout 产生，而不是硬编码数组，
    这样演示结果就是浏览器事件循环自己给出的。
  - 宏任务延迟设为 500ms，只是为了让逐条出现的动画可见，
    延迟长短不影响「谁先谁后」的规则；页面上已注明。
  - 所有颜色使用 VitePress 主题变量，自动适配暗色模式。
-->
<script setup>
import { ref } from 'vue'

const logs = ref([])
const running = ref(false)
const phaseClass = { '同步任务': 'sync', '微任务': 'micro', '宏任务': 'macro' }

function run() {
  logs.value = []
  running.value = true

  // 同步任务：立即进入输出
  logs.value.push({ value: '1', phase: '同步任务' })

  // 微任务：当前同步代码执行完、进入下一个宏任务之前清空
  Promise.resolve().then(() => {
    logs.value.push({ value: '2', phase: '微任务' })
  })

  // 宏任务：下一轮事件循环才执行
  setTimeout(() => {
    logs.value.push({ value: '3', phase: '宏任务' })
    running.value = false
  }, 500)
}

function reset() {
  logs.value = []
  running.value = false
}
</script>

<template>
  <div class="el-demo">
    <pre class="el-demo-code">console.log('1')
Promise.resolve().then(() =&gt; console.log('2'))
setTimeout(() =&gt; console.log('3'), 0)</pre>

    <div class="el-demo-actions">
      <button class="el-demo-btn" type="button" :disabled="running" @click="run">
        {{ running ? '执行中…' : '运行一次' }}
      </button>
      <button class="el-demo-btn is-ghost" type="button" @click="reset">清空</button>
      <span class="el-demo-tip">为了看清逐条出现，演示里的宏任务延迟为 500ms，顺序规则不变</span>
    </div>

    <ol class="el-demo-output">
      <li v-for="(item, index) in logs" :key="index" class="el-demo-line" :class="'is-' + phaseClass[item.phase]">
        <span class="el-demo-index">{{ index + 1 }}</span>
        <span class="el-demo-phase">{{ item.phase }}</span>
        <code>console.log → {{ item.value }}</code>
      </li>
      <li v-if="!logs.length" class="el-demo-empty">点击「运行一次」查看输出顺序</li>
    </ol>

    <p class="el-demo-note">输出固定为 1 → 2 → 3：同步任务先跑完，再清空微任务队列，最后才轮到宏任务。</p>
  </div>
</template>

<style scoped>
.el-demo {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.el-demo-code {
  margin: 0 0 12px;
  padding: 12px 14px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  overflow-x: auto;
}

.el-demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.el-demo-btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.el-demo-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.el-demo-btn.is-ghost {
  background: transparent;
  color: var(--vp-c-brand-1);
}

.el-demo-tip {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.el-demo-output {
  margin: 14px 0 8px;
  padding: 0;
  list-style: none;
}

.el-demo-empty {
  padding: 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.el-demo-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  font-size: 13px;
  animation: el-demo-in 0.25s ease;
}

.el-demo-index {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.el-demo-phase {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 11px;
}

.el-demo-line.is-micro .el-demo-phase {
  background: var(--vp-c-text-2);
}

.el-demo-line.is-macro .el-demo-phase {
  background: var(--vp-c-text-3);
}

.el-demo-note {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--vp-c-text-3);
}

@keyframes el-demo-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

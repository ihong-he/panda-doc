<!--
  BoxModelDemo · 盒模型交互式演示
  ==================================================================
  用途：配合「盒模型」章节，把 content / padding / border / margin
        与 box-sizing 的抽象关系变成可拖动的实时可视化。

  设计说明：
  - 所有尺寸用 ref 保存，contentWidth / boxWidth / totalWidth 全部由
    computed 推导，避免出现「界面显示」与「实际 CSS 规则」两套真相。
  - content-box：width 只作用于 content，padding + border 会撑大盒子；
    border-box：width 是元素总宽，padding + border 向内挤压 content。
  - 四层嵌套用 padding 模拟各层厚度，视觉宽度与计算结果保持一致；
    颜色只用 VitePress 主题变量，自动适配暗色模式。
  - 仅此文档使用，但按文档组件体系全局注册，其它页面也可复用。
-->
<script setup>
import { ref, computed } from 'vue'

const width = ref(200)
const padding = ref(12)
const border = ref(2)
const margin = ref(16)
const boxSizing = ref('content-box')

// content-box 下 width 即内容宽；border-box 下需从 width 中扣掉 padding 与 border
const contentWidth = computed(() =>
  boxSizing.value === 'border-box'
    ? Math.max(0, width.value - padding.value * 2 - border.value * 2)
    : width.value
)

// 元素自身占据的宽度（不含 margin）
const boxWidth = computed(() =>
  contentWidth.value + padding.value * 2 + border.value * 2
)

// 连同外边距在内的总占位宽度
const totalWidth = computed(() => boxWidth.value + margin.value * 2)
</script>

<template>
  <div class="bm">
    <div class="bm-controls">
      <label class="bm-field">
        <span>width <b>{{ width }}px</b></span>
        <input v-model.number="width" type="range" min="120" max="280" step="4" />
      </label>
      <label class="bm-field">
        <span>padding <b>{{ padding }}px</b></span>
        <input v-model.number="padding" type="range" min="0" max="40" />
      </label>
      <label class="bm-field">
        <span>border <b>{{ border }}px</b></span>
        <input v-model.number="border" type="range" min="0" max="12" />
      </label>
      <label class="bm-field">
        <span>margin <b>{{ margin }}px</b></span>
        <input v-model.number="margin" type="range" min="0" max="40" />
      </label>
      <label class="bm-field bm-field-select">
        <span>box-sizing</span>
        <select v-model="boxSizing">
          <option value="content-box">content-box（标准）</option>
          <option value="border-box">border-box（替代）</option>
        </select>
      </label>
    </div>

    <div class="bm-stage">
      <div class="bm-margin" :style="{ padding: margin + 'px' }">
        <span class="bm-label">margin {{ margin }}px</span>
        <div class="bm-border" :style="{ padding: border + 'px' }">
          <span class="bm-label">border {{ border }}px</span>
          <div class="bm-padding" :style="{ padding: padding + 'px' }">
            <span class="bm-label">padding {{ padding }}px</span>
            <div class="bm-content" :style="{ width: contentWidth + 'px' }">
              content {{ contentWidth }}px
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bm-result">
      <span>内容宽 <b>{{ contentWidth }}px</b></span>
      <span>元素占位 <b>{{ boxWidth }}px</b></span>
      <span>含 margin 总宽 <b>{{ totalWidth }}px</b></span>
    </div>
    <p class="bm-note">
      拖动滑块观察：<code>content-box</code> 下 padding / border 会把盒子撑大；
      <code>border-box</code> 下它们向内挤压 content，元素占位始终等于 width。
    </p>
  </div>
</template>

<style scoped>
.bm {
  margin: 20px 0;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.bm-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 20px;
  margin-bottom: 16px;
}

.bm-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.bm-field > span {
  display: flex;
  justify-content: space-between;
}

.bm-field b {
  color: var(--vp-c-brand-1);
}

.bm-field input[type='range'] {
  width: 100%;
  accent-color: var(--vp-c-brand-1);
}

.bm-field-select select {
  padding: 5px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}

.bm-stage {
  overflow-x: auto;
  padding: 4px 0 12px;
}

/* 四层嵌套：用 padding 表示各层厚度，宽度与计算结果天然一致 */
.bm-margin {
  position: relative;
  display: inline-block;
  background: var(--vp-c-bg-alt);
  border-radius: 6px;
}

.bm-border {
  position: relative;
  background: var(--vp-c-brand-1);
  border-radius: 4px;
}

.bm-padding {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 2px;
}

.bm-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-radius: 2px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.bm-label {
  position: absolute;
  top: 2px;
  left: 4px;
  font-size: 10px;
  line-height: 1.2;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.bm-border > .bm-label {
  color: #fff;
}

.bm-result {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 10px 0;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.bm-result b {
  color: var(--vp-c-brand-1);
}

.bm-note {
  margin: 0;
  font-size: 12px;
  line-height: 1.8;
  color: var(--vp-c-text-3);
}

.bm-note code {
  font-size: 12px;
}

@media (max-width: 640px) {
  .bm-controls {
    grid-template-columns: 1fr;
  }
}
</style>

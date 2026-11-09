<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '点击查看答案' },
  openTitle: { type: String, default: '收起答案' },
  points: { type: Array, default: () => [] },
  defaultOpen: { type: Boolean, default: false }
})

const expanded = ref(props.defaultOpen)
</script>

<template>
  <div class="answer-reveal" :class="{ 'is-open': expanded }">
    <button
      class="answer-reveal-head"
      type="button"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      <span class="answer-reveal-arrow" aria-hidden="true">▸</span>
      <span>{{ expanded ? openTitle : title }}</span>
    </button>
    <div
      class="answer-reveal-grid"
      :style="{ gridTemplateRows: expanded ? '1fr' : '0fr' }"
    >
      <div class="answer-reveal-clip">
        <div class="answer-reveal-body">
          <ul v-if="points.length" class="answer-reveal-list">
            <li v-for="(point, index) in points" :key="index">{{ point }}</li>
          </ul>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.answer-reveal {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.answer-reveal-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 0;
  background: transparent;
  color: var(--vp-c-brand-1);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.answer-reveal-head:hover {
  background: var(--vp-c-bg-alt);
}

.answer-reveal-arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.answer-reveal.is-open .answer-reveal-arrow {
  transform: rotate(90deg);
}

.answer-reveal-grid {
  display: grid;
  transition: grid-template-rows 0.24s ease;
}

.answer-reveal-clip {
  overflow: hidden;
}

.answer-reveal-body {
  padding: 4px 16px 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}

.answer-reveal-list {
  margin: 0;
  padding-left: 20px;
}

.answer-reveal-list li + li {
  margin-top: 6px;
}
</style>

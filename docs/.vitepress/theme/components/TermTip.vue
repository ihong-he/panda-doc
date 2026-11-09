<script setup>
import { ref } from 'vue'

defineProps({
  term: { type: String, required: true },
  definition: { type: String, required: true },
  href: { type: String, default: '' }
})

const open = ref(false)
</script>

<template>
  <span class="term-tip" :class="{ 'is-open': open }">
    <button
      class="term-tip-trigger"
      type="button"
      :aria-expanded="open"
      :aria-label="'术语解释：' + term"
      @click="open = !open"
    >{{ term }}</button>
    <span class="term-tip-card" role="tooltip">
      <span class="term-tip-label">术语解释</span>
      <span class="term-tip-def">{{ definition }}</span>
      <a
        v-if="href"
        class="term-tip-link"
        :href="href"
        target="_blank"
        rel="noopener noreferrer"
      >查看文档 →</a>
    </span>
  </span>
</template>

<style scoped>
.term-tip {
  position: relative;
  display: inline-block;
}

.term-tip-trigger {
  padding: 0;
  border: 0;
  border-bottom: 1px dashed var(--vp-c-brand-1);
  background: transparent;
  color: var(--vp-c-brand-1);
  font: inherit;
  font-weight: 600;
  cursor: help;
}

.term-tip-card {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: max-content;
  min-width: 200px;
  max-width: min(320px, 80vw);
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 6px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
}

.term-tip:hover .term-tip-card,
.term-tip:focus-within .term-tip-card,
.term-tip.is-open .term-tip-card {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.term-tip-card::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 8px;
  height: 8px;
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  transform: translate(-50%, -5px) rotate(45deg);
}

.term-tip-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.term-tip-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.term-tip-link:hover {
  text-decoration: underline;
}
</style>

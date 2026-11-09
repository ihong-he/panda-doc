<script setup>
import { onMounted } from 'vue'
import {
  useApiPreference,
  setApiPreference,
  initApiPreference
} from '../composables/useApiPreference'

const preference = useApiPreference()
const options = [
  { value: 'options', label: '选项式 API' },
  { value: 'composition', label: '组合式 API' }
]

onMounted(initApiPreference)
</script>

<template>
  <div class="pref-switch" role="group" aria-label="代码风格偏好">
    <span class="pref-switch-label">代码风格</span>
    <div class="pref-switch-group">
      <button
        v-for="option in options"
        :key="option.value"
        class="pref-switch-btn"
        :class="{ 'is-active': preference === option.value }"
        type="button"
        :aria-pressed="preference === option.value"
        @click="setApiPreference(option.value)"
      >{{ option.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.pref-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 20px 0;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.pref-switch-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.pref-switch-group {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
}

.pref-switch-btn {
  padding: 5px 14px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;
}

.pref-switch-btn.is-active {
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
}
</style>

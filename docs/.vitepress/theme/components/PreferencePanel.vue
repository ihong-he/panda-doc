<script setup>
import { onMounted } from 'vue'
import {
  useApiPreference,
  initApiPreference
} from '../composables/useApiPreference'

defineProps({
  options: { type: String, default: '' },
  composition: { type: String, default: '' }
})

const preference = useApiPreference()

onMounted(initApiPreference)
</script>

<template>
  <div class="pref-panel">
    <span class="pref-panel-tag">
      {{ preference === 'composition' ? '组合式 API' : '选项式 API' }}
    </span>
    <p class="pref-panel-text">
      {{ preference === 'composition' ? composition : options }}
    </p>
  </div>
</template>

<style scoped>
.pref-panel {
  margin: 16px 0;
  padding: 14px 16px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 8px 8px 0;
  background: var(--vp-c-bg-soft);
}

.pref-panel-tag {
  display: inline-block;
  margin-bottom: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-brand-1);
}

.pref-panel-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
}
</style>

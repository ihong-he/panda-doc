<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every((item) => typeof item === 'string' || typeof item?.title === 'string')
  },
  current: { type: Number, default: 0 }
})

const normalize = (step) =>
  typeof step === 'string' ? { title: step, desc: '' } : step
</script>

<template>
  <ol class="doc-steps">
    <li
      v-for="(raw, index) in steps"
      :key="index"
      class="doc-step"
      :class="{
        'is-current': current === index + 1,
        'is-done': current > index + 1
      }"
    >
      <span class="doc-step-index" aria-hidden="true">{{ index + 1 }}</span>
      <div class="doc-step-content">
        <p class="doc-step-title">{{ normalize(raw).title }}</p>
        <p v-if="normalize(raw).desc" class="doc-step-desc">
          {{ normalize(raw).desc }}
        </p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.doc-steps {
  margin: 20px 0;
  padding: 0;
  list-style: none;
}

.doc-step {
  position: relative;
  display: flex;
  gap: 14px;
  padding-bottom: 20px;
}

.doc-step:last-child {
  padding-bottom: 0;
}

.doc-step:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 13px;
  bottom: 4px;
  width: 2px;
  background: var(--vp-c-divider);
}

.doc-step-index {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
}

.doc-step.is-current .doc-step-index {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.doc-step.is-done .doc-step-index {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.doc-step-content {
  padding-top: 3px;
}

.doc-step-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.doc-step.is-current .doc-step-title {
  color: var(--vp-c-brand-1);
}

.doc-step-desc {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>

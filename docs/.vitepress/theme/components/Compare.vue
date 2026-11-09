<script setup>
defineProps({
  left: { type: Object, required: true },
  right: { type: Object, required: true },
  caption: { type: String, default: '' }
})

const items = (side) => side?.items || []
</script>

<template>
  <figure class="doc-compare">
    <div class="doc-compare-grid">
      <section class="doc-compare-col is-left">
        <h4 class="doc-compare-title">{{ left.title }}</h4>
        <ul class="doc-compare-list">
          <li v-for="(item, index) in items(left)" :key="index">{{ item }}</li>
        </ul>
      </section>
      <section class="doc-compare-col is-right">
        <h4 class="doc-compare-title">{{ right.title }}</h4>
        <ul class="doc-compare-list">
          <li v-for="(item, index) in items(right)" :key="index">{{ item }}</li>
        </ul>
      </section>
    </div>
    <figcaption v-if="caption" class="doc-compare-caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.doc-compare {
  margin: 20px 0;
}

.doc-compare-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.doc-compare-col {
  padding: 16px 18px;
  border: 1px solid var(--vp-c-divider);
  border-top: 3px solid var(--vp-c-text-3);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.doc-compare-col.is-right {
  border-top-color: var(--vp-c-brand-1);
}

.doc-compare-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.doc-compare-col.is-right .doc-compare-title {
  color: var(--vp-c-brand-1);
}

.doc-compare-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.doc-compare-list li + li {
  margin-top: 4px;
}

.doc-compare-caption {
  margin-top: 8px;
  font-size: 12px;
  text-align: center;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .doc-compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>

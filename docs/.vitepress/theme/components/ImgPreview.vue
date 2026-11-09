<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  imgs: {
    type: Array,
    required: true,
    validator: (value) => value.every((item) => typeof item === 'string')
  },
  alt: { type: String, default: '' }
})

// 所有图片统一放在 public 下，用站点 base 拼接即可
const srcList = computed(() => props.imgs.map((img) => withBase(img)))
</script>

<template>
  <div class="img-preview">
    <ElImage
      v-for="(src, index) in srcList"
      :key="src"
      :src="src"
      :preview-src-list="srcList"
      :initial-index="index"
      :alt="alt"
      fit="cover"
      loading="lazy"
      preview-teleported
    />
  </div>
</template>

<style scoped>
.img-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>

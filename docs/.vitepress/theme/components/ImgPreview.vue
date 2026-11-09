<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  imgs: {
    type: Array,
    required: true,
    validator: (value) => value.every((item) => typeof item === 'string')
  }
})

// 统一走站点 base，切换部署路径时无需改动组件
const srcList = computed(() => props.imgs.map((img) => withBase(img)))
</script>

<template>
  <div class="img-preview">
    <el-image
      v-for="(src, index) in srcList"
      :key="src"
      :src="src"
      :preview-src-list="srcList"
      :initial-index="index"
      fit="cover"
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

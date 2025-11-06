<template>
  <div class="img-preview">
    <el-image
      v-for="(img, index) in imgs"
      :key="index"
      :src="`/panda-doc${img}`"
      :preview-src-list="imgs.map(img => `/panda-doc${img}`)"
      fit="cover"
    />
  </div>
</template>

<script>
export default {
  name: 'ImgPreview',
  props: {
    imgs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item => typeof item === 'string');
      },
    },
  },
};
</script>

<style scoped>
.img-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
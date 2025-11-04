<!-- components/Pronounce.vue 用于播放单词 -->
<template>
  <span class="pronounce">
    <span style="color:darkcyan;">{{ word }}</span>
    <button class="btn" @click="play">📢</button>
  </span>
</template>

<script setup>
const props = defineProps({
  word: { type: String, required: true },
  lang: { type: String, default: 'en-US' }
})

function play() {
  // 创建一个SpeechSynthesisUtterance对象
  const utterance = new SpeechSynthesisUtterance(props.word)
  utterance.lang = props.lang
  speechSynthesis.speak(utterance)
}
</script>

<style scoped>
.pronounce {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.btn {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1em;
}
</style>
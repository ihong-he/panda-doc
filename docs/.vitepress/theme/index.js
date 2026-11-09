// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.less'
// Element Plus 的组件与样式由 unplugin-vue-components + ElementPlusResolver 自动按需引入
// 暗色变量 resolver 不处理，需在此引入一次
import 'element-plus/theme-chalk/dark/css-vars.css'
import MyLayout from './MyLayout.vue'
// import Layout from './Layout.vue'
// 导入播放单词组件
import Pronounce from './components/Pronounce.vue'
// 导入图片预览组件
import ImgPreview from './components/ImgPreview.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册你的全局组件
    app.component('MyGlobalComponent' /* ... */)
    app.component('Pronounce', Pronounce)
    app.component('ImgPreview', ImgPreview)
  },
  Layout: MyLayout,
}
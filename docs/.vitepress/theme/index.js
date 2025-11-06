// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.less'
// 全局引入elementPlus样式和组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
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
    // 注册Element Plus组件
    app.use(ElementPlus)
    // 注册你的全局组件
    app.component('MyGlobalComponent' /* ... */)
    app.component('Pronounce', Pronounce)
    app.component('ImgPreview', ImgPreview)
  },
  Layout: MyLayout,
}
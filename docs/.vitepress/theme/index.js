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
// 导入文档展示组件
import TermTip from './components/TermTip.vue'
import AnswerReveal from './components/AnswerReveal.vue'
import Steps from './components/Steps.vue'
import Compare from './components/Compare.vue'
import PreferenceSwitch from './components/PreferenceSwitch.vue'
import PreferencePanel from './components/PreferencePanel.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册你的全局组件
    app.component('MyGlobalComponent' /* ... */)
    app.component('Pronounce', Pronounce)
    app.component('ImgPreview', ImgPreview)
    // 文档组件：Markdown 中可直接使用，无需 import
    app.component('TermTip', TermTip)
    app.component('AnswerReveal', AnswerReveal)
    app.component('Steps', Steps)
    app.component('Compare', Compare)
    app.component('PreferenceSwitch', PreferenceSwitch)
    app.component('PreferencePanel', PreferencePanel)
  },
  Layout: MyLayout,
}
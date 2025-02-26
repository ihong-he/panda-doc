import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PandaDoc",
  description: "A VitePress Document",
  head: [['link', { rel: 'icon', href: '/panda-doc/favicon.ico' }]], 
  base: '/panda-doc/', // 使用相对路径，线上部署非根路径时需要修改
  lastUpdated: true,
  cleanUrls: false, // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/doc-logo-mini.png', width: 24, height: 24 },
    editLink: {
      pattern: 'https://github.com/ihong-he/panda-doc/blob/main/docs/:path',
      text: 'Edit this page'
    },
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-2025 Panda工作室'
    },
    algolia: { // algolia 搜索服务 与 内置 search 可二选一
      appId: 'Q6LPLP9RKV',
      apiKey: '62070545d5fa41557099978a4e3e16c0',
      indexName: 'ihong-heio'
    },
    // search: {
    //   provider: 'local', // 可以开启本地搜索
    // },
    nav: [
      { text: '首页', link: '/' },
      { text: '技术', link: '/note/html&css' },
      { text: '开发', link: '/dev/dev1' },
      // { text: '实战', link: '/project/ggzx/index1' },
      {
        text: '实战',
        items: [
          {
            // 该部分的标题
            text: '项目实战',
            items: [
              { text: '博欣试剂管理系统', link: '/project/ggzx/index1' },
              { text: '小兔鲜-web端', link: 'https://ihong-he.github.io/rabbit-doc/' },
              { text: '小兔鲜-小程序端', link: 'https://ihong-he.github.io/rabbit-h5-doc/' },
              { text: '优医问诊APP', link: 'https://fhguo.github.io/yywz-doc/' },
              // { text: 'Section B Item B', link: '...' }
            ]
          }
        ]
      },
      { text: 'Interview ', link: '/interview/index1' },
    ],

    sidebar: {
      '/note/': [
        {
          text: '前端基础',
          collapsed: true,
          items: [
            { text: 'HTML&CSS', link: '/note/html&css' },
            { text: '移动Web', link: '/note/h5' },
            { text: 'JS基础', link: '/note/js-base' },
            { text: 'WebAPI', link: '/note/webAPI' },
            { text: 'JS进阶', link: '/note/js-high' },
            { text: 'Nodejs&Git', link: '/note/node' },
            { text: '前后端交互', link: '/note/link' },
            { text: 'Vue2基础', link: '/note/vue-base' },
            { text: 'Vue2进阶', link: '/note/vue-high' },
          ]
        },
        {
          text: '前端进阶',
          collapsed: true,
          items: [
            { text: 'Vue3基础', link: '/note/vue3' },
            { text: 'TS快速上手', link: '/note/ts' },
            { text: '小程序开发', link: '/note/miniApp' },
            { text: '数据可视化', link: '/note/visualization' },
            { text: 'Electron', link: '/note/electron' },
            { text: 'test', link: '/note/test' },
          ]
        },
      ],
      '/dev/': [
        {
          text: '开发',
          collapsed: true,
          items: [
            { text: 'HTML/CSS/JS', link: '/dev/dev1' },
            { text: 'Vue/Git/HTTP', link: '/dev/dev2' },
            { text: '项目问题一', link: '/dev/dev3' },
            { text: '项目问题二', link: '/dev/dev4' },
          ]
        }
      ],
      '/interview/': [
        {
          text: 'Interview',
          collapsed: true,
          items: [
            { text: 'HTML&CSS', link: '/interview/index1' },
            { text: 'JavaScript', link: '/interview/index2' },
            { text: 'ES6&HTTP', link: '/interview/index3' },
            { text: 'Vue', link: '/interview/index4' },
            { text: '小程序及大屏', link: '/interview/index5' },
            { text: '综合&手写代码', link: '/interview/index6' },
            { text: '项目相关', link: '/interview/index7' },
          ]
        },
        {
          text: '项目',
          collapsed: true,
          items: [
            { text: '博欣信息管理系统', link: '/interview/project/ims' },
            { text: '试剂管理系统', link: '/interview/project/reagent' },
            { text: '行政诉讼E监督', link: '/interview/project/e-supervise' },
            { text: 'APEC', link: '/interview/project/apec' },
            { text: '浙江解纷码', link: '/interview/project/jfm' },
            { text: '小U智选', link: '/interview/project/ushop' },
          ]
        }
      ],
      '/project/': [
        {
          text: '试剂管理系统',
          collapsed: true,
          items: [
            { text: '一、创建项目', link: '/project/ggzx/index1' },
            { text: '二、基础配置', link: '/project/ggzx/index2' },
            { text: '三、页面搭建', link: '/project/ggzx/index3' },
            { text: '四、页面配置', link: '/project/ggzx/index4' },
            { text: '五、权限控制', link: '/project/ggzx/index5' },
            { text: '六、大屏开发', link: '/project/ggzx/index6' },
          ]
        }
      ]
    },
    // 层级
    sidebarDepth: 3,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ihong-he/panda-doc' }
    ]
  }
})



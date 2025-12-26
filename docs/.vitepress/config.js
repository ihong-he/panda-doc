import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid';

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "PandaDoc",
  description: "A VitePress Document",
  head: [['link', { rel: 'icon', href: '/panda-doc/favicon.ico' }]],
  base: '/panda-doc/', // 使用相对路径，线上部署非根路径时需要修改
  lastUpdated: true,
  cleanUrls: false, // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀
  ignoreDeadLinks: true,
  markdown: {
    image: {
      // 设置图片懒加载
      lazyLoading: true
    },
    lineNumbers: true // 启用行号
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/doc-logo-mini.png', width: 24, height: 24 },
    editLink: {
      pattern: 'https://github.com/ihong-he/panda-doc/blob/main/docs/:path',
      text: 'Edit this page'
    },
    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-2026 Panda工作室'
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
      {
        text: '提升',
        items: [
          {
            // 该部分的标题
            text: '技能提升',
            items: [
              { text: 'React学习笔记', link: '/up/up1' },
              { text: '鸿蒙开发笔记', link: '/harmony/hm1' },
              // { text: 'Section B Item B', link: '...' }
            ]
          }
        ]
      },
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
            { text: 'React入门', link: '/note/react' },
            { text: 'test', link: '/note/test' },
          ]
        },
      ],
      '/dev/': [
        {
          text: '开发',
          collapsed: true,
          items: [
            { text: '前言', link: '/dev/dev1' },
            { text: '项目搭建与环境配置', link: '/dev/dev2' },
            { text: '组件与样式渲染', link: '/dev/dev3' },
            { text: '数据处理与状态管理', link: '/dev/dev4' },
            { text: '网络请求与接口调试', link: '/dev/dev5' },
            { text: '性能优化与兼容调试', link: '/dev/dev6' },
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
            { text: 'React&Electron', link: '/interview/index6' },
            { text: '笔试实战', link: '/interview/index7' },
            { text: '项目实现', link: '/interview/index8' },
          ]
        },
        {
          text: '项目',
          collapsed: true,
          items: [
            { text: '博欣信息管理系统', link: '/interview/project/ims' },
            { text: '无人化试剂管理系统', link: '/interview/project/reagent' },
            { text: '博欣项目管理系统', link: '/interview/project/task' },
            { text: '行政诉讼E监督', link: '/interview/project/e-supervise' },
            { text: 'APEC', link: '/interview/project/apec' },
            { text: '浙江解纷码', link: '/interview/project/jfm' },
            { text: '小U智选', link: '/interview/project/ushop' },
          ]
        },
        {
          text: '其它',
          collapsed: true,
          items: [
            { text: '自我介绍', link: '/interview/introduction/index' },
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
      ],
      '/up/': [
        {
          text: 'React学习笔记',
          collapsed: false,
          items: [
            { text: '一、React基础', link: '/up/react/react1/React基础-上' },
            { text: '二、React进阶', link: '/up/react/react2/React基础-下' },
            { text: '三、Redux', link: '/up/react/react3/Redux' },
            { text: '四、React-Router', link: '/up/react/react4/ReactRouter基础' },
            { text: '五、记账本项目', link: '/up/react/react5/ReactRouter记账本' },
            {
              text: '六、极客园-PC', collapsed: true, items: [
                { text: '1. 项目前置准备', link: '/up/react/react6/01.项目前置准备' },
                { text: '2. 登录模块', link: '/up/react/react6/02.登录模块' },
                { text: '3. Layout模块', link: '/up/react/react6/03.Layout模块' },
                { text: '4. 发布文章模块', link: '/up/react/react6/04.发布文章模块' },
                { text: '5. 文章列表模块', link: '/up/react/react6/05.文章列表模块' },
                { text: '6. 编辑文章', link: '/up/react/react6/06.编辑文章' },
                { text: '7. 项目打包', link: '/up/react/react6/07.项目打包' },
              ]
            },
            {
              text: '七、极客园-移动端', collapsed: true, items: [
                { text: '1. 项目前置准备', link: '/up/react/react7/01.项目初始化' },
                { text: '2. 列表模块', link: '/up/react/react7/02.列表模块' },
                { text: '3. 详情模块', link: '/up/react/react7/03.详情模块' },
              ]
            }

          ]
        }
      ],
      '/harmony/': [
        {
          text: 'Harmony',
          collapsed: true,
          items: [
            { text: 'Harmony基础', link: '/harmony/hm1' },
            { text: 'Harmony进阶', link: '/harmony/hm2' },
            { text: '云音乐项目一', link: '/harmony/hm3' },
            { text: '云音乐项目二', link: '/harmony/hm4' },
          ]
        }
      ],
    },
    // 层级
    sidebarDepth: 3,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ihong-he/panda-doc' }
    ]
  }
})



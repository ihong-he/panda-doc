---
outline: deep
---

# BizArk ERP Web 项目快速上手指南

## 项目概述

BizArk ERP Web 是一个基于 Vue.js 2.7 的企业资源规划（ERP）系统前端项目，采用模块化架构设计，集成了多个业务子系统。项目使用 Git 子模块 (`bizark_fe_mods`) 管理通用框架代码。

### 技术栈
- **前端框架**: Vue.js 2.7.14
- **构建工具**: Vue CLI 5 + Webpack
- **UI 组件库**: 
  - Element UI 2.15.13 (按需引入)
  - View Design 4.4.0 (iView 2.0)
  - Avue 2.10.17 (低代码表单)
  - vxe-table 3.8.22 (表格组件)
- **状态管理**: Vuex 3.0.1
- **路由**: Vue Router 3.0.1
- **国际化**: Vue I18n 8.28.2
- **HTTP 客户端**: Axios
- **样式预处理器**: Less, Sass
- **代码规范**: ESLint + Prettier

## 项目结构

```
bizark_erp_web/
├── bizark_fe_mods/          # 框架子模块（通用业务组件、工具、服务）
│   ├── src/
│   │   ├── components/      # 通用业务组件（tablelist、modal、form等）
│   │   ├── store/          # Vuex 状态管理
│   │   ├── service/        # HTTP 服务基类
│   │   ├── locale/         # 国际化
│   │   └── index.js        # 框架入口
│   └── doc/README.md       # 框架详细文档
├── src/
│   ├── assets/             # 静态资源
│   ├── components/         # 项目专用组件
│   ├── hooks/             # Vue 3 Composition API 风格的 Hooks
│   ├── mixins/            # Vue 混入
│   ├── router/            # 路由配置
│   ├── service/           # API 接口服务
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   └── views/             # 页面视图（按业务模块组织）
│       ├── accountingManagement/    # 财务管理
│       ├── ad/                     # 广告管理
│       ├── advertising/           # 广告投放
│       ├── boss/                  # 老板视图
│       ├── finance/               # 财务模块
│       ├── fbb/                   # 仓储物流
│       ├── operate/               # 运营管理
│       ├── purchase/              # 采购管理
│       ├── sales/                 # 销售管理
│       ├── WMS/                   # 仓库管理系统
│       └── ...                    # 其他业务模块
├── package.json           # 项目配置和依赖
├── vue.config.js          # Vue CLI 配置
├── babel.config.js        # Babel 配置
└── .env.*                 # 环境变量配置
```

## 环境准备

### 1. 系统要求
- Node.js >= 16.0.0
- npm 或 cnpm（推荐）

### 2. 依赖安装

```bash
# 首次克隆项目后初始化
npm run init
# 或手动执行
git submodule sync && git submodule update --init --recursive
cd bizark_fe_mods && git checkout dev && git pull
cd ../ && npm install
```

### 3. 环境变量配置

项目支持多环境配置，配置文件位于根目录 `.env.*` 文件：
- `.env.uat` - 开发环境
- `.env.test` - 测试环境  
- `.env.pre` - 预发布环境
- `.env.production` - 生产环境

主要配置项：
- `VUE_APP_BASE_URL` - 基础域名
- `VUE_APP_APIURL_*` - 各业务 API 地址
- `VUE_APP_NODE_ENV` - 环境标识

## 开发指南

### 1. 启动开发服务器

```bash
# 开发环境（UAT）
npm run dev

# 测试环境
npm run dev:test

# 预发布环境
npm run dev:pre

# 生产环境开发模式
npm run dev:prod
```

### 2. 构建项目

```bash
# 测试环境构建
npm run build:test

# 预发布环境构建
npm run build:pre

# 生产环境构建
npm run build
```

### 3. 代码规范

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 清理 ESLint 缓存
npm run lint:clean
```

项目使用 Husky + lint-staged 进行 Git 提交前检查。

## 核心架构说明

### 1. 框架子模块 (`bizark_fe_mods`)

这是项目的核心框架，提供了：

- **路由系统** (`routerInstance`) - 自动集成 404、通知路由
- **状态管理** (`storeInstance`) - 用户信息、权限、多语言、基础数据
- **国际化** (`vueI18nInstance`) - 多语言支持
- **HTTP 服务** - 统一的 API 调用、错误处理
- **通用业务组件** - TableList、Modal、FormEdit、Upload 等

### 2. 入口文件 (`src/main.js`)

```javascript
// 主要功能：
import { storeInstance, routerInstance, vueI18nInstance } from '@mods/index.js'

// Element UI 按需引入
Vue.component('ETree', Tree)
Vue.component('EUpload', Upload)
// ... 其他组件

// 全局混入
Vue.mixin(mixins)

// Vue 实例初始化
new Vue({
  i18n: vueI18nInstance(),
  router: routerInstance(routes, [...customRoutes]),
  store: storeInstance(store, ['ucadm/actionInit']),
})
```

### 3. 业务模块开发

#### 3.1 创建新页面

```javascript
// 1. 在 src/views/ 下创建对应业务目录
// 2. 创建 Vue 组件文件
// 3. 在 router/index.js 中配置路由

// 示例：财务管理模块
src/views/finance/invoice/list.vue
```

#### 3.2 使用 TableList 组件（最常用）

TableList 是框架提供的表格列表通用组件，支持：

- **工具栏** (Tools) - 新增、批量操作、导出等
- **搜索栏** (Searchs) - 条件筛选
- **树形搜索** (TreeSearchs) - 分类筛选
- **标签页搜索** (Tabs) - 状态筛选
- **表格操作** - 行操作、分页、排序

```javascript
// 使用 mixin 模式
import TableList from "@components/templates/tablelist";

export default {
  mixins: [TableList],
  data() {
    return {
      isMixin: true,
      Tools: {
        show: true,
        data: [
          {
            label: '新增',
            theme: "primary",
            operate: "add"
          }
        ]
      },
      Searchs: {
        show: true,
        data: [
          {
            label: "客户名称",
            tag: 'vInput',
            key: 'EQ_customerName',
          }
        ]
      }
    }
  },
  computed: {
    columns() {
      return [
        { type: 'selection', width: 60 },
        { title: '客户名称', key: 'customerName' },
        { 
          title: '操作', 
          width: 100,
          render: this.getOperateNodes
        }
      ]
    }
  },
  methods: {
    // 列表接口
    ajaxRequest(params) {
      return HttpCustomerList(params)
    },
    // 操作处理
    handleOperates(params, type, batch) {
      if (type === 'add') {
        this.handleAdd()
      }
    }
  }
}
```

#### 3.3 API 服务定义

```javascript
// src/service/finance/invoice.js
import HttpService from '@mods/service/base'

// POST 请求示例
export const HttpInvoiceList = (data, config) => 
  HttpService.post("/api/v1/finance/invoice/list", data, {
    ...config, 
    baseURL: process.env.VUE_APP_APIURL_FIN
  })

// GET 请求示例  
export const HttpInvoiceDetail = (id, config) =>
  HttpService.get(`/api/v1/finance/invoice/${id}`, config)
```

### 4. 状态管理

```javascript
// 访问状态数据
// 1. 使用 mapGetters/mapState
import { mapGetters, mapState } from 'vuex'

computed: {
  ...mapGetters('layout', ['getAuthList']),
  ...mapState('layout', ['sysScopeList'])
}

// 2. 直接访问
this.$store.getters['layout/getAuthList']
this.$store.state.layout.sysScopeList
```

### 5. 权限控制

```javascript
// 权限判断函数
this.handleAuth('finance.invoice.view') // 返回 boolean

// 获取用户所有权限
this.getAuthList() // 返回权限数组
```

## 开发工作流程

### 1. 日常开发流程

```bash
# 1. 更新代码
git pull
npm run fe  # 更新子模块

# 2. 启动开发服务器
npm run dev

# 3. 编写代码
# 4. 代码检查
npm run lint:fix

# 5. 提交代码
git add .
git commit -m "feat: 添加发票管理功能"
git push
```

### 2. 模块化编译

项目支持按模块编译，加快开发时的构建速度：

```bash
# 只编译财务和运营模块
npm run dev --module=fin,op

# 配置在 src/utils/config.js 的 moduleDir
const moduleDir = {
  fin: ['finance'],
  op: ['operate', 'salesStatistics', 'product'],
  wms: ['order', 'fbb'],
  // ...
}
```

### 3. 调试技巧

1. **Vue DevTools**: 开发环境自动启用
2. **错误监控**: 全局错误捕获（见 main.js）
3. **接口调试**: 使用浏览器开发者工具 Network 面板
4. **状态调试**: 使用 Vuex 插件查看状态变化

## 常见问题

### Q1: 如何添加新的业务模块？
1. 在 `src/views/` 下创建模块目录
2. 在 `src/router/index.js` 中添加路由
3. 在 `src/service/` 下创建对应的 API 服务
4. 如需按模块编译，在 `src/utils/config.js` 的 `moduleDir` 中添加配置

### Q2: 如何新增页面权限？
1. 后端在权限系统中配置新权限标识
2. 前端使用 `this.handleAuth('权限标识')` 进行控制
3. 菜单权限由后端动态返回

### Q3: 如何处理文件上传？
使用框架提供的上传组件：

```vue
<compMutiUpload
  v-bind="uploadProps"
  @on-success="handleUploadSuccess"
/>
```

### Q4: 如何配置多环境？
- 复制 `.env.uat` 创建新环境配置文件
- 修改对应的 API 地址和域名
- 在 `package.json` 中添加对应的 scripts

### Q5: 如何部署项目？
1. 构建：`npm run build:test` 等
2. 部署产物到 Nginx 或对应服务器
3. 配置 SSL 证书（生产环境）

## 学习资源

### 内部文档
- **框架文档**: `bizark_fe_mods/doc/README.md` (详细框架使用说明)
- **组件示例**: 查看 `bizark_fe_mods/src/components/templates/` 下的组件源码
- **API 示例**: 查看现有业务模块的 service 文件

### 外部文档
- [Vue.js 官方文档](https://cn.vuejs.org/)
- [Vue Router](https://router.vuejs.org/zh/)
- [Vuex](https://vuex.vuejs.org/zh/)
- [Element UI](https://element.eleme.io/#/zh-CN)
- [vxe-table](https://vxetable.cn/#/table/start/install)

## 注意事项

1. **子模块更新**: 定期执行 `npm run fe` 更新框架子模块
2. **代码规范**: 提交前确保通过 ESLint 检查
3. **环境配置**: 不同环境使用对应的 `.env` 文件
4. **性能优化**: 大模块使用按需编译加快开发速度
5. **错误处理**: 框架已集成全局错误监控，关键业务需添加额外错误处理

## 联系方式

- **项目仓库**: http://172.16.12.246:8099/hengjian/bizark_erp_web
- **框架仓库**: https://gitee.com/bizark/bizark_fe_mods.git
- **开发文档**: http://devdoc.bizarkdev.com/docs/dev_standard/erp-web-docs

---

*最后更新: 2025-03-16*
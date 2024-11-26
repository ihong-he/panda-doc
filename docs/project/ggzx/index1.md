---
outline: deep
---

# 试剂管理系统

## 前言

[试剂管理系统](https://gitee.com/gfh_he/bxrms.git)，是**Vue3 后台管理项目**。

项目采用最新的[Vue3](https://cn.vuejs.org/) + [Vite](https://cn.vite.dev/)技术栈，以及对类型限制更为严格的`TypeScript`、路由的新版本`vue-router4`、新一代状态仓库管理工具`Pinia`、UI 组件库`Element-plus`、前后端交互工具`Axios`、可视化大屏工具`ECharts`。

## 一、 项目初始化

::: info
每一个项目都要有统一的开发规范：

- 使用`eslint+stylelint+prettier`来对我们的代码质量做检测和修复
- 使用`husky`来做`commit`拦截
- 使用`commitlint`来统一提交规范
- 使用`preinstall`来统一包管理工具
  :::

下面我们就用这一套规范来初始化我们的项目，集成一个规范的模版。

### 1. 环境准备

- node 16 +
- pnpm 8.0.0 +

### 2. 初始化项目

本项目使用`vite`进行构建，vite 官方中文文档参考：[cn.vitejs.dev/guide/](https://cn.vitejs.dev/guide/)

项目包管理工具使用`pnpm`（performant npm ），[pnpm](https://pnpm.io/zh/installation)意味“高性能的 npm”，由 npm/yarn 衍生而来，极大地优化了性能。

- pnpm 安装指令

```bash
npm i -g pnpm
```

- 项目初始化命令:

```bash
pnpm create vite
```

- 进入到项目根目录安装全部依赖

```bash
pnpm install
```

- 安装完依赖运行程序

```bash
pnpm run dev
```

- 项目运行在 http://127.0.0.1:5173/

## 二、项目配置

> 每个项目都需要统一的配置，通过这些配置可以提高项目的可维护性。

### 1. Eslint 配置

> [ESLint](https://zh-hans.eslint.org/docs/latest/) 是一个开源项目，可以帮助你发现并修复 JavaScript 代码中的问题。 不论你的 JavaScript 是在浏览器还是在服务器，是否使用框架，ESLint 都可以帮助你的代码变得更好。

::: warning
在 ESLint9.0 之后，迎来版本大更新。首先是抛弃了自带的规则（没了 git standard 风格），其次是配置又更新了，改动有点大，下面是最新的 eslint 配置过程。
:::

配置参照：[ESlint9+Prettier 从 0 开始配置教程](https://juejin.cn/post/7402696141495779363?searchId=20241126101341F35D4CB0E543166D543D)

- 安装`ESlint@9.x`依赖包

```bash
pnpm i eslint -D
```

- 初始化`ESlint`配置

```bash
npx eslint --init
```

```bash
Need to install the following packages:
  @eslint/create-config@1.0.1
Ok to proceed? (y) y
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: '@eslint/create-config@1.0.1',
npm WARN EBADENGINE   required: { node: '^18.18.0 || ^20.9.0 || >=21.1.0' },
npm WARN EBADENGINE   current: { node: 'v18.14.0', npm: '9.3.1' }
npm WARN EBADENGINE }
? How would you like to use ESLint? ...
  To check syntax only
> To check syntax and find problems
  To check syntax, find problems, and enforce code style
? What type of modules does your project use? ...
> JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these


√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · vue
√ Does your project use TypeScript? · typescript
√ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js, typescript-eslint, eslint-plugin-vue
√ Would you like to install them now? · No / Yes
? Which package manager do you want to use? ...
  npm
  yarn
> pnpm
  bun
```

- 根目录新建`eslint.config.js`

```jsx
// eslint.config.js
import globals from "globals";
// 预定义配置
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

// import babelParser from "@typescript-eslint/parser";
import commpnParser from "vue-eslint-parser";
import prettier from "eslint-plugin-prettier";

// "@babel/eslint-parser";

// import customConfig from "./esconfig/custom_config.js";

export default [
  // languageOptions：配置如何检查 js 代码
  {
    // 1.1 处理 与 JavaScript 相关的配置项
    // - ecmaVersion
    // - sourceType
    // - globals
    // - parser
    // - parserOptions
    // files: ["**/*.ts", "**/*.vue"],
    // ignores: ["**/*.config.js"],
    ignores: [
      "**/*.config.js",
      "dist/**",
      "node_modules/**",
      "!**/eslint.config.js",
    ],
    languageOptions: {
      // 1.11 定义可用的全局变量
      globals: globals.browser,
      // 1.12 扩展
      // ecmaVersion: "latest",
      // sourceType: "module",
      parser: commpnParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: "@typescript-eslint/parser",
        jsxPragma: "React",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // 原来的extends替换为如下模式
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    plugins: {
      prettier,
    },
    rules: {
      // 开启这条规则后，会将prettier的校验规则传递给eslint，这样eslint就可以按照prettier的方式来进行代码格式的校验
      "prettier/prettier": "error",
      // eslint（https://eslint.bootcss.com/docs/rules/）
      "no-var": "error", // 要求使用 let 或 const 而不是 var
      "no-multiple-empty-lines": ["warn", { max: 1 }], // 不允许多个空行
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-unexpected-multiline": "error", // 禁止空余的多行
      "no-useless-escape": "off", // 禁止不必要的转义字符

      // typeScript (https://typescript-eslint.io/rules)
      "@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
      "@typescript-eslint/prefer-ts-expect-error": "error", // 禁止使用 @ts-ignore
      "@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
      "@typescript-eslint/semi": "off",

      // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
      "vue/multi-word-component-names": "off", // 要求组件名称始终为 “-” 链接的单词
      "vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用
      "vue/no-mutating-props": "off", // 不允许组件 prop的改变
      "vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
    },
  },
];
```
::: tip
从`ESlint9.x`开始，建议直接用`eslint.config.js`（ESNext）或者`eslint.config.mjs`（CommonJS）命名的配置文件。
:::

- 配置命令让`ESlint`起作用

```json{4,5}
// package.json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  },
  "devDependencies": {
    "eslint": "^9.9.0"
  }
}
```

- 执行命令
::: code-group
```bash [格式化]
pnpm lint

```
```bash [修正代码]
pnpm lint:fix

```
:::

### 2. 配置 prettier

::: info

- `ESLint`主要检查 JavaScript 的语法正确性和少量格式问题，确保代码能正常运行；
- `Prettier`则专注于代码格式化，使代码风格统一，支持包括 JS 在内的多种语言。
- 两者结合使用，可以同时保证代码的质量和一致性。
  :::

（1）安装依赖包

```bash
pnpm add eslint-plugin-prettier -D
```

（2）根目录创建一份`prettier.config.js`

```jsx
// prettier.config.js
/**
 * Prettier配置对象
 * 这里定义了代码格式化的标准，以确保代码风格一致性
 * 更多选项说明参见：https://www.prettier.cn/docs/options.html
 */
export default {
  // 在所有地方添加尾随逗号，有助于提高代码的可读性和维护性
  trailingComma: "all",
  // 不使用单引号，使用双引号来定义字符串
  singleQuote: false,
  // 不在语句末尾添加分号，以适应某些编码风格
  semi: false,
  // 每行打印的最大宽度设置为80字符，以保持代码的可读性
  printWidth: 80,
  // 在箭头函数的参数周围总是添加括号，以提高代码的清晰度
  arrowParens: "always",
  // 始终包裹prose内容，以适应Markdown等格式的文本
  proseWrap: "always",
  // 文件末尾的换行符使用Unix风格的LF，以保证跨平台兼容性
  endOfLine: "lf",
  // 不使用实验性的三元表达式特性，以保持代码的兼容性
  experimentalTernaries: false,
  // 设置制表符的宽度为2个空格，以适应大多数项目的编码风格
  tabWidth: 2,
  // 不使用制表符进行缩进，统一使用空格
  useTabs: false,
  // 对象属性的引号风格保持一致，以提高代码的可读性
  quoteProps: "consistent",
  // 在JSX中不使用单引号，保持与JavaScript代码的一致性
  jsxSingleQuote: false,
  // 在方括号周围添加空格，以提高代码的可读性
  bracketSpacing: true,
  // 不在方括号同一行结束，以适应某些编码风格
  bracketSameLine: false,
  // 不在JSX标签的方括号同一行结束，以适应某些编码风格
  jsxBracketSameLine: false,
  // 不对Vue的<script>和<style>标签进行特殊缩进，以保持一致性
  vueIndentScriptAndStyle: false,
  // 不对每个属性单独占一行，以适应某些编码风格
  singleAttributePerLine: false,
};
```

::: tip
通过`pnpm run lint`去检测语法，如果出现不规范格式,通过`pnpm run fix `修改
:::

（3）使用Prettier工具格式化

> 配置统一的`prettier`来格式化我们的`js`和`css`、`html`代码

```json{7}
 "scripts": {
    "dev": "vite --open",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src",
    "fix": "eslint src --fix",
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\"",
  },
```

**当我们运行`pnpm run format`的时候，会把代码直接格式化**

### 3. 配置 husky

> Husky 是一个流行的 Git 钩子工具，用于在不同的 Git 操作（如提交和推送）前自动运行脚本。比如代码格式化、静态检查等。这有助于保持代码库的质量和一致性。

- 安装`husky`

```bash
pnpm install -D husky
```

- 执行

```bash
npx husky-init
```

::: info
会在根目录下生成个一个`.husky`目录，在这个目录下面会有一个`pre-commit`文件，这个文件里面的命令在我们执行`commit`的时候就会执行
:::

在`.husky/pre-commit`文件添加如下命令：

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm run format
```

当我们对代码进行`commit`操作的时候，就会执行命令，对代码进行格式化，然后再提交。

::: warning
`husky`有很大的局限性，在第一次提交的时候会上传一份未格式化的代码，并将格式化后的代码放在工作区，只有再次提交的才会是格式化的代码！
:::

### 4. 配置 commitlint

对于我们的`commit`信息也是有统一规范的，不能随便写。要让每个人都按照统一的标准来执行，我们可以利用`commitlint`来实现。

- 安装包

```bash
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

- 添加配置文件，新建`commitlint.config.cjs`(注意是 cjs)，然后添加下面的代码：

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  // 校验规则
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
        "build",
      ],
    ],
    "type-case": [0],
    "type-empty": [0],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
```

在`package.json`中配置 scripts 命令

```js
# 在scrips中添加下面的代码
{
"scripts": {
    "commitlint": "commitlint --config commitlint.config.cjs -e -V"
  },
}
```

配置结束，现在当我们填写`commit`信息的时候，前面就需要带着下面的`subject`

```js
'feat',//新特性、新功能
'fix',//修改bug
'docs',//文档修改
'style',//代码格式修改, 注意不是 css 修改
'refactor',//代码重构
'perf',//优化相关，比如提升性能、体验
'test',//测试用例修改
'chore',//其他修改, 比如改变构建流程、或者增加依赖库、工具等
'revert',//回滚到上一个版本
'build',//编译相关的修改，例如发布版本、对项目构建或者依赖的改动
```

- 配置 husky

```bash
npx husky add .husky/commit-msg
```

在生成的 commit-msg 文件中添加下面的命令

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm commitlint
```

::: danger

- 当我们 `commit` 提交信息时，就不能再随意写了，必须是 `git commit -m 'fix: xxx'` 符合类型的才可以。
- 需要注意的是类型的后面需要用英文的 `:`，并且冒号后面是需要空一格的，这个是不能省略的！
  :::

### 5. 强制使用 pnpm

::: info

- 团队开发项目的时候，需要统一包管理器工具。
- 因为不同包管理器工具下载同一个依赖，可能版本不一样，导致项目出现 bug 问题，因此包管理器工具需要统一管理。
  :::

在根目录创建`scripts/preinstall.js`文件，添加下面的内容

```js
// 检查当前使用的包管理工具是否为pnpm
if (!/pnpm/.test(process.env.npm_execpath || "")) {
  // 如果不是pnpm，则输出警告信息并退出进程
  console.warn(
    `\u001b[33mThis repository must using pnpm as the package manager ` +
      ` for scripts to work properly.\u001b[39m\n`
  );
  process.exit(1);
}
```

配置命令

```js
"scripts": {
	"preinstall": "node ./scripts/preinstall.js"
}
```

::: tip
当我们使用 npm 或者 yarn 来安装包的时候，就会报错了。

原理就是在`install`的时候会触发`preinstall`（npm 提供的生命周期钩子）这个文件里面的代码。
:::
